import { Flex, Icon, Input } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { RiSearchLine } from "react-icons/ri";

//Controlled components
//Uncontrolled components

export function SearchBox({ placeholderText,  placeholderBG, ...props }) {
  // const [ search, setSearch ] = useState('');

  const searchInputRef = useRef<HTMLInputElement>(null);

  // searchInputRef.current.focus(); (Imperativo)

  // debounce

  return (
    <Flex
      as="label"
      flex="1"
      py="4"
      px="8"
      ml="6"
      maxWidth={350}
      maxHeight={50}
      alignSelf="center"
      color="gray.200"
      position="relative"
      bg={placeholderBG}
      borderRadius="full"
    >
      <Input
        color="gray.50"
        variant="unstyled"
        px="2"
        mr="2"
        placeholder={placeholderText}
        _placeholder={{ color: "gray.400" }}
        ref={searchInputRef}
      />

      <Icon as={RiSearchLine} fontSize="20" />
    </Flex>
  );
}
