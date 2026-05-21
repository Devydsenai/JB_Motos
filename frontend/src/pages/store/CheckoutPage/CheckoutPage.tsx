import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@components/atoms/Icon";
import type { CartItem } from "../lojaTypes";
import {
  CheckLine,
  DisabledBox,
  FieldGrid,
  FieldStack,
  FormArea,
  Input,
  Layout,
  Page,
  PaymentBody,
  PaymentBox,
  PaymentHead,
  PayNow,
  PixBox,
  PixQr,
  Select,
  SectionHeader,
  Summary,
  SummaryItem,
  Top,
  TotalLine,
} from "./CheckoutPage.styles";

const STORAGE_CART = "jb-motos-store-cart";
const STORAGE_CLIENT_SESSION = "jb-motos-client-session";

const countries = [
  "Brasil",
  "Argentina",
  "Bolívia",
  "Canadá",
  "Chile",
  "Colômbia",
  "Estados Unidos",
  "México",
  "Paraguai",
  "Peru",
  "Portugal",
  "Uruguai",
];

const brazilStates = [
  "Acre",
  "Alagoas",
  "Amapá",
  "Amazonas",
  "Bahia",
  "Ceará",
  "Distrito Federal",
  "Espírito Santo",
  "Goiás",
  "Maranhão",
  "Mato Grosso",
  "Mato Grosso do Sul",
  "Minas Gerais",
  "Pará",
  "Paraíba",
  "Paraná",
  "Pernambuco",
  "Piauí",
  "Rio de Janeiro",
  "Rio Grande do Norte",
  "Rio Grande do Sul",
  "Rondônia",
  "Roraima",
  "Santa Catarina",
  "São Paulo",
  "Sergipe",
  "Tocantins",
];

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_CART);
    const parsed = raw ? (JSON.parse(raw) as CartItem[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parsePrice(price: string) {
  const normalized = price.replace(/[^\d,]/g, "").replace(",", ".");
  return Number(normalized) || 0;
}

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function CheckoutPage() {
  const [payment, setPayment] = useState<"card" | "pix">("card");
  const [cardMode, setCardMode] = useState<"credit" | "debit">("credit");
  const clientLogged = Boolean(localStorage.getItem(STORAGE_CLIENT_SESSION));
  const items = readCart();
  const total = items.reduce(
    (sum, item) => sum + parsePrice(item.price) * item.quantity,
    0,
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.alert(
      payment === "pix"
        ? "Pedido criado. O QR Code PIX será integrado com o Mercado Pago."
        : "Pedido criado. O pagamento por cartão será integrado com o Mercado Pago.",
    );
  };

  return (
    <Page>
      <Top>
        <Link to="/loja">JB Motos</Link>
        <Link to="/loja/carrinho" aria-label="Voltar para o carrinho">
          <Icon name="bag" size={20} color="currentColor" />
        </Link>
      </Top>
      <Layout>
        <FormArea onSubmit={handleSubmit}>
          <section>
            <SectionHeader>
              <h2>Contato</h2>
              {!clientLogged && <Link to="/loja/minha-conta">Entrar</Link>}
            </SectionHeader>
            <Input type="email" required placeholder="E-mail ou telefone *" />
            <CheckLine>
              <input type="checkbox" /> Envie novidades e ofertas para mim
            </CheckLine>
          </section>

          <section>
            <h2>Entrega</h2>
            <FieldStack>
              <Select defaultValue="Brasil">
                {countries.map((country) => (
                  <option key={country}>{country}</option>
                ))}
              </Select>
              <FieldGrid>
                <Input placeholder="Nome" />
                <Input required placeholder="Sobrenome *" />
              </FieldGrid>
              <Input required placeholder="CEP *" />
              <Input required placeholder="Endereço *" />
              <Input placeholder="Apartamento, suíte, etc. (opcional)" />
              <FieldGrid>
                <Input required placeholder="Cidade *" />
                <Select defaultValue="Pernambuco">
                  {brazilStates.map((state) => (
                    <option key={state}>{state}</option>
                  ))}
                </Select>
              </FieldGrid>
              <CheckLine>
                <input type="checkbox" /> Salvar estas informações para a próxima compra
              </CheckLine>
            </FieldStack>
          </section>

          <section>
            <h2>Forma de envio</h2>
            <DisabledBox>
              Informe seu endereço para visualizar retirada, entrega ou motoboy.
            </DisabledBox>
          </section>

          <section>
            <h2>Pagamento</h2>
            <p>Todas as transações serão protegidas e integradas ao Mercado Pago.</p>
            <PaymentBox>
              <PaymentHead>
                <CheckLine>
                  <input
                    type="radio"
                    checked={payment === "card"}
                    onChange={() => setPayment("card")}
                  />
                  Cartão de crédito
                </CheckLine>
                <strong>MP</strong>
              </PaymentHead>
              {payment === "card" && (
                <PaymentBody>
                  <FieldGrid>
                    <CheckLine>
                      <input
                        type="radio"
                        name="card-mode"
                        checked={cardMode === "credit"}
                        onChange={() => setCardMode("credit")}
                      />
                      Crédito
                    </CheckLine>
                    <CheckLine>
                      <input
                        type="radio"
                        name="card-mode"
                        checked={cardMode === "debit"}
                        onChange={() => setCardMode("debit")}
                      />
                      Débito
                    </CheckLine>
                  </FieldGrid>
                  <Input required placeholder="Número do cartão *" />
                  <FieldGrid>
                    <Input required placeholder="Validade (MM / AA) *" />
                    <Input required placeholder="Código de segurança *" />
                  </FieldGrid>
                  <Input required placeholder="Nome no cartão *" />
                </PaymentBody>
              )}
              <PaymentHead>
                <CheckLine>
                  <input
                    type="radio"
                    checked={payment === "pix"}
                    onChange={() => setPayment("pix")}
                  />
                  PIX
                </CheckLine>
                <strong>QR</strong>
              </PaymentHead>
              {payment === "pix" && (
                <PaymentBody>
                  <PixBox>
                    <PixQr aria-label="QR Code PIX demonstrativo" />
                    <div>
                      <p>
                        Escaneie o QR Code PIX para pagar. Na integração final,
                        esse código será gerado pelo Mercado Pago.
                      </p>
                      <Input
                        readOnly
                        value="00020126580014BR.GOV.BCB.PIX0136JB-MOTOS-PIX-DEMONSTRATIVO"
                        aria-label="Código PIX copia e cola"
                      />
                    </div>
                  </PixBox>
                </PaymentBody>
              )}
            </PaymentBox>
          </section>

          <section>
            <h2>Endereço de cobrança</h2>
            <FieldStack>
              <Select defaultValue="Pernambuco" aria-label="Estado do endereço de cobrança">
                {brazilStates.map((state) => (
                  <option key={state}>{state}</option>
                ))}
              </Select>
              <FieldGrid>
                <Input placeholder="Nome" />
                <Input required placeholder="Sobrenome *" />
              </FieldGrid>
              <Input required placeholder="CEP *" />
              <Input required placeholder="Endereço *" />
              <Input placeholder="Apartamento, suíte, etc. (opcional)" />
              <FieldGrid>
                <Input required placeholder="Cidade *" />
                <Select defaultValue="Pernambuco">
                  {brazilStates.map((state) => (
                    <option key={state}>{state}</option>
                  ))}
                </Select>
              </FieldGrid>
            </FieldStack>
          </section>

          <PayNow type="submit">Pagar agora</PayNow>
          <p>Todos os direitos reservados JB Motos</p>
        </FormArea>

        <Summary>
          {items.map((item) => (
            <SummaryItem key={item.id}>
              <img src={item.image} alt={item.name} />
              <h3>
                {item.name}
                <br />
                Quantidade: {item.quantity}
              </h3>
              <span>{formatPrice(parsePrice(item.price) * item.quantity)}</span>
            </SummaryItem>
          ))}
          <TotalLine>
            <span>Subtotal</span>
            <span>{formatPrice(total)}</span>
          </TotalLine>
          <TotalLine>
            <span>Envio</span>
            <span>Informe o endereço</span>
          </TotalLine>
          <TotalLine>
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </TotalLine>
        </Summary>
      </Layout>
    </Page>
  );
}
