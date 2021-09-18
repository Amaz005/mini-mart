import * as React from 'react'
import {Box, Button, Flex, Link} from '@chakra-ui/react';
import NextLink from 'next/link';
import {useLogoutMutation, useMeQuery} from '../generated/graphql';

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> =  ({}) => {
    const [{data, fetching}] = useMeQuery();
    const [{fetching: logoutFetching}, logout] = useLogoutMutation();
    let body = null;
    
    // data is loading
    if(fetching) {
        // user not login
    } else if (!data?.me) {
        body = (
            <>
                <NextLink href="/login">
                    <Link mr={2}>Login</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link mr={2}>Register</Link>
                </NextLink>
            </>
        );
         // user not login
    } else {
        body = (
            <Flex>
                <Box mr={2}>{data.me.name}</Box>
                <Button 
                    variant="link" 
                    onClick={() => {
                        logout();
                    }}
                    isLoading={logoutFetching}
                >Logout</Button>
            </Flex>
            );
            // user is logged in
    }
        return (
            <Flex bg="white" p={4}>
                <Box ml={"auto"}>
                    {body}
                </Box>
            </Flex>
        );
}