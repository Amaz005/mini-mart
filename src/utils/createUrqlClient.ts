import { 
    dedupExchange, 
    fetchExchange,
} from "@urql/core";
import { cacheExchange,Cache } from '@urql/exchange-graphcache';
import { 
    LoginMutation, 
    LogoutMutation, 
    MeDocument, 
    MeQuery, 
    RegisterMutation 
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";

export const createUrqlClinet = (ssrExchange: any) => ({
    url: 'http://localhost:8080/graphql',
    
    fetchOptions: {
        credentials: "include" as const,
    } ,
    exchanges: [
        dedupExchange, 
        cacheExchange({
        updates: {
          Mutation:{
            logout: (_result, args, cache, info) => {
              // me query return null
              betterUpdateQuery<LogoutMutation, MeQuery>(
                cache, 
                {query: MeDocument}, 
                _result,
                () => ( { me:null} )
              )
            },

            login: (_result, args, cache, info) => {
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache, 
                {query: MeDocument}, 
                _result,
                (result, query) => {
                  if(result.login.errors) {
                    return query;
                  } else {
                    return {
                      me: result.login.userAccount,
                    };
                  }
                  
                }
              );
            },
    
            register: (_result, args, cache, info) => {
              betterUpdateQuery<RegisterMutation, MeQuery>(
                cache, 
                {query: MeDocument}, 
                _result,
                (result, query) => {
                  if(result.register.errors) {
                    return query;
                  } else {
                    return {
                      me: result.register.userAccount,
                    };
                  }
                  
                }
              );
            },
          }
        }
      }),
      ssrExchange, 
      fetchExchange],
  }) ;