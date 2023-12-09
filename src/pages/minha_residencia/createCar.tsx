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
import InputMask from "react-input-mask";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type CarFormData = {
  model: File;
  brand: string;
  license_plate: string;
  color: string;
  residence_id: string;
};

const CarFormSchema = yup.object({
  residence_id: yup.string(),
  model: yup.string().required("Campo obrigatório."),
  brand: yup.string().required("Campo obrigatório."),
  license_plate: yup.string().required("Campo obrigatório."),
  color: yup.string().required("Campo obrigatório."),
});

export function CreateCar({ isOpen, onClose, residence_id, onUpdateCar }) {
  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(CarFormSchema),
  });

  const { errors } = formState;
  const toast = useToast();

  const handleSubmitAlert: SubmitHandler<CarFormData> = async (values) => {
    values.residence_id = residence_id;

    await api
      .post("/cars", values)
      .then(() => {
        toast({
          position: "top",
          description: "Veículo cadastrado com sucesso!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .then(() => {
        onUpdateCar();
        onClose();
        reset();
      })
      .catch((err) => {
        toast({
          position: "top",
          description: `${err}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
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
                name="model"
                type="text"
                label="Modelo"
                placeholder="Digite o modelo do veículo."
                bg="white"
                variant="outline"
                focusBorderColor="gray.500"
                _hover={{
                  bgColor: "white",
                }}
                errors={errors.model}
                {...register("model")}
              />
              <Input
                name="brand"
                type="text"
                label="Marca"
                placeholder="Digite a marca do veículo."
                bg="white"
                variant="outline"
                focusBorderColor="gray.500"
                _hover={{
                  bgColor: "white",
                }}
                errors={errors.brand}
                {...register("brand")}
              />
              <Input
                name="license_plate"
                type="text"
                label="Placa do veículo"
                placeholder="Digite uma breve descrição."
                bg="white"
                variant="outline"
                focusBorderColor="gray.500"
                _hover={{
                  bgColor: "white",
                }}
                errors={errors.license_plate}
                {...register("license_plate")}
              />
              <Input
                name="color"
                type="text"
                label="Cor"
                placeholder="Digite a cor do veículo."
                bg="white"
                variant="outline"
                focusBorderColor="gray.500"
                _hover={{
                  bgColor: "white",
                }}
                errors={errors.color}
                {...register("color")}
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
