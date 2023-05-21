import { Avatar, Box, Button, Flex, Icon, Text } from "@chakra-ui/react";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({ showProfileData = true }: ProfileProps) {
  const { signOut } = useContext(AuthContext);

  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>Leonardo Hirosue</Text>
          <Text color="gray.300" fontSize="small">
            leonardo.hirosue@gmail.com
          </Text>
        </Box>
      )}
      <Avatar
        size="md"
        name="Leonardo Hirosue"
        src="https://media.licdn.com/dms/image/D4D03AQGyt3komLI1Fg/profile-displayphoto-shrink_800_800/0/1669039365692?e=1688601600&v=beta&t=2_NSzEdwI8hfYI7_w8K_rwovXbSe6dalLR8uHGFc_qM"
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
