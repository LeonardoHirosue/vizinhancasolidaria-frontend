import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import * as yup from "yup";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { Input } from "../../components/Form/Input";
import InputMask from "react-input-mask";
import { RiSaveLine } from "react-icons/ri";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UpdateRole } from "./updateRole";
import { withSSRAuth } from "../../utils/withSSRAuth";
import { setupAPIClient } from "../../../services/api";
import { api } from "../../../services/apiClient";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";

type User = {
  id: string;
  role: string;
  name: string;
  email: string;
  birth_date: Date;
  cellphone: string;
  rg: string;
  cpf: string;
  desired_role: string;
  avatar: string;
  residence: Residence;
};

type Residence = {
  number: string;
  street: Street;
};

type Street = {
  name: string;
  district: string;
  postal_code: string;
  state: string;
  city: string;
};

type CellFormData = {
  avatar: File;
  cellphone: string;
};

const cellFormSchema = yup.object({
  cellphone: yup.string(),
  avatar: yup.mixed().required("Required")
});

export default function Profile() {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(cellFormSchema),
  });

  const { user } = useContext(AuthContext)
  const [currentUser, setCurrentUser] = useState<User>("")
  const { errors } = formState;

  const updateAvatar: SubmitHandler<CellFormData> = async (values) => {
    const formData = new FormData()
    formData.append("avatar", values.avatar[0])

    await new Promise((resolve) => setTimeout(resolve, 2000));
    await api.patch("/users/avatar", formData)
      .then(() => {
        toast({
          position: 'top',
          description: 'Foto de perfil atualizada com sucesso!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })})
      .catch((err) => {
        toast({
          position: 'top',
          description: `${err}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })})    
  };

  async function loadUserInfo(){
    const { data } = await api.get("/users")
    const userInfo = data.find((data) => data.email == user?.email);
    setCurrentUser(userInfo)
  }

  useEffect(() => {
    loadUserInfo()
  },[]);

  return (
    <Flex direction="column" h="100vh">
      <Header />
      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />

        <Box
          as="form"
          flex="1"
          bg="gray.800"
          borderRadius={8}
          p={["6", "8"]}
          mb={6}
          onSubmit={handleSubmit(updateAvatar)}
        >
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Meus Dados
            </Heading>
            <Button
              as="a"
              size="md"
              fontSize="sm"
              colorScheme="gray"
              variant="solid"
              bg="gray.600"
              color="gray.900"
              onClick={onOpen}
            >
              {isWideVersion ? "Solicitar Troca de Função" : "Troca de Função"}
            </Button>
            <UpdateRole
              user_id={currentUser?.id}
              currentRole={currentUser?.role}
              isOpen={isOpen}
              onClose={onClose}
              loadUserInfo={loadUserInfo}
            />
          </Flex>
          <Divider my="4" borderColor="gray.700" />
          {
            currentUser?.role == "Não identificado(a)" ? (
            <Stack my="6" direction="row">
              <Alert status="warning" variant="left-accent" color="gray.700">
                <AlertIcon />
                <AlertTitle>Seu cadastro ainda não foi aprovado!</AlertTitle>
                <AlertDescription>
                  Volte de novo mais tarde.
                </AlertDescription>
              </Alert>
            </Stack>
            ): (currentUser?.role != currentUser?.desired_role ? (
              <Stack my="6" direction="row">
              <Alert status="info" variant="left-accent" color="gray.700">
                  <AlertIcon />
                  <AlertTitle>Sua alteração de função para {currentUser.desired_role} ainda não foi aprovada!</AlertTitle>
                  <AlertDescription>
                    Aguarde mais um pouco.
                  </AlertDescription>
                </Alert>
            </Stack>
            ):(<></>))
          }
          <Stack spacing={["6", "4"]} direction="column">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                isReadOnly
                size="md"
                name="name"
                type="name"
                label="Nome completo"
                placeholder={currentUser?.name}
              />
              <Input
                isReadOnly
                size="md"
                name="email"
                type="email"
                label="E-mail"
                placeholder={currentUser?.email}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                as={InputMask}
                name="tel"
                type="tel"
                label="Celular"
                mask="+55 (99) 99999 9999"
                placeholder={currentUser?.cellphone}
                errors={errors.cellphone}
                // {...register("cellphone")}
              />
              <Input
                isReadOnly
                size="md"
                name="birth_date"
                type="text"
                label="Data de nascimento"
                placeholder={moment.utc(currentUser?.birth_date).format(
                  "DD/MM/YYYY"
                )}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                isReadOnly
                size="md"
                name="rg"
                type="text"
                label="RG"
                placeholder={currentUser?.rg}
              />
              <Input
                isReadOnly
                size="md"
                name="cpf"
                type="text"
                label="CPF"
                placeholder={currentUser?.cpf}
              />
            </SimpleGrid>

            <SimpleGrid
              columns={2}
              minChildWidth="240px"
              spacing={["6", "8"]}
              w="100%"
            >
              <Input
                isReadOnly
                size="md"
                name="cep"
                type="text"
                label="CEP"
                placeholder={currentUser?.residence?.street?.postal_code}
              />

              <Input
                isReadOnly
                size="md"
                name="state"
                type="text"
                label="Estado"
                placeholder={currentUser?.residence?.street?.state}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                isReadOnly
                size="md"
                name="city"
                type="text"
                label="Cidade"
                placeholder={currentUser?.residence?.street?.city}
              />
              <Input
                isReadOnly
                size="md"
                name="district"
                type="text"
                label="Bairro"
                placeholder={currentUser?.residence?.street?.district}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                isReadOnly
                size="md"
                name="street"
                type="text"
                label="Rua"
                placeholder={currentUser?.residence?.street?.name}
              />
              <Input
                isReadOnly
                size="md"
                name="number"
                type="number"
                label="Número"
                placeholder={currentUser?.residence?.number}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                isReadOnly
                size="md"
                name="role"
                type="text"
                label="Função"
                placeholder={currentUser?.role}
              />
              <Input
                name="avatar"
                size="md"
                type="file"
                label="Foto de Perfil"
                accept="image/png, image/jpeg"
                helper_text="Clique para alterar."
                sx={{
                  "::file-selector-button": {
                    height: 10,
                    padding: 0,
                    mr: 4,
                    background: "none",
                    border: "none",
                    fontWeight: "bold",
                    color: "gray.100",
                  },
                }}
                {...register("avatar")}
              />
            </SimpleGrid>
          </Stack>
          <Flex mt="8" justify="space-between">
            <HStack>
              <Button
                variant="ghost"
                colorScheme="whiteAlpha"
                onClick={() => {}}
              >
                Excluir cadastro
              </Button>
            </HStack>
            <HStack spacing="4">
              <Button colorScheme="whiteAlpha" onClick={() => {}}>
                Cancelar
              </Button>
              <Button
                type="submit"
                colorScheme="red"
                leftIcon={<Icon as={RiSaveLine} fontSize="20" />}
                isLoading={formState.isSubmitting}
              >
                Atualizar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    await apiClient.get("/me");

    return {
      props: {},
    };
  },
  {
    permissions: [],
    roles: ["Não identificado(a)", "Morador(a)", "Anfitriã(o)", "Tutor(a)", "Administrador(a)"],
  }
);
