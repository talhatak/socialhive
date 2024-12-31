import { Flex, VStack,FormControl,FormLabel,Input,Button, Heading,Text } from "@chakra-ui/react";
import {register } from "../api/endpoints";
import { useState } from "react";
import {useNavigate} from "react-router-dom"

const Register = ()=> {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async ()=> {
        if (password === confirmPassword) {
            try {
                await register(username,email,firstName,lastName,password);
                alert('successful registration')
                navigate('/login')
            } catch (error) {
                alert('error registering')
            }
        } else {
            alert("password and confirm password not equal")
        }
    }
    const handleNav = () => {
        navigate('/login')
    }

    return(
        <Flex padding='12px' w='90vw' h='90%' justifyContent='center' alignItems='center'>
            <VStack w='95%' maxW='400px' alignItems='center' gap='8px'>
                <Heading>Register</Heading>
                <FormControl isRequired>
                    <FormLabel htmlFor='username'>Username</FormLabel>
                    <Input h='35px' onChange={(e) => setUsername(e.target.value)} bg='white' id='username' />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel htmlFor='email'>Email</FormLabel>
                    <Input h='35px' onChange={(e) => setEmail(e.target.value)} bg='white' type='email' id='email' />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel htmlFor='firstname'>First Name</FormLabel>
                    <Input h='35px' onChange={(e) => setFirstName(e.target.value)} bg='white' id='firstname' />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel htmlFor='lastname'>Last Name</FormLabel>
                    <Input h='35px' onChange={(e) => setLastName(e.target.value)} bg='white' id='lastname' />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel htmlFor='password'>Password</FormLabel>
                    <Input h='35px' onChange={(e) => setPassword(e.target.value)} type='password' bg='white' id='password' />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel htmlFor='confirmpassword'>Confirm Password</FormLabel>
                    <Input h='35px' onChange={(e) => setConfirmPassword(e.target.value)} type='password' bg='white' id='confirmpassword' />
                </FormControl>
                <VStack gap='10px' w='100%' alignItems='start'>
                    <Button mt='8px' onClick={handleRegister} w='100%' colorScheme="green" fontSize='18px'>Register</Button>
                    <Text fontSize='14px' color='gray.600' cursor='pointer' onClick={handleNav}>Already have an account? <strong>Login</strong></Text>
                </VStack>
            </VStack>
        </Flex>
    )
}

export default Register;