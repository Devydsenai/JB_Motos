import { Link } from "react-router-dom";
import type { LojaProduct } from "../lojaTypes";
import { Actions, Backdrop, CloseBtn, Modal, ProductLine } from "./StoreCartAddedModal.styles";

type StoreCartAddedModalProps = {
  product: LojaProduct | null;
  quantity: number;
  onClose: () => void;
};

export function StoreCartAddedModal({
  product,
  quantity,
  onClose,
}: StoreCartAddedModalProps) {
  if (!product) return null;

  return (
    <Backdrop role="dialog" aria-modal="true" aria-label="Produto adicionado">
      <Modal>
        <CloseBtn type="button" aria-label="Fechar" onClick={onClose}>
          ×
        </CloseBtn>
        <h2>Produto adicionado ao carrinho</h2>
        <ProductLine>
          <img src={product.image} alt={product.name} />
          <div>
            <p>{product.name}</p>
            <span>Quantidade: {quantity}</span>
          </div>
        </ProductLine>
        <Actions>
          <Link to="/loja/carrinho">Ir para o carrinho</Link>
          <button type="button" onClick={onClose}>
            Continue comprando
          </button>
        </Actions>
      </Modal>
    </Backdrop>
  );
}
