import React from "react";
import { useState } from "react";
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
  useToast,
} from "@chakra-ui/react";
import { Input } from "../../components/Form/Input";
import { AiOutlineClose, AiOutlineUpload } from "react-icons/ai";
import { api } from "../../../services/apiClient";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InputMask from "react-input-mask";

type StreetFormData = {
    name: string;
    state: string;
    city: string;
    district: string;
    postal_code: string;
};

const streetFormSchema = yup.object({
    name: yup.string().required("Campo obrigatório."),
    state: yup.string().required("Campo obrigatório."),
    city: yup.string().required("Campo obrigatório."),
    district: yup.string().required("Campo obrigatório."),
    postal_code: yup.string().required("Campo obrigatório."),
});

export function CreateStreet({ isCreateOpen, onCreateClose, loadStreets }) {
  const { register, handleSubmit, formState, setValue, reset } = useForm({
    resolver: yupResolver(streetFormSchema),
  });

  const { errors } = formState;
  const [cepError, setCepError] = useState(false);
  const toast = useToast()
  
  const initialRef = React.useRef(null);

  const checkCEP = (e) => {
    const cep = e.target.value.replace(/\D/g, "");
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.erro) {
          setCepError(true);
        } else {
          setValue("state", data.uf);
          setValue("city", data.localidade);
          setValue("name", data.logradouro);
          setValue("district", data.bairro);
          setCepError(false);
        }
      })
      .catch((error) => {
        setCepError(true);
      });
  };

  const handleSubmitInformative: SubmitHandler<StreetFormData> = async (
    values
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await api.post("/streets", values)
        .then(async () =>{
          onCreateClose();
          reset();
          toast({
            position: 'top',
            description: 'Rua cadastrada com sucesso!',
            status: 'success',
            duration: 5000,
            isClosable: true,
          })
          loadStreets();
        })
        .catch(err =>
          toast({
            position: 'top',
            description: `${err.response.data.message}`,
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
        );
  };

  return (
    <Modal isOpen={isCreateOpen} onClose={onCreateClose} isCentered initialFocusRef={initialRef}>
      <ModalOverlay />
      <ModalContent
        as="form"
        bgColor="gray.300"
        color="black"
        onSubmit={handleSubmit(handleSubmitInformative)}
      >
        <ModalHeader>Cadastrar rua</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={5} direction="column">
            <Input
                as={InputMask}
                ref={initialRef}
                size="md"
                color="gray.500"
                bg="white"
                variant="outline"
                focusBorderColor="gray.500" 
                _hover={{
                    bgColor: "white",
                }}
                bgColor="gray.50"
                name="postal_code"
                type="text"
                label="CEP"
                mask="99999-999"
                errors={errors.postal_code}
                {...register("postal_code")}
                onBlur={checkCEP}
            />
            <Input
                size="md"
                color="gray.500"
                bg="white"
                variant="outline"
                focusBorderColor="gray.500" 
                _hover={{
                    bgColor: "white",
                }}
                bgColor="gray.50"
                name="state"
                type="text"
                label="Estado"
                errors={errors.state}
                {...register("state")}
            />
            <Input
                size="md"
                color="gray.500"
                bg="white"
                variant="outline"
                focusBorderColor="gray.500" 
                _hover={{
                    bgColor: "white",
                }}
                bgColor="gray.50"
                name="city"
                type="text"
                label="Cidade"
                errors={errors.city}
                {...register("city")}
            />
            <Input
                size="md"
                color="gray.500"
                bg="white"
                variant="outline"
                focusBorderColor="gray.500" 
                _hover={{
                    bgColor: "white",
                }}
                bgColor="gray.50"
                name="district"
                type="text"
                label="Bairro"
                errors={errors.district}
                {...register("district")}
            />
            <Input
                size="md"
                color="gray.500"
                bg="white"
                variant="outline"
                focusBorderColor="gray.500" 
                _hover={{
                    bgColor: "white",
                }}
                bgColor="gray.50"
                name="name"
                type="text"
                label="Nome da Rua"
                errors={errors.name}
                {...register("name")}
            />
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="gray"
            bg="gray.400"
            color="white"
            mr={3}
            onClick={onCreateClose}
            rightIcon={<Icon as={AiOutlineClose} fontSize="16" />}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            colorScheme="red"
            mr={3}
            rightIcon={<Icon as={AiOutlineUpload} fontSize="16" />}
            isLoading={formState.isSubmitting}
          >
            Publicar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
