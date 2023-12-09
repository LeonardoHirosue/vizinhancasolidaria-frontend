import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { Pagination } from "../../components/Pagination";
import { useEffect, useState } from "react";
import { useUsers } from "../../../services/hooks/useUsers";
import { SearchBox } from "../../components/Header/SearchBox";
import { api } from "../../../services/apiClient";

export default function Tutors() {
  const [users, setUsers] = useState([]);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [page, setPage] = useState(1);


  async function loadUsers(){
    const response = await api.get("/users")
    const tutors = response.data.filter((data) => data.desired_role === "Tutor(a)");
    setCurrentPageData(tutors.slice((page - 1) * 10, page * 10));
    setUsers(tutors)
  }

  useEffect(() => {
    loadUsers()
  },[page]);

  return (
    <Flex direction="column" h="100vh">
      <Header />
      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p={["6", "8"]} mb={6}>
        <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Lista de Tutores
            </Heading>
            <SearchBox placeholderText="Buscar usuários" placeholderBG="gray.700"/>
            </Flex>
          <Divider my="4" borderColor="gray.700" />
          <TableContainer pb={4}>
            <Table size="sm" colorScheme="gray">
              <Thead>
                <Tr justifyItems="space-between">
                  <Th borderColor="gray.600" width="100px">
                    Função
                  </Th>
                  <Th borderColor="gray.600">Usuário</Th>
                  <Th borderColor="gray.600">Endereço</Th>
                  <Th borderColor="gray.600" width="200px"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentPageData.map((user) => {
                  return (
                    <Tr justifyItems="space-between" key={user.id}>
                      <Td borderColor="gray.600" width="100px">
                        {user.role}
                      </Td>
                      <Td borderColor="gray.600">
                        <Box>
                          <Link
                            color="red.400"
                            // onMouseEnter={() => handlePrefetchUser(user.id)}
                          >
                            <Text fontWeight="bold">{user.name}</Text>
                          </Link>
                          <Text fontSize="sm" color="gray.300">
                            {user.email}
                          </Text>
                        </Box>
                      </Td>
                      <Td borderColor="gray.600">{`${user.residence.street.name}, ${user.residence.number} - Bairro ${user.residence.street.district}. ${user.residence.street.city} - ${user.residence.street.state}`}</Td>
                      <Td borderColor="gray.600" width="200px" isNumeric>
                        { user.desired_role !== user.role  ? (
                          <Button
                            size="xs"
                            variant="solid"
                            fontSize="sm"
                            fontWeight="normal"
                            colorScheme="red"
                            bg="red.500"
                            color="gray.50"
                            w="135px"
                          >
                            Aprovar Função
                          </Button>
                        ) : (
                          <Button
                            size="xs"
                            variant="solid"
                            fontSize="sm"
                            fontWeight="normal"
                            colorScheme="gray"
                            bg="gray.600"
                            color="gray.900"
                            w="135px"
                          >
                            Revogar Função
                          </Button>
                        )}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>

          <Pagination
            totalCountOfRegisters={users.length}
            currentPage={page}
            onPageChange={setPage}
          />
        </Box>
      </Flex>
    </Flex>
  );
}
