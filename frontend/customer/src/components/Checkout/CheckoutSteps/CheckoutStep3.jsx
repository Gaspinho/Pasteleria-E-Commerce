import { useEffect  ,useRef } from 'react';
import { useSelector } from "react-redux";
import {useUpdateOrderMutation} from '../../../services/orderApi'


export const CheckoutStep3 = () => {
  const order = useSelector(state => state.order)
  const [updateOrder] = useUpdateOrderMutation();
  
  useEffect( async() => {
    const data ={
      id: order.id,
      order_Status: "Order Placed",
    }
    const res= await updateOrder(data)
      if(res.isError){
        console.log(res.error.error)
      }
      if(res.data){
         console.log(res.data)
      }  
  
    },[] )
  console.log('order form stor', order)
  return (
    <>
      {/* <!-- BEING CHECKOUT STEP Three -->  */}
      <div className="checkout-purchase checkout-form">
        <h4>
          ¡Pastelería Mil Sabores 
          <br />
          Agradece tu Pedido!
        </h4>
        <p>
          En Pastelería Mil Sabores estamos muy
          agradecidos por la confianza que has depositado en nosotros. Sinceramente esperamos que
          estés satisfecho con tu compra y haremos nuestro mejor esfuerzo para continuar
          brindándote el servicio que mereces.
        </p>
        <ul className="checkout-purchase__list">
          <li>
            <span>Número de Pedido</span>{order.id}
          </li>
          <li>
            <span>Estado del Pedido</span> Pedido Realizado
          </li>
          <li>
            <span>Estado de Pago</span>Esperando Pago
          </li>
          <li>
            <span>Fecha de Entrega</span> {order.order_Delivery_Date}
          </li>
          <li>
            <span>Hora de Entrega</span> {order.order_Delivery_Time}
          </li>
        </ul>
        
      </div>
      {/* <!-- CHECKOUT STEP TWO EOF -->  */}
    </>
  );
};
