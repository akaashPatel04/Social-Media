import { useState, useEffect } from "react";
import { Button, Text, HStack, Heading, Input, VStack } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { MdFace, MdLock } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../redux/userSlice";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      navigate("/feed");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter credentials");
      return;
    }
    try {
      setLoading(true);
      setError(false);
      const { data } = await axios.post("/api/login", {
        username,
        password,
      });
      dispatch(signIn(data.user));
      toast.success(`Logged In as ${data.user.username}`);
      setLoading(false);
      navigate("/feed");
    } catch (error) {
      console.log(error.response.data.message);
      dispatch(signIn(null));
      toast.error("Login Failed");
      setLoading(false);
      setError(error.response.data.message);
    }
  };

  return (
    <>
      {!user && (
        <HStack
          height={"100vh"}
          w={"100%"}
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
            h={["100%", "100%", "65vh"]}
          >
            <Heading fontFamily={""} mb={["4vw", "2vw"]}>
              Log In
            </Heading>
            <VStack gap={"4"} px={["2", "4vw"]} w={["95%", "70%", "100%"]}>
              <HStack w={"100%"} position={"relative"}>
                <MdFace className="inputIcon" />
                <Input
                  type="text"
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                />
              </HStack>
              <HStack w={"100%"} position={"relative"}>
                <MdLock className="inputIcon" />
                <Input
                  type="password"
                  placeholder="Enter Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </HStack>
              <Text color={"red"} textAlign={"center"}>
                {error ? error : ""}
              </Text>
              <Button
                w={"3xs"}
                onClick={handleLogin}
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
                {loading ? "Loading..." : "Login"}
              </Button>
            </VStack>
            <HStack>
              <Text fontFamily={"cursive"} fontSize={"xl"} fontWeight={"bold"}>
                New user?
              </Text>
              <Link to={"/register"}>
                <Text fontSize={"xl"} color="blue">
                  Sign Up
                </Text>
              </Link>
            </HStack>
          </VStack>
        </HStack>
      )}
    </>
  );
};

export default Login;
