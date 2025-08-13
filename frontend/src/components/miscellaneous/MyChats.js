import { ChatState } from "../../Context/ChatProvider";
import { useToast, Box, Button, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "../ChatLoading";
import { getSender } from "../../config/ChatLogics";

import GroupChatModal from "./GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data); //sets the data in chats variable..
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      p={3} // internal space
      m={3} // external space
      alignItems="center"
      bg="gray.400"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        w="100%"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={3}
        pb={3}
      >
        <Text
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily="Work sans"
          fontWeight="medium"
        >
          My Chats
        </Text>

        <GroupChatModal>
          <Button
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
        <Stack overflowY="scroll">
  {chats.map((chat) => {
    if (!chat || !chat.users || chat.users.length === 0) return null;

    return (
      <Box
        onClick={() => setSelectedChat(chat)}
        cursor="pointer"
        bg={selectedChat === chat ? "red.300" : "gray.400"}
        color={selectedChat === chat ? "white" : ""}
        px={3}
        py={2}
        borderRadius="lg"
        key={chat._id}
      >
        <Text>
          {!chat.isGroupChat
            ? getSender(loggedUser, chat.users)
            : chat.chatName}
        </Text>
      </Box>
    );
  })}
</Stack>

        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};
export default MyChats;
