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

type PetFormData = {
  name: string;
  breed: string;
  description: string;
  url_image: File;
};

const PetFormSchema = yup.object({
  name: yup.string().required("Campo obrigatório."),
  breed: yup.string().required("Campo obrigatório."),
  description: yup
    .string()
    .required("Campo obrigatório.")
    .max(255, "A descrição deve conter menos de 255 caracteres."),
  url_image: yup.mixed()
});

export function CreatePet({ isOpen, onClose, residence_id, onUpdatePet }) {
  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(PetFormSchema),
  });

  const { errors } = formState;
  const toast = useToast();

  const handleSubmitAlert: SubmitHandler<PetFormData> = async (values) => {
    const formData = new FormData()
    formData.append("url_image", values.url_image[0])
    formData.append("residence_id", residence_id)
    formData.append("name", values.name)
    formData.append("breed", values.breed)
    formData.append("description", values.description)

    await api
      .post("/pets", formData)
      .then(() => {
        toast({
          position: "top",
          description: "PET cadastrado com sucesso!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .then(() => {
        onUpdatePet();
        onClose();
        reset();
      })
      .catch((err) => console.log(err))
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          as="form"
          bgColor="gray.300"
          color="black"
          onSubmit={handleSubmit(handleSubmitAlert)}
        >
          <ModalHeader>Cadastrar Pet</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={5} direction="column">
              <Input
                name="name"
                type="text"
                label="Name"
                placeholder="Digite o nome do PET."
                bg="white"
                variant="outline"
                focusBorderColor="gray.500"
                _hover={{
                  bgColor: "white",
                }}
                errors={errors.name}
                {...register("name")}
              />
              <Input
                name="breed"
                type="text"
                label="Raça"
                placeholder="Digite a raça do PET."
                bg="white"
                variant="outline"
                focusBorderColor="gray.500"
                _hover={{
                  bgColor: "white",
                }}
                errors={errors.breed}
                {...register("breed")}
              />
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
                name="url_image"
                size="md"
                type="file"
                label="Foto do PET"
                accept="image/png, image/jpeg"
                helper_text="Clique para selecionar."
                bg="white"
                color="gray.500"
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
                  }
                }}
                // errors={errors.url_image}
                {...register("url_image")}
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
            >
              Publicar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
