import { UsernamePasswordInput } from "src/resolvers/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
    if(options.email.length <= 2){
        return  [
                {
                    field: "email",
                    message: "email must have more than 2 character",
                },
            ];
    }
    if(!options.email.includes("@")) {
        return  [
                {
                    field: "email",
                    message: "email must have @",
                },
            ];
    }
    if(options.username.length <= 2){
        return [
                {
                    field: "username",
                    message: "username must have more than 2 character",
                },
            ];
    }
    if(options.username.includes("@")){
        return [
                {
                    field: "username",
                    message: "cant include an @",
                },
            ];
    }
    if(options.password.length <= 2){
        return [
                {
                    field: "password",
                    message: "password must have more than 3 character"
                },
            ];
    }
    return null;
}