import * as React from 'react'
import {Avatar, Box, Flex, Heading, Link, Menu, MenuButton, MenuItem, MenuList, Text} from '@chakra-ui/react';
import NextLink from 'next/link';
import {useLogoutMutation, useMeQuery} from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> =  ({}) => {
    const [{data, fetching}] = useMeQuery({
        pause: isServer()
    });
    const [{fetching: logoutFetching}, logout] = useLogoutMutation();
    let body = null;
    
    // data is loading
    if(fetching) {
        // user not login
    } else if (!data?.me) {
        body = (
            <>
                <NextLink href="/login">
                    <Link color="gray.500" mr={2}>Login</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link color="gray.500" mr={2}>Register</Link>
                </NextLink>
            </>
        );
         // user not login
    } else {
        body = (
            <Flex>
                <Menu isLazy>
                    <MenuButton>
                        <Flex align="center">
                            <Avatar size="sm" src=""/>
                            <Flex flexDir="column" ml={4}>
                                <Heading as="h3" color="gray.500" size="sm">{data.me.name}</Heading>
                                <Text color="gray">Admin</Text>
                            </Flex>
                        </Flex>
                    </MenuButton>
                    <MenuList>
                        <MenuItem 
                            variant="link" 
                            onClick={() => {
                                logout();
                            }}
                            isloading={logoutFetching}>
                                Logout
                        </MenuItem>
                        <MenuItem 
                            variant="link" 
                            onClick={() => {
                                console.log("Change passwod");
                                
                            }}
                            isloading={logoutFetching}>
                                Change Password
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
            );
            // user is logged in
    }
        return (
            <Flex position="sticky" top={0} zIndex={1} bg="gray.800" p={4}>
                <Box ml={"auto"}>
                    {body}
                </Box>
            </Flex>
        );
}