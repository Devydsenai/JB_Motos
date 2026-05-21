import { Link } from "react-router-dom";
import { Icon } from "@components/atoms/Icon";
import { readStoreAuth } from "@/services/authStorage";

type StoreAccountLinkProps = {
  iconColor?: string;
};

export function StoreAccountLink({ iconColor = "#fff" }: StoreAccountLinkProps) {
  const auth = readStoreAuth();
  const label = auth?.customer.nome?.trim() || "Minha conta";

  return (
    <Link to="/loja/minha-conta">
      <Icon name="person-fill" size={12} color={iconColor} />
      {label}
    </Link>
  );
}
