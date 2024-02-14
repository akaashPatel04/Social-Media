import {
  useColorMode,
  useColorModeValue,
  IconButton,
  HStack,
  Text,
} from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";

const ColorModeSwitcher = (props) => {
  const { toggleColorMode } = useColorMode();
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  return (
    <HStack onClick={toggleColorMode}>
      <IconButton
        mx={"-3"}
        variant=""
        color="current"
        onClick={toggleColorMode}
        icon={<SwitchIcon />}
        {...props}
      ></IconButton>
      <Text>Theme</Text>
    </HStack>
  );
};

export default ColorModeSwitcher;
