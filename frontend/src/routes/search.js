import { Flex, VStack,Image,Input,Button, Heading,Text, HStack, Box } from "@chakra-ui/react";
import { useState } from "react";

import { search_users } from "../api/endpoints"; 
import { SERVER_URL } from "../constants/constants";
import {useNavigate} from "react-router-dom"
const Search = () => {

    const [search, setSearch] = useState('')
    const [users, setUsers] = useState([])

    const handleSearch = async () => {
        const users = await search_users(search)
        setUsers(users)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch(); // Trigger search when Enter key is pressed
        }
    };

    return (
        <Flex w='100vw' justifyContent='center' mt='50px'>
            <VStack w='95%' maxW='500px' alignItems='start' gap='20px'>
                <Heading>Search Users</Heading>
                <HStack w='100%' gap='5px'>
                    <Input onChange={(e) => setSearch(e.target.value)} onKeyDown={handleKeyDown} bg='white' />
                    <Button onClick={handleSearch} colorScheme="blue">Search</Button>
                </HStack>
                <VStack w='100%'>
                    {users.map((user) => {
                        return <UserProfile username={user.username} profile_image={user.profile_image} first_name={user.first_name} last_name={user.last_name} />
                        })
                    }
                </VStack>
            </VStack>
        </Flex>
    )
}

const UserProfile = ({username, profile_image, first_name, last_name}) => {
    
    const nav = useNavigate();

    const handleNav = () => {
        nav(`/${username}`)
    }
    
    return (
        <Flex onClick={handleNav} cursor='pointer' w='100%' h='100px' border='1px solid' borderColor='gray.300' borderRadius='12px' bg='white' padding='8px' alignItems='center'>
            <HStack gap='20px'>
                <Box boxSize='70px' borderRadius='full' overflow='hidden' bg='white' border='1px solid'>
                    <Image src={`${SERVER_URL}${profile_image}`} boxSize='100%' objectFit='cover' />
                </Box>
                <VStack alignItems='start' gap='3px'>
                    <Text fontWeight='medium'>{first_name} {last_name}</Text>
                    <Text color='gray.600' fontSize='15px'>@{username}</Text>
                </VStack>
            </HStack>
        </Flex>
    )
}

export default Search;