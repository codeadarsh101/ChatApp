import { ViewIcon } from "@chakra-ui/icons";
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
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fallbackImage =
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}

      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent height="410px">
          <ModalHeader
            fontSize="30px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {user.name.charAt(0).toUpperCase()+ user.name.slice(1)}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic || fallbackImage}
              fallbackSrc={fallbackImage} // shows when src fails to load
            />
            <Text
              fontSize={{ base: "18px", md: "20px" }}
              fontFamily="Work sans"
              fontWeight="bold"
              mb={1} // margin bottom for spacing
            >
              Email:
            </Text>
            <Text
              fontSize={{ base: "25px", md: "30px" }}
              fontFamily="Work sans"
              wordBreak="break-word" // ensures long emails wrap if needed
            >
              {user.email}
            </Text>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button onClick={onClose} color="blue" fontWeight="bold">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
