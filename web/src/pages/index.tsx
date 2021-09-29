import { Navbar } from "../components/Navbar";
import { Box, Flex } from '@chakra-ui/react'
import { Sidebar } from "../components/Sidebar";
import { withUrqlClient } from 'next-urql';
import { createUrqlClinet } from "../utils/createUrqlClient";
import { useGetAllPostQuery } from '../generated/graphql';
import React from "react";

const Index = () => {
  const [{data}] = useGetAllPostQuery();
  console.log(data)
  return (
      <Flex>
          <Sidebar />
          <Box flex="1">
            <Navbar/>
            <div>Hello world</div>
            <br/>
            {!data ? (
              <div>Loading...</div>
            ) : (
              data.getAll.map((p) => <div key={p.id}>{p.title}</div>)
            )}
          </Box>
      </Flex>
    )
  }

export default withUrqlClient(createUrqlClinet, {ssr: true})(Index);
