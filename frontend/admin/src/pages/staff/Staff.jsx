import React, {useState} from 'react'
import './staff.css'
import { Link } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import { DeleteOutline ,Edit, Security, Visibility} from "@mui/icons-material";
import {useGetAllStaffQuery , useDeleteUserMutation} from '../../services/userCRUDApi'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useNavigate } from 'react-router-dom' 
import { Alert, Chip, Tooltip, IconButton } from "@mui/material";

function Staff() {
  const [success , setSuccess] = useState(false)
  const { data, isLoading, isError } = useGetAllStaffQuery()
  const [deleteUser]= useDeleteUserMutation()
  const navigate = useNavigate();

  if(isLoading) return <div>Loading.....</div>
  if(isError) return <div>Error al cargar el personal</div>
  
  // Validar que data existe y es un array
  const staffList = Array.isArray(data) ? data : [];
  
  console.log('Staff data:', staffList)
 
  const handleEdit = (props) => {
    console.log(props)
    navigate(`/admin/staff/edit/${props}`);
  };

  const handleViewPermissions = (staff) => {
    confirmAlert({
      title: `Permisos de ${staff.first_Name} ${staff.last_Name}`,
      message: (
        <div style={{ textAlign: 'left', maxHeight: '400px', overflow: 'auto' }}>
          <p><strong>Rol:</strong> {staff.role || 'No asignado'}</p>
          <p><strong>Tipo:</strong> {staff.type}</p>
          <p style={{ marginTop: '10px' }}>
            Para ver o modificar permisos detallados, edite el usuario o vaya a 
            la sección de Roles y Permisos.
          </p>
        </div>
      ),
      buttons: [
        {
          label: 'Editar',
          onClick: () => handleEdit(staff.id)
        },
        {
          label: 'Cerrar',
          onClick: () => {}
        }
      ]
    });
  };

  const handleDelete = (props)=>{
    confirmAlert({
      title: 'Confirmar Eliminación de Miembro del Personal',
      message: '¿Está seguro de eliminar este miembro del personal?',
      buttons: [
        {
          label: 'Sí',
          onClick: async() => {
            const res= await deleteUser(props)
            if(res.error){
              console.log("error in deleting user")
            }
            setSuccess(true)       
          }        
        },
        {
          label: 'No',
          onClick: () => {}
        }]});
  }

  const getRoleColor = (type) => {
    const colors = {
      'STAFF': '#4169E1',
      'DELIVER_BOY': '#32CD32',
      'ADMIN': '#DC143C',
      'MANAGER': '#FF8C00'
    };
    return colors[type] || '#666';
  };

  const columns = [
    {field: "type", headerName: "Tipo", width: 120,headerClassName: 'column',
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small"
          sx={{ 
            backgroundColor: getRoleColor(params.value),
            color: 'white',
            fontWeight: 500
          }}
        />
      )
    },
    {field: "id", headerName: "ID", width: 70,headerClassName: 'column', },
    {field: "first_Name",headerName: "Nombre",width: 150, headerClassName: 'column',},
    {field: "last_Name",headerName: "Apellido",width: 150,headerClassName: 'column',},
    {field: "email", headerName: "Correo Electrónico", width: 250 ,headerClassName: 'column',}, 
    {field: "phone_Number",headerName: "Teléfono",width: 150,headerClassName: 'column',},
    {field: "role",headerName: "Rol",width: 150,headerClassName: 'column',
      renderCell: (params) => {
        const roleValue = params.value || 'Sin asignar';
        return (
          <Chip 
            label={roleValue}
            size="small"
            variant="outlined"
            icon={<Security />}
          />
        );
      }
    },
    {field: "action",headerName: "Acciones",width: 200,headerClassName: 'column',
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Tooltip title="Ver Permisos">
              <IconButton
                size="small"
                onClick={() => handleViewPermissions(params.row)}
                sx={{ color: '#4169E1' }}
              >
                <Visibility />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar">
              <IconButton
                size="small"
                onClick={() => handleEdit(params.row.id)}
                sx={{ color: '#DA627D' }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton
                size="small"
                onClick={() => handleDelete(params.row.id)}
                sx={{ color: '#dc3545' }}
              >
                <DeleteOutline />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];
  return (
    <>
      <div className="userTitleContainer">
        <h1 className="userTitle">Lista de Personal</h1>
        {success ? (<Alert severity="success"> {"       "}Personal Eliminado Exitosamente </Alert>) : ( "")} 
        <Link to="/admin/newstaff">
          <button className="userAddButton"> Crear Usuario</button>
        </Link>
      </div>
      <div className="userList"> 
        <DataGrid rows={staffList} columns={columns} style={{ fontSize:'18px',borderRadius:'1rem',backgroundColor :" #fff0f1"}}/>
      </div>
    </>
  );
}

export default Staff