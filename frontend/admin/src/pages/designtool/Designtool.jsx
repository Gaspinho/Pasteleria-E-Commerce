import React, { useState } from 'react'
import {useUpdateStatusMutation , useGetAllCustomOrdersQuery}  from '../../services/customOrderApi'
import './designtool.css';
import { useNavigate } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import logo from "../../images/logo.ico";
import {
  Box, Card, CardContent, Typography, Button, Chip, Select, MenuItem,
  FormControl, InputLabel, Grid, TextField, Alert, Avatar
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
    
    // Búsqueda más completa incluyendo más campos
    const cakeShape = order?.custom_cake?.shape_layer?.shape_name || '';
    const flavorName = order?.custom_cake?.sponge_flavor?.name || '';
    const icingName = order?.custom_cake?.icing?.name || '';
    const msgOnCake = order?.custom_cake?.msg_on_cake || '';
    const specialInstruction = order?.custom_cake?.special_instruction || '';
    const paymentType = order?.payment?.payment_type || '';
    const paymentStatus = order?.payment?.payment_status || '';
    const city = order?.address?.city || '';
    
    const matchesSearch = searchTerm === '' || 
      cakeShape.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flavorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msgOnCake.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialInstruction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orderStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paymentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paymentStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.toLowerCase().includes(searchTerm.toLowerCase());
      
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
            placeholder="Buscar por forma, sabor, glaseado, mensaje, ciudad, pago..."
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
                <Avatar 
                  src={logo} 
                  alt="Pedido Personalizado" 
                  sx={{ width: 80, height: 80, margin: 'auto' }}
                />
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
                  {/* ID del Pedido */}
                  <Box className='customOrderdataGrid'>
                    <Typography variant="subtitle2" color="textSecondary">
                      ID Pedido:
                    </Typography>
                    <Typography variant="body2" fontWeight="500" sx={{ fontSize: '0.75rem' }}>
                      {data?.id?.substring(0, 8)}...
                    </Typography>
                  </Box>

                  {/* Información del Pastel */}
                  <Box className='customOrderdataGrid'>
                    <Typography variant="subtitle2" color="textSecondary">
                      Forma y Capas:
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {data?.custom_cake?.shape_layer?.shape_name || 'N/A'} 
                      {data?.custom_cake?.shape_layer?.layer_description && 
                        ` (${data.custom_cake.shape_layer.layer_description})`}
                    </Typography>
                  </Box>
                  
                  <Box className='customOrderdataGrid'>
                    <Typography variant="subtitle2" color="textSecondary">
                      Sabor Bizcocho:
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {data?.custom_cake?.sponge_flavor?.name || 'N/A'}
                    </Typography>
                  </Box>
                  
                  <Box className='customOrderdataGrid'>
                    <Typography variant="subtitle2" color="textSecondary">
                      Glaseado/Relleno:
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {data?.custom_cake?.icing?.name || 'N/A'}
                    </Typography>
                  </Box>

                  {data?.custom_cake?.top_img_decoration && (
                    <Box className='customOrderdataGrid'>
                      <Typography variant="subtitle2" color="textSecondary">
                        Decoración Superior:
                      </Typography>
                      <Typography variant="body2" fontWeight="500">
                        {data.custom_cake.top_img_decoration.name || 'N/A'}
                      </Typography>
                    </Box>
                  )}

                  {data?.custom_cake?.msg_on_cake && (
                    <Box className='customOrderdataGrid'>
                      <Typography variant="subtitle2" color="textSecondary">
                        Mensaje:
                      </Typography>
                      <Typography 
                        variant="body2" 
                        fontWeight="500"
                        sx={{ 
                          color: data?.custom_cake?.msg_color?.color_code || '#000', 
                          fontStyle: 'italic',
                          backgroundColor: 'rgba(0,0,0,0.05)',
                          padding: '4px 8px',
                          borderRadius: '4px'
                        }}
                      >
                        "{data.custom_cake.msg_on_cake}"
                      </Typography>
                    </Box>
                  )}

                  {data?.custom_cake?.special_instruction && (
                    <Box className='customOrderdataGrid' sx={{ gridColumn: '1 / -1' }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Instrucciones Especiales:
                      </Typography>
                      <Typography variant="body2" fontWeight="500" sx={{ fontStyle: 'italic' }}>
                        {data.custom_cake.special_instruction}
                      </Typography>
                    </Box>
                  )}

                  {/* Información de Entrega */}
                  {(data?.delivery_at || data?.delivery_time_window) && (
                    <>
                      <Box className='customOrderdataGrid'>
                        <Typography variant="subtitle2" color="textSecondary">
                          Fecha de Entrega:
                        </Typography>
                        <Typography variant="body2" fontWeight="500">
                          {data?.delivery_at ? new Date(data.delivery_at).toLocaleDateString('es-ES') : 'N/A'}
                        </Typography>
                      </Box>
                      {data?.delivery_time_window && (
                        <Box className='customOrderdataGrid'>
                          <Typography variant="subtitle2" color="textSecondary">
                            Hora de Entrega:
                          </Typography>
                          <Typography variant="body2" fontWeight="500">
                            {data.delivery_time_window}
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}

                  {/* Dirección de Entrega */}
                  {data?.address && (
                    <Box className='customOrderdataGrid' sx={{ gridColumn: '1 / -1' }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Dirección de Entrega:
                      </Typography>
                      <Typography variant="body2" fontWeight="500">
                        Casa: {data.address.house_number || 'N/A'}, Calle: {data.address.street_number || 'N/A'}, Área: {data.address.area || 'N/A'}, Ciudad: {data.address.city || 'N/A'}
                      </Typography>
                    </Box>
                  )}

                  {/* Información de Pago */}
                  <Box className='customOrderdataGrid'>
                    <Typography variant="subtitle2" color="textSecondary">
                      Método de Pago:
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {data?.payment?.payment_type || 'N/A'}
                    </Typography>
                  </Box>

                  <Box className='customOrderdataGrid'>
                    <Typography variant="subtitle2" color="textSecondary">
                      Estado de Pago:
                    </Typography>
                    <Chip 
                      label={data?.payment?.payment_status || 'Pendiente'}
                      size="small"
                      color={data?.payment?.payment_status === 'Paid' ? 'success' : 'warning'}
                    />
                  </Box>

                  {data?.delivery_charges && (
                    <Box className='customOrderdataGrid'>
                      <Typography variant="subtitle2" color="textSecondary">
                        Cargo de Envío:
                      </Typography>
                      <Typography variant="body2" fontWeight="500">
                        ${data.delivery_charges}
                      </Typography>
                    </Box>
                  )}

                  <Box className='customOrderdataGrid'>
                    <Typography variant="subtitle2" color="textSecondary">
                      Monto del Pastel:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      ${data?.custom_cake?.amount || 0}
                    </Typography>
                  </Box>

                  <Box className='customOrderdataGrid'>
                    <Typography variant="subtitle2" color="textSecondary">
                      Total Final:
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      ${(parseFloat(data?.custom_cake?.amount || 0) + parseFloat(data?.delivery_charges || 0)).toFixed(2)}
                    </Typography>
                  </Box>

                  {data?.placed_at && (
                    <Box className='customOrderdataGrid' sx={{ gridColumn: '1 / -1' }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Fecha del Pedido:
                      </Typography>
                      <Typography variant="body2" fontWeight="500">
                        {new Date(data.placed_at).toLocaleString('es-ES')}
                      </Typography>
                    </Box>
                  )}
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
