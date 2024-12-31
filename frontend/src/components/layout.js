import { Flex, Box, VStack } from "@chakra-ui/react"
import Navbar from "./navbar"

const Layout = ({children}) => {
    return (
        <VStack width='100vw' minH='100vh' bg='#FCFCFC'>
            <Navbar />
            <Box>
                {children}
            </Box>
        </VStack>
    )
}

export default Layout