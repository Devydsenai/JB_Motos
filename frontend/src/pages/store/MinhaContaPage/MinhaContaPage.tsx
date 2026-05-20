import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Button } from "@components/atoms/Button";
import { Text } from "@components/atoms/Text";


// STYLED COMPONENTS


const PageWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 8% 5rem 8%;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  font-family: 'Inter', 'Montserrat', sans-serif;
`;

const HeaderArea = styled.div`
  border-left: 4px solid #C41E1E;
  padding-left: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
`;

const ProfileSidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const AccountCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border || "rgba(255,255,255,0.05)"};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const UserAvatarBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 1.5rem;
`;

const InitialCircle = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #C41E1E 0%, #8a1313 100%);
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 800;
`;

const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1.25rem;
`;

const Label = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.textMuted || "#8a8f98"};
`;

const Value = styled.p`
  font-size: 0.95rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

const VehicleTag = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 1rem;
  margin-top: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MainContentArea = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const OsCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border || "rgba(255,255,255,0.05)"};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: rgba(196, 30, 30, 0.3);
  }
`;

const OsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const StatusBadge = styled.span<{ $status: "analise" | "execucao" | "concluido" }>`
  padding: 0.35rem 0.8rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 4px;
  
  ${({ $status }) => $status === "analise" && "background: rgba(234, 179, 8, 0.1); color: #eab308; border: 1px solid rgba(234, 179, 8, 0.2);"}
  ${({ $status }) => $status === "execucao" && "background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.2);"}
  ${({ $status }) => $status === "concluido" && "background: rgba(34, 197, 94, 0.1); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.2);"}
`;

const OsDetailsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
`;

// MOCKS DE DADOS DO CLIENTE (Simulação do Banco de Dados)

const CLIENTE_MOCK = {
  nome: "Rodrigo Alencar",
  email: "rodrigo.alencar@email.com",
  whatsapp: "(81) 99876-5432",
  cadastroDesde: "Janeiro de 2026",
  moto: {
    modelo: "Honda CB 650R Neo Sports Café",
    placa: "KGB-7E90"
  }
};

interface OrdemServico {
  id: string;
  data: string;
  status: "analise" | "execucao" | "concluido";
  servico: string;
  moto: string;
  valor: string;
  observacao: string;
}

const HISTORICO_OS: OrdemServico[] = [
  {
    id: "OS-2026-8942",
    data: "20/05/2026",
    status: "analise",
    servico: "Troca Preventiva de Lubrificantes Premium & Filtro",
    moto: "Honda CB 650R",
    valor: "R$ 189,90",
    observacao: "Aguardando aprovação técnica do cruzamento de insumos Scorpion."
  },
  {
    id: "OS-2026-7511",
    data: "12/04/2026",
    status: "concluido",
    servico: "Revisão e Sangria do Sistema de Freios ABS",
    moto: "Honda CB 650R",
    valor: "R$ 140,00",
    observacao: "Pastilhas substituídas e óleo de freio DOT 5.1 aplicado com sucesso."
  }
];

export function MinhaContaPage() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      
      {/* HEADER DA PÁGINA */}
      <HeaderArea>
        <div>
          <Text as="h2" style={{ fontSize: "1.75rem", fontWeight: 800, textTransform: "uppercase", margin: 0, letterSpacing: "0.02em" }}>
            Painel do Cliente
          </Text>
          <Text as="p" style={{ fontSize: "0.95rem", opacity: 0.6, margin: 0 }}>
            Acompanhe suas motos registradas e o status em tempo real de suas Ordens de Serviço.
          </Text>
        </div>
        <Button variant="outline" style={{ borderColor: "#C41E1E", fontWeight: 600 }} onClick={() => navigate("/loja/pedido")}>
          Nova Solicitação de OS
        </Button>
      </HeaderArea>

      {/* DASHBOARD  */}
      <DashboardGrid>
        
        {/* COLUNA ESQUERDA: PERFIL E VEÍCULO */}
        <ProfileSidebar>
          <AccountCard>
            <UserAvatarBlock>
              <InitialCircle>{CLIENTE_MOCK.nome.charAt(0)}</InitialCircle>
              <div>
                <Text as="h3" style={{ fontWeight: 700, fontSize: "1.2rem", margin: 0 }}>
                  {CLIENTE_MOCK.nome}
                </Text>
                <Text as="span" style={{ fontSize: "0.8rem", opacity: 0.5 }}>
                  Cliente desde {CLIENTE_MOCK.cadastroDesde}
                </Text>
              </div>
            </UserAvatarBlock>

            <InfoGroup>
              <Label>E-mail</Label>
              <Value>{CLIENTE_MOCK.email}</Value>
            </InfoGroup>

            <InfoGroup>
              <Label>WhatsApp Cadastrado</Label>
              <Value>{CLIENTE_MOCK.whatsapp}</Value>
            </InfoGroup>
          </AccountCard>

          <AccountCard>
            <Text as="h3" style={{ fontSize: "0.9rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 1rem 0" }}>
              Sua Garagem
            </Text>
            <Text as="p" style={{ fontSize: "0.85rem", opacity: 0.6, margin: 0 }}>
              Motocicletas vinculadas à sua conta:
            </Text>
            
            <VehicleTag>
              <div>
                <Text as="p" style={{ fontWeight: 700, fontSize: "0.9rem", margin: 0 }}>
                  {CLIENTE_MOCK.moto.modelo}
                </Text>
                <Text as="span" style={{ fontSize: "0.75rem", opacity: 0.5, fontFamily: "monospace" }}>
                  PLACA: {CLIENTE_MOCK.moto.placa}
                </Text>
              </div>
              <span style={{ fontSize: "0.65rem", background: "rgba(34, 197, 94, 0.1)", color: "#22c55e", padding: "0.2rem 0.5rem", borderRadius: "4px", fontWeight: 700 }}>
                ATIVA
              </span>
            </VehicleTag>
          </AccountCard>
        </ProfileSidebar>

        {/* COLUNA DIREITA: HISTÓRICO DE ORDENS DE SERVIÇO */}
        <MainContentArea>
          <Text as="h3" style={{ fontSize: "1.25rem", fontWeight: 800, textTransform: "uppercase", margin: 0, letterSpacing: "0.02em" }}>
            Histórico de OS
          </Text>

          {HISTORICO_OS.map((os) => (
            <OsCard key={os.id}>
              <OsHeader>
                <div>
                  <Text as="span" style={{ fontFamily: "monospace", fontSize: "0.95rem", fontWeight: 700, color: "#C41E1E" }}>
                    {os.id}
                  </Text>
                  <Text as="span" style={{ fontSize: "0.85rem", opacity: 0.4, marginLeft: "1rem" }}>
                    Abertura: {os.data}
                  </Text>
                </div>
                <StatusBadge $status={os.status}>
                  {os.status === "analise" ? "Em Triagem / Análise" : os.status === "execucao" ? "Na Bancada" : "Concluído"}
                </StatusBadge>
              </OsHeader>

              <OsDetailsRow>
                <InfoGroup>
                  <Label>Serviço / Item Solicitado</Label>
                  <Value style={{ fontWeight: 600 }}>{os.servico}</Value>
                </InfoGroup>

                <InfoGroup>
                  <Label>Veículo</Label>
                  <Value>{os.moto}</Value>
                </InfoGroup>

                <InfoGroup>
                  <Label>Custo Estimado</Label>
                  <Value style={{ color: "#C41E1E", fontWeight: 700 }}>{os.valor}</Value>
                </InfoGroup>
              </OsDetailsRow>

              <div style={{ background: "rgba(0,0,0,0.02)", padding: "1rem", borderRadius: "6px", borderLeft: "3px solid #666" }}>
                <Label style={{ display: "block", marginBottom: "0.25rem" }}>Observações Técnicas</Label>
                <Text as="p" style={{ fontSize: "0.85rem", opacity: 0.7, margin: 0, lineHeight: 1.5 }}>
                  {os.observacao}
                </Text>
              </div>
            </OsCard>
          ))}
        </MainContentArea>

      </DashboardGrid>

    </PageWrapper>
  );
}