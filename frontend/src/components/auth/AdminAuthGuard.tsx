import { Navigate, useLocation } from "react-router-dom";
import { readAdminAuth } from "@/services/authStorage";

type AdminAuthGuardProps = {
  children: React.ReactNode;
};

/** Redireciona para login da loja se não houver sessão administrativa */
export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const location = useLocation();
  const admin = readAdminAuth();

  if (!admin?.token) {
    return (
      <Navigate
        to="/loja/minha-conta"
        replace
        state={{ from: location.pathname, mensagem: "Faça login para acessar o painel." }}
      />
    );
  }

  return <>{children}</>;
}
