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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
} from "@chakra-ui/react";
import PostCard from "../post/PostCard";
import { IoIosSettings } from "react-icons/io";
import { Link } from "react-router-dom";
import ColorModeSwitcher from "../components/ColorModeSwitcher";
import { signOut, signIn } from "../redux/userSlice";

import { FaEdit } from "react-icons/fa";
import { MdLockOpen, MdDelete } from "react-icons/md";
import { ImExit } from "react-icons/im";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);

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

  //LOG OUT
  const [logoutToggler, setLogoutToggler] = useState(false);
  const toggleLogoutHandler = () => {
    setLogoutToggler(!logoutToggler);
  };

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get("/api/logout");
      dispatch(signOut(null));
      toast.success("Logged Out");
      navigate("/");
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };

  //Account DELETE
  const [deleteToggler, setDeleteToggler] = useState(false);
  const toggleDeleteHandler = () => {
    setDeleteToggler(!deleteToggler);
  };

  const accountDeleteHandler = async () => {
    try {
      const { data } = await axios.delete("/api/profile");
      dispatch(signOut(null));
      toast.success("Account Deleted");
      navigate("/");
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("api/profile");
        dispatch(signIn(data.user));
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();

    const fetchPosts = async () => {
      try {
        const { data } = await axios.get("api/myposts");
        setPosts(data.posts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <Box
      className="main"
      px={["2", "6", "8", "32", "32"]}
      py={["4", "6", "10"]}
      pos={"relative"}
    >
      <Text fontWeight={"bold"}>@ {user.username}</Text>

      <Box
        pos={"absolute"}
        top={["8", "8", "32"]}
        right={["8", "16", "20", "56", "64"]}
        cursor={"pointer"}
      >
        <Menu direction="rtl">
          <MenuButton
            px={4}
            py={2}
            transition="all 0.2s"
            borderRadius="md"
            _expanded={{ bg: "gray.400" }}
          >
            <IoIosSettings fontWeight={"bold"} fontSize={"35px"} />
          </MenuButton>
          <MenuList h={["25vh", "auto"]} w={["55vw", "auto"]}>
            <MenuItem>
              <Link to={"/update"}>
                <HStack>
                  <FaEdit />
                  <> Edit Profile</>
                </HStack>
              </Link>
            </MenuItem>
            <MenuItem>
              <ColorModeSwitcher />
            </MenuItem>
            <MenuItem>
              <Link to={"/password/change"}>
                <HStack>
                  <MdLockOpen />
                  <>Change Password</>
                </HStack>
              </Link>
            </MenuItem>
            <MenuDivider />
            <MenuItem>
              <Link>
                <HStack onClick={toggleLogoutHandler}>
                  <ImExit />
                  <Text>Logout</Text>
                </HStack>
              </Link>
            </MenuItem>
            <MenuItem>
              <HStack onClick={toggleDeleteHandler}>
                <MdDelete />
                <>Delete Account</>
              </HStack>
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>

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
            {user.followers.length > 0 ? (
              user.followers.map((user) => (
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
                >
                  <Avatar size="md" src={user.avatar.url} />
                  <Text fontWeight="400" fontSize="2xl">
                    {user.username}
                  </Text>
                </Link>
              ))
            ) : (
              <Text
                fontWeight="400"
                fontSize="2xl"
                textAlign="center"
                w="100%"
                pt="6"
              >
                No Followers
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
            {user.following.length > 0 ? (
              user.following.map((user) => (
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
                >
                  <Avatar size="md" src={user.avatar.url} />
                  <Text fontWeight="400" fontSize="2xl">
                    {user.username}
                  </Text>
                </Link>
              ))
            ) : (
              <Text
                fontWeight="400"
                fontSize="2xl"
                textAlign="center"
                w="100%"
                pt="6"
              >
                No Following
              </Text>
            )}
          </VStack>
        </VStack>
      )}

      {deleteToggler && (
        <VStack
          w={["65vw", "60vw", "45vw"]}
          pos={"absolute"}
          mx={"auto"}
          h={["fit-content", "fit-content", "40vh"]}
          p={["6", "6", "12"]}
          bgColor={"#000"}
          color={"#fff"}
          top={["12vh", "20vh"]}
          zIndex={"500"}
        >
          <Text
            w={["100%", "100%", "70%"]}
            fontSize={"22px"}
            textAlign={"center"}
          >
            Are you sure, your data, interactions, posts and all information
            would be removed <b>Permanently.</b>
          </Text>
          <HStack gap={"4"} mt={"8"}>
            <Button colorScheme="gray" onClick={toggleDeleteHandler}>
              CANCEL
            </Button>
            <Button colorScheme="red" onClick={accountDeleteHandler}>
              CONFIRM
            </Button>
          </HStack>
        </VStack>
      )}

      {logoutToggler && (
        <VStack
          w={["65vw", "60vw", "45vw"]}
          mx={"auto"}
          h={["fit-content", "fit-content", "32vh"]}
          p={["6", "6", "12"]}
          bgColor={"#000"}
          color={"#fff"}
          pos={"absolute"}
          zIndex={"500"}
          top={"20vh"}
        >
          <Text w={"70%"} fontSize={"22px"} textAlign={"center"}>
            Do you want to <b>Logout?</b>
          </Text>
          <HStack gap={"4"} mt={"8"}>
            <Button colorScheme="gray" onClick={toggleLogoutHandler}>
              CANCEL
            </Button>
            <Button colorScheme="red" onClick={logoutHandler}>
              LOGOUT
            </Button>
          </HStack>
        </VStack>
      )}

      <HStack
        mt={["6", "8", "12"]}
        mb={"5"}
        justifyContent={"space-between"}
        w={["100%", "100%", "100%", "90%", "70%"]}
        height={["12vh", "15vh", "20vh", "25vh"]}
      >
        <Avatar size={["lg", "xl", "2xl"]} src={user.avatar?.url} />

        <HStack w={["85%", "75%"]} justifyContent={"space-around"}>
          <Stack flexDir={["column", "column", "row"]} alignItems={"center"}>
            <Text fontWeight={"bold"}>{user.posts.length}</Text>
            <>Posts</>
          </Stack>
          <Stack
            cursor="pointer"
            flexDir={["column", "column", "row"]}
            alignItems={"center"}
            onClick={toggleFollowersHandler}
          >
            <Text fontWeight={"bold"}>{user.followers.length}</Text>
            <>Followers</>
          </Stack>
          <Stack
            cursor="pointer"
            flexDir={["column", "column", "row"]}
            alignItems={"center"}
            onClick={toggleFollowingHandler}
          >
            <Text fontWeight={"bold"}>{user.following.length}</Text>
            <>Following</>
          </Stack>
        </HStack>
      </HStack>
      <VStack
        w={["100%", "90%", "75%"]}
        alignItems={"flex-start"}
        borderBottom={"1px"}
        pb={"6"}
        borderColor={"gray.400"}
      >
        <Text fontWeight={"bold"}>{user.name || user.username}</Text>
        <Text>{user.about}</Text>
      </VStack>
      <Grid py={"8"} gridTemplateColumns={"1fr 1fr 1fr"} gap={"2"}>
        {posts.map((post) => (
          <PostCard key={post._id} image={post.image?.url} id={post._id} />
        ))}
      </Grid>
    </Box>
  );
};

export default Profile;
