import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Icon,
  Select,
  SimpleGrid,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { Input } from "../../components/Form/Input";

import * as yup from "yup";
import InputMask from "react-input-mask";
import { SubmitHandler, useForm } from "react-hook-form";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { withSSRGuest } from "../../utils/withSSRGuest";
import { Logo } from "../../components/Header/Logo";
import Link from "next/link";
import { RiSaveLine } from "react-icons/ri";
import { validate } from "gerador-validador-cpf";
import { yupResolver } from "@hookform/resolvers/yup";
import { AuthContext } from "../../contexts/AuthContext";
import moment from "moment";
import { api } from "../../../services/apiClient";

type SignUpFormData = {
  name: string;
  email: string;
  password: string;
  cellphone: string;
  birth_date: string;
  rg: string;
  cpf: string;
  desired_role: string;
  street: string;
  state: string;
  city: string;
  district: string;
  postal_code: string;
  residence_number: number;
};

const signUpFormSchema = yup.object({
  name: yup.string().required("Campo obrigatório."),
  email: yup.string().required("Campo obrigatório.").email("E-mail inválido."),
  password: yup
    .string()
    .required("Campo obrigatório.")
    .min(6, "A senha deve conter pelo menos 8 caracteres."),
  password_confirmation: yup
    .string()
    .required("Campo obrigatório.")
    .oneOf([yup.ref("password")], "As senhas precisam ser idênticas."),
  cellphone: yup.string().required("Campo obrigatório."),
  birth_date: yup.date().required("Campo obrigatório."),
  rg: yup.string().required("Campo obrigatório."),
  cpf: yup
    .string()
    .required("Campo obrigatório.")
    .test("validacao-cpf", "CPF inválido.", function (value) {
      return validate(value);
    }),
  desired_role: yup.string().required("Campo obrigatório."),
  street: yup.string().required("Campo obrigatório."),
  state: yup.string().required("Campo obrigatório."),
  city: yup.string().required("Campo obrigatório."),
  district: yup.string().required("Campo obrigatório."),
  postal_code: yup.string().required("Campo obrigatório."),
  residence_number: yup.number().required("Campo obrigatório."),
});

type SignInCredentials = {
  email: string;
  password: string;
};

export default function SignUp() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signUpFormSchema),
  });

  const toast = useToast();
  const { signIn } = useContext(AuthContext);

  const [disabledState, setDisabledState] = useState(true);
  const [disabledCity, setDisabledCity] = useState(true);
  const [disabledDistrict, setDisabledDistrict] = useState(true);
  const [disabledStreet, setDisabledStreet] = useState(true);

  const [streets, setStreets] = useState([]);
  const [statesOptions, setStatesOptions] = useState([]);
  const [citiesOptions, setCitiesOptions] = useState([]);
  const [districtsOptions, setDistrictsOptions] = useState([]);
  const [streetsOptions, setStreetsOptions] = useState([]);

  useEffect(() => {
    api
      .get("/streets")
      .then((response) => {
        setStreets(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const postalCodesList = [];
  const postalCodesSet = new Set();

  streets.forEach((street) => {
    postalCodesSet.add(street.postal_code);
  });

  postalCodesSet.forEach((postal_code) => {
    postalCodesList.push(postal_code);
  });

  function handlePostalCodeChange(event: ChangeEvent<HTMLSelectElement>) {
    const currentPostalCode = event.target.value;
    currentPostalCode == "" ? setDisabledState(true) : setDisabledState(false);

    const statesList = [];

    streets.forEach((street) => {
      if (street.postal_code === currentPostalCode) {
        statesList.push(street.state);
      }
    });

    setStatesOptions(
      statesList.filter((state, index) => state.indexOf(state) === index)
    );
    setValue("state", "");
    getValues("state") == "" ? setDisabledCity(true) : setDisabledCity(false);
    setValue("city", "");
    getValues("city") == ""
      ? setDisabledDistrict(true)
      : setDisabledDistrict(false);
    setValue("district", "");
    getValues("district") == ""
      ? setDisabledStreet(true)
      : setDisabledStreet(false);
    setValue("street", "");
  }

  function handleStateChange(event: ChangeEvent<HTMLSelectElement>) {
    const currentState = event.target.value;
    currentState == "" ? setDisabledCity(true) : setDisabledCity(false);

    const citiesList = [];

    streets.forEach((street) => {
      if (street.state === currentState) {
        citiesList.push(street.city);
      }
    });

    setCitiesOptions(
      citiesList.filter((city, index) => city.indexOf(city) === index)
    );
    setValue("city", "");
    getValues("city") == ""
      ? setDisabledDistrict(true)
      : setDisabledDistrict(false);
    setValue("district", "");
    getValues("district") == ""
      ? setDisabledStreet(true)
      : setDisabledStreet(false);
    setValue("street", "");
  }

  function handleCityChange(event: ChangeEvent<HTMLSelectElement>) {
    const currentCity = event.target.value;
    currentCity == "" ? setDisabledDistrict(true) : setDisabledDistrict(false);

    const districtsList = [];

    streets.forEach((street) => {
      if (street.city === currentCity) {
        districtsList.push(street.district);
      }
    });

    setDistrictsOptions(
      districtsList.filter(
        (district, index) => district.indexOf(district) === index
      )
    );
    setValue("district", "");
    getValues("district") == ""
      ? setDisabledStreet(true)
      : setDisabledStreet(false);
    setValue("street", "");
  }

  function handleDistrictChange(event: ChangeEvent<HTMLSelectElement>) {
    const currentDistrict = event.target.value;

    const streetsList = [];

    streets.forEach((street) => {
      if (street.district === currentDistrict) {
        streetsList.push(street.name);
      }
    });

    setStreetsOptions(
      streetsList.filter((street, index) => street.indexOf(street) === index)
    );
    setValue("street", "");
    currentDistrict == "" ? setDisabledStreet(true) : setDisabledStreet(false);
  }

  const handleSignUp: SubmitHandler<SignUpFormData> = async (values) => {
    console.log("User", values);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    values.cellphone = `+${values.cellphone.replace(/\D+/g, "")}`;
    values.birth_date = moment(values.birth_date).format("MM DD YYYY");
    values.rg = values.rg.replace(/\D+/g, "");
    values.cpf = values.cpf.replace(/\D+/g, "");

    await api
      .post("/users", values)
      .then(async () => {
        await signIn(values);
        toast({
            position: 'top',
            description: 'Cadastro realizado com sucesso!',
            status: 'success',
            duration: 5000,
            isClosable: true,
        })
      })
      .catch((err) => console.log(err));
  };

  return (
    <Box>
      <Flex
        as="header"
        w="100%"
        maxWidth={1480}
        h="20"
        mx="auto"
        mt="6"
        px="6"
        align="center"
      >
        <Logo showExtendedLogo={true} />
      </Flex>

      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Box
          as="form"
          flex="1"
          bg="gray.800"
          borderRadius={8}
          p={["6", "8"]}
          mb={6}
          onSubmit={handleSubmit(handleSignUp)}
        >
          <Heading size="md" fontWeight="normal">
            Cadastro de Usuário
          </Heading>
          <Divider my="4" borderColor="gray.700" />
          <Stack spacing={["6", "4"]} direction="column">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                size="md"
                color="gray.500"
                name="name"
                type="name"
                label="Nome completo"
                errors={errors.name}
                {...register("name")}
              />
              <Input
                size="md"
                color="gray.500"
                name="email"
                type="email"
                label="E-mail"
                errors={errors.email}
                {...register("email")}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                size="md"
                color="gray.500"
                name="password"
                type="password"
                label="Senha"
                placeholder="Insira uma senha"
                errors={errors.password}
                {...register("password")}
              />
              <Input
                size="md"
                color="gray.500"
                name="password-confirmation"
                type="password"
                label="Confirmação da senha"
                placeholder="Insira uma senha"
                errors={errors.password_confirmation}
                {...register("password_confirmation")}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                as={InputMask}
                size="md"
                color="gray.500"
                name="tel"
                type="tel"
                label="Celular"
                mask="+55 (99) 99999 9999"
                errors={errors.cellphone}
                {...register("cellphone")}
              />
              <Input
                size="md"
                color="gray.500"
                name="birth_date"
                type="date"
                label="Data de nascimento"
                errors={errors.birth_date}
                {...register("birth_date")}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                as={InputMask}
                size="md"
                color="gray.500"
                name="rg"
                type="text"
                label="RG"
                mask="99.999.999-9"
                errors={errors.rg}
                {...register("rg")}
              />
              <Input
                as={InputMask}
                size="md"
                color="gray.500"
                name="cpf"
                type="text"
                label="CPF"
                mask="999.999.999-99"
                errors={errors.cpf}
                {...register("cpf")}
              />
            </SimpleGrid>

            <SimpleGrid
              columns={2}
              minChildWidth="240px"
              spacing={["6", "8"]}
              w="100%"
            >
              <FormControl isInvalid={!!errors.postal_code}>
                <FormLabel>CEP</FormLabel>
                <Select
                  size="md"
                  color="gray.500"
                  placeholder="Selecione um CEP"
                  colorScheme="gray"
                  focusBorderColor="red.500"
                  bgColor="gray.900"
                  variant="filled"
                  _hover={{
                    bgColor: "gray.900",
                  }}
                  sx={{
                    "> option": {
                      background: "gray.900",
                      color: "gray.500",
                    },
                  }}
                  {...register("postal_code")}
                  onChange={(event) => handlePostalCodeChange(event)}
                >
                  {postalCodesList.map((postalCode) => (
                    <option key={postalCode} value={postalCode}>
                      {postalCode}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>Campo obrigatório.</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.state}>
                <FormLabel>Estado</FormLabel>
                <Select
                  size="md"
                  color="gray.500"
                  placeholder={
                    disabledState
                      ? "Selecione um CEP primeiro"
                      : "Selecione um estado"
                  }
                  colorScheme="gray"
                  focusBorderColor="red.500"
                  bgColor="gray.900"
                  variant="filled"
                  _hover={{
                    bgColor: "gray.900",
                  }}
                  sx={{
                    "> option": {
                      background: "gray.900",
                      color: "gray.500",
                    },
                  }}
                  {...register("state")}
                  isDisabled={disabledState}
                  onChange={(event) => handleStateChange(event)}
                >
                  {statesOptions.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>Campo obrigatório.</FormErrorMessage>
              </FormControl>
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <FormControl isInvalid={!!errors.city}>
                <FormLabel>Cidade</FormLabel>
                <Select
                  size="md"
                  color="gray.500"
                  placeholder={
                    disabledCity
                      ? "Selecione um Estado antes"
                      : "Selecione uma cidade"
                  }
                  colorScheme="gray"
                  focusBorderColor="red.500"
                  bgColor="gray.900"
                  variant="filled"
                  _hover={{
                    bgColor: "gray.900",
                  }}
                  sx={{
                    "> option": {
                      background: "gray.900",
                      color: "gray.500",
                    },
                  }}
                  {...register("city")}
                  isDisabled={disabledCity}
                  onChange={(event) => handleCityChange(event)}
                >
                  {citiesOptions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>Campo obrigatório.</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.district}>
                <FormLabel>Bairro</FormLabel>
                <Select
                  size="md"
                  color="gray.500"
                  placeholder={
                    disabledDistrict
                      ? "Selecione uma Cidade antes"
                      : "Selecione um bairro"
                  }
                  colorScheme="gray"
                  focusBorderColor="red.500"
                  bgColor="gray.900"
                  variant="filled"
                  _hover={{
                    bgColor: "gray.900",
                  }}
                  sx={{
                    "> option": {
                      background: "gray.900",
                      color: "gray.500",
                    },
                  }}
                  {...register("district")}
                  isDisabled={disabledDistrict}
                  onChange={(event) => handleDistrictChange(event)}
                >
                  {districtsOptions.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>Campo obrigatório.</FormErrorMessage>
              </FormControl>
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <FormControl isInvalid={!!errors.street}>
                <FormLabel>Rua</FormLabel>
                <Select
                  size="md"
                  color="gray.500"
                  placeholder={
                    disabledStreet
                      ? "Selecione um Bairro antes"
                      : "Selecione uma rua"
                  }
                  colorScheme="gray"
                  focusBorderColor="red.500"
                  bgColor="gray.900"
                  variant="filled"
                  _hover={{
                    bgColor: "gray.900",
                  }}
                  sx={{
                    "> option": {
                      background: "gray.900",
                      color: "gray.500",
                    },
                  }}
                  {...register("street")}
                  isDisabled={disabledStreet}
                >
                  {streetsOptions.map((street) => (
                    <option key={street} value={street}>
                      {street}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>Campo obrigatório.</FormErrorMessage>
              </FormControl>

              <Input
                size="md"
                color="gray.500"
                name="number"
                type="number"
                label="Número"
                errors={errors.residence_number}
                {...register("residence_number")}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <FormControl isInvalid={!!errors.desired_role}>
                <FormLabel>Função</FormLabel>
                <Select
                  size="md"
                  color="gray.500"
                  placeholder="Selecione uma função"
                  colorScheme="gray"
                  focusBorderColor="red.500"
                  bgColor="gray.900"
                  variant="filled"
                  _hover={{
                    bgColor: "gray.900",
                  }}
                  sx={{
                    "> option": {
                      background: "gray.900",
                      color: "gray.500",
                    },
                  }}
                  {...register("desired_role")}
                >
                  <option value="Morador(a)">Morador(a)</option>
                  <option value="Anfitriã(o)">Anfitriã(o)</option>
                  <option value="Tutor(a)">Tutor(a)</option>
                </Select>
                <FormErrorMessage>Campo obrigatório.</FormErrorMessage>
                <FormHelperText color="gray.600">
                  <p>Morador: Residente da região</p>
                  <p>Anfitrião: Residente e administrador da residência</p>
                  <p>Tutor: Residente e administrador do grupo</p>
                </FormHelperText>
              </FormControl>
              <Input
                size="md"
                color="gray.500"
                name="avatar"
                type="file"
                label="Foto de Perfil"
                accept="image/png, image/jpeg"
                helper_text="Clique para selecionar."
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
                  leftIcon={<Icon as={RiSaveLine} fontSize="20" />}
                  isLoading={isSubmitting}
                >
                  Cadastrar
                </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

// export const getServerSideProps = withSSRGuest(async (ctx) => {
//   return {
//     props: {},
//   };
// });
