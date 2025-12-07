import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetDetaildCustomOrderQuery } from '../../services/customOrderApi';
import {
  Box, Card, CardContent, Typography, Grid, Chip, Button, Divider,
  CircularProgress, Alert
} from '@mui/material';
import {
  ArrowBack, Cake, ColorLens, Phone, Home, AttachMoney,
  CalendarToday, AccessTime, LocalShipping, CreditCard, Message
} from '@mui/icons-material';
import './customOrderDetails.css';

function CustomOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetDetaildCustomOrderQuery(id);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Error al cargar los detalles del pedido: {error?.data?.detail || 'Error desconocido'}
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/admin/designtool')} sx={{ mt: 2 }}>
          Volver a Pedidos
        </Button>
      </Box>
    );
  }

  const order = data || {};
  const customCake = order.custom_cake || {};
  const address = order.address || {};
  const payment = order.payment || {};

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
    <Box className="custom-order-details-container">
      <Box className="details-header">
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/admin/designtool')}
          variant="outlined"
        >
          Volver
        </Button>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Cake sx={{ fontSize: 36 }} />
          Detalles del Pedido Personalizado
        </Typography>
        <Chip 
          label={order.order_Status || 'Pending'}
          sx={{
            backgroundColor: getStatusColor(order.order_Status),
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px',
            padding: '20px 16px'
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {/* Información del Diseño del Pastel */}
        <Grid item xs={12} md={6}>
          <Card className="detail-card">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Cake /> Diseño del Pastel
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {customCake.final_product_img && (
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                  <img
                    src={`http://127.0.0.1:8000${customCake.final_product_img}`}
                    alt="Pastel Personalizado"
                    style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px' }}
                  />
                </Box>
              )}

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Forma:</Typography>
                  <Typography variant="body1" fontWeight="500">
                    {customCake.layer_id || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Sabor:</Typography>
                  <Typography variant="body1" fontWeight="500">
                    {customCake.spongeflavor_id || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Decoración Superior:</Typography>
                  <Typography variant="body1" fontWeight="500">
                    {customCake.fillingtopdecoration_id || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Imagen Decorativa:</Typography>
                  <Typography variant="body1" fontWeight="500">
                    {customCake.imagetopdecoration_id || 'N/A'}
                  </Typography>
                </Grid>
                {customCake.icing && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Glaseado:</Typography>
                    <Typography variant="body1" fontWeight="500">
                      {customCake.icing}
                    </Typography>
                  </Grid>
                )}
                {customCake.msg_on_cake && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Message />
                      <Box>
                        <Typography variant="subtitle2" color="textSecondary">Mensaje en el Pastel:</Typography>
                        <Typography 
                          variant="body1" 
                          fontWeight="500" 
                          sx={{ 
                            fontStyle: 'italic',
                            color: customCake.msg_color_id || '#000',
                            fontSize: '18px'
                          }}
                        >
                          "{customCake.msg_on_cake}"
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                {customCake.special_instruction && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Instrucciones Especiales:</Typography>
                    <Typography variant="body2">
                      {customCake.special_instruction}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Información del Pedido */}
        <Grid item xs={12} md={6}>
          <Card className="detail-card">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalShipping /> Información de Entrega
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CalendarToday color="action" />
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Fecha de Entrega:</Typography>
                      <Typography variant="body1" fontWeight="500">
                        {order.delivery_at || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <AccessTime color="action" />
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Horario de Entrega:</Typography>
                      <Typography variant="body1" fontWeight="500">
                        {order.delivery_time_window || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CalendarToday color="action" />
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Pedido Realizado:</Typography>
                      <Typography variant="body1" fontWeight="500">
                        {order.placed_at ? new Date(order.placed_at).toLocaleString() : 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Home color="action" />
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Dirección de Entrega:</Typography>
                      <Typography variant="body1">
                        Casa: {address.house_number || 'N/A'}, Calle: {address.street_number || 'N/A'}
                      </Typography>
                      <Typography variant="body1">
                        Área: {address.area || 'N/A'}, Ciudad: {address.city || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card className="detail-card" sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachMoney /> Información de Pago
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CreditCard color="action" />
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Método de Pago:</Typography>
                      <Typography variant="body1" fontWeight="500">
                        {payment.payment_type || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <AttachMoney color="action" />
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Estado del Pago:</Typography>
                      <Chip 
                        label={payment.payment_status || 'Pending'}
                        color={payment.payment_status === 'Paid' ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Monto del Pastel:</Typography>
                  <Typography variant="h6" color="primary">
                    ${customCake.amount || 0}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Cargos de Envío:</Typography>
                  <Typography variant="h6">
                    ${order.delivery_charges || 0}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="h5" fontWeight="bold" color="primary">
                    Total: ${((customCake.amount || 0) + (order.delivery_charges || 0)).toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Monto Pagado:</Typography>
                  <Typography variant="h6" color="success.main">
                    ${payment.amount_paid || 0}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CustomOrderDetails;
