import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { Input } from "../../components/Form/Input";
import { AiOutlineClose, AiOutlineUpload } from "react-icons/ai";
import { api } from "../../../services/apiClient";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Router from "next/router";
import { AuthContext } from "../../contexts/AuthContext";

type AlertFormData = {
  type_id: string;
  user_id: string;
  license_plate: string;
  description: string;
};

const alertFormSchema = yup.object({
  type_id: yup.string().required("Campo obrigatório."),
  license_plate: yup.string(),
  description: yup
    .string()
    .required("Campo obrigatório.")
    .max(255, "A descrição deve conter menos de 255 caracteres."),
});

export function CreateAlert({ isOpen, onClose, alertTypes, onUpdateAlert }) {
  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(alertFormSchema),
  });

  const [showLicensePlate, setShowLicensePlate] = useState(false)
  const { user } = useContext(AuthContext)

  const { errors } = formState;
  const toast = useToast();

  const initialRef = React.useRef(null);

  function handleTypeChange(event: ChangeEvent<HTMLSelectElement>) {
    const currentType = event.target.value;
    currentType == "Veículo suspeito"
      ? setShowLicensePlate(true)
      : setShowLicensePlate(false)
  }

  const handleSubmitAlert: SubmitHandler<AlertFormData> = async (values) => {

    const response =  await api.get("/users")
    const [currentUser] = response.data.filter((data) => data.email === user.email);

    values.user_id = currentUser.id
    console.log("handleSubmitAlert values", values)
    
    await api.post("/notifications", values)
    .then(()=> {
        toast({
            position: 'top',
            description: 'Alerta publicado com sucesso!',
            status: 'success',
            duration: 5000,
            isClosable: true,
        })
    })
    .then(() => {
        onUpdateAlert()
        onClose()
        reset()
    })
  };

  return (
    <>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          as="form"
          bgColor="gray.300"
          color="black"
          onSubmit={handleSubmit(handleSubmitAlert)}
        >
          <ModalHeader>Criar Alerta</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={5} direction="column">
            <FormControl isInvalid={!!errors.type_id}>
                <FormLabel>Tipo</FormLabel>
                <Select
                  ref={initialRef}
                  size="lg"
                  color="gray.500"
                  placeholder="Selecione um tipo"
                  colorScheme="gray"
                  focusBorderColor="gray.500"
                  _hover={{
                    bgColor: "white",
                  }}
                  bg="white"
                  variant="filled"
                  {...register("type_id")}
                  onChange={(event) => handleTypeChange(event)}
                >
                  {
                    alertTypes?.map((alertType) => 
                    <option key={alertType.id} value={alertType.id}>{alertType.name}</option>
                    )
                  }
                </Select>
                <FormErrorMessage>Campo obrigatório.</FormErrorMessage>
              </FormControl>
              {
                showLicensePlate ? (<Input
                  name="license_plate"
                  type="text"
                  label="Placa do Veículo"
                  placeholder="Apenas letras e números"
                  bg="white"
                  variant="outline"
                  focusBorderColor="gray.500"
                  _hover={{
                    bgColor: "white",
                  }}
                  errors={errors.license_plate}
                  {...register("license_plate")}
                />):(
                  <></>
                )
              }
              <Input
                name="description"
                type="text"
                label="Descrição"
                placeholder="Digite uma breve descrição."
                bg="white"
                variant="outline"
                focusBorderColor="gray.500"
                _hover={{
                  bgColor: "white",
                }}
                errors={errors.description}
                {...register("description")}
              />
              <Input
                size="md"
                bg="white"
                color="gray.500"
                name="imagem"
                type="file"
                label="Imagem"
                accept="image/png, image/jpeg"
                helper_text="Clique para selecionar."
                sx={{
                  "::file-selector-button": {
                    height: 10,
                    padding: 0,
                    mr: 4,
                    background: "none",
                    border: "none",
                    borderRadius: "none",
                    fontWeight: "bold",
                    color: "gray.700",
                  },
                }}
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
              type="submit"
              colorScheme="red"
              mr={3}
              rightIcon={<Icon as={AiOutlineUpload} fontSize="16" />}
              // onClick={() => Router.push("/alertas").then(onClose)} 
            >
              Publicar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
