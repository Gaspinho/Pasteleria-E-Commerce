import {useParams} from 'react-router-dom';
import {useDetaildOrderQuery}  from '../../services/orderApi'
import {useReactToPrint} from 'react-to-print';
import './orderDetails.css'
import OrderdProducts from './OrderedProducts';
import OrderTrack from './OrderTrack';
import backImg from '../../images/login-form__bg.png';
import { useRef } from 'react';

const OrderDetails = () => {
  const { id } = useParams()
  const responseInfo = useDetaildOrderQuery(id);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Order_Invoice',
  })

  if (responseInfo.isLoading) return <div>Loading....</div>;
  if (responseInfo.isError)
    return <h1>An error occured {responseInfo.error.error}</h1>;
  
  // Mapear datos del backend al formato esperado
  const orderData = responseInfo.data ? {
    order_Id: responseInfo.data.id,
    order_Status: responseInfo.data.order_Status,
    total_Amount: responseInfo.data.total_Amount,
    delivery_Charges: responseInfo.data.delivery_Charges,
    note: responseInfo.data.note,
    order_Placment_Date: responseInfo.data.placed_at ? new Date(responseInfo.data.placed_at).toLocaleDateString() : 'N/A',
    order_Placment_Time: responseInfo.data.placed_at ? new Date(responseInfo.data.placed_at).toLocaleTimeString() : 'N/A',
    order_Delivery_Date: responseInfo.data.delivery_at,
    order_Delivery_Time: responseInfo.data.delivery_time_window,
    customer: {
      first_Name: responseInfo.data.customer_name ? responseInfo.data.customer_name.split(' ')[0] : 'N/A',
      last_Name: responseInfo.data.customer_name ? responseInfo.data.customer_name.split(' ').slice(1).join(' ') : '',
      phone_Number: responseInfo.data.customer_phone || 'N/A'
    },
    address: responseInfo.data.address || {},
    payment: responseInfo.data.payment || {}
  } : null;

  if (!orderData) {
    return <div>Pedido no encontrado</div>;
  }

    return (
    <div ref={componentRef} >
      <div className='contain' style={{backgroundImage:`url(${backImg})`}}>
        <div className='detailsTitle'>
          <h1>Factura del Pedido</h1>
          <button className="printButton" onClick={handlePrint}> Imprimir Factura</button>
        </div>
        <div>
          <h2 > Estado del Pedido: </h2>
          <div ><OrderTrack data={orderData}  /></div>
        </div>
        <div className='sectionsHeading1'>
          <h2 > Detalles del Pedido : </h2>
          <h2 style={{ marginLeft:"28rem" }}> Dirección de Entrega</h2>
        </div>
        <div className='orderDetails'>
          <div className='leftHead'>
            <p className='spani'>ID de Pedido: </p><br/>
            <p className='spani'>Fecha/Hora de Solicitud: </p><br/>
            <p className='spani'>Cargos de Envío: </p><br/>
            <p className='spani'>Monto Total: </p><br/>
            <p className='spani'>Nota: </p><br/>
          </div>
          <div className='rightvalue'>
            <p className='spani'>{orderData.order_Id}</p><br/>
            <p className='spani'>{orderData.order_Placment_Date} {" "} {orderData.order_Placment_Time}</p><br/>
            <p className='spani'>  $ {' '} {orderData.delivery_Charges} </p><br/>
            <p className='spani'> $ {' '}{orderData.total_Amount}</p><br/>
            <p className='spani'> {orderData.note}</p><br/>
          </div>
          <div className='delivrySection'>
            <div className='leftHead'>
            <p className='spani'>Cliente: </p><br/>
            <p className='spani'>Número de Teléfono: </p><br/>
            <p className='spani'>Dirección de Entrega: </p><br/>
            <p className='spani'>Fecha de Entrega: </p><br/>
            <p className='spani'>Horario de Entrega: </p><br/>
            </div>
            <div className='rightvalue'>
            <p className='spani'>{orderData.customer.first_Name}  {orderData.customer.last_Name}</p><br/>
            <p className='spani'>{orderData.customer.phone_Number} .</p><br/>
            <p className='spani'>Casa: {" "}{orderData.address.house_number || 'N/A'} , Calle:  {" "}
            {orderData.address.street_number || 'N/A'} , Área: {" "}
             {orderData.address.area} , Ciudad: {" "}
             {orderData.address.city}</p><br/>
            <p className='spani'>{orderData.order_Delivery_Date} </p><br/>
            <p className='spani'>{orderData.order_Delivery_Time} </p><br/>
            </div>
          </div>
        </div>
        <div className='sectionsHeading'>
          <h2 > Pago del Pedido: </h2>         
        </div>
        <div className='orderDetails'>
          <div className='leftHead'>
            <p className='spani'>ID de Pago: </p><br/>
            <p className='spani'>Estado del Pago: </p><br/>
          </div>
          <div className='rightvalue'>
            <p className='spani'>{orderData.payment.id || 'N/A'}</p><br/>
            <p className='spani'>{orderData.payment.payment_status || 'N/A'}</p><br/>
          </div>
          <div className='delivrySection'>
            <div className='leftHead'>
            <p className='spani'>Tipo de Pago: </p><br/>
            <p className='spani'>Monto Pagado: </p><br/>
            </div>
            <div className='rightvalue'>
            <p className='spani'>{orderData.payment.payment_type || 'N/A'}</p><br/>
            <p className='spani'> $ {' '}{orderData.payment.amount_paid || 0} </p><br/>
            
          </div>
          </div>
        </div>
        <div className='sectionsHeading'>
          <h2 > Productos: </h2>
        </div>
        <div>
          {<OrderdProducts data={id} />}
        </div>
      </div>   
    </div>
  )
}

export default OrderDetails
