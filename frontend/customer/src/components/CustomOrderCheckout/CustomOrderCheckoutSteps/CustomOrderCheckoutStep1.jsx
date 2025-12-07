import { useEffect, useState } from 'react';
import { useDispatch ,useSelector } from 'react-redux';
import Dropdown from "react-dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {usePlaceCustomOrderMutation} from '../../../services/customOrderApi'
import {useGetLoggedUserQuery, useUpdatePhoneNumberMutation} from '../../../services/userCRUDApi'

const countries = [
  { label: "Concepción", value: "Concepción" },
  { label: "Hualpen", value: "Hualpen" },
  { label: "Talcahuano", value: "Talcahuano" },
  { label: "San Pedro de La Paz", value: "San Pedro de La Paz" },
  { label: "Chiguayante", value: "Chiguayante" },
  { label: "Penco", value: "Penco" },
];

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
  const [updatePhoneNumber] = useUpdatePhoneNumberMutation()
  const [city, setCity]= useState({}) 
  const [time, setTime]= useState({}) 
  const [startDate, setStartDate] = useState(new Date());
  const [server_error, setServerError] = useState({});
  
  // Obtener información del usuario logueado
  const access_token = sessionStorage.getItem('access_token')
  const {data: userInfo, isLoading: userLoading} = useGetLoggedUserQuery(access_token)
  
  // Establecer el número de teléfono del usuario si ya existe
  useEffect(() => {
    if (userInfo?.phone_number) {
      setUserData(prev => ({ ...prev, phone_Number: userInfo.phone_number }))
    }
  }, [userInfo])
  const handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    setUserData(values => ({ ...values, [name]: value }));
  };
  
  console.log("step 1 customer props" ,CustomOrder_Id)
  const handelSubmit = async (e) =>{ 
    e.preventDefault();
    
    // Usar el teléfono del formulario si se ingresó, si no, usar el del usuario
    const phoneToUse = userData.phone_Number || userInfo?.phone_number;
    
    if (!phoneToUse) {
      setServerError({ phone_Number: ['Por favor ingrese un número de teléfono'] });
      return;
    }
    
    const actualData = {
      phone_Number: phoneToUse,
      CustomOrder:CustomOrder_Id,
      address:{
        street_Number: userData.street_Number,
        house_Number: userData.house_Number,
        city: city,
        area: userData.area || "",
      },
      payment:{
        payment_Status: 'Pending',
        payment_Type:'Cash on Delivery',
        amount_Paid: 0
      },
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
      
      // Si el usuario no tenía teléfono registrado, o cambió el teléfono, actualizarlo
      if (userData.phone_Number && userInfo?.id && userData.phone_Number !== userInfo?.phone_number) {
        try {
          await updatePhoneNumber({
            id: userInfo.id,
            phone_number: userData.phone_Number
          })
          console.log('Phone number updated successfully')
        } catch (error) {
          console.log('Error updating phone number:', error)
        }
      }
      
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
            {userInfo?.phone_number && (
              <div style={{display:'grid' , gridTemplateColumns:'repeat(2, 1fr)' , marginBottom:'1rem'}}>
                <div> 
                  <h6>Teléfono Registrado:</h6>
                </div>
                <div> 
                  <h6>{userInfo.phone_number}</h6>
                </div>
              </div>
            )}
            <div className="box-field">
              <input
                type="text"
                className="form-control"
                placeholder={userInfo?.phone_number ? "Cambiar número de teléfono" : "Ingrese su número de teléfono"}
                name="phone_Number"
                value={userData.phone_Number || ''}
                onChange={handleChange}
                required={!userInfo?.phone_number}
              />
            </div>
           {server_error?.phone_Number ? (
              <label style={{ fontSize: 16, color: "red", paddingTop: 10 }}>
                {server_error.phone_Number[0]} </label>) : ("")} 
          </div>
          <div className="checkout-form__item">
            <h4>Información de Entrega</h4>
            <div className="box-field__row">
              <div className="box-field">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Número"
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
                  placeholder="Calle"
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
                  placeholder="Depto/Torre/Casa (opcional)"
                  name="area"
                  onChange={handleChange}
                />
                {server_error?.area ? (
              <label style={{ fontSize: 16, color: "red", paddingTop: 10 }}>
                {server_error.area[0]} </label>) : ("")}
              </div>
              
              <div className="box-field">
              <Dropdown 
               options={countries}
               className="react-dropdown"
               onChange={(option)=> setCity(option.value)}
               placeholder="Seleccione una ciudad"
               required
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