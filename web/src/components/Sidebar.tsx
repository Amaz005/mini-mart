import {Divider, Flex, Heading, Text, Avatar, IconButton } from '@chakra-ui/react';
import * as React from 'react'
import { useState } from 'react';
import {FiMenu, FiHome, FiUser, FiArchive, FiPackage,FiUploadCloud} from 'react-icons/fi';
import {BiExport, BiImport} from 'react-icons/bi';
import { NavItem } from './NavItem';


interface SidebarProps {}

export const Sidebar: React.FC<SidebarProps> =  ({}) => {
    const [navSize, changeNavSize] = useState("large")
    const handleActive = () => {
        
    } 
    return (
            <Flex
                pos="sticky"
                h="100vh"
                pr={navSize == 'small'? 0 : 2}
                boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
                w={navSize == 'small'? '75px': '200px'}
                flexDir="column"
                backgroundColor="#1A202C"
                justifyContent="space-between"
            >
                
                <Flex
                    pl="5%"
                    flexDir="column"
                    alignItems="flex-start"
                    as="nav"
                >
                    <IconButton
                        aria-label=""  
                        background="none"
                        size={navSize == "small" ? "md" : "lg"}
                        mt={2}
                        color="gray.500"
                        marginLeft={navSize == "small" ? "14px" : "0"}
                        _hover={{background: 'none'}}
                        icon={<FiMenu />}
                        onClick={() => {
                            if(navSize == 'small') {
                                changeNavSize('large')
                            } else {
                                changeNavSize('small')
                            }
                        }}
                    />

                    <NavItem navSize={navSize} icon={FiHome} title="Dashboard" onClick={handleActive} href="/"/>
                    <NavItem navSize={navSize} icon={FiUploadCloud} title="Post" onClick={handleActive} href="/create-post"/>
                    <NavItem navSize={navSize} icon={FiUser} title="User" onClick={handleActive} href="/"/>
                    <NavItem navSize={navSize} icon={FiArchive} title="Product" onClick={handleActive} href="/"/>
                    <NavItem navSize={navSize} icon={FiPackage} title="Warehouse" onClick={handleActive} href="/"/>
                    <NavItem navSize={navSize} icon={BiExport} title="Export" onClick={handleActive} href="/"/>
                    <NavItem navSize={navSize} icon={BiImport} title="Import" onClick={handleActive} href="/"/>

                </Flex>

                <Flex
                    p="5%"
                    flexDir="column"
                    w="100%"
                    alignItems={navSize == "small" ? "center" : "flex-start"}
                    mb={4}
                >
                    <Divider display={navSize == 'small' ? "none" : "flex"}/>
                    <Flex mt={4} align="center">
                        <Avatar size="sm" src=""/>
                        <Flex flexDir="column" ml={4} display={navSize =="small"? "none":"flex"}>
                            <Heading color="gray.500" as="h3" size="sm">Duc the Duck</Heading>
                            <Text color="gray">Admin</Text>
                        </Flex>

                    </Flex>
                </Flex>

            </Flex>              
    );
}