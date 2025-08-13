import {
  Avatar,
  Tooltip,
  Box,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { DeleteIcon, ChevronDownIcon } from "@chakra-ui/icons";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages, deleteMessage }) => {
  const { user } = ChatState();

  return (
  
     <Box
  flex="1"
  overflowY="auto"
  display="flex"
  flexDirection="column"
  justifyContent="flex-end"
>
  <ScrollableFeed
    style={{
      flex: "1",
      padding: 0,      // remove extra padding
      margin: 0,       // remove extra margin
      width: "100%",
    }}
  >
    {messages &&
      messages.map((m, i) => (
        <Box
          key={m._id}
          display="flex"
          justifyContent={m.sender._id === user._id ? "flex-end" : "flex-start"}
          alignItems="flex-end"
          mb="2"
          px="2"
          position="relative"
          _hover={{ ".dropdown-menu": { display: "block" } }}
        >
          {/* Avatar */}
          {(isSameSender(messages, m, i, user._id) ||
            isLastMessage(messages, i, user._id)) &&
            m.sender._id !== user._id && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}

          {/* Message Bubble */}
          <Box
            backgroundColor={m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}
            ml={isSameSenderMargin(messages, m, i, user._id)}
            mt={isSameUser(messages, m, i, user._id) ? 1 : 3}
            borderRadius="20px"
            p="5px 12px"
            maxWidth="75%"
            position="relative"
          >
            <Text wordBreak="break-word">
              {m.deleted ? "Message deleted" : m.content}
            </Text>

            {!m.deleted && m.sender._id === user._id && (
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<ChevronDownIcon />}
                  size="xs"
                  position="absolute"
                  left="-25px"
                  top="50%"
                  transform="translateY(-50%)"
                  aria-label="Options"
                  variant="ghost"
                  display="none"
                  className="dropdown-menu"
                />
                <MenuList>
                  <MenuItem
                    icon={<DeleteIcon color="red" />}
                    onClick={() => deleteMessage(m._id, m.chat._id)}
                  >
                    Delete for Everyone
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </Box>
        </Box>
      ))}
  </ScrollableFeed>
</Box>

    
  );
};

export default ScrollableChat;
