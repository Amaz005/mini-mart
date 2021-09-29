require('dotenv').config();
import { MyContext } from '../types';
import {Resolver, Ctx,Query , Arg, Mutation, Field, ObjectType} from 'type-graphql';
import {UserAccount} from '../entities/UserAccount';
import argon2 from 'argon2'; 
import { UsernamePasswordInput } from './UsernamePasswordInput';
import { validateRegister } from '../utils/validateRegister';
import { sendMail } from '../utils/sendEmail';
import {v4} from 'uuid';
// import { getConnection } from 'typeorm';

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

@Resolver()
export class UserResolver{

    @Query(() => UserAccount, {nullable:true})
    async me(
        @Ctx() {req}: MyContext
    ) {
        if(!req.session.UserID){
            return null;
        }

        const user = await UserAccount.findOne({id: req.session.UserID}); 
        return user;
    }
    
    @Mutation(() => UserResponse)
    async changePassword(
        @Arg('token') token:string,
        @Arg('newPassword') newPassword: string,
        @Ctx() {redis, req} : MyContext
    ): Promise<UserResponse> {
        if (newPassword.length <= 2) {
            return {
                errors: [
                    {
                        field: "newPassword",
                        message: "length must be greater than 2",
                    }
                ],
            };
        }
        const link = process.env.FORGET_PASSWORD_PREFIX + token;
        const UserId = await redis.get(link);

        if (!UserId) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "token expired",
                    }
                ]
            }
        }
        const user = await UserAccount.findOne({id: parseInt(UserId)});
        if (!user) {
            return {
                errors:
                [
                    {
                        field: "token",
                        message: "user no longer exists",
                    }
                ]
            }
        }
        user.password = await argon2.hash(newPassword);
        await UserAccount.update({id: user.id}, {password: user.password});
        
        req.session.UserID = user.id;
        await redis.del(link);
        return {userAccount: user};
    }

    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg('email') email: string,
        @Ctx() { redis}: MyContext
    ) {
        const user =  await UserAccount.findOne({email});
        if(!user) {

            return true;
        }
        const token = v4();
        await redis.set(
            process.env.FORGET_PASSWORD_PREFIX + token, 
            user.id, 
            'ex',
            1000 * 60 * 60 * 24 * 3    
        )
        await sendMail(email, 
            `<a href="http://localhost:3000/change-password/${token}">reset password</a>`);
        return true;
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        ): Promise<UserResponse> {
            const errors = validateRegister(options);
            if(errors) {
                return {errors};
            }
            
            const hashPassword = await argon2.hash(options.password);
            let userAccount ;
            try{
                
                // const result = await getConnection()
                //     .createQueryBuilder()
                //     .insert()
                //     .into(UserAccount)
                //     .values({
                //         name: options.username,
                //         password: hashPassword,
                //         email: options.email,
                //     })
                //     .returning("*")
                //     .execute();
                // userAccount = result.raw[0];
                userAccount = await UserAccount.create({
                    name: options.username,
                    password: hashPassword,
                    email: options.email,
                }).save();
            }catch(err) {
                console.log(err);
                
                if(err.code === '23505'){
                    if(err.detail.includes("email")) {
                        return {
                            errors:[
                                {
                                    field: "email",
                                    message: "email already exist"
                                }
                            ]
                        };
                    } else {
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
            }
            

            return {userAccount};
    }

    @Mutation(() => UserResponse)
    async updateUser(
        @Arg('id') id: number,
        @Arg('options') options: UsernamePasswordInput,
        ){
            const userAccount = await UserAccount.findOne({id});
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
            await UserAccount.update({id: userAccount.id}, {name: userAccount.name});
            return userAccount;
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('usernameOrEmail') usernameOrEmail: string,
        @Arg('password') password: string,
        @Ctx() { req }: MyContext
        ): Promise<UserResponse>{
            const userAccount = await UserAccount.findOne(
                usernameOrEmail.includes("@") ? 
                {email: usernameOrEmail} : 
                {name: usernameOrEmail});
            if(!userAccount) {
                return  { 
                    errors: [
                        {
                            field: "usernameOrEmail",
                            message: "usernameOrEmail doesn't exist", 
                        }
                    ],
                };
            }
            if(usernameOrEmail.length <= 2){
                return {
                    errors: [
                        {
                            field: "usernameOrEmail",
                            message: "usernameOrEmail must have more than 2 character",
                        },
                    ],
                };
            }
            if(password.length <= 2){
                return {
                    errors: [
                        {
                            field: "password",
                            message: "password must have more than 2 character"
                        },
                    ],
                };
            }
            const valid = await argon2.verify(userAccount.password, password)
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
            
            req.session.UserID = userAccount.id;

            return {userAccount};
    }

    @Query(() => UserAccount) 
    getUserById(
        @Arg("id") id: number,
    ){
        return UserAccount.findOne({id});
    }

    @Mutation(() => Boolean)
    logout(
        @Ctx() {req, res}: MyContext
    ){
        return new Promise((resolve) => 
        req.session.destroy((err) => {
            res.clearCookie(process.env.COOKIE_NAME as string);
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