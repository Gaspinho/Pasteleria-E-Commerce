import productData from "data/product/product";
import { CartContext } from "pages/_app";
import { useContext } from "react";
import { Card } from "./Card/Card";

export const CheckoutOrders = () => {
  const { cart } = useContext(CartContext);
  const total = cart.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0
  );
  console.log(cart)
  return (
    <>
      <div className="checkout-order">
        <h5>Tu Pedido</h5>
        {cart.map((order) => (
          <Card key={order.id} order={order} />
        ))}
      </div>
      <div className="cart-bottom__total">
        <div className="cart-bottom__total-goods">
          Productos
          <span>${total.toLocaleString('es-CL')}</span>
        </div>

        <div className="cart-bottom__total-delivery">
          Entrega{" "}
          {/* <span className="cart-bottom__total-delivery-date">
            (May 16,2022 at 11:30)
          </span> */}
          <span>${(5000).toLocaleString('es-CL')}</span>
        </div>
        <div className="cart-bottom__total-num">
          total:
          <span>${(total + 5000).toLocaleString('es-CL')}</span>
        </div>
      </div>
    </>
  );
};
