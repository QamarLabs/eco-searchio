import { VStack, Text } from "@chakra-ui/react";
import Link from "next/link";

// export const N_NText = (props) => <Text  lineHeight='24px' {...props} >{props.children}</Text>;
export default function Card({ title, description, link }) {
  return (
    <VStack
      backgroundColor="white"
      className="search-card"
      w={{ base: "90^", md: "45%", lg: "30%", "2xl": "23%" }}
      boxSizing="border-box"
      boxShadow="0px 0px 2px rgba(126,128,131)"
      transition="all 0.25s ease-in-out"
      _hover={{
        backgroundColor: "rgb(34, 211, 238)",
        boxShadow: "0px 0px 6px rgba(126,128,131)",
        cursor: "pointer",
      }}
      borderRadius="0.25rem"
      height="7rem"
      p="0.5rem"
      onClick={() => {
        const isFirefox = typeof InstallTrigger !== "undefined";
        const isSafari =
          /constructor/i.test(window.HTMLElement) ||
          (function (p) {
            return p.toString() === "[object SafariRemoteNotification]";
          })(
            !window["safari"] ||
              (typeof safari !== "undefined" &&
                window["safari"].pushNotification)
          );
        if (isFirefox) {
          return setTimeout(() => {
            window.open(link, "mozillaTab", "fullscreen=1").focus();
          });
        } else if (isSafari) {
          return window.open(link, "_blank").focus();
        } else {
          return window.open(link, "_blank");
        }
      }}
    >
      <VStack alignItems={{ base: "center", md: "flex-start" }}>
        <Link target="_blank" className="title-link" href={link} passHref>
          <Text
            fontWeight={900}
            fontFamily="'Open Sans', sans-serif"
            fontSize="0.8em"
          >
            {title}
          </Text>
        </Link>
        <Text fontWeight="200" fontSize="0.5em">
          {description}
        </Text>
      </VStack>
    </VStack>
  );
}
