import { Navigate, Route, Routes } from "react-router-dom";
import { AdminTemplate } from "@components/templates/AdminTemplate";
import { StoreTemplate } from "@components/templates/StoreTemplate";
import { DashboardPage } from "@pages/admin/DashboardPage";
import { ProdutosPage } from "@pages/admin/ProdutosPage";
import { EstoquePage } from "@pages/admin/EstoquePage";
import { EstoqueEntradaPage } from "@pages/admin/EstoqueEntradaPage";
import { EstoqueSaidaPage } from "@pages/admin/EstoqueSaidaPage";
import { EstoqueAdicionarPage } from "@pages/admin/EstoqueAdicionarPage";
import { EstoqueBaixoPage } from "@pages/admin/EstoqueBaixoPage";
import { RequisicoesPage } from "@pages/admin/RequisicoesPage";
import { ServicosPage } from "@pages/admin/ServicosPage";
import { FinanceiroPage } from "@pages/admin/FinanceiroPage";
import { CadastrosPage } from "@pages/admin/CadastrosPage";
import { AtendimentoPage } from "@pages/admin/AtendimentoPage";
import { CadastroFornecedoresPage } from "@pages/admin/CadastroFornecedoresPage";
import { AdministrativoPage } from "@pages/admin/AdministrativoPage";
import { ConfiguracoesPage } from "@pages/admin/ConfiguracoesPage";
import {
  ClientesListaPage,
  ClientesSolicitacoesPage,
} from "@pages/admin/ClientesPage";
import { LojaHomePage } from "@pages/store/LojaHomePage";
import { MinhaContaPage } from "@pages/store/MinhaContaPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />

      <Route path="/admin" element={<AdminTemplate />}>
        <Route index element={<DashboardPage />} />
        <Route path="produtos" element={<ProdutosPage />} />
        <Route path="clientes" element={<Navigate to="clientes/lista" replace />} />
        <Route path="clientes/lista" element={<ClientesListaPage />} />
        <Route
          path="clientes/solicitacoes"
          element={<ClientesSolicitacoesPage />}
        />
        <Route path="estoque" element={<EstoquePage />} />
        <Route path="estoque/entrada" element={<EstoqueEntradaPage />} />
        <Route path="estoque/saida" element={<EstoqueSaidaPage />} />
        <Route path="estoque/adicionar" element={<EstoqueAdicionarPage />} />
        <Route path="estoque/baixo" element={<EstoqueBaixoPage />} />
        <Route path="requisicoes" element={<RequisicoesPage />} />
        <Route path="servicos" element={<ServicosPage />} />
        <Route path="financeiro" element={<FinanceiroPage />} />
        <Route path="cadastros" element={<CadastrosPage />} />
        <Route path="cadastros/atendimento" element={<AtendimentoPage />} />
        <Route
          path="cadastros/produtos"
          element={<Navigate to="/admin/cadastros/atendimento" replace />}
        />
        <Route
          path="cadastros/fornecedores"
          element={<CadastroFornecedoresPage />}
        />
        <Route path="administrativo" element={<AdministrativoPage />} />
        <Route path="configuracoes" element={<ConfiguracoesPage />} />
      </Route>

      <Route path="/loja" element={<StoreTemplate />}>
        <Route index element={<LojaHomePage />} />
        <Route path="minha-conta" element={<MinhaContaPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
