import { Flex, Button, Stack, Text, Image, VStack } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { Input } from "../components/Form/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { withSSRGuest } from "../utils/withSSRGuest";

type SignInFormData = {
  email: string;
  password: string;
}

const signInFormSchema = yup.object({
  email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
  password: yup.string().required("Senha obrigatória"),
});

export default function SignIn() {
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
        <Stack spacing="4">
          <Input 
            name="email" 
            type="email" 
            label="E-mail" 
            error={errors.email}
            {...register("email")} 
          />
          <Input name="password" 
            type="password" 
            label="Senha"
            error={errors.password} 
            {...register("password")} 
          />
        </Stack>

        <Button type="submit" mt="6" colorScheme="red" size="lg" isLoading={formState.isSubmitting}>
          Entrar
        </Button>
      </Flex>
    </VStack>
  );
}

export const getServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {}
  }
});