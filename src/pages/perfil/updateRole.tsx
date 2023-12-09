import React, { useState } from "react";
import {
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { AiOutlineClose } from "react-icons/ai";
import { api } from "../../../services/apiClient";

export function UpdateRole({ user_id, currentRole, isOpen, onClose, loadUserInfo }) {
  const toast = useToast();
  const [desiredRole, setDesiredRole] = useState(currentRole)

  async function updateUserRole(user_id: string, role: string, desired_role: string): Promise<void>{
    await api.patch("/users", {
      user_id: user_id,
      role: role,
      desired_role: desired_role
    })
      .then(() => {
        onClose();
        toast({
          position: 'top',
          description: 'A sua solicitação foi criada com sucesso!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        loadUserInfo();
      })
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bgColor="gray.300" color="black">
          <ModalHeader>Solicitar alteração de função para:</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <RadioGroup defaultValue={currentRole} onChange={setDesiredRole} value={desiredRole}>
              <Stack spacing={5} direction="column">
                <Radio colorScheme="gray" bg="white" borderColor="gray.400" value="Morador(a)">
                  Morador (Residente da região)
                </Radio>
                <Radio colorScheme="gray" bg="white" borderColor="gray.400" value="Anfitriã(o)">
                  Anfitrião (Residente e administrador da residência)
                </Radio>
                <Radio colorScheme="gray" bg="white" borderColor="gray.400" value="Tutor(a)">
                  Tutor (Residente e administrador do grupo)
                </Radio>
              </Stack>
            </RadioGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="gray"
              bg="gray.400"
              color="white"
              mr={3}
              onClick={() => {}}
              rightIcon={<Icon as={AiOutlineClose} fontSize="16" />}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              colorScheme="red" 
              mr={3} 
              onClick={() => {updateUserRole(user_id, currentRole, desiredRole)}}
            >
              Confirmar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
