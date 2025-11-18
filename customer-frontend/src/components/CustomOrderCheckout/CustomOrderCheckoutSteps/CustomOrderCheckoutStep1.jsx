import { useEffect, useState } from 'react';
import { useDispatch ,useSelector } from 'react-redux';
import Dropdown from "react-dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {usePlaceCustomOrderMutation} from '../../../services/customOrderApi'

// --- CAMBIO ---
// Se elimina la variable 'countries', ya no es necesaria.

const timezone = [
  { label: "10AM - 12PM", value: "10AM - 12PM" },
  { label: "12PM - 2PM", value: "12PM - 2PM" },
  { label: "2PM - 4PM", value: "2PM - 4PM" },
  { label: "4PM - 6PM", value: "4PM - 6PM" },
  { label: "6PM - 8PM", value: "6PM - 8PM" },
  { label: "8PM - 10PM", value: "8PM - 10PM" },
];

export const CustomOrderCheckoutStep1 = ({ onNext , CustomOrder_Id }) => {
  const dispatch = useDispatch()
  const [userData , setUserData]= useState({}) 
  const [PlaceOrder] = usePlaceCustomOrderMutation()
  
  // --- CAMBIO ---
  // Se elimina el estado 'city', ya que ahora es un valor fijo.
  const [time, setTime]= useState({}) 
  const [startDate, setStartDate] = useState(new Date());
  const [server_error, setServerError] = useState({});
 
  const handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    setUserData(values => ({ ...values, [name]: value }));
  };
  
  console.log("step 1 customer props" ,CustomOrder_Id)
  const handelSubmit = async (e) =>{ 
    e.preventDefault();
    const actualData = {
      phone_Number:userData.phone_Number,
      CustomOrder:CustomOrder_Id,
      address:{
        street_Number: userData.street_Number,
        house_Number: userData.house_Number,
        // --- CAMBIO --- Se fija la ciudad a "Concepción"
        city: "Concepción", 
        area: userData.area,
      },
      payment:{
        payment_Status: 'Pending',
        payment_Type:'Cash on Delivery',
        amount_Paid: 0
      },
      // --- CAMBIO --- Se actualiza el costo de entrega a 5000
      delivery_Charges: 5000, 
      order_Delivery_Date : startDate,
      order_Delivery_Time : time,
    }

    console.log('these are the actual data',actualData)
    const res = await PlaceOrder(actualData)

    if (res.error) {
      console.log(res.error)
      // Manejar diferentes estructuras de error
      if (res.error.data && res.error.data.errors) {
        setServerError(res.error.data.errors)
      } else if (res.error.data && res.error.data.detail) {
        setServerError({ non_field_errors: [res.error.data.detail] })
      } else {
        setServerError({ non_field_errors: ['Ocurrió un error. Por favor intente nuevamente.'] })
      }
    }
    if (res.data) {
      console.log(res.data)
      sessionStorage.setItem("Current_Order_Id", res.data.order_id);
      setServerError({})
      onNext();
    } 
  }
  
  return (
    <>
      {/* */}
      <div className="checkout-form">
        <form onSubmit={handelSubmit}>
          <div className="checkout-form__item">
            <h4>Información de envio</h4>
            {/* ... (código de teléfono sin cambios) ... */}
            <div className="box-field">
              <input
                type="text"
                className="form-control"
                placeholder="Ingrese su Número de Teléfono"
                name="phone_Number"
                onChange={handleChange}
                required
              />
            </div>
           {server_error?.phone_Number ? (
              <label style={{ fontSize: 16, color: "red", paddingTop: 10 }}>
                {server_error.phone_Number[0]} </label>) : ("")} 
          </div>
          <div className="checkout-form__item">
            <h4>Información de Entrega</h4>
            <div className="box-field__row">
              {/* ... (código de número de casa y calle sin cambios) ... */}
              <div className="box-field">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ingrese el Número de Casa"
                  name="house_Number"
                  onChange={handleChange}
                  required
                />
                {server_error?.house_Number ? (
              <label style={{ fontSize: 16, color: "red", paddingTop: 10 }}>
                {server_error.house_Number[0]} </label>) : ("")}
              </div>
              
              <div className="box-field">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ingrese el Número de Calle"
                  name="street_Number"
                  onChange={handleChange}
                  required
                />
                {server_error?.street_Number ? (
              <label style={{ fontSize: 16, color: "red"}}>
                {server_error.street_Number[0]} </label>) : ("")} 
              </div> 
    
            </div>
            <div className="box-field__row">
              <div className="box-field">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ingrese el Área (ej: Villa, Población)"
                  name="area"
                  onChange={handleChange}
                  required
                />
                {server_error?.area ? (
              <label style={{ fontSize: 16, color: "red", paddingTop: 10 }}>
                {server_error.area[0]} </label>) : ("")}
              </div>
              
              {/* --- CAMBIO ---
                  Se reemplaza el Dropdown de ciudad por un 
                  campo de texto deshabilitado con el valor "Concepción".
              */}
              <div className="box-field">
                <input
                  type="text"
                  className="form-control"
                  value="Concepción"
                  disabled
                />
              </div>  
            </div>
            {/* ... (código de fecha/hora sin cambios) ... */}
            <h4>Fecha / Hora de Entrega</h4>
            <div className="box-field__row" style={{marginTop: "20px"}}>
              <div className="box-field">
              <span style={{paddingBottom: "20px"}}>Seleccione Fecha</span>    
              <DatePicker className="box-field" selected={startDate} onChange={(date) => setStartDate(date)} />
              </div>
            <div className="box-field">
              <Dropdown 
              options={timezone}
              className="react-dropdown"
              onChange={(option)=> setTime(option.value)}
              placeholder="Hora de Entrega" 
              required 
            />
            </div>
            </div>
          </div>
          <div className="checkout-buttons">
            <button type="submit" className="btn btn-icon btn-next">
              Siguiente <i className="icon-arrow"></i>
            </button>
          </div>
        </form>
      </div>
      {/* */}
    </>
  );
};