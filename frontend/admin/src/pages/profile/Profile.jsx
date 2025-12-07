import React from 'react'
import'./profile.css'
import { getToken} from '../../services/LocalStorageService';
import { useGetLoggedUserQuery } from '../../services/userCRUDApi';
import {House,Signpost,LocationCity,CalendarToday,BadgeOutlined,LocationSearching,MailOutline,PhoneAndroid,Edit,Save,Cancel} from "@mui/icons-material";
import user_image from "../profile/UserAfatar.jpg";
import backImg from '../../images/login-form__bg.png';
import { Alert, CircularProgress, Button, TextField, Box, Card, CardContent, Chip, Typography } from "@mui/material";
import { useUpdateUserMutation } from "../../services/userCRUDApi";
import { useState , useEffect } from "react";

function Profile() {
  const { access_token } = getToken()
  const  responseData  = useGetLoggedUserQuery(access_token)
  const [data, setData] = useState("");
  const [success , setSuccess] = useState(false)
  const [server_error, setServerError] = useState({});
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [editMode, setEditMode] = useState(false);

  console.log("Data: ", responseData.data);
  console.log("Success: ", responseData.isSuccess);

  useEffect(() => {
    if (responseData.isSuccess) {
    setData ({
        id: responseData.data.id,
        first_Name: responseData.data.first_name || '',
        last_Name: responseData.data.last_name || '',
        phone_Number: responseData.data.phone_number || '',
        data_Joind: responseData.data.created_at || '',
        email: responseData.data.email || '',
        last_login: responseData.data.last_login_at || '',
        type: responseData.data.type || '',
        is_staff: responseData.data.is_staff || false,
        house_number: responseData.data.address?.house_number || '',
        street_number: responseData.data.address?.street_number || '',
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
      address:{
        house_number: data.house_number,
        street_number: data.street_number,
        city: data.city,
        area: data.area,
      }   
    };
    console.log('here the data for quary', actualData);
    const res = await updateUser(actualData);
    if (res.error) {
      console.log(typeof res.error.data.errors);
      console.log(res.error.data.errors);
      setServerError(res.error.data.errors);
    }
    if (res.data) {
      console.log(typeof res.data);
      console.log("data updated");
      setSuccess(true)
      setServerError({})
      setEditMode(false)
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleCancelEdit = () => {
    // Restaurar datos originales
    setData({
      id: responseData.data.id,
      first_Name: responseData.data.first_name || '',
      last_Name: responseData.data.last_name || '',
      phone_Number: responseData.data.phone_number || '',
      data_Joind: responseData.data.created_at || '',
      email: responseData.data.email || '',
      last_login: responseData.data.last_login_at || '',
      type: responseData.data.type || '',
      is_staff: responseData.data.is_staff || false,
      house_number: responseData.data.address?.house_number || '',
      street_number: responseData.data.address?.street_number || '',
      city: responseData.data.address?.city || '',
      area: responseData.data.address?.area || '',
    });
    setEditMode(false);
    setServerError({});
  };
  
  
  return (
    <div className="user">
      <Box className="profile-header">
        <h1 className="userTitle">Mi Perfil de Administrador</h1>
        {!editMode && (
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => setEditMode(true)}
            sx={{
              backgroundColor: '#DA627D',
              '&:hover': { backgroundColor: '#A53860' }
            }}
          >
            Editar Perfil
          </Button>
        )}
      </Box>
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ✓ Datos del Perfil Actualizados Exitosamente
        </Alert>
      )}

      <div className="userContainer">
        <Card
          className="userShow modern-card"
          sx={{ 
            backgroundImage: `url(${backImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <CardContent>
            <div className="userShowTop">
              <img src={user_image} alt="Profile" className="userShowImg" />
              <div className="userShowTopTitle">
                <Typography variant="h5" fontWeight="bold">
                  {data.first_Name} {data.last_Name}
                </Typography>
                <Chip label="Administrador" color="primary" size="small" sx={{ mt: 1 }} />
              </div>
            </div>

            <Box className="userShowBottom" sx={{ mt: 3 }}>
              <Typography variant="h6" className="userShowTitle" sx={{ mb: 2 }}>
                Detalles de la Cuenta
              </Typography>
              
              <Box className="info-grid">
                <div className="userShowInfo">
                  <BadgeOutlined sx={{color: '#DA627D'}} />
                  <Box>
                    <Typography variant="caption" color="textSecondary">ID de Usuario</Typography>
                    <Typography variant="body2" fontWeight="500">{data.id}</Typography>
                  </Box>
                </div>

                <div className="userShowInfo">
                  <CalendarToday sx={{color: '#DA627D'}} />
                  <Box>
                    <Typography variant="caption" color="textSecondary">Cuenta Creada</Typography>
                    <Typography variant="body2" fontWeight="500">{data.data_Joind}</Typography>
                  </Box>
                </div>

                <div className="userShowInfo">
                  <CalendarToday sx={{color: '#DA627D'}} />
                  <Box>
                    <Typography variant="caption" color="textSecondary">Último Acceso</Typography>
                    <Typography variant="body2" fontWeight="500">{data.last_login}</Typography>
                  </Box>
                </div>
              </Box>

              <Typography variant="h6" className="userShowTitle" sx={{ mb: 2, mt: 3 }}>
                Detalles de Contacto
              </Typography>
              
              <Box className="info-grid">
                <div className="userShowInfo">
                  <PhoneAndroid sx={{color: '#DA627D'}} />
                  <Box>
                    <Typography variant="caption" color="textSecondary">Teléfono</Typography>
                    <Typography variant="body2" fontWeight="500">{data.phone_Number}</Typography>
                  </Box>
                </div>

                <div className="userShowInfo">
                  <MailOutline sx={{color: '#DA627D'}} />
                  <Box>
                    <Typography variant="caption" color="textSecondary">Correo Electrónico</Typography>
                    <Typography variant="body2" fontWeight="500">{data.email}</Typography>
                  </Box>
                </div>
              </Box>

              <Typography variant="h6" className="userShowTitle" sx={{ mb: 2, mt: 3 }}>
                Dirección
              </Typography>
              
              <Box className="info-grid">
                <div className="userShowInfo">
                  <House sx={{color: '#DA627D'}} />
                  <Box>
                    <Typography variant="caption" color="textSecondary">Número de Casa</Typography>
                    <Typography variant="body2" fontWeight="500">{data.house_number}</Typography>
                  </Box>
                </div>

                <div className="userShowInfo">
                  <Signpost sx={{color: '#DA627D'}} />
                  <Box>
                    <Typography variant="caption" color="textSecondary">Número de Calle</Typography>
                    <Typography variant="body2" fontWeight="500">{data.street_number}</Typography>
                  </Box>
                </div>

                <div className="userShowInfo">
                  <LocationSearching sx={{color: '#DA627D'}} />
                  <Box>
                    <Typography variant="caption" color="textSecondary">Área</Typography>
                    <Typography variant="body2" fontWeight="500">{data.area}</Typography>
                  </Box>
                </div>

                <div className="userShowInfo">
                  <LocationCity sx={{color: '#DA627D'}} />
                  <Box>
                    <Typography variant="caption" color="textSecondary">Ciudad</Typography>
                    <Typography variant="body2" fontWeight="500">{data.city}</Typography>
                  </Box>
                </div>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {editMode && (
          <Card
            className="userUpdate modern-card"
            sx={{ 
              backgroundImage: `url(${backImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <CardContent>
              <Typography variant="h6" className="userUpdateTitle" sx={{ mb: 3 }}>
                Editar Información
              </Typography>
              <form className="userUpdateForm" onSubmit={handleSubmit}>
                <Box className="form-grid">
                  <TextField
                    fullWidth
                    label="Nombre"
                    name="first_Name"
                    value={data.first_Name || ""}
                    onChange={handleChange}
                    error={!!server_error.first_Name}
                    helperText={server_error.first_Name?.[0]}
                    variant="outlined"
                    sx={{ backgroundColor: 'white', borderRadius: 1 }}
                  />

                  <TextField
                    fullWidth
                    label="Apellido"
                    name="last_Name"
                    value={data.last_Name || ""}
                    onChange={handleChange}
                    error={!!server_error.last_Name}
                    helperText={server_error.last_Name?.[0]}
                    variant="outlined"
                    sx={{ backgroundColor: 'white', borderRadius: 1 }}
                  />

                  <TextField
                    fullWidth
                    label="Número de Teléfono"
                    name="phone_Number"
                    value={data.phone_Number || ""}
                    onChange={handleChange}
                    error={!!server_error.phone_Number}
                    helperText={server_error.phone_Number?.[0]}
                    variant="outlined"
                    sx={{ backgroundColor: 'white', borderRadius: 1 }}
                  />

                  <TextField
                    fullWidth
                    label="Número de Casa"
                    name="house_number"
                    value={data.house_number || ""}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ backgroundColor: 'white', borderRadius: 1 }}
                  />

                  <TextField
                    fullWidth
                    label="Número de Calle"
                    name="street_number"
                    value={data.street_number || ""}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ backgroundColor: 'white', borderRadius: 1 }}
                  />

                  <TextField
                    fullWidth
                    label="Área"
                    name="area"
                    value={data.area || ""}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ backgroundColor: 'white', borderRadius: 1 }}
                  />

                  <TextField
                    fullWidth
                    select
                    label="Ciudad"
                    name="city"
                    value={data.city || ""}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ backgroundColor: 'white', borderRadius: 1 }}
                    SelectProps={{ native: true }}
                  >
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Islamabad">Islamabad</option>
                  </TextField>
                </Box>

                <Box className="form-actions" sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  {isLoading ? (
                    <CircularProgress />
                  ) : (
                    <>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<Save />}
                        sx={{
                          backgroundColor: '#DA627D',
                          '&:hover': { backgroundColor: '#A53860' }
                        }}
                      >
                        Guardar Cambios
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={handleCancelEdit}
                        color="error"
                      >
                        Cancelar
                      </Button>
                    </>
                  )}
                </Box>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}


export default Profile

