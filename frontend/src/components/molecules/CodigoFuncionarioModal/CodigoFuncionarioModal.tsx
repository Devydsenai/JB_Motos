import { useEffect, useRef, useState, type FormEvent } from "react";
import { useFuncionarios } from "@/contexts/FuncionariosContext";
import { perfilFuncionarioLabels } from "@/config/permissoes";
import type { Funcionario, PerfilFuncionario } from "@/types/funcionario";
import {
  isCodigoServicoValido,
  normalizarCodigoServico,
} from "@/utils/funcionarioCodigo";
import {
  Backdrop,
  Body,
  BtnOutline,
  BtnPrimary,
  BtnPularAdmin,
  DicaTeste,
  Erro,
  Footer,
  FooterActions,
  Header,
  Modal,
} from "./CodigoFuncionarioModal.styles";

export type CodigoFuncionarioModalProps = {
  open: boolean;
  titulo: string;
  descricao: string;
  perfis: PerfilFuncionario[];
  onConfirm: (funcionario: Funcionario) => void;
  onCancel: () => void;
  /** Texto do campo (ex.: "Código do atendente" no modo administrador) */
  rotuloCampo?: string;
  /** Dica de códigos de teste exibida abaixo do campo */
  dicaTeste?: string;
  /** Dono pode registrar a ação sem código de funcionário */
  permitirPularComoAdmin?: boolean;
  onPularComoAdmin?: () => void;
  rotuloPularAdmin?: string;
};

export function CodigoFuncionarioModal({
  open,
  titulo,
  descricao,
  perfis,
  onConfirm,
  onCancel,
  rotuloCampo = "Seu código de serviço",
  dicaTeste,
  permitirPularComoAdmin = false,
  onPularComoAdmin,
  rotuloPularAdmin = "Continuar como administrador (sem código)",
}: CodigoFuncionarioModalProps) {
  const { buscarPorCodigoServico } = useFuncionarios();
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setCodigo("");
      setErro("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  const validar = (event: FormEvent) => {
    event.preventDefault();
    setErro("");

    if (!isCodigoServicoValido(codigo)) {
      setErro("Informe um código de 4 a 6 dígitos.");
      return;
    }

    const funcionario = buscarPorCodigoServico(codigo, perfis);
    if (!funcionario) {
      const qualquer = buscarPorCodigoServico(codigo);
      if (qualquer && perfis.length > 0 && !perfis.includes(qualquer.perfil)) {
        setErro(
          `Este código é de outro perfil. Use um código de ${perfis.map((p) => perfilFuncionarioLabels[p]).join(" ou ")}.`,
        );
      } else {
        setErro(
          "Código não encontrado. Use os de teste abaixo ou cadastre em Administrativo → CRH.",
        );
      }
      return;
    }

    if (!funcionario.ativo) {
      setErro("Funcionário inativo no cadastro (CRH).");
      return;
    }

    onConfirm(funcionario);
  };

  return (
    <Backdrop onClick={onCancel}>
      <Modal onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <Header>
          <h2>{titulo}</h2>
          <p>{descricao}</p>
        </Header>
        <form onSubmit={validar}>
          <Body>
            <label htmlFor="codigo-funcionario">{rotuloCampo}</label>
            <input
              ref={inputRef}
              id="codigo-funcionario"
              type="text"
              inputMode="numeric"
              maxLength={6}
              autoComplete="off"
              placeholder="••••"
              value={codigo}
              onChange={(e) =>
                setCodigo(normalizarCodigoServico(e.target.value))
              }
            />
            {dicaTeste && <DicaTeste>{dicaTeste}</DicaTeste>}
            {erro && <Erro>{erro}</Erro>}
          </Body>
          <Footer>
            {permitirPularComoAdmin && onPularComoAdmin && (
              <BtnPularAdmin type="button" onClick={onPularComoAdmin}>
                {rotuloPularAdmin}
              </BtnPularAdmin>
            )}
            <FooterActions>
              <BtnOutline type="button" onClick={onCancel}>
                Cancelar
              </BtnOutline>
              <BtnPrimary type="submit" disabled={codigo.length < 4}>
                Confirmar
              </BtnPrimary>
            </FooterActions>
          </Footer>
        </form>
      </Modal>
    </Backdrop>
  );
}
