import {Resolver, Query} from 'type-graphql';

@Resolver()
export class HelloResolver{
    @Query(() => String)
    hello() {
        return "Hello there, its me again!"
    }
}