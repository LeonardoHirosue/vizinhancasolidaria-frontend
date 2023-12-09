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
  useToast,
} from "@chakra-ui/react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { RiAddLine } from "react-icons/ri";
import { AlertTile } from "./alertTile";
import { CreateAlert } from "./create";
import { setupAPIClient } from "../../../services/api";
import { withSSRAuth } from "../../utils/withSSRAuth";
import { api } from "../../../services/apiClient";
import { useEffect, useState } from "react";

export default function Alerts() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [alertTypes, setAlertTypes] = useState([])
  const [alerts, setAlerts] = useState([]);
  const toast = useToast()

  async function deleteAlert(notification_id:string) {
    await api.delete(`/notifications/${notification_id}`)
      .then(() => {
        toast({
          position: "top",
          description: "Alerta encerrado com sucesso!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        updateAlerts()
        onClose()
      })
      .catch((err) => {
        toast({
          position: "top",
          description: `${err}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
  }

  async function loadAlertTypes (){
    const response = await api.get("notifications/types")
    setAlertTypes(response.data)
  }

  async function updateAlerts(){
    await api
      .get("/notifications")
      .then((response) => {
        setAlerts(response.data);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    updateAlerts()
    loadAlertTypes()
  }, [])

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  return (
    <Flex direction="column" h="100vh">
      <Header />
      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p={["6", "8"]} mb={6}>
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Alertas
            </Heading>

            <Button
              as="a"
              size="md"
              fontSize="sm"
              colorScheme="red"
              leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              onClick={onOpen}
            >
              {isWideVersion ? "Novo Alerta" : "Novo"}
            </Button>
            <CreateAlert isOpen={isOpen} onClose={onClose} alertTypes={alertTypes} onUpdateAlert={updateAlerts}/>
          </Flex>
          <Divider my="4" borderColor="gray.700" />
          <Stack spacing={3}>
            {alerts?.map((alert) => {
              return (
                <AlertTile
                  key={alert.id}
                  id={alert.id}
                  image={alert.image}
                  license_plate={alert.license_plate}
                  title={alert.type.name}
                  description={alert.description}
                  alert_type={alert.type.label}
                  created_at={alert.created_at}
                  deleteAlert={deleteAlert}
                />
              );
            })}
          </Stack>
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
  roles:["Morador(a)", "Anfitriã(o)", "Tutor(a)", "Administrador(a)"]
})