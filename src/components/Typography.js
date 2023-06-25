import React from "react";
import { Text } from "@chakra-ui/react";

const TypedText = ({ text }) => {
  const [typed, setTyped] = React.useState("");
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        setTyped(typed + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }
    }, 100);
    if (currentIndex === text.length) {
      setTimeout(() => {
        setTyped("");
        setCurrentIndex(0);
      }, 5000);
    }

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, text]);

  return (
    <Text
      alignSelf="flex-end"
      fontWeight={900}
      fontFamily="'Coiny', sans-serif"
      fontSize="1.75em"
      color="rgb(34, 211, 238)"
    >
      {typed}
    </Text>
  );
};

export default TypedText;
