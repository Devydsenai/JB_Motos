import { useEffect, useMemo, useState } from "react";
import { useProdutos } from "@/contexts/ProdutosContext";
import type { OrdemServico, ServicoAdicionalOficina } from "@/types/atendimento";
import type { Produto } from "@/types/produto";
import { parseQuantidade } from "@/utils/produtoEstoque";
import {
  Backdrop,
  Body,
  BtnOutline,
  BtnPrimary,
  Erro,
  Field,
  Footer,
  Header,
  Hint,
  ListaProdutos,
  Modal,
  OpcaoBtn,
  PerguntaRow,
  ProdutoItem,
} from "./ServicoAdicionalModal.styles";

export type ServicoAdicionalModalResult = {
  teveServicoAdicional: boolean;
  servicoAdicional?: ServicoAdicionalOficina;
};

export type ServicoAdicionalModalProps = {
  open: boolean;
  ordem: OrdemServico | null;
  onConfirm: (result: ServicoAdicionalModalResult) => void;
  onCancel: () => void;
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function ServicoAdicionalModal({
  open,
  ordem,
  onConfirm,
  onCancel,
}: ServicoAdicionalModalProps) {
  const { produtos } = useProdutos();
  const [resposta, setResposta] = useState<"sim" | "nao" | null>(null);
  const [busca, setBusca] = useState("");
  const [produtoSel, setProdutoSel] = useState<Produto | null>(null);
  const [servicoRealizado, setServicoRealizado] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (open) {
      setResposta(null);
      setBusca("");
      setProdutoSel(null);
      setServicoRealizado("");
      setErro("");
    }
  }, [open, ordem?.id]);

  const produtosEstoque = useMemo(() => {
    const t = busca.trim().toLowerCase();
    return produtos
      .filter((p) => p.ativo && parseQuantidade(p.quantidade) > 0)
      .filter(
        (p) =>
          !t ||
          p.produto.toLowerCase().includes(t) ||
          p.codigo.toLowerCase().includes(t),
      )
      .sort((a, b) => a.produto.localeCompare(b.produto, "pt-BR"));
  }, [produtos, busca]);

  if (!open || !ordem) return null;

  const confirmar = () => {
    setErro("");
    if (resposta === null) {
      setErro("Informe se houve serviço adicional.");
      return;
    }
    if (resposta === "nao") {
      onConfirm({ teveServicoAdicional: false });
      return;
    }
    if (!produtoSel) {
      setErro("Selecione um item do estoque.");
      return;
    }
    const texto = servicoRealizado.trim() || produtoSel.produto;
    onConfirm({
      teveServicoAdicional: true,
      servicoAdicional: {
        produtoId: produtoSel.id,
        produtoCodigo: produtoSel.codigo,
        produtoNome: produtoSel.produto,
        servicoRealizado: texto,
        registradoEm: todayIso(),
      },
    });
  };

  const selecionarProduto = (p: Produto) => {
    setProdutoSel(p);
    if (!servicoRealizado.trim()) {
      setServicoRealizado(p.produto);
    }
  };

  return (
    <Backdrop onClick={onCancel}>
      <Modal onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <Header>
          <h2>Avançar serviço</h2>
          <p>
            <strong>{ordem.servicoNaMoto}</strong> — {ordem.clienteNome}
            <br />
            Houve serviço ou peça adicional além do solicitado?
          </p>
        </Header>
        <Body>
          <PerguntaRow>
            <OpcaoBtn
              type="button"
              $ativo={resposta === "sim"}
              onClick={() => setResposta("sim")}
            >
              Sim
            </OpcaoBtn>
            <OpcaoBtn
              type="button"
              $ativo={resposta === "nao"}
              onClick={() => setResposta("nao")}
            >
              Não
            </OpcaoBtn>
          </PerguntaRow>

          {resposta === "nao" && (
            <Hint>
              Sem serviço extra: a ordem segue direto para{" "}
              <strong>Requisições</strong> (em atendimento), onde o mecânico
              conclui e informa o valor.
            </Hint>
          )}

          {resposta === "sim" && (
            <>
              <Field>
                Buscar no estoque
                <input
                  type="search"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Nome ou código do produto"
                />
              </Field>
              <ListaProdutos>
                {produtosEstoque.length === 0 ? (
                  <li style={{ padding: "0.75rem", color: "#6b7280" }}>
                    Nenhum produto com estoque.
                  </li>
                ) : (
                  produtosEstoque.map((p) => (
                    <ProdutoItem
                      key={p.id}
                      $selected={produtoSel?.id === p.id}
                    >
                      <button type="button" onClick={() => selecionarProduto(p)}>
                        <strong>{p.produto}</strong>
                        <span>
                          {p.codigo} · {p.quantidade} em estoque · {p.valor}
                        </span>
                      </button>
                    </ProdutoItem>
                  ))
                )}
              </ListaProdutos>
              <Field>
                Qual serviço foi feito?
                <textarea
                  value={servicoRealizado}
                  onChange={(e) => setServicoRealizado(e.target.value)}
                  placeholder="Ex.: troca de pastilha dianteira"
                />
              </Field>
            </>
          )}

          {erro && <Erro>{erro}</Erro>}
        </Body>
        <Footer>
          <BtnOutline type="button" onClick={onCancel}>
            Cancelar
          </BtnOutline>
          <BtnPrimary
            type="button"
            onClick={confirmar}
            disabled={resposta === "sim" && !produtoSel}
          >
            Avançar
          </BtnPrimary>
        </Footer>
      </Modal>
    </Backdrop>
  );
}
