import { Checkout } from "components/Checkout/Checkout";
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
  {
    label: "Pagar",
    path: "/checkout",
  },
];
const CheckoutPage = () => {
  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Pagar">
      <Checkout />
    </PublicLayout>
  );
};

export default CheckoutPage;
