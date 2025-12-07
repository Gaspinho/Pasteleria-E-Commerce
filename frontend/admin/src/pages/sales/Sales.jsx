import React, { useState, useMemo } from 'react';
import './sales.css';
import {
  Box, Card, CardContent, Typography, Grid, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
  FormControl, InputLabel, Select, MenuItem, TextField, CircularProgress
} from '@mui/material';
import {
  TrendingUp, AttachMoney, ShoppingCart, CalendarToday, FilterList
} from '@mui/icons-material';
import { useGetAllOrderQuery } from '../../services/orderApi';
import { useGetAllCustomOrdersQuery } from '../../services/customOrderApi';

function Sales() {
  const { data: ordersData, isLoading: ordersLoading } = useGetAllOrderQuery();
  const { data: customOrdersData, isLoading: customOrdersLoading } = useGetAllCustomOrdersQuery();
  
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const isLoading = ordersLoading || customOrdersLoading;

  // Combinar órdenes normales y personalizadas
  const allOrders = useMemo(() => {
    const orders = [];
    
    if (ordersData) {
      ordersData.forEach(order => {
        orders.push({
          id: order.id,
          type: 'regular',
          customer: order.customer_name || 'N/A',
          amount: order.total_Amount || 0,
          status: order.order_Status || 'Pending',
          date: order.placed_at || '',
          products: order.products?.length || 0
        });
      });
    }
    
    if (customOrdersData) {
      customOrdersData.forEach(order => {
        orders.push({
          id: order.id,
          type: 'custom',
          customer: order.customer_name || 'Cliente Personalizado',
          amount: (order.amount || 0) + (order.delivery_charges || 0),
          status: order.order_Status || 'Pending',
          date: order.placed_at || '',
          products: 1
        });
      });
    }
    
    // Ordenar por fecha descendente
    return orders.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [ordersData, customOrdersData]);

  // Filtrar órdenes
  const filteredOrders = useMemo(() => {
    return allOrders.filter(order => {
      // Filtro de período
      if (filterPeriod !== 'all') {
        const orderDate = new Date(order.date);
        const now = new Date();
        const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
        
        if (filterPeriod === 'today' && daysDiff !== 0) return false;
        if (filterPeriod === 'week' && daysDiff > 7) return false;
        if (filterPeriod === 'month' && daysDiff > 30) return false;
      }
      
      // Filtro de estado
      if (filterStatus !== 'all' && order.status.toLowerCase() !== filterStatus.toLowerCase()) {
        return false;
      }
      
      // Búsqueda
      if (searchTerm && !order.customer.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [allOrders, filterPeriod, filterStatus, searchTerm]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const total = filteredOrders.reduce((sum, order) => sum + order.amount, 0);
    const completed = filteredOrders.filter(o => 
      o.status === 'Deliverd' || o.status === 'Completed'
    ).length;
    const pending = filteredOrders.filter(o => o.status === 'Pending').length;
    
    return {
      totalRevenue: total,
      totalOrders: filteredOrders.length,
      completedOrders: completed,
      pendingOrders: pending,
      avgOrderValue: filteredOrders.length > 0 ? total / filteredOrders.length : 0
    };
  }, [filteredOrders]);

  const getStatusColor = (status) => {
    const statusLower = (status || '').toLowerCase();
    switch(statusLower) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'completed':
      case 'deliverd': return 'success';
      case 'canceled': return 'error';
      default: return 'default';
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box className="sales-container" p={3}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AttachMoney sx={{ fontSize: 40 }} />
        Reporte de Ventas
      </Typography>

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Ingresos Totales
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="primary">
                    ${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 40, color: '#4CAF50' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Total Órdenes
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {stats.totalOrders}
                  </Typography>
                </Box>
                <ShoppingCart sx={{ fontSize: 40, color: '#2196F3' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Completadas
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="success.main">
                    {stats.completedOrders}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: '#4CAF50' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Valor Promedio
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="secondary">
                    ${stats.avgOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 40, color: '#FF9800' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <FilterList />
            <Typography variant="h6">Filtros</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Período</InputLabel>
                <Select
                  value={filterPeriod}
                  label="Período"
                  onChange={(e) => setFilterPeriod(e.target.value)}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="today">Hoy</MenuItem>
                  <MenuItem value="week">Última Semana</MenuItem>
                  <MenuItem value="month">Último Mes</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filterStatus}
                  label="Estado"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="pending">Pendiente</MenuItem>
                  <MenuItem value="processing">En Proceso</MenuItem>
                  <MenuItem value="completed">Completado</MenuItem>
                  <MenuItem value="deliverd">Entregado</MenuItem>
                  <MenuItem value="canceled">Cancelado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Buscar Cliente"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre del cliente..."
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabla de Órdenes */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Órdenes ({filteredOrders.length})
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Tipo</strong></TableCell>
                  <TableCell><strong>Cliente</strong></TableCell>
                  <TableCell><strong>Productos</strong></TableCell>
                  <TableCell><strong>Monto</strong></TableCell>
                  <TableCell><strong>Estado</strong></TableCell>
                  <TableCell><strong>Fecha</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="textSecondary" py={3}>
                        No se encontraron órdenes
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={`${order.type}-${order.id}`} hover>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>
                        <Chip 
                          label={order.type === 'regular' ? 'Normal' : 'Personalizado'}
                          size="small"
                          color={order.type === 'regular' ? 'primary' : 'secondary'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.products}</TableCell>
                      <TableCell>
                        <Typography fontWeight="600" color="primary">
                          ${order.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={order.status}
                          size="small"
                          color={getStatusColor(order.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CalendarToday sx={{ fontSize: 16, color: '#757575' }} />
                          <Typography variant="body2">
                            {order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Sales;