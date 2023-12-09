import React from "react";
import {
  Box,
  Button,
  FormLabel,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { AiOutlineClose, AiOutlineUpload } from "react-icons/ai";

export function ViewAlert({
  id,
  title,
  license_plate = null,
  image = null,
  description,
  created_at,
  isOpen,
  onClose,
  deleteAlert
}) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bgColor="gray.300" color="black">
          <ModalHeader>{title}{license_plate == null ?"": ` (${license_plate})`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={5} direction="column">
              {image != null ? <Image src={image} /> : null}
              <Box>
                <FormLabel>Descrição</FormLabel>
                <Text>{description}</Text>
              </Box>
              <Box>
                <FormLabel>Data de criação</FormLabel>
                <Text>{created_at}</Text>
              </Box>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="gray"
              bg="gray.400"
              color="white"
              mr={3}
              onClick={() => deleteAlert(id)}
              rightIcon={<Icon as={AiOutlineClose} fontSize="16" />}
            >
              Encerrar
            </Button>
            <Button
              type="submit"
              colorScheme="red"
              mr={3}
              rightIcon={<Icon as={AiOutlineUpload} fontSize="16" />}
              onClick={() => {}}
            >
              Compartilhar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
