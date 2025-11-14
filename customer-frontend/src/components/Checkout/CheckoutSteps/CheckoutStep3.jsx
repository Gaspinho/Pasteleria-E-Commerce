import { useEffect  ,useRef } from 'react';
import { useSelector } from "react-redux";
import {useUpdateOrderMutation} from '../../../services/orderApi'


export const CheckoutStep3 = () => {
  const order = useSelector(state => state.order)
  const [updateOrder] = useUpdateOrderMutation();
  
  useEffect(() => {
    const update = async () => {
      if (!order.id) return;
      const data = { id: order.id, order_Status: "Order Placed" };
      const res = await updateOrder(data);
      if (res.error) {
        console.error(res.error.error);
      } else if (res.data) {
        console.log(res.data);
      }
    };
    update();
  }, [order.id, updateOrder]);
  return (
    <>
      {/* <!-- BEING CHECKOUT STEP Three -->  */}
      <div className="checkout-purchase checkout-form">
        <h4>
          Bake & Take Le agradece
          <br />
          su compra!
        </h4>
        <p>
          En Bake & Take apreciamos mucho su compra y estamos
          muy agradecidos por la confianza que ha depositado en
          nosotros. Esperamos sinceramente que esté satisfecho 
          con su compra y haremos todo lo posible para seguir 
          brindándole el servicio que usted se merece.
        </p>
        <ul className="checkout-purchase__list">
          <li>
            <span>Número de orden</span>{order.id}
          </li>
          <li>
            <span>Estado de pedido</span> Pedido realizado
          </li>
          <li>
            <span>Estado de Pago</span>Pago realizado
          </li>
          <li>
            <span>Fecha entrega</span> {" "}
            {new Date(order.order_Delivery_Date).toLocaleDateString("es-CL", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </li>
          <li>
            <span>Hora de entrega</span> {order.order_Delivery_Time}
          </li>
        </ul>
        
      </div>
      {/* <!-- CHECKOUT STEP TWO EOF -->  */}
    </>
  );
};
