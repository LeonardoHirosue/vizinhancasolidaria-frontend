import { Box, Flex, SimpleGrid, StatHelpText, Text, theme } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { useEffect, useState } from "react";
import { setupAPIClient } from "../../services/api";
import { api } from "../../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";
import { useCan } from "../../services/hooks/useCan";
import { Can } from "../components/Can";

// const Chart = dynamic(() => import("react-apexcharts"), {
//   ssr: false,
// });

// const options = {
//   chart: {
//     toolbar: {
//       show: false,
//     },
//     zoom: {
//       enabled: false,
//     },
//     foreColor: theme.colors.gray[500],
//   },
//   grid: {
//     show: false,
//   },
//   dataLabels: {
//     enabled: false,
//   },
//   tooltip: {
//     enabled: false,
//   },
//   xaxis: {
//     type: "datetime",
//     axisBorder: {
//       color: theme.colors.gray[600],
//     },
//     axisTicks: {
//       color: theme.colors.gray[600],
//     },
//     categories: [
//       "2023-05-01T00:00:00.000z",
//       "2023-05-02T00:00:00.000z",
//       "2023-05-03T00:00:00.000z",
//       "2023-05-04T00:00:00.000z",
//       "2023-05-05T00:00:00.000z",
//       "2023-05-06T00:00:00.000z",
//       "2023-05-07T00:00:00.000z",
//     ],
//   },
//   fill: {
//     opacity: 0.3,
//     type: "gradient",
//     gradient: {
//       shade: "dark",
//       opacityFrom: 0.7,
//       opacityTo: 0.3,
//     },
//   },
// };

// const series = [{ name: "series1", data: [31, 120, 10, 28, 61, 18, 109] }];

export default function Dashboard() {
  // const [assembleGraphics, setAssembleGraphics] = useState(false);

  // const userCanSeeMetrics = useCan({
  //   permissions: ['metrics.list']
  // })

  // useEffect(() => {
  //   setAssembleGraphics(true);
  // }, []);

  // useEffect(() => {
  //   api.get('/me')
  //     .then(response => console.log(response))
  //     .catch(err => console.log(err));
  // }, []);

  return (
    <Flex direction="column" h="100vh">
      <Header />

      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />

        {/* {assembleGraphics && (
          <SimpleGrid flex="1" gap="4" minChildWidth="300px" align="flex-start">
            <Box p={["6", "8"]} bg="gray.800" borderRadius={8} pb="4" height={270}>
              <Text fontSize="lg" mb="4">
                Notificações da semana
              </Text>
              <Chart
                type="area"
                height={160}
                option={options}
                series={series}
              />
            </Box>
            <Can permissions={['metrics.list']}>
              <Box p={["6", "8"]} bg="gray.800" borderRadius={8} pb="4" height={270}>
                <Text fontSize="lg" mb="4">
                  Novas notificações
                </Text>
                <Chart
                  type="area"
                  height={160}
                  option={options}
                  series={series}
                />
              </Box>
            </Can>
          </SimpleGrid>
        )} */}
      </Flex>
    </Flex>
  );
}

// export const getServerSideProps = withSSRAuth(async (ctx) => {
//   const apiClient = setupAPIClient(ctx);
//   const response = await apiClient.get('/me');
//   console.log(response);
//   return {
//     props: {}
//   }
// })
