import React, { useState } from 'react'
import {useUpdateStatusMutation , useGetAllCustomOrdersQuery}  from '../../services/customOrderApi'
import './designtool.css';
import { useNavigate } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {
  Box, Card, CardContent, Typography, Button, Chip, Select, MenuItem,
  FormControl, InputLabel, Grid, TextField, Alert
} from '@mui/material';
import {
  Cake, Visibility, Cancel, CheckCircle, HourglassEmpty,
  LocalShipping, Search
} from '@mui/icons-material';

function Designtool() {
  const navigate = useNavigate();
  const response = useGetAllCustomOrdersQuery();
  const [updateOrder] = useUpdateStatusMutation();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [success, setSuccess] = useState('');

  console.log("Response information: ", response);
  console.log("Data: ", response.data);
  console.log("Success: ", response.isSuccess);
  
  if (response.isLoading) return <div className="loading-state">Cargando pedidos personalizados...</div>;
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
              setSuccess('Pedido cancelado exitosamente');
              setTimeout(() => setSuccess(''), 3000);
            }}
          },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  }

  const handleStatusChange = async (orderId, newStatus) => {
    const updateData = {
      id: orderId,
      order_Status: newStatus,
    };
    const res = await updateOrder(updateData);
    if(res.data){
      setSuccess(`Estado actualizado a "${newStatus}"`);
      setTimeout(() => setSuccess(''), 3000);
    }
  }

  const handleEdit = props => {
    console.log(props);
    navigate(`/admin/customorder/details/${props}`);
  };

  // Filtrar pedidos
  const filteredOrders = arr.filter(order => {
    // Validar que order_Status existe
    const orderStatus = order?.order_Status || '';
    const matchesStatus = filterStatus === 'all' || orderStatus.toLowerCase() === filterStatus.toLowerCase();
    
    // Validar que los campos existen antes de buscar
    const cakeShape = order?.Cake_Shape_layers?.cake_shape || '';
    const flavorName = order?.sponge_Flavor?.flavor_name || '';
    const matchesSearch = searchTerm === '' || 
      cakeShape.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flavorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orderStatus.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calcular estadísticas
  const totalOrders = arr.length;
  const pendingOrders = arr.filter(o => o?.order_Status?.toLowerCase() === 'pending').length;
  const completedOrders = arr.filter(o => o?.order_Status?.toLowerCase() === 'completed').length;
  const canceledOrders = arr.filter(o => o?.order_Status?.toLowerCase() === 'canceled').length;

  const getStatusIcon = (status) => {
    const statusLower = (status || '').toLowerCase();
    switch(statusLower) {
      case 'pending': return <HourglassEmpty />;
      case 'processing': return <Cake />;
      case 'completed': return <CheckCircle />;
      case 'delivered': return <LocalShipping />;
      case 'canceled': return <Cancel />;
      default: return <Cake />;
    }
  };

  const getStatusColor = (status) => {
    const statusLower = (status || '').toLowerCase();
    switch(statusLower) {
      case 'pending': return '#FFC107';
      case 'processing': return '#2196F3';
      case 'completed': return '#4CAF50';
      case 'delivered': return '#9C27B0';
      case 'canceled': return '#F44336';
      default: return '#757575';
    }
  };

  return (
    <Box className="designtool-container">
      <Box className="designtool-header">
        <Box>
          <Typography variant="h4" className="designtool-title">
            <Cake sx={{ mr: 2, fontSize: 32 }} />
            Pedidos Personalizados
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Gestiona los diseños de pasteles personalizados
          </Typography>
        </Box>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Estadísticas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="stat-card">
            <CardContent>
              <Typography variant="h6" color="textSecondary">Total</Typography>
              <Typography variant="h3" fontWeight="bold" color="primary">
                {totalOrders}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="stat-card">
            <CardContent>
              <Typography variant="h6" color="textSecondary">Pendientes</Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ color: '#FFC107' }}>
                {pendingOrders}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="stat-card">
            <CardContent>
              <Typography variant="h6" color="textSecondary">Completados</Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ color: '#4CAF50' }}>
                {completedOrders}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="stat-card">
            <CardContent>
              <Typography variant="h6" color="textSecondary">Cancelados</Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ color: '#F44336' }}>
                {canceledOrders}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Buscar por forma, sabor o estado..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />
            }}
            sx={{ flexGrow: 1, minWidth: 300 }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Filtrar por Estado</InputLabel>
            <Select
              value={filterStatus}
              label="Filtrar por Estado"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="pending">Pendiente</MenuItem>
              <MenuItem value="processing">En Proceso</MenuItem>
              <MenuItem value="completed">Completado</MenuItem>
              <MenuItem value="delivered">Entregado</MenuItem>
              <MenuItem value="canceled">Cancelado</MenuItem>
            </Select>
          </FormControl>
          <Chip 
            label={`${filteredOrders.length} resultados`}
            color="primary"
            variant="outlined"
          />
        </Box>
      </Card>

      {/* Lista de Pedidos */}
      <div className="customOrdergrid">
        {filteredOrders.length === 0 ? (
          <Card sx={{ p: 4, textAlign: 'center', gridColumn: '1 / -1' }}>
            <Typography variant="h6" color="textSecondary">
              No se encontraron pedidos
            </Typography>
          </Card>
        ) : (
          filteredOrders.map((data, index) => (
            <Card key={index} className="customOrdercard modern-order-card">
              <Box className="order-image-container">
                {data?.finalProduct?.finalProductImg ? (
                  <img 
                    src={`http://127.0.0.1:8000${data.finalProduct.finalProductImg}`} 
                    alt="Pastel Personalizado" 
                    className="customOrderimage" 
                  />
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Cake sx={{ fontSize: 80, color: 'white', opacity: 0.5 }} />
                  </Box>
                )}
                <Chip
                  icon={getStatusIcon(data?.order_Status)}
                  label={data?.order_Status || 'Pending'}
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: getStatusColor(data?.order_Status),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
              <CardContent className="customOrderdata">
                <Box className="order-details">
                  <Box className='customOrderdataGrid'>
                    <Typography variant="subtitle2" color="textSecondary">
                      Forma del Pastel:
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {data?.Cake_Shape_layers?.cake_shape || 'N/A'}
                    </Typography>
                  </Box>
                  <Box className='customOrderdataGrid'>
                    <Typography variant="subtitle2" color="textSecondary">
                      Sabor:
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {data?.sponge_Flavor?.flavor_name || 'N/A'}
                    </Typography>
                  </Box>
                  <Box className='customOrderdataGrid'>
                    <Typography variant="subtitle2" color="textSecondary">
                      Glaseado:
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {data?.Icing?.decoration_name || 'N/A'}
                    </Typography>
                  </Box>
                  {data?.msg_on_cake && (
                    <Box className='customOrderdataGrid'>
                      <Typography variant="subtitle2" color="textSecondary">
                        Mensaje:
                      </Typography>
                      <Typography 
                        variant="body2" 
                        fontWeight="500"
                        sx={{ color: data?.msg_color?.color_Code || '#000', fontStyle: 'italic' }}
                      >
                        "{data.msg_on_cake}"
                      </Typography>
                    </Box>
                  )}
                  <Box className='customOrderdataGrid'>
                    <Typography variant="subtitle2" color="textSecondary">
                      Monto Total:
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      ${data?.amount || 0}
                    </Typography>
                  </Box>
                </Box>

                <Box className="order-actions" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormControl size="small" fullWidth>
                    <InputLabel>Cambiar Estado</InputLabel>
                    <Select
                      value={data?.order_Status || 'Pending'}
                      label="Cambiar Estado"
                      onChange={(e) => handleStatusChange(data.id, e.target.value)}
                    >
                      <MenuItem value="Pending">Pendiente</MenuItem>
                      <MenuItem value="Processing">En Proceso</MenuItem>
                      <MenuItem value="Completed">Completado</MenuItem>
                      <MenuItem value="Delivered">Entregado</MenuItem>
                      <MenuItem value="Canceled">Cancelado</MenuItem>
                    </Select>
                  </FormControl>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Visibility />}
                      onClick={() => handleEdit(data.id)}
                      sx={{
                        backgroundColor: '#DA627D',
                        '&:hover': { backgroundColor: '#A53860' }
                      }}
                    >
                      Ver Detalles
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      startIcon={<Cancel />}
                      onClick={() => handleCancel(data.id)}
                      disabled={data?.order_Status?.toLowerCase() === 'canceled'}
                    >
                      Cancelar
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </Box>
  );
}
export default Designtool
