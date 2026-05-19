import { Navigate, Route, Routes } from "react-router-dom";
import { AdminTemplate } from "@components/templates/AdminTemplate";
import { StoreTemplate } from "@components/templates/StoreTemplate";
import { DashboardPage } from "@pages/admin/DashboardPage";
import { ProdutosPage } from "@pages/admin/ProdutosPage";
import { EstoquePage } from "@pages/admin/EstoquePage";
import { EstoqueEntradaPage } from "@pages/admin/EstoqueEntradaPage";
import { EstoqueSaidaPage } from "@pages/admin/EstoqueSaidaPage";
import { EstoqueAdicionarPage } from "@pages/admin/EstoqueAdicionarPage";
import { RequisicoesPage } from "@pages/admin/RequisicoesPage";
import { ServicosPage } from "@pages/admin/ServicosPage";
import { FinanceiroPage } from "@pages/admin/FinanceiroPage";
import { CadastrosPage } from "@pages/admin/CadastrosPage";
import { CadastroProdutosPage } from "@pages/admin/CadastroProdutosPage";
import { CadastroFornecedoresPage } from "@pages/admin/CadastroFornecedoresPage";
import { AdministrativoPage } from "@pages/admin/AdministrativoPage";
import { LojaHomePage } from "@pages/store/LojaHomePage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />

      <Route path="/admin" element={<AdminTemplate />}>
        <Route index element={<DashboardPage />} />
        <Route path="produtos" element={<ProdutosPage />} />
        <Route path="estoque" element={<EstoquePage />} />
        <Route path="estoque/entrada" element={<EstoqueEntradaPage />} />
        <Route path="estoque/saida" element={<EstoqueSaidaPage />} />
        <Route path="estoque/adicionar" element={<EstoqueAdicionarPage />} />
        <Route path="requisicoes" element={<RequisicoesPage />} />
        <Route path="servicos" element={<ServicosPage />} />
        <Route path="financeiro" element={<FinanceiroPage />} />
        <Route path="cadastros" element={<CadastrosPage />} />
        <Route path="cadastros/produtos" element={<CadastroProdutosPage />} />
        <Route
          path="cadastros/fornecedores"
          element={<CadastroFornecedoresPage />}
        />
        <Route path="administrativo" element={<AdministrativoPage />} />
      </Route>

      <Route path="/loja" element={<StoreTemplate />}>
        <Route index element={<LojaHomePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
