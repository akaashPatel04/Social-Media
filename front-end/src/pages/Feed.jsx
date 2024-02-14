import {
  Avatar,
  Box,
  HStack,
  Text,
  VStack,
  Button,
  Input,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { MdChatBubbleOutline } from "react-icons/md";
import { TbArrowBadgeRightFilled } from "react-icons/tb";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [likeRequest, setLikeRequest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commentRequest, setCommentRequest] = useState(true);
  const { user } = useSelector((state) => state.user);

  const likeRequestHandler = async (id) => {
    try {
      const { data } = await axios.get(`api/post/${id}`);
      setLikeRequest(!likeRequest);
    } catch (error) {
      console.log(error);
    }
  };

  const commentRequestHandler = async (id, comment) => {
    try {
      if (!comment) {
        toast.error("Please write a comment before");
        return;
      }
      const { data } = await axios.put(`api/post/comment/${id}`, { comment });
      setCommentRequest(!commentRequest);
      toast.success("Comment Posted");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get("api/posts");
        setPosts(data.posts);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchPosts();
  }, [likeRequest, commentRequest]);

  if (loading) return <Loader />;

  return (
    <Box
      px={["2", "6", "8", "32", "32"]}
      py={["4", "6", "10"]}
      pos={"relative"}
      className="main"
      bgGradient="linear(to-r, purple.400, yellow.200)"
      minH={"100vh"}
    >
      <VStack w={["100%", "80%", "70%"]} gap={"20"} mx={"auto"} pb={8}>
        {posts.length !== 0 ? (
          posts.map((post) => {
            const isRedOrBlack = post.likes.map(
              (like) => like._id === user._id
            );
            const isLiked = isRedOrBlack.includes(true);
            return (
              <PostComponent
                key={post._id}
                post={post}
                likeRequestHandler={likeRequestHandler}
                commentRequestHandler={commentRequestHandler}
                isLiked={isLiked}
                user={user}
              />
            );
          })
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
              Bas bhai khatam!
            </Text>
            <Text textAlign="center" fontSize={["4xl", "5xl", "7xl"]}>
              ✅
            </Text>
            <Text textAlign="center" fontSize="xl">
              <Link
                to="/search"
                style={{ color: "#384aea", textDecoration: "underline" }}
              >
                Follow
              </Link>{" "}
              some people and explore more.
            </Text>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default Feed;

const PostComponent = ({
  post,
  likeRequestHandler,
  isLiked,
  commentRequestHandler,
  user,
}) => {
  const [showLikes, setShowLikes] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");

  const toggleViewLikeHandler = () => {
    setShowLikes(!showLikes);
  };

  const toggleViewCommentHandler = () => {
    setShowComments(!showComments);
  };

  return (
    <VStack
      w={"100%"}
      alignItems={"start"}
      py={4}
      bg={"white"}
      color={"black"}
      key={post._id}
      pos={"relative"}
    >
      <Link to={`/user/${post.user._id}`}>
        <HStack gap={4} py={1} ml={2}>
          <Avatar size={"sm"} src={post.user.avatar.url} />
          <Text fontWeight={"bold"}>{post.user.username}</Text>
        </HStack>
      </Link>
      <Link style={{ width: "100%" }} to={`/post/${post._id}`}>
        <img
          style={{ width: "100%", objectFit: "contain" }}
          src={post.image.url}
          alt="Post"
        />
      </Link>
      <Text py={2} px={4} w={"100%"} fontSize={"xl"}>
        {post.caption}
      </Text>
      <HStack py={2} px={4} w={"100%"} alignItems={"center"}>
        {!isLiked ? (
          <FaRegHeart
            onClick={() => likeRequestHandler(post._id)}
            cursor={"pointer"}
            fontSize={"24px"}
          />
        ) : (
          <FaHeart
            onClick={() => likeRequestHandler(post._id)}
            cursor={"pointer"}
            fontSize={"24px"}
            color="red"
          />
        )}
        <Text
          cursor="pointer"
          fontWeight={"500"}
          fontSize={"xl"}
          onClick={toggleViewLikeHandler}
          mr={6}
        >
          {post.likes.length} Likes
        </Text>
        {showLikes && post.likes.length > 0 && (
          <VStack
            w={["280px", "320px", "400px"]}
            pos={"absolute"}
            bottom={"10vh"}
            p={"4"}
            zIndex={"500"}
            bg={"gray.800"}
            rounded={"lg"}
            color="white"
            alignItems={"start"}
            maxH={"70vh"}
            left="50%"
            transform="translateX(-50%)"
          >
            <HStack justify={"space-between"} w={"100%"} mb={4}>
              <HStack fontSize={"22px"} gap={"2"}>
                <>Total Likes</>
                <FaHeart fontSize={"20px"} />
              </HStack>
              <Button colorScheme="gray" onClick={toggleViewLikeHandler}>
                CLOSE
              </Button>
            </HStack>

            {post.likes.map((like) => (
              <Link
                style={{
                  borderBottom: "1px solid #555",
                  width: "50%",
                  paddingBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                }}
                to={`/user/${like._id}`}
                key={like._id}
              >
                <Avatar size={"xs"} src={like.avatar.url} />
                <Text ml={"6"} display={"inline"} fontSize={"20px"}>
                  {like.username}
                </Text>
              </Link>
            ))}
          </VStack>
        )}
        <MdChatBubbleOutline
          onClick={toggleViewCommentHandler}
          cursor={"pointer"}
          fontSize={"25px"}
        />
        <Text
          cursor="pointer"
          fontWeight={"500"}
          fontSize={"xl"}
          onClick={toggleViewCommentHandler}
        >
          {post.comments.length} Comments
        </Text>
        {showComments && (
          <VStack
            w={["280px", "320px", "400px"]}
            pos={"absolute"}
            bottom={"10vh"}
            p={"4"}
            zIndex={"500"}
            bg={"gray.800"}
            rounded={"lg"}
            color="white"
            alignItems={"start"}
            maxH={"70vh"}
            left="50%"
            transform="translateX(-50%)"
          >
            <HStack justify={"space-between"} w={"100%"} mb={4}>
              <Text fontSize={"22px"}>Comments</Text>
              <Button colorScheme="gray" onClick={toggleViewCommentHandler}>
                CLOSE
              </Button>
            </HStack>

            {post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <VStack
                  mb={4}
                  pl={2}
                  w={"100%"}
                  align={"start"}
                  key={comment._id}
                >
                  <Link
                    style={{
                      width: "60%",
                      display: "flex",
                      alignItems: "center",
                    }}
                    to={`/user/${comment._id}`}
                  >
                    <Avatar size={"xs"} src={comment.user.avatar.url} />
                    <Text
                      ml={"4"}
                      fontWeight={"bold"}
                      display={"inline"}
                      fontSize={"18px"}
                    >
                      {comment.user.username}
                    </Text>
                  </Link>
                  <Text ml={2}>{comment.comment}</Text>
                </VStack>
              ))
            ) : (
              <Text w={"100%"} my={16} textAlign={"center"}>
                <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                  No Comments Yet
                </span>{" "}
                <br />
                Be the <b> first</b> to comment.
              </Text>
            )}

            <HStack w={"full"}>
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                type="text"
                placeholder="Add a comment"
              />
              <Button
                w={"20%"}
                onClick={() => {
                  commentRequestHandler(post._id, comment);
                  toggleViewCommentHandler();
                }}
              >
                <TbArrowBadgeRightFilled />
              </Button>
            </HStack>
          </VStack>
        )}
      </HStack>
    </VStack>
  );
};
