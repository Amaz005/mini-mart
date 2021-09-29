import { Post } from '../entities/Post';
import {Resolver, Query, Arg, Mutation, Ctx, UseMiddleware} from 'type-graphql';
import { MyContext } from 'src/types';
import { isAuth } from '../middleware/isAuth';
import { PostInput } from './PostInput';

@Resolver()
export class PostResolver{
    @Query(() => [Post])
    getAll(): Promise<Post[]> {
        return Post.find();
    }

    @Query(() => Post, {nullable: true})
    getOne(
            @Arg("id") id: number,
        ): Promise<Post | undefined> {
        return Post.findOne(id);
    }

    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async createPost(
            @Arg("input") input: PostInput,
            @Ctx() {req} : MyContext
        ): Promise<Post> { 
       
        return Post.create({
            ...input,
            createId: req.session.UserID,
        }).save();
    }

    @Mutation(() => Post, {nullable: true})
    async updatePost(
            @Arg("id") id: number,
            @Arg("title") title: string,
        ): Promise<Post | null> {  
        const post = await Post.findOne( id );
        if(!post) {
            return null;
        }    
        if(typeof title !== "undefined") {
            post.title = title;
            await Post.update({id},{title});  
        }
        return post;
    }

    @Mutation(() => Boolean)
    async deletePost(
            @Arg("id") id: number,
        ): Promise<boolean> {  
        await Post.delete({id});
        return true;
    }
}