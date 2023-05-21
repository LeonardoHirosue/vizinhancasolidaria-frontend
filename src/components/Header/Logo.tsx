import { Text, VStack } from "@chakra-ui/react";

interface LogoProps {
  showExtendedLogo?: boolean;
}

export function Logo({ showExtendedLogo = true }: LogoProps) {
  if(!showExtendedLogo){
    return (
      <VStack spacing={1} align="flex-start">
        <Text fontSize={["l", "xl"]} fontWeight="bold" letterSpacing="tight" w="auto" >
          Vizinhança
        </Text>
        <Text fontSize={["l", "xl"]} fontWeight="bold" letterSpacing="tight" w="auto" color="red.500">
          Solidária
        </Text>
      </VStack>
    );
  }

  return (
    <Text fontSize={["xl", "2xl"]} fontWeight="bold" letterSpacing="tight" w="64">
      Vizinhança
      <Text as="span" ml="1" color="red.500">
        Solidária
      </Text>
    </Text>
  );
}
