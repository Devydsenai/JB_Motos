import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@components/atoms/Icon";
import { criarCheckoutMercadoPago } from "@/services/mercadoPagoCheckout";
import { savePendingPurchase } from "@/utils/storePurchaseHistory";
import type { CartItem } from "../lojaTypes";
import {
  CheckLine,
  DisabledBox,
  FieldGrid,
  FieldStack,
  FormArea,
  Input,
  Layout,
  MercadoPagoOnly,
  Page,
  PaymentBox,
  PayNow,
  Select,
  SectionHeader,
  Summary,
  SummaryItem,
  TestModeNotice,
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

const isDevCheckout =
  import.meta.env.DEV || import.meta.env.VITE_MERCADO_PAGO_TEST_MODE === "true";

export function CheckoutPage() {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [testMode, setTestMode] = useState(isDevCheckout);
  const clientLogged = Boolean(localStorage.getItem(STORAGE_CLIENT_SESSION));
  const items = readCart();
  const total = items.reduce(
    (sum, item) => sum + parsePrice(item.price) * item.quantity,
    0,
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (items.length === 0) {
      window.alert("Seu carrinho está vazio.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const nome = String(formData.get("nome") ?? "").trim() || "Cliente";
    const sobrenome = String(formData.get("sobrenome") ?? "").trim() || "Teste";
    const contato = String(formData.get("contato") ?? "").trim();
    const email =
      contato.includes("@")
        ? contato
        : testMode
          ? "test_user@testuser.com"
          : undefined;

    setCheckoutLoading(true);
    try {
      const preference = await criarCheckoutMercadoPago({
        items,
        payer: {
          name: nome,
          surname: sobrenome,
          email,
        },
      });

      setTestMode(Boolean(preference.testMode ?? testMode));

      const checkoutUrl =
        preference.init_point ??
        preference.sandbox_init_point ??
        preference.link;
      if (!checkoutUrl) {
        throw new Error("Mercado Pago não retornou init_point.");
      }

      savePendingPurchase({
        items,
        total,
        preferenceId: preference.id,
        externalReference: preference.external_reference,
      });

      window.location.href = checkoutUrl;
    } catch (err) {
      window.alert(
        err instanceof Error
          ? err.message
          : "Não foi possível abrir o checkout do Mercado Pago.",
      );
    } finally {
      setCheckoutLoading(false);
    }
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
            <Input
              name="contato"
              type="email"
              required={!isDevCheckout}
              placeholder={
                isDevCheckout
                  ? "E-mail (opcional em teste — padrão test_user@testuser.com)"
                  : "E-mail ou telefone *"
              }
            />
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
                <Input name="nome" placeholder="Nome" />
                <Input
                  name="sobrenome"
                  required={!isDevCheckout}
                  placeholder={isDevCheckout ? "Sobrenome (opcional)" : "Sobrenome *"}
                />
              </FieldGrid>
              <Input required={!isDevCheckout} placeholder={isDevCheckout ? "CEP (opcional)" : "CEP *"} />
              <Input required={!isDevCheckout} placeholder={isDevCheckout ? "Endereço (opcional)" : "Endereço *"} />
              <Input placeholder="Apartamento, suíte, etc. (opcional)" />
              <FieldGrid>
                <Input required={!isDevCheckout} placeholder={isDevCheckout ? "Cidade (opcional)" : "Cidade *"} />
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
              <MercadoPagoOnly>
                <strong>Mercado Pago</strong>
                <p>
                  Ao clicar em pagar, você será direcionado para a tela segura do
                  Mercado Pago com <strong>cartão</strong> e <strong>PIX</strong>.
                </p>
                <span>Valor enviado: {formatPrice(total)}</span>
                {(testMode || isDevCheckout) && (
                  <TestModeNotice>
                    <strong>Modo teste (sandbox)</strong>
                    Use o checkout de testes do Mercado Pago — não precisa de cartão
                    ou CPF reais.
                    <ul>
                      <li>
                        <strong>Cartão aprovado:</strong> 5031 4332 1540 6351 · CVV
                        123 · validade 11/30
                      </li>
                      <li>
                        <strong>CPF de teste:</strong> 123.456.789-09 (ou qualquer
                        formato válido no sandbox)
                      </li>
                      <li>
                        <strong>PIX:</strong> escolha PIX na tela do Mercado Pago e
                        simule o pagamento de teste
                      </li>
                    </ul>
                  </TestModeNotice>
                )}
              </MercadoPagoOnly>
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
                <Input
                  required={!isDevCheckout}
                  placeholder={isDevCheckout ? "Sobrenome (opcional)" : "Sobrenome *"}
                />
              </FieldGrid>
              <Input required={!isDevCheckout} placeholder={isDevCheckout ? "CEP (opcional)" : "CEP *"} />
              <Input required={!isDevCheckout} placeholder={isDevCheckout ? "Endereço (opcional)" : "Endereço *"} />
              <Input placeholder="Apartamento, suíte, etc. (opcional)" />
              <FieldGrid>
                <Input required={!isDevCheckout} placeholder={isDevCheckout ? "Cidade (opcional)" : "Cidade *"} />
                <Select defaultValue="Pernambuco">
                  {brazilStates.map((state) => (
                    <option key={state}>{state}</option>
                  ))}
                </Select>
              </FieldGrid>
            </FieldStack>
          </section>

          <PayNow type="submit" disabled={checkoutLoading}>
            {checkoutLoading ? "Abrindo Mercado Pago..." : "Pagar agora"}
          </PayNow>
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
