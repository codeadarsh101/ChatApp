import { 
   Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
  IconButton,
  Spinner,
 } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ViewIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../userAvatar/UserBadgeItem';
import UserListItem from '../userAvatar/UserItemList';
import axios from 'axios';




const UpdateGroupChatModal = ({fetchAgain,setFetchAgain,fetchMessages}) => {
 
const [groupChatName,setGroupChatName] = useState();
const [search, setSearch] = useState("");
const [searchResult, setSearchResult] = useState([]);
const [loading, setLoading] = useState(false);
const [renameloading, setRenameloading] = useState(false);

const {isOpen,onClose,onOpen} =useDisclosure();

const{ selectedChat,setSelectedChat,user}=ChatState();
const toast = useToast();

const handleAddUser=async(user1)=>{
    if(selectedChat.users.find((u)=>u._id===user1._id)){
       toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
       })
       return;
    }
    if(selectedChat.groupAdmin._id !== user._id){
       toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
       })
    };

    try {
      setLoading(true);
      const config ={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }
    const {data }= await axios.put('api/chat/groupadd',{
        chatId:selectedChat._id,
        userId:user1._id
    },config)

       setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setLoading(false)
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      setLoading(false);
    }
}

const handleRemove =async(user1)=>{
   if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
     toast({
       title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
     })
   }

   try {
    setLoading(true);
    const config={
      headers:{
         Authorization:`Bearer ${user.token}`
      }
    }
   
    const {data}= await axios.put(`/api/chat/groupremove`,{
       chatId:selectedChat._id,
       userId:user1._id
    },config)

    user._id===user1._id ? setSelectedChat():setSelectedChat(data);
    setFetchAgain(!fetchAgain);
    fetchMessages();
    setLoading(false)
     
   } catch (error) {
      toast({
         title: "Error Occured!",
        
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      setLoading(false);
   }

}

const handleRename=async()=>{
   if(!groupChatName) return;

   try {
     setRenameloading(true);
     const config={
      headers:{
        Authorization:`Bearer ${user.token}`
      }

     }

     const {data}= await axios.put('/api/chat/rename',{
        chatId:selectedChat._id,
        chatName:groupChatName
     },config);

     setSelectedChat(data);
     setFetchAgain(!fetchAgain);
     setRenameloading(false);

   } catch (error) {
       toast({
        title: "Error Occured!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
       })
       setRenameloading(false)
   }
      setGroupChatName("");
    
}
const handleSearch = async (query) => {
  setSearch(query);// set the search value equal to query..
  if (!query) return;

  try {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const { data } = await axios.get(`/api/users?search=${query}`, config);
    setSearchResult(data); // set the data in searchResult state..
    setLoading(false);
  } catch (error) {
    toast({
      title: "Error Occurred!",
        description: error.response?.data?.message || error.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
    setLoading(false);
  }
};


  return (
   <>
      <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
 
  )
}

export default UpdateGroupChatModal