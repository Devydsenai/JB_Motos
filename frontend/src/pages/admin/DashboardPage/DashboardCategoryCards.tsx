import { Icon } from "@components/atoms/Icon";
import type { CategoriaLoja } from "@/data/mockDashboard";
import {
  CategoryCard,
  CategoryCardHeader,
  CategoryCardLabel,
  CategoryGrid,
  CategoryHint,
  CategoryIconWrap,
  CategoryPercent,
  CategoryValue,
} from "./DashboardPage.styles";

type Props = {
  categorias: CategoriaLoja[];
};

export function DashboardCategoryCards({ categorias }: Props) {
  return (
    <CategoryGrid>
      {categorias.map((cat) => (
        <CategoryCard key={cat.id} $accent={cat.cor}>
          <CategoryCardHeader>
            <CategoryCardLabel>{cat.label}</CategoryCardLabel>
            <CategoryIconWrap $accent={cat.cor}>
              <Icon name={cat.icon} size={18} color={cat.cor} />
            </CategoryIconWrap>
          </CategoryCardHeader>
          <CategoryValue>{cat.valor}</CategoryValue>
          <CategoryPercent $accent={cat.cor}>
            {cat.percentual}% do total
          </CategoryPercent>
          {cat.hint && <CategoryHint>{cat.hint}</CategoryHint>}
        </CategoryCard>
      ))}
    </CategoryGrid>
  );
}
