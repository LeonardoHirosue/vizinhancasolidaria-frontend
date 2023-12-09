import React from "react"
import { Button, Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useToast } from "@chakra-ui/react"
import { Input } from "../../components/Form/Input";
import { AiOutlineClose, AiOutlineUpload } from "react-icons/ai";
import { api } from "../../../services/apiClient";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";

type InformativeFormData = {
    user_id: string;
    title: string;
    description: string;
    url_banner: string;
    url_source: string;
    start_date: string;
    end_date: string;
}

const informativeFormSchema = yup.object({
    url_banner: yup.string().required("Campo obrigatório."),
    title: yup.string().required("Campo obrigatório."),
    description: yup.string().required("Campo obrigatório.")
        .max(125, "A descrição deve conter menos de 125 caracteres."),
    url_source: yup.string().required("Campo obrigatório."),
    start_date: yup.date().required("Campo obrigatório."),
    end_date: yup.date().required("Campo obrigatório."),
  })

export function CreateInformative({isOpen, onClose, onUpdateInformative}) {
    const toast = useToast();

    const { register, handleSubmit, formState, reset } = useForm({
        resolver: yupResolver(informativeFormSchema)
    });
    
    const { errors } = formState;
    
    const initialRef = React.useRef(null)

    const handleSubmitInformative:SubmitHandler<InformativeFormData> = async(values) => {
        
        values.start_date = moment(values.start_date).format("MM DD YYYY")
        values.end_date = moment(values.end_date).format("MM DD YYYY")

        await api.post("/informatives", values)
            .then(()=> {
                toast({
                    position: 'top',
                    description: 'Informativo publicado com sucesso!',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
            })
            .then(() => {
                onClose()
                onUpdateInformative()
                reset()
            })
    }
  
    return (
      <>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay/>
          <ModalContent as="form" bgColor="gray.300" color="black" onSubmit={handleSubmit(handleSubmitInformative)}>
            <ModalHeader>Cadastrar novo informativo</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
                <Stack spacing={5} direction="column">
                    <Input 
                        name="url_banner"
                        type="url"
                        label="URL Banner (imagem)"
                        ref={initialRef} 
                        placeholder="Insira a URL da imagem do informativo."
                        bg="white"
                        variant="outline"
                        focusBorderColor="gray.500" 
                        _hover={{
                            bgColor: "white",
                        }}
                        errors={errors.url_banner} 
                        {...register("url_banner")}
                    />
                    <Input 
                        name="title"
                        type="text"
                        label="Título"
                        placeholder="Digite um título."
                        bg="white"
                        variant="outline"
                        focusBorderColor="gray.500" 
                        _hover={{
                            bgColor: "white",
                        }}
                        errors={errors.title} 
                        {...register("title")}
                    />
                    <Input 
                        name="description"
                        type="text"
                        label="Descrição (Ex.: Data, local e hora)"
                        placeholder='Digite uma breve descrição.'
                        bg="white"
                        variant="outline"
                        focusBorderColor="gray.500" 
                        _hover={{
                            bgColor: "white",
                        }}
                        errors={errors.description} 
                        {...register("description")}
                    />
                    <Input 
                        name="url_source"
                        type="url"
                        label="URL da origem do informativo (Link oficial)"
                        placeholder="URL da fonte de informação."
                        bg="white"
                        variant="outline"
                        focusBorderColor="gray.500" 
                        _hover={{
                            bgColor: "white",
                        }}
                        errors={errors.url_source} 
                        {...register("url_source")}
                    />
                    <Input 
                        name="start_date"
                        type="date"
                        label="Data de Início (Divulgação)"
                        bg="white"
                        variant="outline"
                        focusBorderColor="gray.500" 
                        _hover={{
                            bgColor: "white",
                        }}
                        errors={errors.start_date} 
                        {...register("start_date")}
                    />
                    <Input 
                        name="end_date"
                        type="date"
                        label="Data de Início (Divulgação)"
                        bg="white"
                        variant="outline"
                        focusBorderColor="gray.500" 
                        _hover={{
                            bgColor: "white",
                        }}
                        errors={errors.end_date} 
                        {...register("end_date")}
                    />
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
                        // onClick={() => Router.push("/informativos").then(onClose)} 
                    >
                        Publicar
                    </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }