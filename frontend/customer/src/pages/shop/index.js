import { Subscribe } from "components/shared/Subscribe/Subscribe";
import { Shop } from "components/Shop/Shop";
import { PublicLayout } from "layout/PublicLayout";

const breadcrumbsData = [
  {
    label: "Inicio",
    path: "/",
  },
  {
    label: "Ordenar Pastel",
    path: "/shop",
  },
];
const ShopPage = () => {
  return (
    <PublicLayout
      breadcrumb={breadcrumbsData}
      breadcrumbTitle="Ordena Tu Pastel"
    >
      <Shop />
    </PublicLayout>
  );
};

export default ShopPage;
