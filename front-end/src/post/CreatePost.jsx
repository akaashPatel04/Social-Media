import { useState } from "react";
import {
  Button,
  HStack,
  Heading,
  VStack,
  Box,
  Textarea,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";

const CreatePost = () => {
  const { user } = useSelector((state) => state.user);

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      if (!image) {
        toast.error("Please choose an Image");
        return;
      }
      setLoading(true);
      const myForm = new FormData();

      myForm.set("image", image);
      myForm.set("caption", caption);

      const { data } = await axios.post("/api/create", myForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      toast.success(`Post Uploaded`);
      navigate("/profile");
    } catch (error) {
      setLoading(false);
      toast.error("Something went Wrong");
      console.log(error);
    }
  };

  if (loading) return <Loader />;

  return (
    <HStack
      height={"100vh"}
      bgGradient="linear(to-l, #7928CA, #FF0080)"
      className="main"
    >
      <VStack
        gap={["6vw", "4"]}
        py={["8vh", "8vh", "6"]}
        mx={"auto"}
        my={["0", "0", "5vh"]}
        w={["100%", "100%", "md"]}
        bgColor={"gray.800"}
        color={"#fff"}
        borderRadius={"1vw"}
        h={["100%", "100%", "50vh"]}
        boxShadow={"2xl"}
      >
        <Heading fontFamily={""} mb={["4vw", "2vw"]}>
          Create Post
        </Heading>
        <VStack gap={"4"} px={["2", "4vw"]} w={["95%", "70%", "100%"]}>
          <Box pos={"relative"}>
            <label htmlFor="image">
              <Box
                border={"1px"}
                rounded={"lg"}
                py={2}
                px={5}
                bg={"#999"}
                color={"black"}
              >
                Choose a Picture
              </Box>
              <input
                type="file"
                accept="images/*"
                hidden
                id="image"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
          </Box>
          <HStack w={"100%"} position={"relative"} alignItems={"start"}>
            <Textarea
              placeholder={`Hii ${
                user.name || user.username
              }, What's on your mind?`}
              onChange={(e) => setCaption(e.target.value)}
              value={caption}
            />
          </HStack>
          <Button
            w={"3xs"}
            onClick={handleProfileUpdate}
            opacity={loading ? "0.75" : "1"}
            bgGradient="linear(to-l, #7928CA, #FF0080)"
            color={"white"}
            _hover={{
              bgGradient: "linear(to-l, #7928CA, #FF0080)",
            }}
          >
            {loading ? ". . ." : "Create"}
          </Button>
        </VStack>
      </VStack>
    </HStack>
  );
};

export default CreatePost;
