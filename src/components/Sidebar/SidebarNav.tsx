import { Stack } from "@chakra-ui/react";
import { RiAlarmWarningFill, RiAlarmWarningLine, RiAlertFill, RiAlertLine, RiCarLine, RiContactsLine, RiDashboardLine, RiFileUserLine, RiHome2Line, RiHomeGearLine, RiMapPinLine, RiNewspaperLine, RiTeamLine, RiUserLocationLine } from 'react-icons/ri'
import { MdFamilyRestroom, MdOutlineNotificationAdd, MdPets } from 'react-icons/md'
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export function SidebarNav() {
    return (
        <Stack spacing='10' align='flex-start' mb='10'>
            <NavSection title='GERAL'>
                <NavLink icon={RiDashboardLine} href="/dashboard">Dashboard</NavLink>
                <NavLink icon={RiNewspaperLine} href="/forms">Informativos</NavLink>
                <NavLink icon={RiFileUserLine} href="/profile">Meus Dados</NavLink>
            </NavSection>
            <NavSection title='NOTIFICAÇÕES'>
                <NavLink icon={RiAlarmWarningLine} href="/my_notifications">Meus Alertas</NavLink>
                <NavLink icon={RiAlarmWarningFill} href="/notifications">Alertas Gerais</NavLink>
            </NavSection>
            <NavSection title='RESIDÊNCIA'>
                <NavLink icon={RiHome2Line} href="/my_residence">Minha residência</NavLink>
                <NavLink icon={MdFamilyRestroom} href="/my_family">Minha Família</NavLink>
                <NavLink icon={RiCarLine} href="/my_cars">Meus veículos</NavLink>
                <NavLink icon={MdPets} href="/my_pets">Meus PETs</NavLink>
            </NavSection>
            <NavSection title="TUTOR">
                <NavLink icon={RiAlertLine} href="/new_notifications">Novas Notificações</NavLink>
                <NavLink icon={MdOutlineNotificationAdd} href="/new_solicitation">Novas Solicitações</NavLink>
                <NavLink icon={RiContactsLine} href="/users">Usuários</NavLink>
                <NavLink icon={RiHomeGearLine} href="/residences">Residências</NavLink>
            </NavSection>
            <NavSection title="ADMIN">
                <NavLink icon={RiUserLocationLine} href="/tutors">Tutores</NavLink>
                <NavLink icon={RiTeamLine} href="/groups">Grupos</NavLink>
                <NavLink icon={RiMapPinLine} href="/streets">Gerenciar Ruas</NavLink>
                <NavLink icon={RiAlertFill} href="/notifications_type">Tipos de Notificações</NavLink>
            </NavSection>
        </Stack>
    );
}