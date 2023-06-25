import { useState } from "react";
import Head from "next/head";
import { Inter } from "@next/font/google";
import { Avatar, Button, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { RepeatIcon, Search2Icon } from "@chakra-ui/icons";
import Card from "@/components/Card";
import TypedText from "@/components/Typography";
import Loader from "@/components/Loader";
import axios from "axios";

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchData = async () => {
    if (searchText) {
      setLoading(true);
      const { data } = await axios.post("/api/search", {
        searchTerm: searchText,
      });
      setArticles(data.articles);
      setLoading(false);
    }
  };
  return (
    <>
      <Head>
        <title>SearchIO</title>
        <meta name="description" content="Search Eco-Friendly Articles." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <VStack bg="rgb(7, 7, 7)">
        <HStack mb="1em">
          <Avatar
            size="lg"
            name="Ali Alhaddad"
            ignoreFallback={true}
            src="/ali.nooganaega.svg"
            bg='rgb(34, 211, 238)'
          />
          <TypedText text="Eco-Friendly Search" />
        </HStack>
        <HStack>
          <Input
            color="white"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search stuff..."
          />
          <Button leftIcon={<Search2Icon />} onClick={searchData}>
            Search
          </Button>
        </HStack>
        {loading ? (
          <Loader />
        ) : (
          <VStack
            flexWrap="wrap"
            flexDir={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
          >
            {articles &&
              articles.map((article, articleIdx) => (
                <Card
                  key={articleIdx}
                  title={article.title}
                  description={article.description}
                  link={article.link}
                />
              ))}
          </VStack>
        )}
      </VStack>
    </>
  );
}
