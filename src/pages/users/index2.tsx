import NextLink from "next/link";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Icon,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  useBreakpointValue,
  Spinner,
  Link,
  LinkOverlay
} from "@chakra-ui/react";
import { RiAddLine } from "react-icons/ri";

import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { Pagination } from "../../components/Pagination";
import { getUsers, useUsers } from "../../../services/hooks/useUsers";
import { useEffect, useState } from "react";
import { queryClient } from "../../../services/queryClient";
import { api } from "../../../services/apiClient";
import { GetServerSideProps } from "next";

export default function UserList({ users }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, error } = useUsers(page, {
    initialData: users,
  });
  
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  // async function handlePrefetchUser(userId: string) {
  //   await queryClient.prefetchQuery(['user', userId], async () => {
  //     const response = await api.get(`users/${userId}`);

  //     return response.data;
  //   }, {
  //     staleTime: 1000 * 60 * 10,
  //   })
  // }

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p={["6", "8"]} mb={6}>
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Usuários
              { !isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4"/>}
            </Heading>

            {/* <NextLink href="/users/create" passHref> */}
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="red"
                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              >
                { isWideVersion ? "Novo usuário" : "Novo" }
              </Button>
            {/* </NextLink> */}
          </Flex>

          { isLoading ? (
            <Flex justify="center">
              <Spinner/>
            </Flex>
          ) : error ? (
            <Flex justify="center">
              <Text>Falha ao obter dados dos usuários</Text>
            </Flex>
          ) : (
            <>
              <Table colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th px={["2", "4", "6"]} color="gray.300" width="8">
                    <Checkbox colorScheme="red" />
                  </Th>
                  <Th>Usuário</Th>
                  {isWideVersion && <Th>Data de Cadastro</Th>}
                  {isWideVersion && <Th w="8"></Th>}
                </Tr>
              </Thead>
              <Tbody>
                {data.users.map(user => {
                  return (
                    <Tr key={user.id}>
                      <Td px={["2", "4", "6"]}>
                        <Checkbox colorScheme="red" />
                      </Td>
                      <Td>
                        <Box>
                          <Link color="red.400" onMouseEnter={() => handlePrefetchUser(user.id)}>
                            <Text fontWeight="bold">{user.name}</Text>
                          </Link>
                          <Text fontSize="sm" color="gray.300">
                            {user.email}
                          </Text>
                        </Box>
                      </Td>
                      {isWideVersion && <Td>{user.createdAt}</Td>}
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>

            <Pagination 
              totalCountOfRegisters={data.totalCount}
              currentPage={page}
              onPageChange={setPage}
            />
          </>
          )}
        </Box>
      </Flex>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { users, totalCount} = await getUsers(1)

  return {
    props: {
      users,
    }
  }
}
