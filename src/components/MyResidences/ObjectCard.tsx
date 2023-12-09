import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Button,
  Text,
  VStack,
  Avatar,
  useDisclosure,
} from "@chakra-ui/react";
import { UserInfo } from "../UserInfo";

interface residenceMember {
  id: string;
  name: string;
  avatar: string;
  loadResidence: () => void;
}

export default function ObjectCard({
  id,
  name,
  avatar,
  loadResidence,
  ...props
}: residenceMember) {
  const {
    onOpen: onOpenUserInfo,
    isOpen: isOpenUserInfo,
    onClose: onCloseUserInfo,
  } = useDisclosure();

  return (
    <Card size="sm" bgColor="gray.700" align="center">
      <CardBody p="20px 20px 0 20px">
        <Avatar
          objectFit="cover"
          width="210px"
          height="280px"
          borderRadius="md"
          size="md"
          name={name ? name : ""}
          src={avatar ? `/${avatar}` : ""}
        />
      </CardBody>
      <CardFooter color="gray.50" p="12px">
        <VStack spacing="1">
          <Button
            colorScheme="red"
            variant="link"
            fontWeight="semi-bold"
            fontSize="md"
            onClick={onOpenUserInfo}
            color="gray.50"
          >
            {name}
          </Button>

          <UserInfo
            isOpen={isOpenUserInfo}
            onClose={onCloseUserInfo}
            user_id={id}
            onResidenceUpdate={loadResidence}
          />
        </VStack>
      </CardFooter>
    </Card>
  );
}
