import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useGetUserQuery, useUpdateUserMutation } from '../../services/userCRUDApi';
import { House, Signpost, LocationCity, CalendarToday, BadgeOutlined, LocationSearching, MailOutline, PhoneAndroid, Security } from "@mui/icons-material";
import user_image from "../profile/UserAfatar.jpg";
import backImg from '../../images/login-form__bg.png';
import { Alert, CircularProgress, Chip } from "@mui/material";
import '../customers/customerEdit.jsx.css'

function StaffProfile() {
  const { id } = useParams()
  const responseData = useGetUserQuery(id)
  const [data, setData] = useState("");
  const [success, setSuccess] = useState(false)
  const [server_error, setServerError] = useState({});
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  useEffect(() => {
    if (responseData.isSuccess) {
      setData({
        id: responseData.data.id,
        first_Name: responseData.data.first_Name || '',
        last_Name: responseData.data.last_Name || '',
        phone_Number: responseData.data.phone_Number || '',
        data_Joind: responseData.data.data_Joind || '',
        email: responseData.data.email || '',
        last_login: responseData.data.last_login || '',
        type: responseData.data.type || '',
        is_staff: responseData.data.is_staff || false,
        role: responseData.data.role || '',
        house_number: responseData.data.address?.house_Number || '',
        street_number: responseData.data.address?.street_Number || '',
        city: responseData.data.address?.city || '',
        area: responseData.data.address?.area || '',
      })
    }
  }, [responseData])

  const handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    setData(values => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const actualData = {
      id: data.id,
      first_Name: data.first_Name,
      last_Name: data.last_Name,
      phone_Number: data.phone_Number,
      address_Id: responseData.data.address?.address_Id,
      address: {
        house_number: data.house_number,
        street_number: data.street_number,
        city: data.city,
        area: data.area,
      }
    };
    
    const res = await updateUser(actualData);
    if (res.error) {
      console.log(res.error.data.errors);
      setServerError(res.error.data.errors);
    }
    if (res.data) {
      console.log("data updated");
      setSuccess(true)
      setServerError({})
    }
  };

  if (responseData.isLoading) return <div>Loading...</div>
  if (responseData.isError) return <div>Error al cargar el personal</div>

  const getRoleColor = (type) => {
    const colors = {
      'STAFF': '#4169E1',
      'DELIVER_BOY': '#32CD32',
      'ADMIN': '#DC143C',
      'MANAGER': '#FF8C00'
    };
    return colors[type] || '#666';
  };

  return (
    <div className="user">
      <h1 className="userTitle">Perfil del Personal</h1>
      {success ? (
        <Alert severity="success"> Datos del Perfil Actualizados Exitosamente </Alert>
      ) : (
        ""
      )}
      <div className="userContainer">
        <div
          className="userShow"
          style={{ backgroundImage: `url(${backImg})` }}
        >
          <div className="userShowTop">
            <img src={user_image} alt="" className="userShowImg" />
            <div className="userShowTopTitle  ">
              <span className="userShowUsername ">
                <span style={{ marginRight: "2rem" }}> Nombre: </span>{" "}
                {data.first_Name}
              </span>
              <span className="userShowUsername FontSize">
                <span style={{ marginRight: "2rem" }}>Apellido:</span>{" "}
                {data.last_Name}
              </span>
              <Chip 
                label={data.type} 
                size="medium"
                sx={{ 
                  backgroundColor: getRoleColor(data.type),
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '14px',
                  marginTop: '10px'
                }}
              />
            </div>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle FontSize ">Detalles de la Cuenta</span>
            <div className="userShowInfo">
              <div>
                <BadgeOutlined sx={{ marginRight: '0.2rem' }} />
                <span>ID de Usuario:</span>
              </div>
              <div>
                <span>{data.id}</span>
              </div>
            </div>
            <div className="userShowInfo">
              <div>
                <Security sx={{ marginRight: '0.2rem' }} />
                <span>Tipo:</span>
              </div>
              <div>
                <span>{data.type}</span>
              </div>
            </div>
            {data.role && (
              <div className="userShowInfo">
                <div>
                  <Security sx={{ marginRight: '0.2rem' }} />
                  <span>Rol:</span>
                </div>
                <div>
                  <span>{data.role}</span>
                </div>
              </div>
            )}
            <div className="userShowInfo">
              <div>
                <CalendarToday sx={{ marginRight: '0.2rem' }} />
                <span>Cuenta Creada el:</span>
              </div>
              <div>
                <span>{data.data_Joind}</span>
              </div>
            </div>
            <div className="userShowInfo">
              <div>
                <CalendarToday sx={{ marginRight: '0.2rem' }} />
                <span>Último Acceso:</span>
              </div>
              <div>
                <span> {data.last_login}</span>
              </div>
            </div>
            <span className="userShowTitle FontSize">Detalles de Contacto</span>
            <div className="userShowInfo">
              <div>
                <PhoneAndroid sx={{ marginRight: '0.2rem' }} />
                <span>Número de Teléfono:</span>
              </div>
              <div>
                <span> {data.phone_Number}</span>
              </div>
            </div>
            <div className="userShowInfo">
              <div>
                <MailOutline sx={{ marginRight: '0.2rem' }} />
                <span>Correo Electrónico:</span>
              </div>
              <div>
                <span>{data.email}</span>
              </div>
            </div>

            <div className="userShowInfo">
              <span className="userShowTitle FontSize ">Dirección:</span>
            </div>
            <div className="userShowInfo">
              <div>
                <House sx={{ marginRight: '0.2rem' }} />
                <span> Número de Casa: </span>
              </div>
              <div>
                <span> {data.house_number}</span>
              </div>
            </div>
            <div className="userShowInfo">
              <div>
                <Signpost sx={{ marginRight: '0.2rem' }} />
                <span> Número de Calle: </span>
              </div>
              <div>
                <span> {data.street_number}</span>
              </div>
            </div>
            <div className="userShowInfo">
              <div>
                <LocationSearching sx={{ marginRight: '0.2rem' }} />
                <span> Área: </span>
              </div>
              <div>
                <span> {data.area}</span>
              </div>
            </div>
            <div className="userShowInfo">
              <div>
                <LocationCity sx={{ marginRight: '0.2rem' }} />
                <span> Ciudad: </span>
              </div>
              <div>
                <span> {data.city}</span>
              </div>
            </div>
          </div>
        </div>
        <div
          className="userUpdate"
          style={{ backgroundImage: `url(${backImg})` }}
        >
          <div>
            <span className="userUpdateTitle">Editar Personal</span>
            <form className="userUpdateForm" onSubmit={handleSubmit}>
              <div className="userUpdateLeft">
                <span className="userUpdateItem">
                  <label>Nombre</label>
                  <input
                    type="text"
                    name="first_Name"
                    value={data.first_Name || ""}
                    onChange={handleChange}
                    className="userUpdateInput"
                  />
                  {server_error.first_Name ? (
                    <label style={{ fontSize: 16, color: "red", paddingLeft: 10 }}>
                      {server_error.first_Name[0]}
                    </label>
                  ) : ""}
                </span>
                <span className="userUpdateItem">
                  <label>Apellido</label>
                  <input
                    type="text"
                    value={data.last_Name || ""}
                    onChange={handleChange}
                    className="userUpdateInput"
                    name="last_Name"
                  />
                  {server_error.last_Name ? (
                    <label style={{ fontSize: 16, color: "red", paddingLeft: 10 }}>
                      {server_error.last_Name[0]}
                    </label>
                  ) : ""}
                </span>
                <span className="userUpdateItem">
                  <label>Número de Teléfono</label>
                  <input
                    type="text"
                    value={data.phone_Number || ""}
                    onChange={handleChange}
                    className="userUpdateInput"
                    name="phone_Number"
                  />
                  {server_error.phone_Number ? (
                    <label style={{ fontSize: 16, color: "red", paddingLeft: 10 }}>
                      {server_error.phone_Number[0]}
                    </label>
                  ) : ""}
                </span>
                <span className="userShowTitle">
                  <label style={{ marginTop: "3px" }}>Dirección:</label>
                </span>
                <span className="userUpdateItem">
                  <label>Número de Casa</label>
                  <input
                    type="text"
                    value={data.house_number || ""}
                    onChange={handleChange}
                    className="userUpdateInput"
                    name="house_number"
                  />
                </span>
                <span className="userUpdateItem">
                  <label>Número de Calle</label>
                  <input
                    type="text"
                    value={data.street_number || ""}
                    onChange={handleChange}
                    className="userUpdateInput"
                    name="street_number"
                  />
                </span>
                <span className="userUpdateItem">
                  <label>Área</label>
                  <input
                    type="text"
                    value={data.area || ""}
                    onChange={handleChange}
                    className="userUpdateInput"
                    name="area"
                  />
                </span>
                <span className="userUpdateItem">
                  <label>Ciudad</label>
                  <select
                    className="userUpdateSelect"
                    name="city"
                    value={data.city || ""}
                    onChange={handleChange}
                  >
                    <option value="Rawalpindi"> Rawalpindi</option>
                    <option value="Islamabad">Islamabad</option>
                  </select>
                </span>
              </div>
              <div className="userUpdateRight">
                <div className="userUpdateUpload"> </div>
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <button type="submit" className="userUpdateButton">
                    Actualizar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffProfile