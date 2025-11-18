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

    return (
    <div ref={componentRef} >
      <div className='contain' style={{backgroundImage:`url(${backImg})`}}>
        <div className='detailsTitle'>
          <h1>Factura del Pedido</h1>
          <button className="printButton" onClick={handlePrint}> Imprimir Factura</button>
        </div>
        <div>
          <h2 > Estado del Pedido: </h2>
          <div ><OrderTrack data={responseInfo.data}  /></div>
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
            <p className='spani'>{responseInfo.data.order_Id}</p><br/>
            <p className='spani'>{responseInfo.data.order_Placment_Date} {" "} {responseInfo.data.order_Placment_Time}</p><br/>
            <p className='spani'>  Rs. {' '} {responseInfo.data.delivery_Charges} </p><br/>
            <p className='spani'> Rs. {' '}{responseInfo.data.total_Amount}</p><br/>
            <p className='spani'> {responseInfo.data.note}</p><br/>
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
            <p className='spani'>{responseInfo.data.customer.first_Name}  {responseInfo.data.customer.last_Name}</p><br/>
            <p className='spani'>{responseInfo.data.customer.phone_Number} .</p><br/>
            <p className='spani'>H: {" "}{responseInfo.data.address.house_Number} , St:  {" "}
            {responseInfo.data.address.street_Number} , Area: {" "}
             {responseInfo.data.address.area} , City: {" "}
             {responseInfo.data.address.city}</p><br/>
            <p className='spani'>{responseInfo.data.order_Delivery_Date} </p><br/>
            <p className='spani'>{responseInfo.data.order_Delivery_Time} </p><br/>
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
            <p className='spani'>{responseInfo.data.payment.payment_Id}</p><br/>
            <p className='spani'>{responseInfo.data.payment.payment_Status}</p><br/>
          </div>
          <div className='delivrySection'>
            <div className='leftHead'>
            <p className='spani'>Tipo de Pago: </p><br/>
            <p className='spani'>Monto Pagado: </p><br/>
            </div>
            <div className='rightvalue'>
            <p className='spani'>{responseInfo.data.payment.payment_Type}</p><br/>
            <p className='spani'> Rs. {' '}{responseInfo.data.payment.amount_Paid} </p><br/>
            
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
