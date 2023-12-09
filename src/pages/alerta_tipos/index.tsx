import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Stack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { RiAddLine } from "react-icons/ri";
import { AlertTile } from "../alertas/alertTile";
import { api } from "../../../services/apiClient";
import { useEffect, useState } from "react";
import { CreateAlertType } from "./create";
  
  export default function AlertTypes() {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const isWideVersion = useBreakpointValue({
      base: false,
      lg: true,
    });

    const [alertTypes, setAlertTypes] = useState([]);

    useEffect(() => {
      api.get("/notifications/types")
        .then(response => {
          setAlertTypes(response.data)
        })      
        .catch(err => console.log(err))
    },[alertTypes]);  
  
    return (
      <Flex direction="column" h="100vh">
        <Header />
        <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
          <Sidebar />
  
          <Box flex="1" borderRadius={8} bg="gray.800" p={["6", "8"]} mb={6}>
            <Flex mb="8" justify="space-between" align="center">
              <Heading size="lg" fontWeight="normal">
                Tipos de Alertas
              </Heading>
  
              <Button
                as="a"
                size="md"
                fontSize="sm"
                colorScheme="red"
                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                onClick={onOpen}
              >
                {isWideVersion ? "Novo tipo" : "Novo"}
              </Button>
              <CreateAlertType isOpen={isOpen} onClose={onClose} />
            </Flex>
            <Divider my="4" borderColor="gray.700" />
            <Stack spacing={3}>
              {alertTypes.map((alert) => {
                return (
                  <AlertTile
                    key={alert.id}
                    title={alert.name}
                    alert_type={alert.label}
                  />
                );
              })}
            </Stack>
          </Box>
        </Flex>
      </Flex>
    );
  }
  