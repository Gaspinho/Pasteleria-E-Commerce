import { useEffect, useState   } from 'react';
import { useSelector } from "react-redux";
import {useUpdateOrderMutation , useGetDetaildCustomOrderQuery} from '../../../services/customOrderApi'

export const CustomOrderCheckoutStep3 = (props) => {
  const [updateOrder] = useUpdateOrderMutation();
  const [realOrderId, setRealOrderId] = useState(null);
useEffect(() => {
    // --- CAMBIO ---
    // Lee el ID del pedido real que guardamos en el Step 1
    const newOrderId = sessionStorage.getItem("Current_Order_Id");
    setRealOrderId(newOrderId);

    // El resto de tu lógica del useEffect
    const updateOrderStatus = async (id) => {
      const data = {
        id: id, // Usa el ID del pedido real
        order_Status: "Order Placed",
      };
      const res = await updateOrder(data);
      if (res.isError) {
        console.log(res.error.error);
      }
      if (res.data) {
        console.log(res.data);
      }
    };

    if (newOrderId) {
      updateOrderStatus(newOrderId);
    }

  }, [updateOrder]); // Añadir updateOrder a las dependencias
  
  
  let customOrder = useGetDetaildCustomOrderQuery(realOrderId, {
    skip: !realOrderId,
  });
  if (!realOrderId || customOrder.isLoading) return <div>Cargando....</div>;
  if (customOrder.isError) return <h1>Ocurrió un error {customOrder?.error?.message || 'Por favor intente nuevamente'}</h1>;
  console.log('detaild custom Order', customOrder.data)

   if (customOrder.isLoading) return <div>Cargando....</div>;
   if (customOrder.isError) return <h1>Ocurrió un error {customOrder?.error?.message || 'Por favor intente nuevamente'}</h1>;
     console.log('detaild custom Order', customOrder.data)

   // --- CAMBIO ---
   // Se calculan los montos para el desglose
   const subtotal = customOrder.data.CustomCake?.amount || 0;
   const delivery = customOrder.data.delivery_Charges || 0;
   const total = subtotal + delivery;

  return (
    <>
      {/* */}
      <div className="checkout-purchase checkout-form">
        <h4>
          ¡Pastelería Mil Sabores 
          <br />
          Agradecetu Pedido!
        </h4>
        <p>
          En Pastelería Mil Sabores estamos muy
          agradecidos por la confianza que has depositado en nosotros. Sinceramente esperamos que
          estés satisfecho con tu compra y haremos nuestro mejor esfuerzo para continuar
          brindándote el servicio que mereces.
        </p>
        <ul className="checkout-purchase__list">
          <li>
            <span>Número de Pedido</span>{customOrder.data.id}
          </li>
          <li>
            <span>Estado del Pedido</span> Pedido Realizado
          </li>
          <li>
            <span>Estado de Pago</span>Esperando Pago
          </li>
          <li>
            <span>Fecha de Entrega</span> {customOrder.data.order_Delivery_Date}
          </li>
          <li>
            <span>Hora de Entrega</span> {customOrder.data.order_Delivery_Time}
          </li>
          
          {/* --- CAMBIO ---
              Se reemplaza "Monto Total" por un desglose detallado 
              usando los valores calculados y formato de moneda local.
          */}
          <li>
            <span>Subtotal Pastel</span> ${subtotal.toLocaleString('es-CL')}
          </li>
          <li>
            <span>Entrega</span> ${delivery.toLocaleString('es-CL')}
          </li>
          <li>
            <span>Monto Total</span> ${total.toLocaleString('es-CL')}
          </li>
        </ul>
        
      </div>
      {/* */}
    </>
  );
};