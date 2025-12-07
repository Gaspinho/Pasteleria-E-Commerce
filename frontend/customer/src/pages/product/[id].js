import { MostViewed } from "components/shared/MostViewed/MostViewed";
import { ProductDetails } from "components/Product/ProductDetails/ProductDetails";

const { PublicLayout } = require("layout/PublicLayout");

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
const SingleProductPage = () => {
  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Ordenar Pastel">
      <ProductDetails />
    </PublicLayout>
  );
};

export default SingleProductPage;
