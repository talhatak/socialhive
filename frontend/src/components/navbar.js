import { Flex, Text, HStack } from "@chakra-ui/react"
import { useNavigate } from 'react-router-dom'
import { IoMdPerson } from "react-icons/io";
import { BsFillPlusSquareFill } from "react-icons/bs";
import { AiFillHome } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { RiSettings3Line } from "react-icons/ri";

const Navbar = ()=> {

    const nav = useNavigate();
    const handleNavigate = (route) =>{
        nav(`/${route}`)
    }

    const handleNavigateUser = () => {
        const username = JSON.parse(localStorage.getItem('userData'))['username']
        nav(`/${username}`)
        window.location.reload()
    }

    return (
        <Flex w='100vw' h='80px' bgGradient='linear(to-r, #1488CC, #2B32B2)' justifyContent={"center"} alignItems={"center"}>
            <HStack w='90%' color={"white"} justifyContent="space-between">
                <Text fontSize={"22px"} fontWeight="bold">SocialHive</Text>
                <HStack gap='15px'>
                    <Text cursor="pointer" onClick={() => handleNavigate('')}><AiFillHome size="25px"/></Text>
                    <Text cursor="pointer" onClick={() => handleNavigate('create/post')}><BsFillPlusSquareFill size="18px"/></Text>
                    <Text cursor="pointer" onClick={handleNavigateUser}><IoMdPerson size="25px"/></Text>
                    <Text cursor="pointer" onClick={() => handleNavigate('search')}><FaSearch size="22px"/></Text>
                    <Text cursor="pointer" onClick={() => handleNavigate('settings')}><RiSettings3Line size="25px"/></Text>
                </HStack>
            </HStack>
        </Flex>
    )
}

export default Navbar