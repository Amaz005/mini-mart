import { Flex, MenuButton,Menu, Link, Icon, Text, MenuList} from '@chakra-ui/react';
import * as React from 'react'
import { IconType } from 'react-icons';
import { NavHoverBox } from './NavHoverBox';

type NavItemProps = {
    navSize: string
    title: string
    icon: IconType
    active?: boolean
    onClick?: any
    description?: string
}

export const NavItem: React.FC<NavItemProps> =  (props) => {
        return (
            <Flex
                mt={30}
                flexDir="column"
                w="100%"
                alignItems={props.navSize == "small" ? "center" : "flex-start"}
            >
                <Menu>
                    <Link
                        backgroundColor={props.active ? "#AECBCA" : "unset"}
                        p={3}
                        borderRadius={8}
                        onClick={props.onClick}
                        _hover={{ textDecor: 'none', backgroundColor: "#AECBCA"}}
                        w={props.navSize == "large" ? "100%" : "unset"}
                    >
                        <MenuButton w="100%">
                            <Flex>
                                <Icon as={props.icon} fontSize="xl" color={props.active ? "#82AAAD": "gray.500"}/>
                                <Text ml={5} display={props.navSize == "small" ? "none" : "flex"}>{props.title}</Text>
                            </Flex>
                        </MenuButton>
                    </Link>
                    <MenuList
                        py={0}
                        border="none"
                        w={200}
                        h={200}
                        ml={180}
                        mt={-122}
                    >
                        <NavHoverBox title={props.title} icon={props.icon} description={props.description} />
                    </MenuList>
                </Menu>
            </Flex>
        );
}