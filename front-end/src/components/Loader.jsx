import { Box, VStack } from "@chakra-ui/react";

const Loader = () => {
  return (
    <VStack justify={"center"} h={"100vh"} className="main">
      <div class="loading-container">
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
      </div>
    </VStack>
  );
};

export default Loader;
