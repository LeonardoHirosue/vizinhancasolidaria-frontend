import { Card, CardBody, CardFooter, Image, Button, Text, VStack, Avatar } from "@chakra-ui/react";
import { Can } from "../../components/Can";

interface residenceMember {
    id: string;
    name: string;
    avatar: string;
    deletePet: (pet_id: string) => void;
}

export default function PetCard({id, name, avatar, deletePet, ...props}: residenceMember) {

    return (
        <Card size='sm' bgColor='gray.700' align='center'>

            <CardBody p='20px 20px 0 20px'>
                <Avatar
                    objectFit='cover'
                    width='210px'
                    height='280px'
                    borderRadius='md'
                    size="md"
                    name={name ? name : ""}
                    src={avatar ? `/${avatar}` : ""}
                />
                    
            </CardBody>
            <CardFooter color='gray.50' p='12px'>
                <VStack spacing='1'>
                    <Text>
                        {name}
                    </Text>
                    <Can roles={["Anfitriã(o)", "Tutor(a)", "Administrador(a)"]}>                        
                        <Button colorScheme='red' variant='link' fontWeight='normal' fontSize='sm' onClick={() => {deletePet(id)}}>Remover</Button>
                    </Can>
                </VStack>
            </CardFooter>
        </Card>
    )
}