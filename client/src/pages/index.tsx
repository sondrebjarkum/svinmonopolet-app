import {
  Box,
  Card,
  CardBody,
  Center,
  Container,
  HStack,
  Heading,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { type NextPage } from "next";
import Link from "next/link";
import Header from "~/components/Header/Header";
import { applications } from "~/components/Header/applications";

const Home: NextPage = () => {
  return (
    <>
      <Header></Header>
      <Container centerContent mt="4" w="full">
        <Heading size="m">Velg applikasjon</Heading>

        <VStack spacing="4" w="full" mt={4}>
          {applications.map((app) => (
            <Card key={app.title} w="full">
              <Link key={app.link} href={app.link}>
                <CardBody>
                  <HStack spacing={4}>
                    <Center bg="gray.100" p={2} borderRadius={8}>
                      <Box fontSize={30}>{app.icon}</Box>
                    </Center>
                    <Box justifyContent="flex-start">
                      <Heading size="m">{app.title}</Heading>
                      <Text fontSize="xs">{app.description}</Text>
                    </Box>
                  </HStack>
                </CardBody>
              </Link>
            </Card>
          ))}
        </VStack>
      </Container>
    </>
  );
};

export default Home;
