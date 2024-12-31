import { Button, Flex, FormControl, FormLabel, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { create_post } from "../api/endpoints";
import { useState } from "react";
import {useNavigate} from "react-router-dom"
const CreatePost = () => {

    const [description, setDescription] = useState('')
    const nav = useNavigate()

    const handlePost = async () => {
        try {
            await create_post(description)
            nav('/')
        } catch (error) {
            alert('error creating post')
        }
    }

    return (
        <Flex w='100vw' h='100%' justifyContent='center' pt='50px'>
            <VStack borderRadius='8px' w='95%' maxW='450px' alignItems='start' gap='24px'>
                <Heading>Create Post</Heading>
                <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Input onChange={(e) => setDescription(e.target.value)} bg='white' type='text'/>
                </FormControl>
                <Button onClick={handlePost} w='100%' colorScheme="blue">Create Post</Button>
            </VStack>
        </Flex>
    )
}

export default CreatePost;