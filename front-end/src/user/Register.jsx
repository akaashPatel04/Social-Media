import { useEffect, useState } from "react";
import { Button, Text, HStack, Heading, Input, VStack } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { MdOutlineEmail, MdFace, MdLock } from "react-icons/md";
import { FaKey } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../redux/userSlice";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
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

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !password || !email || !password2) {
      toast.error("Please enter credentials");
      return;
    }

    if (password !== password2) {
      toast.error("Passwords does'nt match");
      return;
    }
    try {
      setLoading(true);
      setError(false);
      const { data } = await axios.post("/api/register", {
        username,
        password,
        email,
      });
      setLoading(false);
      dispatch(signIn(data.user));
      toast.success(`Logged In as ${data.user.username}`);
      navigate("/feed");
    } catch (error) {
      toast.error("Sign Up Failed");
      setLoading(false);
      dispatch(signIn(null));
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
              Register
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
                <MdOutlineEmail className="inputIcon" />
                <Input
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </HStack>
              <HStack w={"100%"} position={"relative"}>
                <MdLock className="inputIcon" />
                <Input
                  type="password"
                  placeholder="Create Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </HStack>
              <HStack w={"100%"} position={"relative"}>
                <FaKey className="inputIcon" />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  onChange={(e) => setPassword2(e.target.value)}
                  value={password2}
                />
              </HStack>
              <Text color={"red"} textAlign={"center"}>
                {error ? error : ""}
              </Text>
              <Button
                w={"3xs"}
                onClick={handleRegister}
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
                {loading ? "Loading..." : "Register"}
              </Button>
            </VStack>
            <HStack>
              <Text fontFamily={"cursive"} fontSize={"xl"} fontWeight={"bold"}>
                Already our user?
              </Text>
              <Link to={"/"}>
                <Text fontSize={"xl"} color="blue">
                  Login
                </Text>
              </Link>
            </HStack>
          </VStack>
        </HStack>
      )}
    </>
  );
};

export default Register;
