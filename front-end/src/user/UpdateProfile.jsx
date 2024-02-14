import { useState } from "react";
import {
  Button,
  HStack,
  Heading,
  Input,
  VStack,
  Avatar,
  Box,
  Textarea,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { MdOutlineEmail, MdFace } from "react-icons/md";
import { FaPencilAlt, FaUserEdit, FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../redux/userSlice";
import "./components/user.css";
const UpdateProfile = () => {
  const { user } = useSelector((state) => state.user);

  const [username, setUsername] = useState(user.username);
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email);
  const [about, setAbout] = useState(user.about || "");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      if (!username || !email) {
        toast.error("Username and Email are required");
        return;
      }
      setLoading(true);
      const myForm = new FormData();

      myForm.set("name", name);
      myForm.set("username", username);
      myForm.set("email", email);
      myForm.set("image", image);
      myForm.set("about", about);

      const { data } = await axios.put("/api/update", myForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(signIn(data.user));
      toast.success(`Profile Updated`);
      navigate("/profile");
    } catch (error) {
      setLoading(false);
      toast.error("Something went Wrong");
      console.log(error);
    }
  };

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
        h={["100%", "100%", "85vh"]}
        boxShadow={"2xl"}
      >
        <Heading fontFamily={""} mb={["4vw", "2vw"]}>
          Profile
        </Heading>
        <VStack gap={"4"} px={["2", "4vw"]} w={["95%", "70%", "100%"]}>
          <Box pos={"relative"}>
            <Avatar size={"xl"} src={user.avatar?.url} />
            <label htmlFor="image">
              <FaPencilAlt className="profilePicEditIcon" cursor={"pointer"} />
              <input
                type="file"
                accept="images/*"
                hidden
                id="image"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
          </Box>
          <HStack w={"100%"} position={"relative"}>
            <MdFace className="inputIcon" />
            <Input
              type="text"
              placeholder={"Username"}
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </HStack>
          <HStack w={"100%"} position={"relative"}>
            <FaUserEdit className="inputIcon" />
            <Input
              type="text"
              placeholder={"Name"}
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </HStack>
          <HStack w={"100%"} position={"relative"}>
            <MdOutlineEmail className="inputIcon" />
            <Input
              type="email"
              placeholder={"Email"}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </HStack>

          <HStack w={"100%"} position={"relative"} alignItems={"start"}>
            <FaEdit className="inputIcon" />
            <Textarea
              placeholder={"Write about yourself"}
              onChange={(e) => setAbout(e.target.value)}
              value={about}
            />
          </HStack>
          <Button
            w={"3xs"}
            onClick={handleProfileUpdate}
            disabled={loading}
            opacity={loading ? "0.75" : "1"}
            bgGradient="linear(to-l, #7928CA, #FF0080)"
            color={"white"}
            _hover={{
              bgGradient: "linear(to-l, #7928CA, #FF0080)",
            }}
          >
            {loading ? "Loading..." : "Update"}
          </Button>
        </VStack>
      </VStack>
    </HStack>
  );
};

export default UpdateProfile;
