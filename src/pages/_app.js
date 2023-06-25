import "@/styles/globals.css";
import "@/styles/loader.css";
import { ChakraProvider, VStack } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
const breakpoints = {
  sm: "30em",
  md: "48em",
  lg: "62em",
  xl: "80em",
  "2xl": "96em",
};
const theme = extendTheme({ breakpoints });
export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <VStack
        bg="rgb(7, 7, 7);"
        paddingX={{ base: "2vw", md: "5vw", lg: "10vw" }}
        paddingTop="10vw"
      >
        <Component {...pageProps} />
      </VStack>
    </ChakraProvider>
  );
}
