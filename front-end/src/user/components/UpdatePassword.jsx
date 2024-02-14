import { useState } from "react";
import { Button, Text, HStack, Heading, Input, VStack } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { MdKey, MdLock } from "react-icons/md";

const UpdatePassword = () => {
  const [oldPassword, setoldPassword] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleupdatePassword = async () => {
    if (!oldPassword || !newPassword) {
      toast.error("Please enter passwords");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put("/api/update/password", {
        newPassword,
        oldPassword,
      });
      console.log(data);
      toast.success(`Password Updated`);
      setLoading(false);
      navigate("/profile");
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message || "Something went Wrong");
    }
  };

  return (
    <HStack
      height={"100vh"}
      className="main"
      bgGradient="linear(to-l, #7928CA, #FF0080)"
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
      >
        <Heading fontFamily={""} mb={["4vw", "2vw"]}>
          Update Password
        </Heading>
        <VStack gap={"4"} px={["2", "4vw"]} w={["95%", "70%", "100%"]}>
          <HStack w={"100%"} position={"relative"}>
            <MdKey className="inputIcon" />
            <Input
              type="password"
              placeholder="Old Password"
              onChange={(e) => setoldPassword(e.target.value)}
              value={oldPassword}
            />
          </HStack>
          <HStack w={"100%"} position={"relative"}>
            <MdLock className="inputIcon" />
            <Input
              type="password"
              placeholder="New Password"
              onChange={(e) => setnewPassword(e.target.value)}
              value={newPassword}
            />
          </HStack>
          <Button
            mt={"6"}
            w={"3xs"}
            onClick={handleupdatePassword}
            disabled={loading}
            opacity={loading ? "0.75" : "1"}
            bgGradient="linear(to-l, #7928CA, #FF0080)"
            color={"white"}
            _hover={{
              bgGradient: "linear(to-l, #7928CA, #FF0080)",
              transform: "scale(105%)",
              transition: "0.25s",
            }}
          >
            {loading ? "Loading..." : "Update"}
          </Button>
        </VStack>
      </VStack>
    </HStack>
  );
};

export default UpdatePassword;
