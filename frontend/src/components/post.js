import { VStack,Text, HStack, Flex, Box } from "@chakra-ui/react";

import { LuDiamond } from "react-icons/lu";

import { FaDiamond } from "react-icons/fa6";
import { useState } from "react";
import { toggleLike } from "../api/endpoints";

const Post = ({id, username, description, formatted_date, liked, like_count}) => {

    const [clientLiked, setClientLiked] = useState(liked)
    const [clientLikeCount, setClientLikeCount] = useState(like_count)

    const handleToggleLike = async () => {
        const data = await toggleLike(id)
        if (data.now_liked) {
            setClientLiked(true)
            setClientLikeCount(clientLikeCount+1)
        } else {
            setClientLiked(false)
            setClientLikeCount(clientLikeCount-1)
        }
    }

    return (
        <VStack w='350px' h='350px' border='1px solid' borderColor='grey.400' borderRadius='8px' boxShadow='0 1px 2px grey'>
            <HStack w='100%' flex='1' className='header' borderBottom='1px solid' borderColor='gray.500' p='0 20px' bg='gray.50' borderRadius='8px 8px 0 0'>
                <Text>@{username}</Text>
            </HStack>
            <Flex className='description' flex='6' w='100%' h='100%' justifyContent='center' alignItems='center' padding='10px'>
                <Text textAlign='center'>{description}</Text>
            </Flex>
            <Flex className='footer' justifyContent='center' alignItems='center' flex='2' w='100%' bg='gray.50' borderTop='1px solid' borderRadius='0 0 8px 8px'>
                <HStack w='90%' justifyContent='space-between'>
                    <HStack>
                        <Box cursor='pointer'>
                            { clientLiked ? 
                            <Box color='blue.500'>
                                <FaDiamond onClick={handleToggleLike}/>  
                            </Box> 
                            :
                            <LuDiamond onClick={handleToggleLike}/>}
                        </Box>
                        <Text>{clientLikeCount}</Text>
                    </HStack>
                    <Text fontSize='13px'>{formatted_date}</Text>
                </HStack>
            </Flex>
        </VStack>
    )
}

export default Post;