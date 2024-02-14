import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  Avatar,
  Box,
  Grid,
  HStack,
  Stack,
  Text,
  VStack,
  Button,
} from "@chakra-ui/react";
import PostCard from "../post/PostCard";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";

const UserProfile = () => {
  const [person, setPerson] = useState({});
  const { user } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followRequest, setFollowRequest] = useState(false);

  const { id } = useParams();

  //FOLLOWERS
  const [followersToggler, setFollowersToggler] = useState(false);
  const toggleFollowersHandler = () => {
    setFollowersToggler(!followersToggler);
  };

  //FOLLOWING
  const [followingToggler, setFollowingToggler] = useState(false);
  const toggleFollowingHandler = () => {
    setFollowingToggler(!followingToggler);
  };

  const handleFollow = async () => {
    try {
      const { data } = await axios.get(`/api/follow/${id}`);
      setFollowRequest(!followRequest);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`/api/profile/${id}`);
        setPerson(data.user);
        setPosts(data.user.posts);
        setFollowingToggler(false);
        setFollowersToggler(false);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, followRequest]);

  const isFollowing =
    person.followers &&
    person.followers.some((follower) => follower._id === user._id);

  if (loading) return <Loader />;

  return (
    <Box
      className="main"
      px={["2", "6", "8", "32", "32"]}
      py={["4", "6", "10"]}
      pos={"relative"}
    >
      <Text fontWeight={"bold"}>@ {person.username}</Text>

      {followersToggler && (
        <VStack
          w={["100%", "90%", "85%", "80%", "50%"]}
          pos={"absolute"}
          minH={"40vh"}
          maxH={"85vh"}
          p={["4", "6"]}
          bgColor={"#000"}
          color={"#fff"}
          top={"10vh"}
          zIndex={"500"}
          align="start"
          left="50%"
          transform="translateX(-50%)"
        >
          <HStack w="100%" align="center" justify="space-between">
            <Text fontWeight="bold" fontSize="xl">
              Followers
            </Text>
            <Button colorScheme="gray" onClick={toggleFollowersHandler}>
              CLOSE
            </Button>
          </HStack>
          <VStack w="full" align="start" pl="5" gap="8" my={"8"}>
            {person.followers.length > 0 ? (
              person.followers.map((user) => (
                <Link
                  key={user._id}
                  style={{
                    width: "90%",
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    borderBottom: "1px solid #555",
                    paddingBottom: "5px",
                  }}
                  to={`/user/${user._id}`}
                >
                  <Avatar size="md" src={user.avatar.url} />
                  <Text fontWeight="400" fontSize="2xl">
                    {user.username}
                  </Text>
                </Link>
              ))
            ) : (
              <Text fontWeight="400" fontSize="2xl">
                No Followera
              </Text>
            )}
          </VStack>
        </VStack>
      )}

      {followingToggler && (
        <VStack
          w={["100%", "90%", "85%", "80%", "50%"]}
          mx={"auto"}
          minH={"40vh"}
          maxH={"85vh"}
          p={["4", "6"]}
          bgColor={"#000"}
          color={"#fff"}
          pos={"absolute"}
          zIndex={"500"}
          top={"10vh"}
          align="start"
          left="50%"
          transform="translateX(-50%)"
        >
          <HStack w="100%" align="center" justify="space-between">
            <Text fontWeight="bold" fontSize="xl">
              Following
            </Text>
            <Button colorScheme="gray" onClick={toggleFollowingHandler}>
              CLOSE
            </Button>
          </HStack>
          <VStack w="full" align="start" pl="5" gap="8" my={"8"}>
            {person.following.length > 0 ? (
              person.following.map((user) => (
                <Link
                  style={{
                    width: "90%",
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    borderBottom: "1px solid #555",
                    paddingBottom: "5px",
                  }}
                  to={`/user/${user._id}`}
                  key={user._id}
                >
                  <Avatar size="md" src={user.avatar.url} />
                  <Text fontWeight="400" fontSize="2xl">
                    {user.username}
                  </Text>
                </Link>
              ))
            ) : (
              <Text fontWeight="400" fontSize="2xl">
                No Following
              </Text>
            )}
          </VStack>
        </VStack>
      )}

      <HStack
        mt={["6", "8", "12"]}
        mb={"8"}
        justifyContent={"space-between"}
        w={["100%", "100%", "100%", "90%", "70%"]}
        height={["15vh", "15vh", "20vh", "25vh"]}
        pos="relative"
      >
        <Avatar size={["lg", "xl", "2xl"]} src={person.avatar?.url} />

        <HStack w={["85%", "75%"]} justifyContent={"space-around"}>
          <Stack flexDir={["column", "column", "row"]} alignItems={"center"}>
            <Text fontWeight={"bold"}>{person.posts.length}</Text>
            <>Posts</>
          </Stack>
          <Stack
            cursor="pointer"
            flexDir={["column", "column", "row"]}
            alignItems={"center"}
            onClick={toggleFollowersHandler}
          >
            <Text fontWeight={"bold"}>{person.followers.length}</Text>
            <>Followers</>
          </Stack>
          <Stack
            cursor="pointer"
            flexDir={["column", "column", "row"]}
            alignItems={"center"}
            onClick={toggleFollowingHandler}
          >
            <Text fontWeight={"bold"}>{person.following.length}</Text>
            <>Following</>
          </Stack>
        </HStack>
        {person._id !== user._id && (
          <Button
            pos="absolute"
            bottom={["-2vh", "2vh"]}
            left={["24%", "30%"]}
            colorScheme={isFollowing ? "gray" : "messenger"}
            px={"8"}
            h={"5vh"}
            onClick={handleFollow}
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
        )}
      </HStack>
      <VStack
        w={["100%", "90%", "75%"]}
        alignItems={"flex-start"}
        borderBottom={"1px"}
        pb={"6"}
        borderColor={"gray.400"}
      >
        <Text fontWeight={"bold"}>{person.name || person.username}</Text>
        <Text>{person.about}</Text>
      </VStack>
      <Grid py={"8"} gridTemplateColumns={"1fr 1fr 1fr"} gap={"2"}>
        {posts.map((post) => (
          <PostCard key={post._id} image={post.image?.url} id={post._id} />
        ))}
      </Grid>
    </Box>
  );
};

export default UserProfile;
