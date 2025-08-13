import {
  Tooltip,
  Button,
  Box,
  Input,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuDivider,
  MenuItem,
  useDisclosure,
  useToast,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Spinner,
} from "@chakra-ui/react";

import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModel from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import ChatLoading from "../ChatLoading";
import axios from "axios";
import UserListItem from "../userAvatar/UserItemList";
import { getSender } from "../../config/ChatLogics";
import NotificationBadge, { Effect } from "react-notification-badge";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(); //loading animation

  const navigate = useNavigate();

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something to search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }; // backend API calls
      const { data } = await axios.get(`/api/users?search=${search}`, config);

      setLoading(false);
      setsearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    // receiver user's Id
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="purple.300"
        w="100%"
        p="5px 10px"
        borderWidth="4px"
        borderRadius="full"
      >
        {/* Left: Search Button */}
        <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
          <Button
            onClick={onOpen}
            borderRadius="full"
            gap="4px"
            bg="blue.200"
            color="black"
            _hover={{ bg: "blue.400" }}
          >
            <i className="fas fa-search"></i>
            <Text>Search User</Text>
          </Button>
        </Tooltip>

        {/* Center: App Title */}
        <Text
          fontSize="2xl"
          fontWeight="medium"
          fontFamily="Work sans"
          textAlign="center"
        >
          ZepTalk
        </Text>

        {/* Right: Icons */}
        <Box display="flex" alignItems="center" gap="10px">
          <Menu>
            <MenuButton
              p="1"
              onClick={() => {
                if (notification.length > 0) {
                  setSelectedChat(notification[0].chat);

                  setNotification([]);
                }
              }}
            >
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>

            <MenuList pl={3}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem key={notif._id}>
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              p="0"
              bg="transparent"
              _hover={{ bg: "transparent" }}
            >
              <Avatar size="sm" name={user.name} src={user.pic} />
            </MenuButton>

            <MenuList>
              <ProfileModel user={user}>
                <MenuItem fontFamily="Work-sans" fontWeight="bold">
                  My Profile
                </MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem
                onClick={logoutHandler}
                fontFamily="Work-sans"
                color="red.500"
                fontWeight="bold"
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="2px">Search Users</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb="2">
              <Input
                placeholder="Search via Email/Name"
                mr="2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>

            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}

            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
