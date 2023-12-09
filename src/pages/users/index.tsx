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
  useDisclosure,
} from "@chakra-ui/react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { Pagination } from "../../components/Pagination";
import { useEffect, useState } from "react";
import { SearchBox } from "../../components/Header/SearchBox";
import { api } from "../../../services/apiClient";
import { withSSRAuth } from "../../utils/withSSRAuth";
import { setupAPIClient } from "../../../services/api";
import { UserInfo } from "../../components/UserInfo";

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
  residence: Residence
}

type Residence = {
  number: string;
  street: Street
}

type Street = {
  name: string;
  district: string;
  postal_code: string;
  state: string;
  city: string
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [page, setPage] = useState(1);
  
  const {
    onOpen: onOpenUserInfo,
    isOpen: isOpenUserInfo,
    onClose: onCloseUserInfo,
  } = useDisclosure();
  
  async function loadUsers(){
    const response = await api.get("/users")
    const allUsers = response.data
    setCurrentPageData(allUsers.slice((page - 1) * 10, page * 10));
    setUsers(allUsers)
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
              Lista de Usuários
            </Heading>
            <SearchBox
              placeholderText="Buscar usuários"
              placeholderBG="gray.700"
            />
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
                            onClick={onOpenUserInfo}
                          >
                            <Text fontWeight="bold">{user.name}</Text>
                          </Link>
                          
                          <UserInfo
                            isOpen={isOpenUserInfo}
                            onClose={onCloseUserInfo}
                            user_id={user.id} 
                            onResidenceUpdate={undefined}                          />
                          <Text fontSize="sm" color="gray.300">
                            {user.email}
                          </Text>
                        </Box>
                      </Td>
                      <Td borderColor="gray.600">{`${user.residence.street.name}, ${user.residence.number} - Bairro ${user.residence.street.district}. ${user.residence.street.city} - ${user.residence.street.state}`}</Td>
                      <Td borderColor="gray.600" width="200px" isNumeric>
                        <Button
                          size="xs"
                          fontSize="sm"
                          fontWeight="normal"
                          colorScheme="gray"
                          variant="solid"
                          bg="gray.600"
                          color="gray.900"
                          w="135px"
                        >
                          Remover Usuário
                        </Button>
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

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  await apiClient.get("/me");
  
  return {
    props:{}
  }
}, {
  permissions:[],
  roles:["Tutor(a)", "Administrador(a)"]
})