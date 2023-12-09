import { Stack } from "@chakra-ui/react";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";
import {
  AiOutlineRead,
  AiOutlineUser,
  AiOutlineSound,
  AiOutlineHome,
  AiOutlineMail,
  AiOutlineAudit,
  AiOutlineSafety,
  AiOutlineEnvironment,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import { Can } from "../Can";
import { withSSRAuth } from "../../utils/withSSRAuth";
import { setupAPIClient } from "../../../services/api";

export function SidebarNav() {
  return (
    <Stack spacing="10" align="flex-start" mb="10">
      <NavSection title="GERAL">
        <Can roles={["Morador(a)", "Anfitriã(o)", "Tutor(a)", "Administrador(a)"]}>
          <NavLink icon={AiOutlineRead} href="/informativos">
            Informativos
          </NavLink>
        </Can>
        <NavLink icon={AiOutlineUser} href="/perfil">
          Meus Dados
        </NavLink>
        <Can roles={["Morador(a)", "Anfitriã(o)", "Tutor(a)", "Administrador(a)"]}>
          <NavLink icon={AiOutlineSound} href="/alertas">
            Alertas
          </NavLink>
          <NavLink icon={AiOutlineHome} href="/minha_residencia">
            Minha Residência
          </NavLink>
        </Can>
      </NavSection>
      <Can roles={["Tutor(a)", "Administrador(a)"]}>
        <NavSection title="TUTOR">
          <NavLink icon={AiOutlineMail} href="/novas_solicitacoes">
            Novas Solicitações
          </NavLink>
          <NavLink icon={AiOutlineAudit} href="/users">
            Usuários
          </NavLink>
        </NavSection>
      </Can>
      <Can roles={["Administrador(a)"]}>
        <NavSection title="ADMIN">
          <NavLink icon={AiOutlineSafety} href="/tutores">
            Tutores
          </NavLink>
          <NavLink icon={AiOutlineEnvironment} href="/ruas">
            Gerenciar Ruas
          </NavLink>
          <NavLink icon={AiOutlineInfoCircle} href="/alerta_tipos">
            Tipos de Alertas
          </NavLink>
        </NavSection>
      </Can>
    </Stack>
  );
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    await apiClient.get("/me");

    return {
      props: {},
    };
  },
  {
    permissions: [],
    roles: [],
  }
);
