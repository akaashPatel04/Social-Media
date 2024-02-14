import { Avatar, HStack, Stack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { IoMdHome } from "react-icons/io";
import { IoHomeOutline } from "react-icons/io5";
import { FaSearch, FaPlusSquare, FaRegPlusSquare } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { RiMessengerFill, RiMessengerLine } from "react-icons/ri";

import { useState } from "react";

const SideBar = ({ image }) => {
  const [page, setPage] = useState("/feed");
  return (
    <Stack
      direction={["row", "row", "column"]}
      h={["5vh", "5vh", "100vh"]}
      w={["100vw", "100vw", "250px"]}
      maxW={"100%"}
      borderRight={["0", "0", "1px"]}
      borderColor={"gray.400"}
      py={["2", "2", "12"]}
      px={["2", "2", "10"]}
      fontSize={["25", "25", "20"]}
      justifyContent={["space-between", "space-between", "flex-start"]}
      gap={["0", "0", "5"]}
      pos={["fixed"]}
      zIndex={"99"}
      left={["-2vmax", "-6vmax", "0"]}
      top={["93vh", "93vh", "0"]}
    >
      <Link to={"/feed"}>
        <Text
          display={["none", "none", "block"]}
          fontFamily={"Satisfy"}
          mb={"6"}
          fontSize={"4vmax"}
        >
          Saffron
        </Text>
      </Link>

      <Link to={"/feed"}>
        <HStack onClick={() => setPage("/feed")}>
          {page === "/feed" ? <IoMdHome /> : <IoHomeOutline />}
          <Text
            display={["none", "none", "block"]}
            fontWeight={page === "/feed" ? "bold" : "normal"}
          >
            Home
          </Text>
        </HStack>
      </Link>

      <Link to={"/search"}>
        <HStack onClick={() => setPage("/search")}>
          {page === "/search" ? <FaSearch /> : <IoSearchOutline />}
          <Text
            display={["none", "none", "block"]}
            fontWeight={page === "/search" ? "bold" : "normal"}
          >
            Search
          </Text>
        </HStack>
      </Link>

      <Link to={"/create"}>
        <HStack onClick={() => setPage("/create")}>
          {page === "/create" ? <FaPlusSquare /> : <FaRegPlusSquare />}
          <Text
            display={["none", "none", "block"]}
            fontWeight={page === "/create" ? "bold" : "normal"}
          >
            Create
          </Text>
        </HStack>
      </Link>

      <Link to={"/message"}>
        <HStack onClick={() => setPage("/message")}>
          {page === "/message" ? <RiMessengerFill /> : <RiMessengerLine />}
          <Text
            display={["none", "none", "block"]}
            fontWeight={page === "/message" ? "bold" : "normal"}
          >
            Message
          </Text>
        </HStack>
      </Link>

      <Link to={"/profile"}>
        <HStack onClick={() => setPage("/profile")}>
          <Avatar size={["xs", "xs", "2xs"]} src={image} />
          <Text
            display={["none", "none", "block"]}
            fontWeight={page === "/profile" ? "bold" : "normal"}
          >
            Profile
          </Text>
        </HStack>
      </Link>
    </Stack>
  );
};

export default SideBar;
