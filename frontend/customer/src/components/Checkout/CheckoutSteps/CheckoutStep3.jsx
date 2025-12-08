import { useEffect } from 'react';
import { useSelector } from "react-redux";
import { useUpdateOrderMutation } from '../../../services/orderApi'


export const CheckoutStep3 = () => {
  const order = useSelector(state => state.order)
  const [updateOrder] = useUpdateOrderMutation();
  
  useEffect(() => {
    const updateOrderStatus = async () => {
      if (order.id) {
        const data = {
          id: order.id,
          order_Status: "Order Placed",
        }
        const res = await updateOrder(data)
        if (res.isError) {
          console.log(res.error.error)
        }
        if (res.data) {
          console.log(res.data)
        }
      }
    }
    updateOrderStatus()
  }, [order.id])

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'UTC'
    };
    
    return date.toLocaleDateString('es-CL', options);
  };

  const formatOrderId = (id) => {
    if (!id) return 'No disponible';
    return id.substring(0, 8).toUpperCase();
  };

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
            <span>Número de Pedido</span>{formatOrderId(order.id)}
          </li>
          <li>
            <span>Estado del Pedido</span> Pedido Realizado
          </li>
          <li>
            <span>Estado de Pago</span>Esperando Pago
          </li>
          <li>
            <span>Teléfono</span> {order.phone_Number || 'No disponible'}
          </li>
          <li>
            <span>Dirección</span> {order.address?.house_Number || ''} {order.address?.street_Number || ''}, {order.address?.city || 'No disponible'}
          </li>
          {order.address?.area && (
            <li>
              <span>Área</span> {order.address.area}
            </li>
          )}
          <li>
            <span>Fecha de Entrega</span> {formatDate(order.order_Delivery_Date)}
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
