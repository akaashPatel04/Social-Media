import { Box, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const PostCard = ({ image, id }) => {
  return (
    <Link key={id} to={`/post/${id}`}>
      <Box bgColor={"gray.700"} h={["32vw", "32vw", "25vh", "25vh", "40vh"]}>
        <Image h={"100%"} w={"100%"} objectFit={"contain"} src={image} />
      </Box>
    </Link>
  );
};

export default PostCard;
