import { Flex, Button, Stack, Text, Image, VStack, Link, useDisclosure } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { Input } from "../components/Form/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { withSSRGuest } from "../utils/withSSRGuest";
import Router from "next/router";
import { PasswordRecovery } from "../components/PasswordRecovery";

type SignInFormData = {
  email: string;
  password: string;
}

const signInFormSchema = yup.object({
  email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
  password: yup.string().required("Senha obrigatória"),
});

export default function SignIn() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema)
  });

  const { errors } = formState;

  const { signIn } = useContext(AuthContext)

  const handleSignIn:SubmitHandler<SignInFormData> = async (values) => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    await signIn(values);
  }

  return (
    <VStack
      spacing="8"
      w="100vw"
      h="100vh"
      align="center"
      justify="center"
    >
      <Text fontSize="3xl" fontWeight="bold" letterSpacing="tight" w="auto">
        Vizinhança
        <Text as="span" ml="1" color="red.500">
          Solidária
        </Text>
      </Text>

      <Image
        src="https://www.policiamilitar.sp.gov.br/unidades/ccomsoc/pvs/images/logo.png"
        alt="Logo Vizinhança Solidária"
        maxW={230}
      />

      <Flex
        as="form"
        w={["cal(100% - 24px)", "360px"]}
        maxWidth={360}
        bg="gray.800"
        p="8"
        borderRadius={8}
        flexDir="column"
        onSubmit={handleSubmit(handleSignIn)}
      >
        <Stack spacing={3} >
          <Input
            size="md"  
            name="email" 
            type="email" 
            label="E-mail" 
            errors={errors.email}
            {...register("email")} 
          />
          <Input
            size="md" 
            name="password" 
            type="password" 
            label="Senha"
            errors={errors.password} 
            {...register("password")} 
          />
        </Stack>
        <Button variant="link" mt="3" colorScheme="gray" size="md" fontWeight="normal" onClick={onOpen}>
          Clique aqui para recuperar sua senha.
        </Button>
        <PasswordRecovery isOpen={isOpen} onClose={onClose}/>

        <Button type="submit" mt="5" colorScheme="red" size="md" isLoading={formState.isSubmitting}>
          Entrar
        </Button>
        <Button variant="link" mt="4" colorScheme="gray"size="md" onClick={() => { Router.push("/cadastro") }}>
          Cadastrar-se
        </Button>
      </Flex>
    </VStack>
  );
}

// export const getServerSideProps = withSSRGuest(async (ctx) => {
//   return {
//     props: {}
//   }
// });