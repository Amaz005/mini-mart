import { Flex, MenuButton,Menu, Icon, Text} from '@chakra-ui/react';
import * as React from 'react'
import { IconType } from 'react-icons';
import NextLink from 'next/link';

type NavItemProps = {
    navSize: string
    title: string
    icon: IconType
    active?: boolean
    onClick?: any
    description?: string
    href: string
}

export const NavItem: React.FC<NavItemProps> =  (props) => {
        return (
            <Flex
                mt={15}
                flexDir="column"
                w="100%"
                alignItems={props.navSize == "small" ? "center" : "flex-start"}
            >
                <Menu>
                    <NextLink href={props.href}>
                        <MenuButton
                            backgroundColor={props.active ? "#AECBCA" : "unset"}
                            p={2}
                            borderRadius={8}
                            onClick={props.onClick}
                            _hover={{ textDecor: 'none', backgroundColor: "gray.500", color : "white"}}
                            w={props.navSize == "large" ? "100%" : "70%"}
                            color={props.active ? "#82AAAD": "gray.500"}
                        > 
                                <Flex>
                                    <Icon 
                                        marginLeft="6px"
                                        as={props.icon} 
                                        fontSize="xl" 
                                    />
                                    <Text 
                                        ml={3} 
                                        display={props.navSize == "small" ? "none" : "flex"}
                                    >
                                        {props.title}
                                    </Text>
                                </Flex>
                        </MenuButton>
                    </NextLink>
                </Menu>
            </Flex>
        );
}