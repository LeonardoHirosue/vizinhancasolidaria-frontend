import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { api } from "../../../services/apiClient";

export function DeleteStreet({ isDeleteOpen, onDeleteClose, street_id, loadStreets }) {
    const toast = useToast();

    async function deleteStreet(){
        await api.delete(`/streets/${street_id}`)
            .then(() => {
                onDeleteClose();
                toast({
                    position: 'top',
                    description: 'Rua excluída com sucesso!',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
                loadStreets();
            })
            .catch((err) => console.log(err))
    }

    return (     
        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} isCentered>
            <ModalOverlay opacity={0.5}/>
            <ModalContent
            as="form"
            bgColor="gray.300"
            color="black"
            >
            <ModalHeader>Exclusão de Rua</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                Tem certeza que deseja excluir essa rua?
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='red' mr={3} onClick={onDeleteClose}>
                Cancelar
                </Button>
                <Button variant='ghost' onClick={() => {deleteStreet()}}>Confirmar</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    )
}