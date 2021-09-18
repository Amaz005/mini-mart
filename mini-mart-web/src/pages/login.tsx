import * as React from 'react';
import {Form, Formik} from 'formik';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { Box, Button } from '@chakra-ui/react';
import { toErrorMap } from '../utils/toErrorMap';
import {useRouter} from 'next/router';
import {useLoginMutation} from '../generated/graphql';
import { withUrqlClient } from 'next-urql';
import { createUrqlClinet } from '../utils/createUrqlClient';

interface loginProps {}

const Login: React.FC<loginProps> =  ({}) => {
    const router = useRouter();
    const [,login] = useLoginMutation();
    return (
        <Wrapper variant="small">
            <Formik 
            initialValues={{ username: "", password: ""}}
            onSubmit={async (values, {setErrors}) => {
                const response = await login({options: values});
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
                            name="username"
                            placeholder="username"
                            label="username"
                        />
                        <Box mt={4}>
                        <InputField
                            name="password"
                            placeholder="password"
                            label="Password"
                            type="password"
                        />
                        </Box>
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
export default withUrqlClient(createUrqlClinet)(Login);