import "./newStaff.css";
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRegisterStaffMutation } from '../../services/userAuthApi'
import {CircularProgress ,Alert, MenuItem, Select, FormControl, Chip, Box } from '@mui/material';
import backImg from '../../images/login-form__bg.png';
import {useNavigate } from "react-router-dom";

const NewStaff =() =>{
    const navigate = useNavigate();
    const roles = useSelector(state => state.roles?.roles || []);
    const [server_error, setServerError] = useState({})
    const [registerUser, { isLoading }] = useRegisterStaffMutation()   
    const [success , setSuccess] = useState(false)
    const [selectedRole, setSelectedRole] = useState('')

    const handleSubmit  = async (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const actualData = {
        first_Name: data.get("first_Name"),
        last_Name: data.get("last_Name"),
        email: data.get("email"),
        password: data.get("password"),
        type: data.get("type"),
        role: selectedRole,
        phone_Number: data.get("phone_Number"),
        address :{
          house_Number: data.get("house_Number"),
          street_Number: data.get("street_Number"),
          city: data.get("city"),
          area: data.get("area")
        }   
      };
      

      const res = await registerUser(actualData);
      if (res.error) {
        console.log(res.error.data.errors)
        setServerError(res.error.data.errors);
      }
      if (res.data) {
        console.log(res.data);
        setSuccess(true)
        setTimeout(function(){ navigate('/admin/staff')} , 3000);
      }
    };
  return (
    <div className="newUser" >
      <h1 className="newUserTitle">Crear Nueva Cuenta de Usuario del Personal</h1>
      {success ? (<Alert severity="success"> {"       "}Personal Agregado Exitosamente {"       "}</Alert>) : ( "")} 
      <form className="newUserForm" onSubmit={handleSubmit} style={{backgroundImage:`url(${backImg})`}}>
        <div className="newUserItem">
          <lable>Nombre</lable>
          <input type="text" placeholder="Ingrese el Nombre" name="first_Name" />
          {server_error.first_Name ? <lable style={{ fontSize: 16, color: 'red', paddingLeft: 10 }}>{server_error.first_Name[0]}</lable> : ""}
        </div>
        <div className="newUserItem">
          <lable>Apellido</lable>
          <input type="text" placeholder="Ingrese el Apellido" name="last_Name" />
          {server_error.last_Name ? <lable style={{ fontSize: 16, color: 'red', paddingLeft: 10 }}>{server_error.last_Name[0]}</lable> : ""}
        </div>
        <div className="newUserItem">
          <lable>Correo Electrónico</lable>
          <input type="email" placeholder="Ingrese el Correo Electrónico" name="email" />
          {server_error.email ? <lable style={{ fontSize: 16, color: 'red', paddingLeft: 10 }}>{server_error.email[0]}</lable> : ""}
        </div>
        <div className="newUserItem">
          <lable>Contraseña</lable>
          <input type="password" placeholder="Ingrese la Contraseña" name="password"/>
          {server_error.password ? <lable style={{ fontSize: 16, color: 'red', paddingLeft: 10 }}>{server_error.password[0]}</lable> : ""}
        </div>
        <div className="newUserItem">
          <lable>Número de Teléfono</lable>
          <input type="text" placeholder="03xxxxxxxxx" name="phone_Number" />
          {server_error.phone_Number ? <lable style={{ fontSize: 16, color: 'red', paddingLeft: 10 }}>{server_error.phone_Number[0]}</lable> : ""}
        </div>
        <div className="newUserItem">
          <lable>Tipo de Usuario</lable>
          <select className="newUserSelect" name="type" id="type">
            <option value="STAFF">Staff</option>
            <option value="DELIVER_BOY">Delivery Boy</option>
          </select>
        </div>
        <div className="newUserItem">
          <lable>Rol y Permisos</lable>
          <FormControl fullWidth>
            <Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              displayEmpty
              className="newUserSelect"
              sx={{
                backgroundColor: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ddd'
                }
              }}
            >
              <MenuItem value="" disabled>
                Seleccione un rol
              </MenuItem>
              {roles.map(role => (
                <MenuItem key={role.id} value={role.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: role.color
                      }}
                    />
                    {role.name}
                    <Chip
                      label={`${role.permissions.length} permisos`}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedRole && (
            <Box sx={{ mt: 1, fontSize: '14px', color: '#666' }}>
              {roles.find(r => r.id === selectedRole)?.description}
            </Box>
          )}
        </div>
        <div className="newUserItem">
          <lable>Número de Casa</lable>
          <input type="text" placeholder="Ingrese el Número de Casa" name="house_Number"/>
          {server_error.house_Number ? <lable style={{ fontSize: 16, color: 'red', paddingLeft: 10 }}>{server_error.house_Number[0]}</lable> : ""}
        </div>
        <div className="newUserItem">
          <lable>Número de Calle</lable>
          <input type="text" placeholder="Ingrese el Número de Calle" name="street_Number" />
          {server_error.street_Number ? <lable style={{ fontSize: 16, color: 'red', paddingLeft: 10 }}>{server_error.street_Number[0]}</lable> : ""}
        </div>
        <div className="newUserItem">
          <lable>Área</lable>
          <input type="text" name="area" placeholder="Ingrese Área/Fase" />
          {server_error.area ? <lable style={{ fontSize: 16, color: 'red', paddingLeft: 10 }}>{server_error.area[0]}</lable> : ""}
        </div>
        <div className="newUserItem">
          <lable>Ciudad</lable>
          <select className="newUserSelect" name="city" id="city">
            <option value="Islamabad">Islamabad</option>
            <option value="Rawalpindi">Rawalpindi</option>
          </select>
        </div>
        <div> </div>
        
        {isLoading ? <CircularProgress /> : <button  type="submit" className="newUserButton">Crear Personal</button> } 
      </form>
    </div>
  );
}

export default NewStaff