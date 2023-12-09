import { Button, ButtonGroup, Card, CardBody, CardFooter, Heading, Icon, Image, Spacer, Stack, Text, useDisclosure } from "@chakra-ui/react";
import NextLink from "next/link"
import { AiOutlineLink, AiOutlineForm, AiOutlineDelete } from 'react-icons/ai'
import { DeleteInformative } from "../../pages/informativos/delete";
import { Can } from "../../components/Can";

interface InformativeProps {
    id: string;
    title: string;
    description: string;
    url_banner: string;
    url_source?: string;
    onUpdateInformative: () => void;
}

export function Informative({id, title, description, url_banner, url_source, onUpdateInformative, ...props}: InformativeProps){
    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onClose: onDeleteClose,
      } = useDisclosure();

    
    return(
        <Card maxW='100%' bg='gray.800' h="100%">
            <CardBody>
                <Image
                w='100%'
                h='300px'
                src={url_banner}
                alt='Imagem do Informativo'
                borderRadius='lg'
                fit='cover'
                />
                <Stack mt='6' spacing='3'>
                    <Heading size='md' fontWeight='bold' color='white'>{title}</Heading>
                    <Text color='white'>
                        {description}
                    </Text>
                </Stack>
            </CardBody>
            <CardFooter>
                <ButtonGroup spacing='2' w='100%'>
                    <Can roles={["Tutor(a)", "Administrador(a)"]}>
                        <Button 
                            as="a"
                            size="md"
                            variant="outline"
                            fontSize="sm"
                            bg="gray.800"
                            color='gray.600'
                            colorScheme="red"
                            rightIcon={<Icon as={AiOutlineDelete} fontSize="16"/>}
                            onClick={onDeleteOpen}
                            >
                            Excluir
                        </Button>
                    </Can>
                    <DeleteInformative
                            isDeleteOpen={isDeleteOpen}
                            onDeleteClose={onDeleteClose}
                            informative_id={id}
                            onUpdateInformative={onUpdateInformative}
                          />
                    <Spacer/>
                    {/* <Button 
                        as="a"
                        size="md"
                        variant="solid"
                        fontSize="sm"
                        bg="gray.600"
                        color='white'
                        colorScheme="red"
                        rightIcon={<Icon as={AiOutlineForm} fontSize="16"/>}
                    >
                        Editar
                    </Button> */}
                    <NextLink href={url_source} target="_blank">
                        <Button 
                            as="a"
                            size="md"
                            variant="solid"
                            fontSize="sm"
                            colorScheme="red"
                            rightIcon={<Icon as={AiOutlineLink} fontSize="16"/>}
                    >
                            Saiba mais
                        </Button>
                    </NextLink>
                </ButtonGroup>
            </CardFooter>
        </Card>
    )
}

