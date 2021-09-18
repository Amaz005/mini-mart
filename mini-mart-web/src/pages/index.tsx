import { Navbar } from "../components/Navbar";
import { Flex, Text, IconButton } from '@chakra-ui/react'
import { Sidebar } from "../components/Sidebar";
import { FiMenu } from 'react-icons/fi'
import { withUrqlClient } from 'next-urql';
import { createUrqlClinet } from "../utils/createUrqlClient";

const Index = () => {
  return (
      <Flex w="100%">
        <Sidebar />
        <Flex
          pos="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        >
          <Text>Click the
            <IconButton
              aria-label=""
              background="none"
              _hover={{ background: 'none' }}
              icon={<FiMenu />}
            />
          to resize the vertical navigation bar.</Text>
        </Flex>
        
        <Navbar/>
      </Flex>
    )
  }

export default withUrqlClient(createUrqlClinet)(Index);
