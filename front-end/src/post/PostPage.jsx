import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Image,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Button,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { HiDotsVertical } from "react-icons/hi";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const PostPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [caption, setCaption] = useState(post.caption);
  const { id } = useParams();

  //post EDIT
  const [postEditToggler, setPostEditToggler] = useState(false);
  const toggleEditHandler = () => {
    setPostEditToggler(!postEditToggler);
  };

  const postEditHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.put(`/api/post/${id}`, { caption: caption });
      console.log(data);
      toast.success("Caption Update");
      setLoading(false);
      toggleEditHandler();
    } catch (error) {
      toast.error("Something went Wrong");
      setLoading(false);
      toggleEditHandler();
    }
  };

  //post DELETE
  const [deleteToggler, setDeleteToggler] = useState(false);
  const toggleDeleteHandler = () => {
    setDeleteToggler(!deleteToggler);
  };
  const postDeleteHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`/api/post/${id}`);
      toast.success("Post Removed");
      setLoading(false);
      navigate("/profile");
    } catch (error) {
      toast.error("Something went Wrong");
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`/api/p/${id}`);
        setPost(data.post);
        setCaption(data.post.caption);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  let isOwner = false;
  isOwner = post.user === user._id;

  if (loading) return <Loader />;

  return (
    <VStack h={"100vh"} justify={"center"} className="main">
      {isOwner && (
        <Menu>
          <MenuButton className="postMenuButton">
            <HiDotsVertical />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={toggleEditHandler}>
              <span>Edit</span>
            </MenuItem>
            <MenuItem onClick={toggleDeleteHandler}>
              <span>Delete</span>
            </MenuItem>
          </MenuList>
        </Menu>
      )}
      <Image
        objectFit={"contain"}
        maxW={"90%"}
        minW={"60%"}
        maxH={"100%"}
        mx={"auto"}
        src={post.image?.url}
        alt="Post"
      />
      {deleteToggler && (
        <VStack
          w={["65vw", "60vw", "45vw"]}
          pos={"absolute"}
          mx={"auto"}
          h={["fit-content", "fit-content", "30vh"]}
          px={["2", "6", "12"]}
          py="12"
          bgColor={"#000"}
          color={"#fff"}
          top={"20vh"}
          zIndex={"500"}
        >
          <Text w={"70%"} fontSize={"22px"} textAlign={"center"}>
            Do you want to <b>Delete </b>this post
          </Text>
          <HStack gap={"4"} mt={"8"}>
            <Button colorScheme="gray" onClick={toggleDeleteHandler}>
              CANCEL
            </Button>
            <Button colorScheme="red" onClick={postDeleteHandler}>
              DELETE
            </Button>
          </HStack>
        </VStack>
      )}

      {postEditToggler && (
        <VStack
          w={["65vw", "60vw", "45vw"]}
          mx={"auto"}
          h={["fit-content", "fit-content", "35vh"]}
          px={["2", "6", "12"]}
          py="12"
          bgColor={"#000"}
          color={"#fff"}
          pos={"absolute"}
          zIndex={"500"}
          top={"20vh"}
        >
          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <HStack gap={"4"} mt={"8"}>
            <Button colorScheme="gray" onClick={toggleEditHandler}>
              CANCEL
            </Button>
            <Button colorScheme="whatsapp" onClick={postEditHandler}>
              UPDATE
            </Button>
          </HStack>
        </VStack>
      )}
    </VStack>
  );
};

export default PostPage;
