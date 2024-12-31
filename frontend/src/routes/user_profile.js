import {Text, Flex, Box, VStack, Heading, HStack, Image, Button, Spacer} from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { get_user_profile_data, toggleFollow, get_users_posts } from '../api/endpoints';
import { SERVER_URL } from '../constants/constants';
import { useNavigate } from 'react-router-dom'

import Post from '../components/post';

const UserProfile = ()=> {

    const get_username_from_url = ()=>{
        const url_split = window.location.pathname.split('/');
        return url_split[url_split.length-1]
    }

    const [username, setUsername] = useState(get_username_from_url())

    useEffect(()=>{
        setUsername(get_username_from_url())
    },[])

    return(
        <Flex w="100vw" justifyContent={"center"}>
            <VStack w='75%' mt='35px'>
                <Box w="100%">
                    <UserDetails username={username}/>
                </Box>
                <Box w="100%" mt='30px'>
                    <UserPosts username={username}/>
                </Box>
            </VStack>
        </Flex>
    )
}

const UserDetails = ({username}) =>{

    const [loading, setLoading] = useState(true);
    const [bio, setBio] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    
    const [isOurProfile, setIsOurProfile] = useState(false);
    const [following, setFollowing] = useState(false);

    const handleToggleFollow = async () => {
        const data = await toggleFollow(username);
        if (data.now_following) {
            setFollowerCount(followerCount+1)
            setFollowing(true)
        } else {
            setFollowerCount(followerCount-1)
            setFollowing(false)
        }
    }

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const data = await get_user_profile_data(username);
                setBio(data.bio)
                setProfileImage(data.profile_image)
                setFollowerCount(data.follower_count)
                setFollowingCount(data.following_count)

                setIsOurProfile(data.is_our_profile)
                setFollowing(data.following)
            } catch (error) {
                console.log(error)
            }finally{
                setLoading(false)
            } 
        }
        fetchData();
    }, [])

    const nav = useNavigate();
    const handleEditProfile = () =>{
        nav('/settings')
    }

    return (
        <VStack w="100%" alignItems="start" gap='12px'>
            <Heading>@{username}</Heading>
            <HStack gap='25px'>
                <Box boxSize="120px" border='2px solid grey' borderRadius='full' overflow='hidden'>
                    <Image src={loading ? '-' : `${SERVER_URL}${profileImage}`} boxSize='100%' objectFit='cover'></Image>
                </Box>
                <VStack gap='12px'>
                    <HStack gap='20px' fontSize='15px'>
                        <VStack>
                            <Text>Followers</Text>
                            <Text>{loading ? '-' : followerCount}</Text>
                        </VStack>
                        <VStack>
                            <Text>Following</Text>
                            <Text>{loading ? '-' : followingCount}</Text>
                        </VStack>
                    </HStack>
                    {
                        loading ?
                        <Spacer /> :
                        isOurProfile ?
                        <Button onClick={handleEditProfile} w='100%'>Edit Profile</Button> :
                        <Button onClick={handleToggleFollow} colorScheme='blue' w='100%'>{following? 'Unfollow' : 'Follow'}</Button>
                    }
                    
                </VStack>
            </HStack>
            <Text fontSize='15px'>{loading ? '-' : bio}</Text>
        </VStack>
    )
}

const UserPosts = ({username}) => {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const posts = await get_users_posts(username)
                setPosts(posts)
            } catch (error) {
                alert('error getting users posts', error)
            } finally{
                setLoading(false)
            }
        }
        fetchPosts()
    }, [])

    return (
        <Flex w='100%' wrap='wrap' mb='45px' gap='25px'>
            {loading ?
                <Text>Loading...</Text> :
                posts.map((post) => {
                    return <Post key={post.id} id={post.id} username={post.username} description={post.description} formatted_date={post.formatted_date} liked={post.liked} like_count={post.like_count} />
                })
            } 
        </Flex>
    )
}


export default UserProfile