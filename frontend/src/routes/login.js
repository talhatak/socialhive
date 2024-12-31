import { Flex, VStack,FormControl,FormLabel,Input,Button, Heading,Text } from "@chakra-ui/react";
import { useAuth } from "../contexts/useAuth";
import { useState } from "react";
import {useNavigate} from "react-router-dom"

const Login = ()=> {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { auth_login } = useAuth();

    const handleLogin = ()=> {
        auth_login(username, password)
    }

    const handleNav = () => {
        navigate('/register')
    }

    return(
        <Flex w='90vw' h='calc(100vh - 90px)' scrollbar='hidden' justifyContent='center' alignItems='center'>
            <VStack w='95%' maxW='400px' alignItems='center' gap='16px'>
                <Heading>Login</Heading>
                <FormControl isRequired>
                    <FormLabel htmlFor='username'>Username</FormLabel>
                    <Input onChange={(e) => setUsername(e.target.value)} bg='white' id='username' />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel htmlFor='password'>Password</FormLabel>
                    <Input onChange={(e) => setPassword(e.target.value)} type='password' bg='white' id='password' />
                </FormControl>
                <VStack w='100%' alignItems='start'>
                    <Button  onClick={handleLogin} w='100%' colorScheme="green" fontSize='18px'>Login</Button>
                    <Text fontSize='14px' color='gray.600' cursor='pointer' onClick={handleNav}>Don't have an account? <strong>Register</strong></Text>
                </VStack>
            </VStack>
        </Flex>
    )
}

export default Login;