require('dotenv').config();
import 'reflect-metadata';
import {__prod__ } from "./constants";
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import { HelloResolver } from "./resolvers/Hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from './resolvers/user';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';
import {createConnection} from 'typeorm';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { Post } from './entities/Post';
import { UserAccount } from './entities/UserAccount';

const main = async () => {
    const conn = await createConnection({
        type: 'postgres',
        database: "minimart",
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        logging: true,
        synchronize: true,
        entities: [Post,UserAccount]
    });

    const app = express();
    let RedisStore = connectRedis(session);
    let redis = new Redis();

    app.use(cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    }));


    app.use(
        session({
            name: process.env.COOKIE_NAME,
            store: new RedisStore(
                { 
                    client: redis, 
                    disableTouch: true,

                }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true,
                sameSite: 'lax', // crsf
                secure: __prod__, //cookie only work in https
            },    
            saveUninitialized: false,
            secret: process.env.SECRET_SIGN as string,
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
        context: ({req, res}) => ({ req, res, redis}),
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ 
        app,
        cors: false });

    app.listen(8080, ()=> {
        console.log('🚀 🔥 🥶 Server ready at localhost:8080');
    })
}

main().catch(err=>{
    console.error(err);
});
