import { Box, Button, Flex } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import * as React from 'react'
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useCreatePostMutation } from '../generated/graphql';
import {useRouter} from "next/router";
import { withUrqlClient } from 'next-urql';
import { createUrqlClinet } from '../utils/createUrqlClient';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

const CreatePost: React.FC<{}> =  ({}) => {
        const [, createPost] = useCreatePostMutation();
        const router = useRouter();
        return (
            <>
                    <Navbar/>
                    <Wrapper variant="small">
            <Formik 
            initialValues={{ title: "", text: ""}}
            onSubmit={async (values) => {
                console.log(values);
                const {error} = await createPost({postInput: values});
                if(!error) {
                    router.push("/");
                }
            }}      
            >
                {({isSubmitting}) => (
                    <Form>
                        <InputField
                            autoComplete="false"
                            name="title"
                            placeholder="title"
                            label="Title"
                        />
                        <Box mt={4}>
                        <InputField
                            textarea    
                            autoComplete="false"
                            name="text"
                            placeholder="text..."
                            label="Body"
                        />
                        </Box>
                        <Button 
                            mt={4}
                            type="submit" 
                            colorScheme="teal" 
                            isLoading={isSubmitting}
                        >
                            Create
                        </Button>
                    </Form>
                )
                }
            </Formik>
        </Wrapper>
            </>
        );
}
export default withUrqlClient(createUrqlClinet, {ssr: false})(CreatePost);