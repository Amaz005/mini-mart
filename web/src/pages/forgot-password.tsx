import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import * as React from 'react'
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { useState } from 'react';
import { withUrqlClient } from 'next-urql';
import { createUrqlClinet } from '../utils/createUrqlClient';
import router from 'next/router';

interface ForgotPasswordProps {

}

const ForgetPassword: React.FC<ForgotPasswordProps> =  ({}) => {
    const [, forgotPassword] = useForgotPasswordMutation();
    const [complete, setComplete] = useState(false);
    return (
        <Wrapper variant="small">
            <Formik 
            initialValues={{ email: ""}}
            onSubmit={async (values) => {
                await forgotPassword({email: values.email});
                setComplete(true);
                
                // if(response.data?.forgotPassword.errors){
                //     setErrors(toErrorMap(response.data.login.errors));
                // } else if (response.data?.login.userAccount) {
                //     router.push('/') 
                // } 
            }}      
            >
                {({isSubmitting}) => complete ? (
                    <Box>If an account with that email exists, we will sent you a mail</Box>
                ) : (
                    <Form>
                        <InputField
                            autoComplete="false"
                            name="email"
                            placeholder="Email"
                            label="email"
                        />  
                        <Button 
                            mt={4}
                            type="submit" 
                            colorScheme="teal" 
                            isLoading={isSubmitting}
                        >
                            Send
                        </Button>
                    </Form>
                )
                }
            </Formik>
        </Wrapper>
    );
}

export default withUrqlClient(createUrqlClinet, {ssr: false})(ForgetPassword);