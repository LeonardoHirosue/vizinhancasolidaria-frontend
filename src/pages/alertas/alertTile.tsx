import { Alert, AlertDescription, AlertIcon, AlertStatus, AlertTitle, Button, useDisclosure } from "@chakra-ui/react";
import { ViewAlert } from "./view";


interface AlertProps {
    id?: string;
    title: string;
    image?: string;
    description?: string;
    license_plate?: string;
    alert_type: AlertStatus;
    created_at?: string;
    deleteAlert: (notification_id: string) => void;
}

export function AlertTile({id = null, title, description, created_at, image = null, license_plate = null, alert_type, deleteAlert, ...props}: AlertProps){
    const { isOpen, onOpen, onClose } = useDisclosure()

    return(
        <Alert status={alert_type} variant="left-accent" color="gray.700">
            <AlertIcon />
                {id == null?
                    <AlertTitle> 
                        {title}
                    </AlertTitle> :
                    <AlertTitle> 
                        <Button variant="link" color="gray.700" onClick={onOpen}>
                            {title}{license_plate == null ?"": ` (${license_plate})`}
                        </Button>
                        <ViewAlert id={id} title={title} license_plate={license_plate} image={image} description={description} created_at={created_at} isOpen={isOpen} onClose={onClose} deleteAlert={deleteAlert}/>
                    </AlertTitle>
                }
            <AlertDescription>{description}</AlertDescription>
        </Alert>
    )
}