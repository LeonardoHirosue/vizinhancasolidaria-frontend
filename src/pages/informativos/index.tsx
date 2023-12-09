import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  VStack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { useContext, useEffect, useState } from "react";
import { Informative } from "../../components/Informative";
import { api } from "../../../services/apiClient";
import { RiAddLine } from "react-icons/ri";
import { CreateInformative } from "./create";
import { AuthContext } from "../../contexts/AuthContext";
import { withSSRAuth } from "../../utils/withSSRAuth";
import { setupAPIClient } from "../../../services/api";
import { Can } from "../../components/Can";

export default function Informatives() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [informatives, setInformatives] = useState([]);

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  async function updateInformatives(){
    api
      .get("/informatives")
      .then((response) => {
        setInformatives(response.data);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    api.get("/me").then((response) => console.log(response));
  }, []);

  useEffect(() => {
    updateInformatives()
  }, []);

  return (
    <Flex direction="column" h="100vh">
      <Header />
      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.900" p={["6", "8"]} mb={6}>
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="semi-bold">
              Informativos
            </Heading>
            <Can roles={["Tutor(a)", "Administrador(a)"]}>
              <Button
                as="a"
                size="md"
                fontSize="sm"
                colorScheme="red"
                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                onClick={onOpen}
              >
                {isWideVersion ? "Novo Informativo" : "Novo"}
              </Button>
            </Can>
            <CreateInformative isOpen={isOpen} onClose={onClose} onUpdateInformative={updateInformatives}/>
          </Flex>
          <Divider my="6" borderColor="gray.900" />
          <Stack w="100%">
            <SimpleGrid
              columns={2}
              gap="8"
              minChildWidth="350px"
              w={informatives.length == 1 ? "50%" : "100%"}
            >
              {informatives.map((informative) => {
                return (
                  <Box key={informative.id} bg="gray.800" borderRadius={8} height="530px">
                    <Informative
                      id={informative.id}
                      title={informative.title}
                      description={informative.description}
                      url_banner={informative.url_banner}
                      url_source={informative.url_source}
                      onUpdateInformative={updateInformatives}
                    />
                  </Box>
                );
              })}
            </SimpleGrid>
          </Stack>
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
    roles: ["Morador(a)", "Anfitriã(o)", "Tutor(a)", "Administrador(a)"],
  }
);
