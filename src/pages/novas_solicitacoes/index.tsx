import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Link,
  HStack,
  Table,
  TableContainer,
  Tag,
  TagLabel,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { Pagination } from "../../components/Pagination";
import { useEffect, useRef, useState } from "react";
import { api } from "../../../services/apiClient";
import { withSSRAuth } from "../../utils/withSSRAuth";
import { setupAPIClient } from "../../../services/api";
import { UserInfo } from "../../components/UserInfo";

export default function NewsSolicitations() {
  const [users, setUsers] = useState([]);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [page, setPage] = useState(1);
  const toast = useToast()
  const {
    onOpen: onOpenUserInfo,
    isOpen: isOpenUserInfo,
    onClose: onCloseUserInfo,
  } = useDisclosure();

  async function updateUserRole(user_id: string, role: string, desired_role: string): Promise<void>{
    await api.patch("/users", {
      user_id: user_id,
      role: role,
      desired_role: desired_role
    })
      .then(() => {
        toast({
          position: 'top',
          description: 'A solicitação respondida com sucesso!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        loadUsers();
      })
  }

  async function loadUsers(){
    const response = await api.get("/users")
    const usersWithSolicitations = response.data.filter((data) => data.role !== data.desired_role);
    setCurrentPageData(usersWithSolicitations.slice((page - 1) * 10, page * 10));
    setUsers(usersWithSolicitations)
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
          <Heading size="lg" fontWeight="normal">
            Novas Solicitações
          </Heading>
          <Divider my="4" borderColor="gray.700" />
          <TableContainer pb={4}>
            <Table size="sm" colorScheme="gray">
              <Thead>
                <Tr justifyItems="space-between">
                  <Th borderColor="gray.600" width="100px">
                    Tipo
                  </Th>
                  <Th borderColor="gray.600">Usuário</Th>
                  <Th borderColor="gray.600">Data</Th>
                  <Th borderColor="gray.600" width="200px"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentPageData.map((user) => {
                  return (
                    <Tr justifyItems="space-between" key={user.id}>
                      <Td borderColor="gray.600" width="100px">
                        <Tag size="sm" variant="outline" colorScheme={user.role=="Não identificado(a)"?"green":"yellow"}>
                          <TagLabel>{user.role=="Não identificado(a)"? "Cadastro" : "Alteração de função"}</TagLabel>
                        </Tag>
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
                            onResidenceUpdate={undefined} 
                          />
                          <Text fontSize="sm" color="gray.300">
                            {user.email}
                          </Text>
                        </Box>
                      </Td>
                      <Td borderColor="gray.600">{user.updated_at}</Td>
                      <Td borderColor="gray.600" width="200px">
                        <HStack spacing={2} justify="flex-end">
                          <Button
                            size="xs"
                            variant="solid"
                            fontSize="sm"
                            fontWeight="normal"
                            colorScheme="red"
                            w="80px"
                            onClick={() => {
                              updateUserRole(user.id, user.desired_role, user.desired_role)
                            }}
                          >
                            Aprovar
                          </Button>
                          <Button
                            size="xs"
                            variant="solid"
                            fontSize="sm"
                            fontWeight="normal"
                            colorScheme="gray"
                            bg="gray.600"
                            color="gray.50"
                            w="80px"
                            onClick={() => {
                              updateUserRole(user.id, user.role, user.role)
                            }}
                          >
                            Reprovar
                          </Button>
                        </HStack>
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