import {
  Avatar,
  Box,
  HStack,
  Text,
  VStack,
  Button,
  Input,
  Grid,
  Image,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const Search = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`api/search?searchTerm=${searchTerm}`);
      setUsers(data.users);
      const reversedDataPost = data.posts.reverse();
      setPosts(reversedDataPost);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <Box
      px={["2", "6", "8", "32", "32"]}
      py={["4", "6", "10"]}
      pos={"relative"}
      className="main"
      minH={"100vh"}
    >
      <HStack h="15vh" w={["100%", "80%", "70%"]} mx={"auto"} py={4}>
        <Input
          type="text"
          placeholder="Type your closed one..."
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
        <Button colorScheme="gray" onClick={fetchData}>
          Search
        </Button>
      </HStack>
      <VStack w={["100%", "80%", "70%"]} gap={"6"} mx={"auto"} pb={8}>
        {users.length > 0 ? (
          users.map((user) => (
            <Link style={{ width: "100%" }} to={`/user/${user._id}`}>
              <HStack
                w={["100%", "80%"]}
                gap={[6, 8, 12]}
                key={user._id}
                borderBottom="1px solid #777"
                pb={4}
              >
                <Avatar size="lg" src={user.avatar.url} />
                <VStack alignItems="start" gap={0}>
                  <Text fontWeight={"bold"} fontSize="sm">
                    @ {user.username}
                  </Text>
                  <Text fontSize="xl">{user.name}</Text>
                </VStack>
              </HStack>
            </Link>
          ))
        ) : (
          <VStack
            bg="gray.800"
            color="white"
            w={["100%", "80%", "70%"]}
            gap={"6"}
            mx={"auto"}
            p={8}
            mt={"20%"}
          >
            <Text textAlign="center" fontWeight="bold" fontSize="2xl">
              No users Found
            </Text>
            <Text textAlign="center" fontSize={["4xl", "5xl", "7xl"]}>
              🔎
            </Text>
            <Text textAlign="center" fontSize="xl">
              Try something different.
            </Text>
          </VStack>
        )}
      </VStack>
      <VStack w={["100%", "80%", "70%"]} mt="20" mx={"auto"} pb={12}>
        <Text fontSize="4xl" fontWeight="bold">
          Post Results
        </Text>
        <Grid py={"8"} gap={"10"} gridTemplateColumns={"1fr 1fr"}>
          {posts.length > 0 &&
            posts.map((post) => {
              return <PostComponent key={post._id} post={post} />;
            })}
        </Grid>
      </VStack>
    </Box>
  );
};

export default Search;

const PostComponent = ({ post }) => (
  <Link key={post._id} to={`/post/${post._id}`}>
    <Box bgColor={"gray.700"} h={["32vw", "32vw", "25vh", "25vh", "40vh"]}>
      <Image h={"100%"} w={"100%"} objectFit={"contain"} src={post.image.url} />
    </Box>
  </Link>
);
