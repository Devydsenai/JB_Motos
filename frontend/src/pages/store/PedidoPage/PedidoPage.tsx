import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Button } from "@components/atoms/Button";
import { Text } from "@components/atoms/Text";


// STYLED COMPONENTS 


const PageWrapper = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem 1rem 4rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  font-family: 'Inter', 'Montserrat', sans-serif;
`;

const HeaderArea = styled.div`
  border-left: 4px solid #C41E1E;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const FormCard = styled.form`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border || "rgba(255,255,255,0.05)"};
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.textMuted || "#8a8f98"};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.85rem 1rem;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border || "rgba(255,255,255,0.1)"};
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #C41E1E;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.85rem 1rem;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border || "rgba(255,255,255,0.1)"};
  border-radius: 6px;
  font-size: 0.95rem;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #C41E1E;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const SuccessOverlay = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
`;

const SuccessIcon = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(196, 30, 30, 0.1);
  border: 2px solid #C41E1E;
  color: #C41E1E;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: bold;
`;


// COMPONENTE PRINCIPAL

export function PedidoPage() {
  const navigate = useNavigate();
  const [enviado, setEnviado] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    whatsapp: "",
    modeloMoto: "",
    placa: "",
    descricao: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simula o salvamento e abertura da OS na esteira da Scorpion Serviços LTDA
    setEnviado(true);
  };

  if (enviado) {
    return (
      <PageWrapper>
        <SuccessOverlay>
          <SuccessIcon>✓</SuccessIcon>
          <div>
            <Text as="h3" style={{ fontSize: "1.5rem", fontWeight: 800, textTransform: "uppercase", margin: 0 }}>
              Solicitação Registrada!
            </Text>
            <Text as="p" style={{ fontSize: "0.95rem", opacity: 0.7, marginTop: "0.5rem" }}>
              Sua Ordem de Serviço pré-cadastrada foi enviada para a triagem da **JB Motos**. 
              Em breve entraremos em contato via WhatsApp para confirmar o orçamento.
            </Text>
          </div>
          <Button variant="primary" style={{ background: "#C41E1E", borderColor: "#C41E1E" }} onClick={() => navigate("/loja")}>
            Voltar para a Vitrine
          </Button>
        </SuccessOverlay>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      
      <HeaderArea>
        <Text as="h2" style={{ fontSize: "1.75rem", fontWeight: 800, textTransform: "uppercase", margin: 0 }}>
          Solicitar Atendimento
        </Text>
        <Text as="p" style={{ fontSize: "0.95rem", opacity: 0.6, margin: 0 }}>
          Preencha os dados da sua motocicleta para pré-cadastrar sua Ordem de Serviço digital.
        </Text>
      </HeaderArea>

      <FormCard onSubmit={handleSubmit}>
        
        <Row>
          <FormGroup>
            <Label htmlFor="nome">Seu Nome Completo</Label>
            <Input 
              id="nome"
              name="nome"
              type="text" 
              required 
              placeholder="Ex: João Silva" 
              value={formData.nome}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="whatsapp">WhatsApp / Telefone</Label>
            <Input 
              id="whatsapp"
              name="whatsapp"
              type="tel" 
              required 
              placeholder="Ex: (81) 99999-0000" 
              value={formData.whatsapp}
              onChange={handleChange}
            />
          </FormGroup>
        </Row>

        <Row>
          <FormGroup>
            <Label htmlFor="modeloMoto">Modelo da Moto & Cilindrada</Label>
            <Input 
              id="modeloMoto"
              name="modeloMoto"
              type="text" 
              required 
              placeholder="Ex: Honda CB 500F" 
              value={formData.modeloMoto}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="placa">Placa (Opcional)</Label>
            <Input 
              id="placa"
              name="placa"
              type="text" 
              placeholder="Ex: ABC-1234" 
              value={formData.placa}
              onChange={handleChange}
            />
          </FormGroup>
        </Row>

        <FormGroup>
          <Label htmlFor="descricao">O que sua moto está apresentando? (Problema ou Revisão)</Label>
          <TextArea 
            id="descricao"
            name="descricao"
            required
            placeholder="Descreva detalhadamente os sintomas, barulhos ou peças que deseja trocar..." 
            value={formData.descricao}
            onChange={handleChange}
          />
        </FormGroup>

        <div style={{ marginTop: "0.5rem" }}>
          <Button 
            type="submit" 
            fullWidth 
            style={{ background: "#C41E1E", border: "1px solid #C41E1E", fontWeight: 700, padding: "1rem" }}
          >
            ENVIAR SOLICITAÇÃO PARA A TRIAGEM
          </Button>
        </div>

      </FormCard>

    </PageWrapper>
  );
}