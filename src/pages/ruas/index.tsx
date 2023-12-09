import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { Pagination } from "../../components/Pagination";
import { useEffect, useState } from "react";
import { RiAddLine } from "react-icons/ri";
import { CreateStreet } from "./create";
import { DeleteStreet } from "./delete";
import { api } from "../../../services/apiClient";
import { withSSRAuth } from "../../utils/withSSRAuth";
import { setupAPIClient } from "../../../services/api";

export default function Streets() {
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [streets, setStreets] = useState([]);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [page, setPage] = useState(1);

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  async function loadStreets(){
    const response = await api.get("/streets")
    const allStreets = response.data
    setCurrentPageData(allStreets.slice((page - 1) * 10, page * 10));
    setStreets(allStreets)
  }

  useEffect(() => {
    loadStreets()
  },[page]);


  return (
    <Flex direction="column" h="100vh">
      <Header />
      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p={["6", "8"]} mb={6}>
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Lista de Ruas
            </Heading>
            <Button
              as="a"
              size="md"
              fontSize="sm"
              colorScheme="red"
              leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              onClick={onCreateOpen}
            >
              {isWideVersion ? "Adicionar Rua" : "Adicionar"}
            </Button>
            <CreateStreet
              isCreateOpen={isCreateOpen}
              onCreateClose={onCreateClose}
              loadStreets={loadStreets}
            />
          </Flex>
          <Divider my="4" borderColor="gray.700" />
          <TableContainer pb={4}>
            <Table size="sm" colorScheme="gray">
              <Thead>
                <Tr justifyItems="space-between">
                  <Th borderColor="gray.600">CEP</Th>
                  <Th borderColor="gray.600">Estado</Th>
                  <Th borderColor="gray.600">Cidade</Th>
                  <Th borderColor="gray.600">Bairro</Th>
                  <Th borderColor="gray.600">Rua</Th>
                  <Th borderColor="gray.600" isNumeric>
                    Residências Vinculadas
                  </Th>
                  <Th borderColor="gray.600"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentPageData.map((street) => (
                  <Tr justifyItems="space-between" key={street.id}>
                    <Td borderColor="gray.600">{street.postal_code}</Td>
                    <Td borderColor="gray.600">{street.state}</Td>
                    <Td borderColor="gray.600">{street.city}</Td>
                    <Td borderColor="gray.600">{street.district}</Td>
                    <Td borderColor="gray.600">{street.name}</Td>
                    <Td borderColor="gray.600" isNumeric>
                      {street.residences.length}
                    </Td>
                    <Td borderColor="gray.600" isNumeric>
                      {street.residences.length > 0 ? (
                        <Button
                          isDisabled
                          size="xs"
                          variant="solid"
                          fontSize="sm"
                          fontWeight="normal"
                          colorScheme="gray"
                          bg="gray.600"
                          color="gray.900"
                          w="80px"
                        >
                          Excluir
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="xs"
                            variant="solid"
                            fontSize="sm"
                            fontWeight="normal"
                            colorScheme="gray"
                            bg="gray.600"
                            color="gray.900"
                            w="80px"
                            onClick={onDeleteOpen}
                          >
                            Excluir
                          </Button>
                          <DeleteStreet
                            isDeleteOpen={isDeleteOpen}
                            onDeleteClose={onDeleteClose}
                            street_id={street.id}
                            loadStreets={loadStreets}
                          />
                        </>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Pagination
            totalCountOfRegisters={streets.length}
            currentPage={page}
            onPageChange={setPage}
          />
        </Box>
      </Flex>
    </Flex>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  await apiClient.get("/me");
  
  return {
    props:{}
  }
}, {
  permissions:[],
  roles:["Administrador(a)"]
})