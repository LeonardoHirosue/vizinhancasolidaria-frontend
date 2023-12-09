import {
  Box,
  Divider,
  Flex,
  HStack,
  Heading,
  SimpleGrid,
  Stack,
  Button,
  Icon,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup"
import { RiSaveLine } from "react-icons/ri";
import Link from "next/link";

import { Input } from "../../components/Form/Input";
import { api } from "../../../services/apiClient";
import { useRouter } from "next/router";
import { withSSRGuest } from "../../utils/withSSRGuest";
import { Logo } from "../../components/Header/Logo";


type CreateUserFormData = {
  name: string;
  email: string;
  bith_date: string;
  cell: string;
  rg: string;
  cpf: string;
  password: string;
  password_confirmation: string;
}

const createUserFormSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório"),
  email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
  birth_date: yup.string().required("Data de nascimento obrigatório"),
  cell: yup.string().required("Número de celular obrigatório"),
  rg: yup.string().required("Número de RG obrigatório"),
  cpf: yup.string().required("Número de CPF obrigatório"),
  password: yup.string().required("Senha obrigatória").min(6, "No mínimo 6 caracteres"),
  password_confirmation: yup.string().oneOf([
    null, yup.ref("password")
  ], "As senhas precisam ser iguais")
})

export default function CreateUser() {
  const router = useRouter();

  const { register, handleSubmit, formState } = useForm ({
    resolver: yupResolver(createUserFormSchema)
  });

  const { errors } = formState;

  const handleCreateUser: SubmitHandler<CreateUserFormData> = async (values: CreateUserFormData) => {
    const response = await api.post('users', values);

    router.push('/');
  }
 
  return (
    <Box>
      <Flex
      as="header"
      w="100%"
      maxWidth={1480}
      h="20"
      mx="auto"
      mt="4"
      px="6"
      align="center"
    >
      
      <Logo showExtendedLogo={true}/>

    </Flex>

      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        {/* <Sidebar /> */}

        <Box 
          as="form" 
          flex="1" 
          bg="gray.800" 
          borderRadius={8} p={["6", "8"]} 
          onSubmit={handleSubmit(handleCreateUser)}
        >
          <Heading size="lg" fontWeight="normal">
            Cadastro de Usuário
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          <Stack spacing={["6", "8"]} direction="column">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input 
                name="name"
                errors={errors.name} 
                label="Nome completo"
                {...register("name")} 
              />
              <Input 
                name="email" 
                type="email"
                errors={errors.email}
                label="E-mail"
                {...register("email")}  
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
            <Input 
                name="birth_date"
                errors={errors.birth_date} 
                label="Data de Nascimento"
                {...register("birth_date")} 
              />
              <Input 
                name="cell" 
                errors={errors.cell}
                label="Celular"
                {...register("cell")}  
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
            <Input 
                name="rg"
                errors={errors.rg} 
                label="RG"
                {...register("rg")} 
              />
              <Input 
                name="cpf" 
                errors={errors.cpf}
                label="CPF"
                {...register("cpf")}  
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input 
                name="password" 
                type="password"
                errors={errors.password}
                label="Senha"
                {...register("password")} 
              />
              <Input
                name="password_confirmation"
                type="password"
                errors={errors.password_confirmation}
                label="Confirmação da senha"
                {...register("password_confirmation")} 
              />
            </SimpleGrid>
          </Stack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/" passHref>
                  <Button colorScheme="whiteAlpha">Cancelar</Button>
              </Link>
              <Button
                type="submit"
                colorScheme="red"
                leftIcon={<Icon 
                  as={RiSaveLine} 
                  fontSize="20" 
                />}
                isLoading={formState.isSubmitting}
              >
                Salvar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

export const getServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {}
  }
});
