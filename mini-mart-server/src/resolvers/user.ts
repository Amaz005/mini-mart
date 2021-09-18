import { MyContext } from '../types';
import {Resolver, Ctx,Query , Arg, Mutation, InputType, Field, ObjectType} from 'type-graphql';
import {UserAccount} from '../entities/UserAccount';
import argon2 from 'argon2'; 
import {EntityManager} from '@mikro-orm/postgresql';
import { COOKIE_NAME } from '../constants';

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string
    @Field()
    password: string
}

@ObjectType()
class FieldError{
    @Field()
    field: string;

    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field(() => UserAccount, {nullable: true})
    userAccount?: UserAccount;
}

// const validate = (options: UsernamePasswordInput) => {
    
// }

@Resolver()
export class UserResolver{

    @Query(() => UserAccount, {nullable:true})
    async me(
        @Ctx() {em ,req}: MyContext
    ) {
        if(!req.session.UserID){
            return null;
        }

        const user = await em.findOne(UserAccount, {id: req.session.UserID}); 
        return user;
    }
    
    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em }: MyContext
        ): Promise<UserResponse> {
            if(options.username.length <= 2){
                return {
                    errors: [
                        {
                            field: "username",
                            message: "username must have more than 2 character",
                        },
                    ],
                };
            }
            if(options.password.length <= 3){
                return {
                    errors: [
                        {
                            field: "password",
                            message: "password must have more than 3 character"
                        },
                    ],
                };
            }
            
            const hashPassword = await argon2.hash(options.password);
            let userAccount ;
            try{
                const result = await (em as EntityManager)
                .createQueryBuilder(UserAccount)
                .getKnexQuery()
                .insert({
                    name: options.username,
                    password: hashPassword,
                    created_at: new Date(),
                    updated_at: new Date(),
                })
                .returning("*");
                userAccount = result[0];
            }catch(err) {
                if(err.code === '23505'){
                    console.log(err)
                    return {
                        errors:[
                            {
                                field: "username",
                                message: "username already exist"
                            }
                        ]
                    };
                }
            }
            

            return {userAccount};
    }

    @Mutation(() => UserResponse)
    async updateUser(
        @Arg('id') id: number,
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em }: MyContext
        ){
            const userAccount = em.findOne(UserAccount, {id});
            if(!userAccount) {
                return  { 
                    errors: [
                        {
                            field: "username",
                            message: "username doesn't exist", 
                        }
                    ],
                };
            }
            if(options.username.length <= 2){
                return {
                    errors: [
                        {
                            field: "username",
                            message: "username must have more than 2 character",
                        },
                    ],
                };
            }
            if(options.password.length <= 3){
                return {
                    errors: [
                        {
                            field: "password",
                            message: "password must have more than 3 character"
                        },
                    ],
                };
            }
            await em.persistAndFlush(userAccount);
            return userAccount;
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
        ): Promise<UserResponse>{
            const userAccount = await em.findOne(UserAccount, {name: options.username});
            if(!userAccount) {
                return  { 
                    errors: [
                        {
                            field: "username",
                            message: "username doesn't exist", 
                        }
                    ],
                };
            }
            if(options.username.length <= 2){
                return {
                    errors: [
                        {
                            field: "username",
                            message: "username must have more than 2 character",
                        },
                    ],
                };
            }
            if(options.password.length <= 3){
                return {
                    errors: [
                        {
                            field: "password",
                            message: "password must have more than 3 character"
                        },
                    ],
                };
            }
            const valid = await argon2.verify(userAccount.password, options.password)
            if(!valid) {
                return  { 
                    errors: [
                        {
                            field: "password",
                            message: "incorrect password", 
                        }
                    ],
                };
            }

            //stored user id 
            console.log(req);
            
            req.session.UserID = userAccount.id;

            return {userAccount};
    }

    @Query(() => UserAccount) 
    getUserById(
        @Arg("id") id: number,
        @Ctx() {em} : MyContext
    ){
        return em.findOne(UserAccount, {id});
    }

    @Mutation(() => Boolean)
    logout(
        @Ctx() {req, res}: MyContext
    ){
        return new Promise((resolve) => 
        req.session.destroy((err) => {
            res.clearCookie(COOKIE_NAME);
            if(err) {
                console.log(err);
                resolve(false);
                return;
            }
            resolve(true);
        })
        ); 
    }

}