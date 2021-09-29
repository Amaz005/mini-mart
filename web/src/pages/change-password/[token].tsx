import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import router, { useRouter } from 'next/router';
import * as React from 'react'
import { useState } from 'react';
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { toErrorMap } from '../../utils/toErrorMap';
import { withUrqlClient } from 'next-urql';
import {createUrqlClinet} from '../../utils/createUrqlClient';
import NextLink from 'next/link';

const ChangePassword: NextPage<{token: string}> = ({token}) => {
    const [, changePassword] = useChangePasswordMutation();
    const router = useRouter();
    const [tokenError, setTokenError] = useState("");
        return (
        <Wrapper variant="small">
            <Formik 
            initialValues={{ newPassword: ""}}
            onSubmit={async (values, {setErrors}) => {
                const response = await changePassword({
                    newPassword: values.newPassword,
                    token,
                });
                
                console.log(response);
                
                if(response.data?.changePassword.errors){
                    const errorMap = toErrorMap(response.data.changePassword.errors);
                    if('token' in errorMap) {
                        setTokenError(errorMap.token);
                    }
                    setErrors(errorMap)
                
                } else if (response.data?.changePassword.userAccount) {
                    router.push('/') 
                } 
            }}      
            >
                {({isSubmitting}) => (
                    <Form>
                        <InputField
                            autoComplete="false"
                            name="newPassword"
                            placeholder="newPassword"
                            label="newPassword"
                            type="password"
                        />
                        {tokenError ? (
                        <Flex>
                            <Box mr={2} style={{ color: "red" }}>
                                    {tokenError}

                            </Box>
                            <NextLink href="/forgot-password">
                                <Link>Get new
                                </Link>
                            </NextLink>
                        </Flex> ) : null}
                        <Box mt={4}>
                        <InputField
                            autoComplete="false"
                            name="rePassword"
                            placeholder="rePassword"
                            label="rePassword"
                            type="password"
                        />
                        </Box>
                        <Button 
                            mt={4}
                            type="submit" 
                            colorScheme="teal" 
                            isLoading={isSubmitting}
                        >
                            Change password
                        </Button>
                    </Form>
                )
                }
            </Formik>
        </Wrapper>

        );
};

ChangePassword.getInitialProps = ({query}) => {
    return {
        token: query.token as string,
    };
};

export default withUrqlClient(createUrqlClinet, {ssr: false})(ChangePassword);

