import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { api } from "../../../services/apiClient";
import { Input } from "../../components/Form/Input";
import ObjectCard from "../../components/MyResidences/ObjectCard";
import { RiAddLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";
import { withSSRAuth } from "../../utils/withSSRAuth";
import { setupAPIClient } from "../../../services/api";
import { CreatePet } from "./createPet";
import PetCard from "./PetCard";
import { CreateCar } from "./createCar";
import { Can } from "../../components/Can";

export default function Informatives({ currentUser }) {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  const {
    onOpen: onOpenCreatePet,
    isOpen: isOpenCreatePet,
    onClose: onCloseCreatePet,
  } = useDisclosure();
  const {
    onOpen: onOpenCreateCar,
    isOpen: isOpenCreateCar,
    onClose: onCloseCreateCar,
  } = useDisclosure();
  const toast = useToast();
  const [currentResidence, setCurrentResidence] = useState([]);
  const [residenceMembers, setResidenceMembers] = useState([]);
  const [residencePETs, setResidencePETs] = useState([]);
  const [residenceCars, setResidenceCars] = useState([]);

  async function loadResidence() {
    const response = await api.get("/residences");
    const [residence] = response.data.filter(
      (data) => data.id === currentUser.residence.id
    );
    setCurrentResidence(residence);
    setResidenceMembers(residence.users);
    setResidencePETs(residence.pets);
    setResidenceCars(residence.cars);
  }

  async function deletePet(pet_id: string) {
    await api
      .delete(`/pets/${pet_id}`)
      .then(() => {
        toast({
          position: "top",
          description: "PET deletado com sucesso!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        loadResidence();
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
  }

  async function deleteCar(car_id: string) {
    await api
      .delete(`/cars/${car_id}`)
      .then(() => {
        toast({
          position: "top",
          description: "Veículo deletado com sucesso!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        loadResidence();
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
  }

  useEffect(() => {
    loadResidence();
  }, []);

  return (
    <Flex direction="column" h="100vh">
      <Header />
      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />

        <Box
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={["6", "8"]}
          mb={6}
          minHeight="720px"
        >
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="semi-bold">
              Minha Residência
            </Heading>
          </Flex>
          <Divider my="4" borderColor="gray.700" />

          <Accordion allowToggle>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    Informações da Residência
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Stack spacing={["6", "6"]} direction="column" pb={4}>
                  <SimpleGrid
                    columns={2}
                    minChildWidth="240px"
                    spacing={["6", "8"]}
                    w="100%"
                  >
                    <Input
                      isReadOnly
                      name="street"
                      type="text"
                      label="Rua"
                      size="md"
                      placeholder={currentUser.residence.street.name}
                    />
                    <Input
                      isReadOnly
                      name="number"
                      type="number"
                      label="Número"
                      size="md"
                      placeholder={currentUser.residence.number}
                    />
                    <Input
                      isReadOnly
                      name="district"
                      type="text"
                      label="Bairro"
                      size="md"
                      placeholder={currentUser.residence.street.district}
                    />
                  </SimpleGrid>
                  <SimpleGrid
                    minChildWidth="240px"
                    spacing={["6", "8"]}
                    w="100%"
                  >
                    <Input
                      isReadOnly
                      name="city"
                      type="text"
                      label="Cidade"
                      size="md"
                      placeholder={currentUser.residence.street.city}
                    />
                    <Input
                      isReadOnly
                      name="state"
                      type="text"
                      label="Estado"
                      size="md"
                      placeholder={currentUser.residence.street.state}
                    />
                    <Input
                      isReadOnly
                      name="cep"
                      type="text"
                      label="CEP"
                      size="md"
                      placeholder={currentUser.residence.street.postal_code}
                    />
                  </SimpleGrid>
                </Stack>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    Membros
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <SimpleGrid
                  spacing={4}
                  templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                  pb={4}
                  justifyContent="space-between"
                >
                  {residenceMembers.map((residenceMember) => {
                    return (
                      <Box bg="gray.800" borderRadius={8}>
                        <ObjectCard
                          key={residenceMember.id}
                          id={residenceMember.id}
                          name={residenceMember.name}
                          avatar={residenceMember.avatar}
                          loadResidence={loadResidence}
                        />
                      </Box>
                    );
                  })}
                </SimpleGrid>
                <Can roles={["Anfitriã(o)", "Tutor(a)", "Administrador(a)"]}>
                  <Flex justify="flex-end">
                    <Button
                      as="a"
                      size="sm"
                      fontSize="sm"
                      colorScheme="red"
                      leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                      alignSelf="end"
                    >
                      {isWideVersion ? "Novo Morador" : "Novo"}
                    </Button>
                  </Flex>
                </Can>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    PETs
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <SimpleGrid
                  spacing={4}
                  templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                  pb={4}
                  justifyContent="space-between"
                >
                  {residencePETs.map((residencePET) => {
                    return (
                      <Box bg="gray.800" borderRadius={8}>
                        <PetCard
                          key={residencePET.id}
                          id={residencePET.id}
                          name={residencePET.name}
                          avatar={residencePET.url_image}
                          deletePet={deletePet}
                        />
                      </Box>
                    );
                  })}
                </SimpleGrid>
                <Can roles={["Anfitriã(o)", "Tutor(a)", "Administrador(a)"]}>
                  <Flex justify="flex-end">
                    <Button
                      as="a"
                      size="sm"
                      fontSize="sm"
                      colorScheme="red"
                      leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                      alignSelf="end"
                      onClick={onOpenCreatePet}
                    >
                      {isWideVersion ? "Novo PET" : "Novo"}
                    </Button>
                    <CreatePet
                      isOpen={isOpenCreatePet}
                      onClose={onCloseCreatePet}
                      residence_id={currentUser.residence.id}
                      onUpdatePet={loadResidence}
                    />
                  </Flex>
                </Can>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    Veículos
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <TableContainer pb={4}>
                  <Table size="sm" colorScheme="gray">
                    <Thead>
                      <Tr justifyItems="space-between">
                        <Th borderColor="gray.600" width="20%">
                          Placa
                        </Th>
                        <Th borderColor="gray.600" width="20%">
                          Marca
                        </Th>
                        <Th borderColor="gray.600" width="20%">
                          Modelo
                        </Th>
                        <Th borderColor="gray.600" width="20%">
                          Cor
                        </Th>
                        <Th borderColor="gray.600" width="20%"></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {residenceCars.map((residenceCar) => {
                        return (
                          <Tr
                            justifyItems="space-between"
                            key={residenceCar.id}
                          >
                            <Td borderColor="gray.600" width="20%">
                              {residenceCar.license_plate}
                            </Td>
                            <Td borderColor="gray.600" width="20%">
                              {residenceCar.brand}
                            </Td>
                            <Td borderColor="gray.600" width="20%">
                              {residenceCar.model}
                            </Td>
                            <Td borderColor="gray.600" width="20%">
                              {residenceCar.color}
                            </Td>

                            <Td borderColor="gray.600" width="20%" isNumeric>
                              <Can
                                roles={[
                                  "Anfitriã(o)",
                                  "Tutor(a)",
                                  "Administrador(a)",
                                ]}
                              >
                                <Button
                                  size="xs"
                                  variant="link"
                                  fontSize="sm"
                                  fontWeight="normal"
                                  colorScheme="red"
                                  rightIcon={
                                    <Icon as={AiOutlineDelete} fontSize="16" />
                                  }
                                  onClick={() => deleteCar(residenceCar.id)}
                                >
                                  Remover
                                </Button>
                              </Can>
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
                <Can roles={["Anfitriã(o)", "Tutor(a)", "Administrador(a)"]}>
                  <Flex justify="flex-end">
                    <Button
                      as="a"
                      size="sm"
                      fontSize="sm"
                      colorScheme="red"
                      leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                      alignSelf="end"
                      onClick={onOpenCreateCar}
                    >
                      {isWideVersion ? "Novo Veículo" : "Novo"}
                    </Button>
                    <CreateCar
                      isOpen={isOpenCreateCar}
                      onClose={onCloseCreateCar}
                      residence_id={currentUser.residence.id}
                      onUpdateCar={loadResidence}
                    />
                  </Flex>
                </Can>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      </Flex>
    </Flex>
  );
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const response1 = await apiClient.get("/me");
    const response2 = await apiClient.get("/users");
    const [currentUser] = response2.data.filter(
      (data) => data.email === response1.data.email
    );

    return {
      props: {
        currentUser,
      },
    };
  },
  {
    permissions: [],
    roles: ["Morador(a)", "Anfitriã(o)", "Tutor(a)", "Administrador(a)"],
  }
);
