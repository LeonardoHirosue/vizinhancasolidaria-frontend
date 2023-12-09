import { Avatar, Box, Button, Flex, Icon, Spinner, Text } from "@chakra-ui/react";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../../services/apiClient";

interface ProfileProps {
  showProfileData?: boolean;
}

type currentUser = {
  name: string;
  email: string;
  avatar: string;
};

export function Profile({ showProfileData = true }: ProfileProps) {
  const { signOut, user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState<currentUser>()

  async function loadUserInfo(){
    const { data } = await api.get("/users")
    const userInfo = data.find((data) => data.email == user?.email);
    setCurrentUser(userInfo)
  }

  useEffect(() => {
    loadUserInfo()
  },[]);
  
  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>{currentUser ? currentUser.name : ""}</Text>
          <Text color="gray.300" fontSize="small">
            {currentUser ? currentUser.email : ""}
          </Text>
        </Box>
      )}
      <Avatar
        size="md"
        name={currentUser ? currentUser.name : ""}
        src={currentUser ? `${currentUser.avatar}` : ""}
      />
      <Button variant="link" mx="4" onClick={signOut}>
        <Icon as={RiLogoutBoxRLine} fontSize="20" mr="2"/>
        {showProfileData && (
          <Text color="gray.300" fontSize="small">
            Sair
          </Text>
        )}
      </Button>
    </Flex>
  );
}