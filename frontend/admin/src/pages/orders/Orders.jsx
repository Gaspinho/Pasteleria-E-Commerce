import React, { useState } from 'react';
import { useGetAllOrderQuery, useUpdateOrderMutation } from '../../services/orderApi';
import './orders.css';
import logo from "../../images/logo.ico";
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {
  Box, Card, CardContent, Typography, Button, Chip, Select, MenuItem,
  FormControl, InputLabel, Grid, TextField, Alert, Avatar
} from '@mui/material';
import {
  ShoppingBag, Visibility, Cancel, CheckCircle, HourglassEmpty,
  LocalShipping, Search, Person, Home, AttachMoney, CalendarToday
} from '@mui/icons-material';

function Orders() {
  const navigate = useNavigate();
  const response = useGetAllOrderQuery();
  const [updateOrder] = useUpdateOrderMutation();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [success, setSuccess] = useState('');

  console.log("Response Information: ", response);
  console.log("Data: ", response.data);
  console.log("Success: ", response.isSuccess);
  
  if (response.isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <Typography>Cargando pedidos...</Typography>
    </Box>
  );
  
  if (response.isError) return (
    <Alert severity="error" sx={{ m: 3 }}>
      Ocurrió un error: {response.error.error}
    </Alert>
  );

  const arr = (response.data).slice().reverse();

  const handleCancel = (props) => {
    const updateData = {
      id: props,
      order_Status: "Canceled",
    };
    confirmAlert({
      title: 'Confirmar Cancelación de Pedido',
      message: '¿Está seguro de cancelar este pedido?',
      buttons: [
        {
          label: 'Sí',
          onClick: async () => {
            const res = await updateOrder(updateData);
            if (res.isError) {
              console.log(res.error.error);
            }
            if (res.data) {
              setSuccess('Pedido cancelado exitosamente');
              setTimeout(() => setSuccess(''), 3000);
            }
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const updateData = {
      id: orderId,
      order_Status: newStatus,
    };
    const res = await updateOrder(updateData);
    if (res.data) {
      setSuccess(`Estado actualizado a "${newStatus}"`);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleEdit = props => {
    console.log(props);
    navigate(`/admin/order/details/${props}`);
  };

  // Filtrar pedidos
  const filteredOrders = arr.filter(order => {
    const orderStatus = order?.order_Status || '';
    const matchesStatus = filterStatus === 'all' || orderStatus.toLowerCase() === filterStatus.toLowerCase();
    const orderId = order?.order_Id?.toString() || '';
    const customerId = order?.customer?.toString() || '';
    const city = order?.address?.city || '';
    const matchesSearch = searchTerm === '' || 
      orderId.includes(searchTerm) ||
      customerId.includes(searchTerm) ||
      city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calcular estadísticas
  const totalOrders = arr.length;
  const pendingOrders = arr.filter(o => o?.order_Status === 'Order Placed').length;
  const deliveredOrders = arr.filter(o => o?.order_Status === 'Deliverd').length;
  const canceledOrders = arr.filter(o => o?.order_Status === 'Canceled').length;

  const getStatusIcon = (status) => {
    const safeStatus = status || 'Order Placed';
    switch(safeStatus) {
      case 'Order Placed': return <HourglassEmpty />;
      case 'Under Package': return <ShoppingBag />;
      case 'On The way to deliver': return <LocalShipping />;
      case 'Deliverd': return <CheckCircle />;
      case 'Canceled': return <Cancel />;
      default: return <HourglassEmpty />;
    }
  };

  const getStatusColor = (status) => {
    const safeStatus = status || 'Order Placed';
    switch(safeStatus) {
      case 'Order Placed': return '#FF9800';
      case 'Under Package': return '#9C27B0';
      case 'On The way to deliver': return '#2196F3';
      case 'Deliverd': return '#4CAF50';
      case 'Canceled': return '#F44336';
      default: return '#757575';
    }
  };

  return (
    <Box className="orders-container">
      <Box className="orders-header">
        <Box>
          <Typography variant="h4" className="orders-title">
            <ShoppingBag sx={{ mr: 2, fontSize: 32 }} />
            Gestión de Pedidos
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Administra todos los pedidos de tu tienda
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
              <Typography variant="h3" fontWeight="bold" sx={{ color: '#FF9800' }}>
                {pendingOrders}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="stat-card">
            <CardContent>
              <Typography variant="h6" color="textSecondary">Entregados</Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ color: '#4CAF50' }}>
                {deliveredOrders}
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
            placeholder="Buscar por ID, cliente o ciudad..."
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
              <MenuItem value="order placed">Pedido Realizado</MenuItem>
              <MenuItem value="under package">En Empaque</MenuItem>
              <MenuItem value="on the way to deliver">En Camino</MenuItem>
              <MenuItem value="deliverd">Entregado</MenuItem>
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
      <div className="grid">
        {filteredOrders.length === 0 ? (
          <Card sx={{ p: 4, textAlign: 'center', gridColumn: '1 / -1' }}>
            <Typography variant="h6" color="textSecondary">
              No se encontraron pedidos
            </Typography>
          </Card>
        ) : (
          filteredOrders.map((data, index) => (
            <Card key={index} className="order-card modern-order-card">
              <Box className="order-image-container">
                <Avatar 
                  src={logo} 
                  alt="Order" 
                  sx={{ width: 80, height: 80, margin: 'auto' }}
                />
                <Chip
                  icon={getStatusIcon(data?.order_Status)}
                  label={data?.order_Status || 'Order Placed'}
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
              <CardContent className="order-data">
                <Box className="order-details">
                  <Box className='order-data-grid'>
                    <Typography variant="subtitle2" color="textSecondary">
                      ID de Pedido:
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      #{data?.order_Id || 'N/A'}
                    </Typography>
                  </Box>
                  <Box className='order-data-grid'>
                    <Typography variant="subtitle2" color="textSecondary">
                      <CalendarToday sx={{ fontSize: 14, mr: 0.5 }} />
                      Fecha/Hora:
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {data?.order_Placment_Date || 'N/A'} {data?.order_Placment_Time || ''}
                    </Typography>
                  </Box>
                  <Box className='order-data-grid'>
                    <Typography variant="subtitle2" color="textSecondary">
                      <AttachMoney sx={{ fontSize: 14, mr: 0.5 }} />
                      Monto Total:
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      ${data?.total_Amount || 0}
                    </Typography>
                  </Box>
                  <Box className='order-data-grid'>
                    <Typography variant="subtitle2" color="textSecondary">
                      <Person sx={{ fontSize: 14, mr: 0.5 }} />
                      ID de Cliente:
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {data?.customer || 'N/A'}
                    </Typography>
                  </Box>
                  <Box className='order-data-grid'>
                    <Typography variant="subtitle2" color="textSecondary">
                      <Home sx={{ fontSize: 14, mr: 0.5 }} />
                      Dirección:
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      H: {data?.address?.house_Number || 'N/A'}, St: {data?.address?.street_Number || 'N/A'}, {data?.address?.area || 'N/A'}, {data?.address?.city || 'N/A'}
                    </Typography>
                  </Box>
                </Box>

                <Box className="order-actions" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormControl size="small" fullWidth>
                    <InputLabel>Cambiar Estado</InputLabel>
                    <Select
                      value={data?.order_Status || 'Order Placed'}
                      label="Cambiar Estado"
                      onChange={(e) => handleStatusChange(data.order_Id, e.target.value)}
                    >
                      <MenuItem value="Order Placed">Pedido Realizado</MenuItem>
                      <MenuItem value="Under Package">En Empaque</MenuItem>
                      <MenuItem value="On The way to deliver">En Camino</MenuItem>
                      <MenuItem value="Deliverd">Entregado</MenuItem>
                      <MenuItem value="Canceled">Cancelado</MenuItem>
                    </Select>
                  </FormControl>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Visibility />}
                      onClick={() => handleEdit(data.order_Id)}
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
                      onClick={() => handleCancel(data.order_Id)}
                      disabled={data?.order_Status === 'Canceled'}
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

export default Orders;
