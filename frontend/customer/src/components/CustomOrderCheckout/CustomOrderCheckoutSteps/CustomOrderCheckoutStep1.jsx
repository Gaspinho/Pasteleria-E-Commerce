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
  const reduxUser = useSelector(state => state.user)
  const [PlaceOrder] = usePlaceCustomOrderMutation()
  const [updatePhoneNumber] = useUpdatePhoneNumberMutation()
  const [city, setCity]= useState({}) 
  const [time, setTime]= useState({}) 
  const [startDate, setStartDate] = useState(new Date());
  const [server_error, setServerError] = useState({});
  const [access_token, setAccessToken] = useState(null);
  
  // Obtener el token solo en el cliente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAccessToken(sessionStorage.getItem('access_token'));
    }
  }, []);
  
  // Obtener información del usuario logueado
  const { data: apiUserData, isSuccess } = useGetLoggedUserQuery(access_token, {
    skip: !access_token || reduxUser.id !== ""
  });
  
  useEffect(() => {
    // Priorizar datos de Redux, luego API, luego valores por defecto
    const currentUser = reduxUser.id ? reduxUser : (apiUserData || {});
    
    setUserData({
      id: currentUser.id || "",
      phone_Number: "",  // Cambiar esta línea - siempre vacío
      first_Name: currentUser.first_name || "",
      last_Name: currentUser.last_name || "",
      street_Number: "",
      house_Number:"",
      city: "",
      area: "",
      note:" "
    })
  }, [reduxUser, apiUserData])

  const handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    setUserData(values => ({ ...values, [name]: value }));
    
    // Limpiar error específico del campo
    if (server_error[name]) {
      setServerError(prev => ({ ...prev, [name]: null }));
    }
  };
  
  console.log("step 1 customer props" ,CustomOrder_Id)
  
  const handelSubmit = async (e) =>{ 
    e.preventDefault();
    
    // Limpiar errores previos
    setServerError({});
    
    // Validar dirección
    if (!userData.house_Number || userData.house_Number.trim() === '') {
      setServerError({
        house_Number: ['Por favor ingrese su dirección (Calle, Avenida, número)']
      });
      return;
    }
    
    // Validar formato de teléfono
    const phoneRegex = /^\+569\d{8}$/;
    if (!phoneRegex.test(userData.phone_Number)) {
      setServerError({
        phone_Number: ['El formato debe ser +569XXXXXXXX']
      });
      return;
    }
    
    // Validar que se haya seleccionado ciudad
    if (!city || Object.keys(city).length === 0) {
      setServerError({
        city: ['Por favor seleccione una ciudad']
      });
      return;
    }
    
    // Validar que se haya seleccionado hora
    if (!time || Object.keys(time).length === 0) {
      setServerError({
        time: ['Por favor seleccione una hora de entrega']
      });
      return;
    }
    
    const actualData = {
      phone_Number: userData.phone_Number,
      CustomOrder: CustomOrder_Id,
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
      
      // Si el usuario cambió el teléfono, actualizarlo
      if (userData.phone_Number && apiUserData?.id && userData.phone_Number !== apiUserData?.phone_number) {
        try {
          await updatePhoneNumber({
            id: apiUserData.id,
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
  
  // Filtrar las horas disponibles según la fecha seleccionada
  const getAvailableTimeSlots = () => {
    const today = new Date();
    const selectedDay = new Date(startDate);
    
    // Si la fecha seleccionada es hoy
    if (selectedDay.toDateString() === today.toDateString()) {
      const currentHour = today.getHours();
      
      // Filtrar las horas que ya pasaron
      return timezone.filter(slot => {
        const slotStartHour = parseInt(slot.value.split('AM')[0].split('PM')[0]);
        const isPM = slot.value.includes('PM');
        const hour24 = isPM && slotStartHour !== 12 ? slotStartHour + 12 : slotStartHour;
        
        return hour24 > currentHour;
      });
    }
    
    // Si es un día futuro, mostrar todas las horas
    return timezone;
  };
  
  return (
    <>
      {/* <!-- BEING CHECKOUT STEP ONE -->  */}
      <div className="checkout-form">
        <form onSubmit={handelSubmit}>
          <div className="checkout-form__item">
            <h4>Información sobre ti</h4>
            <div style={{display:'grid' , gridTemplateColumns:'repeat(2, 1fr)' , marginBottom:'1rem'}}>
              <div> 
                <h6>Nombre:</h6>
              </div>
              <div> 
                <h6>{userData.first_Name} {" "} {userData.last_Name}</h6>
              </div>
            </div>
            <div className="box-field">
              <input
                type="text"
                className="form-control"
                placeholder="Ingrese su Número de Teléfono, ej: +56912345678"
                name="phone_Number"
                value={userData.phone_Number || ''}
                onChange={handleChange}
              />
            </div>
           {server_error?.phone_Number ? (
              <label style={{ fontSize: 16, color: "red", paddingTop: 10 }}>
                {server_error.phone_Number[0]} </label>) : ("")} 
          </div>
          <div className="checkout-form__item">
            <h4>Información de Entrega</h4>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div className="box-field">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Dirección (Calle, Avenida, número)"
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
                  placeholder="Apartamento, piso (opcional)"
                  name="street_Number"
                  onChange={handleChange}
                />
                {server_error?.street_Number ? (
                  <label style={{ fontSize: 16, color: "red"}}>
                    {server_error.street_Number[0]} 
                  </label>) : ("")} 
              </div> 
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
              <div className="box-field">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Barrio/Vecindario (opcional)"
                  name="area"
                  onChange={handleChange}
                />
                {server_error?.area ? (
                  <label style={{ fontSize: 16, color: "red", paddingTop: 10 }}>
                    {server_error.area[0]} 
                  </label>) : ("")}
              </div>
              <div className="box-field">
              <Dropdown 
                options={countries}
                className="react-dropdown"
                onChange={(option)=> setCity(option.value)}
                placeholder="Seleccione una Ciudad"
                required
              />
              {server_error?.city && (
                <label style={{ fontSize: 16, color: "red", paddingTop: 10 }}>
                  {server_error.city[0]}
                </label>)}
              </div>  
            </div>
            <h4 style={{marginTop: '60px'}}>Fecha/Hora Delivery</h4>
            <div className="box-field__row" style={{marginTop: "20px"}}>
              <div className="box-field">    
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="form-control" 
                  placeholderText="Selecciona fecha"
                  required
                  minDate={new Date()}
                  style={{textAlign: 'center', fontSize: '16px', fontWeight: '500'}}
                />
              </div>
              <div className="box-field">
                <Dropdown 
                  options={getAvailableTimeSlots()}
                  className="react-dropdown"
                  onChange={(option)=> setTime(option.value)}
                  placeholder="Hora delivery" 
                  required 
                />
                {server_error?.time && (
                  <label style={{ fontSize: 16, color: "red", paddingTop: 10 }}>
                    {server_error.time[0]}
                  </label>)}
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
      {/* <!-- CHECKOUT STEP ONE EOF -->  */}
      
      <style jsx global>{`
  .react-datepicker__input-container input.form-control {
    text-align: center !important;
    font-size: 18px !important;
    font-weight: 400 !important;
    padding: 12px 15px !important;
  }
  
  .checkout-form__item {
    background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    margin-bottom: 25px;
    border: 1px solid #ffd5d5;
  }
  
  .checkout-form__item h4 {
    color: #d63031;
    font-weight: 600;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #ffb3b3;
    font-size: 20px;
  }
  
  .checkout-form__item h6 {
    color: #444;
    font-weight: 500;
    margin-bottom: 8px;
  }
  
  .form-control {
    border: 2px solid #ffd5d5 !important;
    border-radius: 8px !important;
    padding: 14px 16px !important;
    font-size: 15px !important;
    transition: all 0.3s ease !important;
    background: #fff !important;
  }
  
  .form-control:focus {
    border-color: #ff6b6b !important;
    box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.15) !important;
    outline: none !important;
  }
  
  .form-control::placeholder {
    color: #aaa;
  }
  
  .react-dropdown {
    border: 2px solid #ffd5d5 !important;
    border-radius: 8px !important;
    background: #fff !important;
  }
  
  .react-dropdown:hover {
    border-color: #ffb3b3 !important;
  }
  
  .Dropdown-control {
    padding: 14px 16px !important;
    border: none !important;
    text-align: center !important;
    font-size: 15px !important;
    background: #fff !important;
  }
  
  .Dropdown-placeholder {
    text-align: center !important;
    color: #aaa !important;
  }
  
  .box-field__textarea textarea {
    border: 2px solid #ffd5d5 !important;
    border-radius: 8px !important;
    padding: 14px 16px !important;
    min-height: 100px;
    resize: vertical;
    background: #fff !important;
  }
  
  .box-field__textarea textarea:focus {
    border-color: #ff6b6b !important;
    box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.15) !important;
  }
  
  .checkout-buttons {
    display: flex;
    gap: 15px;
    margin-top: 30px;
  }
  
  .btn {
    padding: 14px 30px !important;
    border-radius: 8px !important;
    font-weight: 600 !important;
    font-size: 16px !important;
    transition: all 0.3s ease !important;
    border: none !important;
  }
  
  .btn-next {
    background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%) !important;
    color: white !important;
    flex: 1;
  }
  
  .btn-next:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4) !important;
  }
  
  .btn-grey {
    background: #f5f5f5 !important;
    color: #666 !important;
  }
  
  .btn-grey:hover {
    background: #e8e8e8 !important;
  }
  
  label[style*="color: red"] {
    display: block;
    margin-top: 8px;
    font-size: 14px !important;
    font-weight: 500;
  }
  
  .box-field__row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  @media (max-width: 768px) {
    .checkout-form__item {
      padding: 20px;
    }
    
    .box-field__row {
      grid-template-columns: 1fr;
    }
  }
`}</style>
    </>
  );
};