import React from "react";
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
  Stack,
} from "@chakra-ui/react";
import { Input } from "../../components/Form/Input";
import { AiOutlineClose } from "react-icons/ai";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Router from "next/router";

type PasswordRecoveryFormData = {
  email: string;
};

const passwordRecoveryFormSchema = yup.object({
  email: yup.string().required("Campo obrigatório."),
});

export function PasswordRecovery({ isOpen, onClose }) {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(passwordRecoveryFormSchema),
  });

  const { errors } = formState;

  const initialRef = React.useRef(null);

  const handleSubmitPasswordRecovery: SubmitHandler<PasswordRecoveryFormData> = async (values) => {

  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          as="form"
          bgColor="gray.300"
          color="black"
          onSubmit={handleSubmit(handleSubmitPasswordRecovery)}
        >
          <ModalHeader>Recuperar senha via e-mail</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={5} direction="column">
              <Input
                name="email"
                type="email"
                label="Email"
                ref={initialRef} 
                placeholder="Digite seu e-mail"
                bg="white"
                variant="outline"
                focusBorderColor="gray.500"
                _hover={{
                  bgColor: "white",
                }}
                errors={errors.email}
                {...register("email")}
              />
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="gray"
              bg="gray.400"
              color="white"
              mr={3}
              onClick={onClose}
              rightIcon={<Icon as={AiOutlineClose} fontSize="16" />}
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => Router.push("/")}
            >
              Recuperar Senha
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
