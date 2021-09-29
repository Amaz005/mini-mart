import * as React from 'react';
import {Form, Formik} from 'formik';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { toErrorMap } from '../utils/toErrorMap';
import {useRouter} from 'next/router';
import {useLoginMutation} from '../generated/graphql';
import { withUrqlClient } from 'next-urql';
import { createUrqlClinet } from '../utils/createUrqlClient';
import NextLink from 'next/link';

interface loginProps {}

const Login: React.FC<loginProps> =  ({}) => {
    const router = useRouter();
    const [,login] = useLoginMutation();
    return (
        <Wrapper variant="small">
            <Formik 
            initialValues={{ usernameOrEmail: "", password: ""}}
            onSubmit={async (values, {setErrors}) => {
                const response = await login({usernameOrEmail: values.usernameOrEmail, password: values.password});
                
                console.log(response);
                
                if(response.data?.login.errors){
                    setErrors(toErrorMap(response.data.login.errors));
                } else if (response.data?.login.userAccount) {
                    router.push('/') 
                } 
            }}      
            >
                {({isSubmitting}) => (
                    <Form>
                        <InputField
                            autoComplete="false"
                            name="usernameOrEmail"
                            placeholder="usernameOrEmail"
                            label="usernameOrEmail"
                        />
                        <Box mt={4}>
                        <InputField
                            autoComplete="false"
                            name="password"
                            placeholder="password"
                            label="Password"
                            type="password"
                        />
                        </Box>
                        <Flex mt={2}>
                            <NextLink href="/forget-password">
                                <Link ml="auto">
                                    Forgot password
                                </Link>
                            </NextLink>
                        </Flex>    
                        <Button 
                            mt={4}
                            type="submit" 
                            colorScheme="teal" 
                            isLoading={isSubmitting}
                        >
                            Login
                        </Button>
                    </Form>
                )
                }
            </Formik>
        </Wrapper>
    )
}
export default withUrqlClient(createUrqlClinet, {ssr: false})(Login);