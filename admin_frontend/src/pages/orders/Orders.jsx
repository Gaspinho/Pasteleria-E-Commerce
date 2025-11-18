import React from 'react'
import {useGetAllOrderQuery ,useUpdateOrderMutation}  from '../../services/orderApi'
import './orders.css';
import logo from "../../images/logo.ico";
import { useNavigate } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import backImg from '../../images/login-form__bg.png';

function Orders() {
  const navigate = useNavigate();
  const response = useGetAllOrderQuery();
  const [updateOrder] = useUpdateOrderMutation();
  console.log("Response Information: ", response);
  console.log("Data: ", response.data);
  console.log("Success: ", response.isSuccess);
  
  if (response.isLoading) return <div>Loading....</div>;
  if (response.isError) return <h1>An error occured {response.error.error}</h1>;
  const arr = (response.data).slice().reverse();
  const handleCancel= (props)=>{
    const updateData= {
      id:props,
      order_Status:"Canceled",
    }
    confirmAlert({
      title: 'Confirmar Cancelación de Pedido',
      message: '¿Está seguro de cancelar este pedido?',
      buttons: [
        {
          label: 'Sí',
          onClick: async() => {
            const res= await updateOrder(updateData)
            if(res.isError){
              console.log(res.error.error)
            }
            if(res.data){
              console.log(res.data)
                      
            }            
          }        
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  }
  const handleEdit = props => {
    console.log(props);
    navigate(`/admin/order/details/${props}`);
  };

  return (
    <div >
      <h1 style={{ marginBottom: "3rem" }}> Lista de Pedidos </h1>
      <div className="grid">
        {arr.map((data, index) => (
          <div key={index} className="container">
            <div className="card" style={{backgroundImage:`url(${backImg})`}}>
              <img src={logo} alt="logo" className="image" />
              <div className="data">
                <h1 className="title">{data.order_Status}</h1>
                <div className='dataGrid'>
                  <h3>ID de Pedido: </h3>
                  <p className='info'>{data.order_Id} </p>
                </div>
                <div className='dataGrid'>
                  <h3>Fecha/Hora: </h3>
                  <p className='info'>{data.order_Placment_Date} {" "} {data.order_Placment_Time}</p>
                </div>
                <div className='dataGrid'>
                  <h3>Monto Total: </h3>
                  <p className='info'> Rs. {' '} {data.total_Amount}</p>
                </div>
                <div className='dataGrid'>
                  <h3>ID de Cliente: </h3>
                  <p className='info'>{data.customer} </p>
                </div>
                <div className='dataGrid'>
                  <h3>Dirección: </h3>
                  <p className='info'> H: {data.address.house_Number} , St:
                  {data.address.street_Number}  , Area: {data.address.area} , City:
                  {data.address.city} </p>
                </div>
                <div className="buttons">
                  <button className="button" onClick={() => handleEdit(data.order_Id)}>
                     Detalles del Pedido </button>
                  <button
                    className="button" 
                    style={{ backgroundColor: "red" }} 
                    onClick={() => handleCancel(data.order_Id)}
                  >
                    Cancelar Pedido
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Orders
