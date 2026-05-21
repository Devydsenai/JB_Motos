import type { FormEvent } from "react";
import { MotoForm } from "./MotoCliente.styles";

type MotoClienteProps = {
  onSubmit: () => void;
  onCancel: () => void;
};

const STORAGE_MOTOS = "jb-motos-client-motos";

export function MotoCliente({ onSubmit, onCancel }: MotoClienteProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const imagem = formData.get("imagem");
    const moto = {
      modelo: String(formData.get("modelo") ?? ""),
      marca: String(formData.get("marca") ?? ""),
      placa: String(formData.get("placa") ?? ""),
      id: String(formData.get("id") ?? ""),
    };

    const saveMoto = (imagemData?: string) => {
      const motoComImagem = imagemData ? { ...moto, imagem: imagemData } : moto;

      try {
        const raw = localStorage.getItem(STORAGE_MOTOS);
        const motos = raw ? JSON.parse(raw) : [];
        const next = Array.isArray(motos)
          ? [...motos, motoComImagem]
          : [motoComImagem];
        localStorage.setItem(STORAGE_MOTOS, JSON.stringify(next));
      } catch {
        localStorage.setItem(STORAGE_MOTOS, JSON.stringify([motoComImagem]));
      }

      onSubmit();
    };

    if (imagem instanceof File && imagem.size > 0) {
      const reader = new FileReader();
      reader.onload = () => saveMoto(String(reader.result ?? ""));
      reader.onerror = () => saveMoto();
      reader.readAsDataURL(imagem);
      return;
    }

    saveMoto();
  };

  return (
    <MotoForm onSubmit={handleSubmit}>
      <label>
        Modelo da moto *
        <input name="modelo" type="text" required placeholder="Ex.: Honda CG 160" />
      </label>
      <label>
        Marca da moto *
        <input name="marca" type="text" required placeholder="Ex.: Honda" />
      </label>
      <label>
        Placa da moto *
        <input name="placa" type="text" required placeholder="Ex.: ABC1D23" />
      </label>
      <label>
        ID da moto *
        <input name="id" type="text" required placeholder="Ex.: MOTO-001" />
      </label>
      <label>
        Imagem da moto
        <input name="imagem" type="file" accept="image/*" />
      </label>
      <div>
        <button type="submit">Registrar moto</button>
        <button type="button" onClick={onCancel}>
          Cadastrar depois
        </button>
      </div>
    </MotoForm>
  );
}
