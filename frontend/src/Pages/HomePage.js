import React from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Login } from "../components/Authentication/Login";
import { Signup } from "../components/Authentication/Signup";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg="teal.400"
        w={"90%"}
        m="40px 0 15px 0"
        borderRadius="xl"
        borderWidth="4px"
      >
        <Text fontSize="3xl" fontFamily="work sans">
          ZapTalk
        </Text>
      </Box>

      <Box
        bg="white"
        w="90%"
        p={4}
        borderRadius="xl"
        borderWidth="4px"
        height="75%"
      >
        <Tabs variant="enclosed" isFitted>
          <TabList mb="1em">
            <Tab fontWeight="bold">Login</Tab>
            <Tab fontWeight="bold">Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};
