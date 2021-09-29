import * as React from 'react'
import { InputHTMLAttributes } from 'react';
import {useField} from 'formik';
import { 
    FormControl, 
    FormLabel, 
    FormErrorMessage,
    Input,
    InputRightElement,
    Button,
    InputGroup,
    Textarea,
} from '@chakra-ui/react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    name: string;
    textarea?: boolean;
}

export const InputField: React.FC<InputFieldProps> =  (props) => {
    const [field, {error}] = useField(props);
    const [show, setShow] = React.useState(false);
    const handleClick = () => setShow(!show);
    let InputOrTextarea;
    if (props.textarea) {
        InputOrTextarea = Textarea;
    } else {
        InputOrTextarea = Input;
    }
        return (
            <FormControl isInvalid={!!error}>
                <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
                <InputGroup size="md">
                <InputOrTextarea {...field} id={field.name} placeholder={props.placeholder} type={props.type == 'password' && show ? 'text' : props.type} variant="flushed"/>
                {props.type == 'password' ?
                    <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                  : null
                }
                </InputGroup>

                {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
            </FormControl>
        );
}