import type { CartItem } from "../lojaTypes";
import { Backdrop, Content, Drawer, Empty, Footer, Header, Item } from "./CarrinhoLoja.styles";

type CarrinhoLojaProps = {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
};

export function CarrinhoLoja({
  open,
  items,
  onClose,
  onRemove,
  onCheckout,
}: CarrinhoLojaProps) {
  if (!open) return null;

  return (
    <Backdrop onClick={onClose}>
      <Drawer onClick={(event) => event.stopPropagation()} aria-label="Carrinho">
        <Header>
          <h2>Carrinho</h2>
          <button type="button" onClick={onClose} aria-label="Fechar carrinho">
            ×
          </button>
        </Header>
        <Content>
          {items.length === 0 ? (
            <Empty>Seu carrinho ainda está vazio.</Empty>
          ) : (
            items.map((item) => (
              <Item key={item.id}>
                <img src={item.image} alt={item.name} />
                <div>
                  <h3>{item.name}</h3>
                  <small>Quantidade: {item.quantity}</small>
                  <br />
                  <span>{item.price}</span>
                </div>
                <button type="button" onClick={() => onRemove(item.id)}>
                  Remover
                </button>
              </Item>
            ))
          )}
        </Content>
        <Footer>
          <button type="button" onClick={onCheckout} disabled={items.length === 0}>
            Finalizar pedido
          </button>
        </Footer>
      </Drawer>
    </Backdrop>
  );
}
