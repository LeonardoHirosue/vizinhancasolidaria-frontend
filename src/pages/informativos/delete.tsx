import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react";
import { api } from "../../../services/apiClient";

export function DeleteInformative({ isDeleteOpen, onDeleteClose, informative_id, onUpdateInformative }) {
    const toast = useToast();

    const deleteInformative = async() => {
        await api.delete(`/informatives/${informative_id}`)
            .then(() => onDeleteClose())
            .then(() => {
                toast({
                position: 'top',
                description: 'Informativo excluído com sucesso!',
                status: 'success',
                duration: 5000,
                isClosable: true,
            })})
            .then(() => onUpdateInformative())
    }

    return (     
        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} isCentered>
            <ModalOverlay opacity={0.5}/>
            <ModalContent
            as="form"
            bgColor="gray.300"
            color="black"
            >
            <ModalHeader>Exclusão de Informativo</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                Tem certeza que deseja excluir este informativo?
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='red' mr={3} onClick={onDeleteClose}>
                Cancelar
                </Button>
                <Button variant='ghost' onClick={deleteInformative}>Confirmar</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    )
}