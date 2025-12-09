import { useEffect, useState } from 'react';
import { useUpdateOrderMutation, useGetDetaildCustomOrderQuery } from '../../../services/customOrderApi'

export const CustomOrderCheckoutStep3 = ({ CustomOrder_Id }) => {
  const [updateOrder] = useUpdateOrderMutation();
  const [realOrderId, setRealOrderId] = useState(null);

  useEffect(() => {
    // Lee el ID del pedido real que guardamos en el Step 1
    const newOrderId = sessionStorage.getItem("Current_Order_Id");
    setRealOrderId(newOrderId);

    // Actualizar el estado del pedido a "Order Placed"
    const updateOrderStatus = async (id) => {
      const data = {
        id: id,
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

  }, [updateOrder]);
  
  const customOrder = useGetDetaildCustomOrderQuery(realOrderId, {
    skip: !realOrderId,
  });

  if (!realOrderId || customOrder.isLoading) return <div>Cargando....</div>;
  if (customOrder.isError) return <h1>Ocurrió un error {customOrder?.error?.message || 'Por favor intente nuevamente'}</h1>;

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

  // Calcular los montos del desglose
  const subtotal = customOrder.data.CustomCake?.amount || 0;
  const delivery = customOrder.data.delivery_Charges || 0;
  const total = subtotal + delivery;

  return (
    <>
      {/* <!-- BEING CHECKOUT STEP THREE --> */}
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
            <span>Número de Pedido</span>{customOrder.data.id}
          </li>
          <li>
            <span>Estado del Pedido</span> Pedido Realizado
          </li>
          <li>
            <span>Estado de Pago</span> Esperando Pago
          </li>
          <li>
            <span>Teléfono</span> {customOrder.data.phone_Number || 'No disponible'}
          </li>
          <li>
            <span>Dirección</span> {customOrder.data.address?.house_Number || ''} {customOrder.data.address?.street_Number || ''}, {customOrder.data.address?.city || 'No disponible'}
          </li>
          {customOrder.data.address?.area && (
            <li>
              <span>Área</span> {customOrder.data.address.area}
            </li>
          )}
          <li>
            <span>Fecha de Entrega</span> {formatDate(customOrder.data.order_Delivery_Date)}
          </li>
          <li>
            <span>Hora de Entrega</span> {customOrder.data.order_Delivery_Time}
          </li>
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
      {/* <!-- CHECKOUT STEP THREE EOF --> */}

      <style jsx>{`
        .checkout-purchase {
          background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border: 1px solid #ffd5d5;
        }

        .checkout-purchase h4 {
          color: #d63031;
          font-weight: 600;
          margin-bottom: 20px;
          font-size: 24px;
          line-height: 1.4;
        }

        .checkout-purchase p {
          color: #666;
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 30px;
        }

        .checkout-purchase__list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .checkout-purchase__list li {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #ffb3b3;
          color: #444;
          font-size: 15px;
        }

        .checkout-purchase__list li:last-child {
          border-bottom: none;
          font-weight: 600;
          background: #ffe8e8;
          padding: 15px 15px;
          margin: 0 -40px -40px -40px;
          padding-left: 40px;
          padding-right: 40px;
          border-radius: 0 0 12px 12px;
        }

        .checkout-purchase__list li span {
          font-weight: 500;
          color: #d63031;
          min-width: 150px;
        }

        @media (max-width: 768px) {
          .checkout-purchase {
            padding: 20px;
          }

          .checkout-purchase h4 {
            font-size: 20px;
          }

          .checkout-purchase__list li {
            flex-direction: column;
            gap: 8px;
          }

          .checkout-purchase__list li span {
            min-width: auto;
          }

          .checkout-purchase__list li:last-child {
            margin: 0 -20px -20px -20px;
            padding-left: 20px;
            padding-right: 20px;
          }
        }
      `}</style>
    </>
  );
};