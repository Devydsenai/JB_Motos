import { useMemo, useState } from "react";

import { Link } from "react-router-dom";

import { StatusBadge } from "@components/molecules/StatusBadge";

import { CodigoFuncionarioModal } from "@components/molecules/CodigoFuncionarioModal";

import {

  ServicoAdicionalModal,

  type ServicoAdicionalModalResult,

} from "@components/molecules/ServicoAdicionalModal";

import { adminRoutes } from "@/config/adminMenu";

import { statusLabels } from "@/data/mockClientes";

import { useAtendimento } from "@/contexts/AtendimentoContext";

import { useSessao } from "@/contexts/SessaoContext";

import type { OrdemServico } from "@/types/atendimento";

import type { Funcionario } from "@/types/funcionario";

import {

  formatarNomeFuncionario,

  formatarRegistroFuncionario,

} from "@/utils/formatFuncionarioRegistro";

import type { StatusSolicitacao } from "@/data/mockClientes";

import {

  ActionGroup,

  ExtrasLista,

  FilterBar,

  FilterBtn,

  OrigemTag,

  Page,

  PageHeader,

  Panel,

  StatusBtn,

  SummaryCard,

  SummaryGrid,

  Table,

} from "./ServicosPage.styles";



type FiltroStatus = "todos" | StatusSolicitacao;



type AvancoStash = {

  ordemId: string;

  result: ServicoAdicionalModalResult;

};



function formatarData(iso: string) {

  return new Date(iso + "T12:00:00").toLocaleDateString("pt-BR");

}



function renderServicosExtras(ordem: OrdemServico) {

  if (ordem.teveServicoAdicionalOficina === false) {

    return <small>Oficina: sem serviço extra</small>;

  }

  if (!ordem.servicosAdicionais?.length) {

    return null;

  }

  return (

    <ExtrasLista>

      {ordem.servicosAdicionais.map((s, i) => (

        <li key={`${s.produtoId}-${i}`}>

          <strong>+ {s.servicoRealizado}</strong>

          <br />

          <small>

            {s.produtoNome} ({s.produtoCodigo})

          </small>

        </li>

      ))}

    </ExtrasLista>

  );

}



export function ServicosPage() {

  const { podePularCodigoFuncionario } = useSessao();

  const {

    ordens,

    atualizarStatusOrdem,

    registrarMecanicoNaOrdem,

    registrarAvancoOficina,

  } = useAtendimento();

  const [filtro, setFiltro] = useState<FiltroStatus>("todos");

  const [ordemAvanco, setOrdemAvanco] = useState<OrdemServico | null>(null);

  const [ordemAssumir, setOrdemAssumir] = useState<OrdemServico | null>(null);

  const [avancoStash, setAvancoStash] = useState<AvancoStash | null>(null);



  const resumo = useMemo(() => {

    const pendente = ordens.filter((o) => o.status === "pendente").length;

    const emEspera = ordens.filter((o) => o.status === "em_espera").length;

    const atendido = ordens.filter((o) => o.status === "atendido").length;

    const concluido = ordens.filter((o) => o.status === "concluido").length;

    return { pendente, emEspera, atendido, concluido, total: ordens.length };

  }, [ordens]);



  const ordensFiltradas = useMemo(() => {

    if (filtro === "todos") return ordens;

    return ordens.filter((o) => o.status === filtro);

  }, [ordens, filtro]);



  const precisaCodigoMecanico = (ordem: OrdemServico) => !ordem.mecanicoCodigo;



  const aplicarAvancoParaRequisicoes = (

    ordem: OrdemServico,

    result: ServicoAdicionalModalResult,

    mecanico?: { codigo: string; nome: string },

  ) => {

    registrarAvancoOficina(ordem.id, {

      teveServicoAdicional: result.teveServicoAdicional,

      servicoAdicional: result.servicoAdicional,

      proximoStatus: "atendido",

    });

    if (mecanico) {

      registrarMecanicoNaOrdem(ordem.id, mecanico);

    }

  };



  const avancarStatus = (ordem: OrdemServico) => {

    if (ordem.status === "pendente" || ordem.status === "em_espera") {

      setOrdemAvanco(ordem);

      return;

    }



    if (ordem.status === "atendido") {

      return;

    }

  };



  const confirmarServicoAdicional = (result: ServicoAdicionalModalResult) => {

    const ordem = ordemAvanco;

    if (!ordem) return;

    setOrdemAvanco(null);



    if (precisaCodigoMecanico(ordem)) {

      setAvancoStash({ ordemId: ordem.id, result });

      setOrdemAssumir(ordem);

      return;

    }



    aplicarAvancoParaRequisicoes(ordem, result);

  };



  const pularCodigoComoAdmin = () => {

    if (avancoStash) {
      const ordem = ordens.find((o) => o.id === avancoStash.ordemId);
      if (ordem) {
        aplicarAvancoParaRequisicoes(ordem, avancoStash.result);
      }
      setAvancoStash(null);

    } else if (ordemAssumir) {

      atualizarStatusOrdem(ordemAssumir.id, "atendido");

    }

    setOrdemAssumir(null);

  };



  const confirmarMecanicoAssumir = (funcionario: Funcionario) => {

    const nome = formatarNomeFuncionario(

      funcionario.nome,

      funcionario.sobrenome,

    );

    const mecanico = {

      codigo: funcionario.codigoServico,

      nome,

    };



    if (avancoStash) {

      const ordem = ordens.find((o) => o.id === avancoStash.ordemId);

      if (ordem) {

        aplicarAvancoParaRequisicoes(ordem, avancoStash.result, mecanico);

      }

      setAvancoStash(null);

    } else if (ordemAssumir) {

      registrarMecanicoNaOrdem(ordemAssumir.id, mecanico);

      atualizarStatusOrdem(ordemAssumir.id, "atendido");

    }



    setOrdemAssumir(null);

  };



  return (

    <Page>

      <PageHeader>

        <h1>Serviços — oficina (mecânico)</h1>

        <p>

          Ordens vindas do balcão (

          <Link to={adminRoutes.cadastroAtendimento}>Atendimento</Link>) e da

          loja online. Ao avançar, informe se houve serviço extra e o código do

          mecânico; a conclusão fica em{" "}

          <Link to={adminRoutes.requisicoes}>Requisições</Link>.

        </p>

      </PageHeader>



      <SummaryGrid>

        <SummaryCard>

          <span>Pendentes</span>

          <strong>{resumo.pendente}</strong>

        </SummaryCard>

        <SummaryCard>

          <span>Em espera</span>

          <strong>{resumo.emEspera}</strong>

        </SummaryCard>

        <SummaryCard>

          <span>Em atendimento</span>

          <strong>{resumo.atendido}</strong>

        </SummaryCard>

        <SummaryCard>

          <span>Concluídos</span>

          <strong>{resumo.concluido}</strong>

        </SummaryCard>

      </SummaryGrid>



      <Panel>

        <FilterBar>

          <FilterBtn

            type="button"

            $active={filtro === "todos"}

            onClick={() => setFiltro("todos")}

          >

            Todos ({resumo.total})

          </FilterBtn>

          {(Object.keys(statusLabels) as StatusSolicitacao[]).map((status) => (

            <FilterBtn

              key={status}

              type="button"

              $active={filtro === status}

              onClick={() => setFiltro(status)}

            >

              {statusLabels[status]}

            </FilterBtn>

          ))}

        </FilterBar>



        <Table>

          <thead>

            <tr>

              <th>Cliente / Moto</th>

              <th>Serviço na moto</th>

              <th>Peça / detalhe</th>

              <th>Estoque</th>

              <th>Data</th>

              <th>Origem / Responsáveis</th>

              <th>Status</th>

              <th>Ações</th>

            </tr>

          </thead>

          <tbody>

            {ordensFiltradas.length === 0 ? (

              <tr>

                <td colSpan={8} style={{ textAlign: "center", color: "#6b7280" }}>

                  Nenhuma ordem neste filtro.

                </td>

              </tr>

            ) : (

              ordensFiltradas.map((ordem) => (

                <tr key={ordem.id}>

                  <td>

                    <strong>{ordem.clienteNome}</strong>

                    <br />

                    <small>

                      {ordem.motoMarca} {ordem.motoModelo}

                    </small>

                  </td>

                  <td>

                    <strong>{ordem.servicoNaMoto}</strong>

                  </td>

                  <td>

                    {ordem.produtoNome && (

                      <>

                        <strong>{ordem.produtoNome}</strong>

                        <br />

                      </>

                    )}

                    <small>{ordem.descricao}</small>

                    {renderServicosExtras(ordem)}

                    {ordem.valorServico && (

                      <>

                        <br />

                        <small>Valor prev.: {ordem.valorServico}</small>

                      </>

                    )}

                    {ordem.observacao && (

                      <>

                        <br />

                        <small>{ordem.observacao}</small>

                      </>

                    )}

                  </td>

                  <td>

                    {ordem.estoqueNoMomento !== undefined

                      ? `${ordem.estoqueNoMomento} un.`

                      : "—"}

                  </td>

                  <td>{formatarData(ordem.solicitadoEm)}</td>

                  <td>

                    <OrigemTag $balcao={ordem.origem === "balcao_atendente"}>

                      {ordem.origem === "balcao_atendente"

                        ? "Balcão"

                        : "Loja online"}

                    </OrigemTag>

                    {ordem.origem === "balcao_atendente" && (

                      <>

                        <br />

                        <small>

                          Atend.:{" "}

                          {formatarRegistroFuncionario(

                            ordem.atendenteCodigo,

                            ordem.atendenteNome ?? ordem.atendente,

                          )}

                        </small>

                      </>

                    )}

                    {ordem.origem === "loja_online" && (

                      <>

                        <br />

                        <small>Online — {ordem.clienteNome}</small>

                      </>

                    )}

                    {ordem.mecanicoCodigo && (

                      <>

                        <br />

                        <small>

                          Mec.:{" "}

                          {formatarRegistroFuncionario(

                            ordem.mecanicoCodigo,

                            ordem.mecanicoNome,

                          )}

                        </small>

                      </>

                    )}

                  </td>

                  <td>

                    <StatusBadge status={ordem.status} />

                  </td>

                  <td>

                    <ActionGroup>

                      {(ordem.status === "pendente" ||

                        ordem.status === "em_espera") && (

                        <StatusBtn

                          type="button"

                          $variant="primary"

                          onClick={() => avancarStatus(ordem)}

                        >

                          Avançar

                        </StatusBtn>

                      )}

                      {ordem.status === "atendido" && (

                        <StatusBtn

                          as={Link}

                          to={adminRoutes.requisicoes}

                          $variant="primary"

                        >

                          Requisições

                        </StatusBtn>

                      )}

                      {ordem.status !== "pendente" &&

                        ordem.status !== "concluido" && (

                          <StatusBtn

                            type="button"

                            onClick={() =>

                              atualizarStatusOrdem(ordem.id, "pendente")

                            }

                          >

                            Pendente

                          </StatusBtn>

                        )}

                    </ActionGroup>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </Table>

      </Panel>



      <ServicoAdicionalModal

        open={ordemAvanco !== null}

        ordem={ordemAvanco}

        onConfirm={confirmarServicoAdicional}

        onCancel={() => setOrdemAvanco(null)}

      />



      <CodigoFuncionarioModal

        open={ordemAssumir !== null}

        titulo="Código do mecânico"

        descricao={

          podePularCodigoFuncionario

            ? "Informe o código do mecânico para registrar quem avançou o serviço — depois a ordem segue para Requisições."

            : "Informe seu código para registrar que você avançou este serviço na oficina."

        }

        rotuloCampo={

          podePularCodigoFuncionario

            ? "Código do mecânico"

            : "Seu código de serviço"

        }

        dicaTeste={

          podePularCodigoFuncionario ? "Teste: 2001 — Carlos (mecânico)" : undefined

        }

        perfis={["mecanico"]}

        permitirPularComoAdmin={podePularCodigoFuncionario}

        onPularComoAdmin={pularCodigoComoAdmin}

        rotuloPularAdmin="Avançar como administrador (sem código)"

        onConfirm={confirmarMecanicoAssumir}

        onCancel={() => {

          setOrdemAssumir(null);

          setAvancoStash(null);

        }}

      />

    </Page>

  );

}

