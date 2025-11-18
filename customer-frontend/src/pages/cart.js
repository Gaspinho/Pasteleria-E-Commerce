import { Cart } from 'components/Cart/Cart';
import { PublicLayout } from 'layout/PublicLayout';

const breadcrumbsData = [
  {
    label: 'Inicio',
    path: '/',
  },
  {
    label: 'Carrito',
    path: '/cart',
  },
];
const CartPage = () => {
  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle='Carrito'>
      <Cart />
    </PublicLayout>
  );
};

export default CartPage;
