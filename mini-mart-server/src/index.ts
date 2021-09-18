import 'reflect-metadata';
import {MikroORM} from "@mikro-orm/core";
import { COOKIE_NAME, __prod__ } from "./constants";
// import { Post } from "./entities/Post";
import mikroConfig from "./mikro-orm.config";
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import { HelloResolver } from "./resolvers/Hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from './resolvers/user';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

const main = async () => {
    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();
    const app = express();
    
    let RedisStore = connectRedis(session);
    let redisClient = redis.createClient();

    app.use(cors({
        origin: "http://localhost:3000",
        credentials: true,
    }));


    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore(
                { 
                    client: redisClient, 
                    disableTouch: true,

                }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true,
                sameSite: 'lax', // crsf
                secure: __prod__, //cookie only work in https
            },    
            saveUninitialized: false,
            secret: 'hasgfhjaegwr',
            resave: false,
        })
    )

    const apolloServer = new ApolloServer({

        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,

        }),
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground()
        ],
        context: ({req, res}) => ({em: orm.em, req, res}),
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ 
        app,
        cors: false });

    app.listen(8080, ()=> {
        console.log('🚀 Server ready at localhost:8080');
    })
}

main().catch(err=>{
    console.error(err);
});
