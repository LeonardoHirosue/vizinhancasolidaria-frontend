import React from "react"
import { Button, FormControl, FormErrorMessage, FormLabel, Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Stack } from "@chakra-ui/react"
import { Input } from "../../components/Form/Input";
import { AiOutlineClose, AiOutlineUpload } from "react-icons/ai";
import { api } from "../../../services/apiClient";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type AlertTypeFormData = {
    name: string;
    label: string;
}

const alertTypeFormSchema = yup.object({
    name: yup.string().required("Campo obrigatório.")
        .max(255, "A descrição deve conter menos de 255 caracteres."),
    label: yup.string().required("Campo obrigatório."),
})

export function CreateAlertType({isOpen, onClose}) {

    const { register, handleSubmit, formState, reset } = useForm({
        resolver: yupResolver(alertTypeFormSchema)
    });
    
    const { errors } = formState;
    
    const initialRef = React.useRef(null)

    const handleSubmitInformative:SubmitHandler<AlertTypeFormData> = async(values) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await api.post("/notifications/types", values)
            .then(() => {
                reset()
                onClose()
            })
    }
  
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
        >
            <ModalOverlay/>
            <ModalContent as="form" bgColor="gray.300" color="black" onSubmit={handleSubmit(handleSubmitInformative)}>
            <ModalHeader>Cadastrar novo tipo de alerta</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
                <Stack spacing={5} direction="column">
                    <Input 
                        name="title"
                        type="text"
                        label="Título do alerta"
                        ref={initialRef} 
                        placeholder="Insira um título para o tipo de alerta."
                        bg="white"
                        variant="outline"
                        focusBorderColor="gray.500" 
                        _hover={{
                            bgColor: "white",
                        }}
                        errors={errors.name} 
                        {...register("name")}
                    />
                    <FormControl isInvalid={!!errors.label}>
                        <FormLabel>Rótulo do alerta</FormLabel>
                        <Select
                            size="lg"
                            color="gray.500"
                            placeholder="Selecione uma opção"
                            colorScheme="gray"
                            focusBorderColor="gray.500"
                            bgColor="gray.50"
                            variant="outline"
                            {...register("label")}
                        >
                            <option value="info">Informativo</option>
                            <option value="warning">Atenção</option>
                            <option value="error">Perigo</option>
                        </Select>
                        <FormErrorMessage>Campo obrigatório.</FormErrorMessage>
                    </FormControl>
                </Stack>
            </ModalBody>

            <ModalFooter>
                <Button
                    colorScheme="gray"
                    bg="gray.400"
                    color='white'
                    mr={3} 
                    onClick={onClose}
                    rightIcon={<Icon as={AiOutlineClose} fontSize="16" />}
                >
                    Cancel
                </Button>
                <Button 
                    type="submit"
                    colorScheme='red'
                    mr={3}
                    rightIcon={<Icon as={AiOutlineUpload} fontSize="16" />}
                    isLoading={formState.isSubmitting}                       
                >
                    Publicar
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    )
  }