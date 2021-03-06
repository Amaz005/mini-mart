import {Divider, Flex, Heading, Text, Avatar, IconButton } from '@chakra-ui/react';
import * as React from 'react'
import { useState } from 'react';
import {FiMenu, FiHome, FiUser, FiArchive, FiPackage} from 'react-icons/fi';
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
                left="5"
                h="95vh"
                marginTop="2.5vh"
                boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
                borderRadius={navSize == 'small' ? '15px' : '30px'}
                w={navSize == 'small'? '75px': '200px'}
                flexDir="column"
                justifyContent="space-between"
            >
                
                <Flex
                    p="5%"
                    flexDir="column"
                    alignItems="flex-start"
                    as="nav"
                >
                    <IconButton
                        aria-label=""  
                        background="none"
                        mt={2}
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
                    <NavItem navSize={navSize} icon={FiHome} title="Dashboard" onClick={handleActive}/>
                    <NavItem navSize={navSize} icon={FiUser} title="User" onClick={handleActive}/>
                    <NavItem navSize={navSize} icon={FiArchive} title="Product" onClick={handleActive}/>
                    <NavItem navSize={navSize} icon={FiPackage} title="Warehouse" onClick={handleActive}/>
                    <NavItem navSize={navSize} icon={BiExport} title="Export" onClick={handleActive}/>
                    <NavItem navSize={navSize} icon={BiImport} title="Import" onClick={handleActive}/>
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
                        <Flex flexDir="column" ml={4}>
                            <Heading as="h3" size="sm">Duc the Duck</Heading>
                            <Text color="gray">Admin</Text>
                        </Flex>

                    </Flex>
                </Flex>

            </Flex>
               
    );
}