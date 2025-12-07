import "./featuredInfo.css";
import { TrendingUp, AttachMoney, ShoppingCart, AccountBalance } from "@mui/icons-material";
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { useGetAllOrderQuery } from '../../../services/orderApi';
import { useGetAllCustomersQuery } from '../../../services/userCRUDApi';

export default function FeaturedInfo() {
  const { data: ordersData, isSuccess: ordersSuccess } = useGetAllOrderQuery();
  const { data: customersData, isSuccess: customersSuccess } = useGetAllCustomersQuery();

  // Calcular estadísticas reales
  let totalRevenue = 0;
  let completedOrders = 0;
  let totalCustomers = 0;

  if (ordersSuccess && ordersData) {
    totalRevenue = ordersData.reduce((sum, order) => sum + (order.total_Amount || 0), 0);
    completedOrders = ordersData.filter(order => 
      order.order_Status === 'Deliverd' || order.order_Status === 'Completed'
    ).length;
  }

  if (customersSuccess && customersData) {
    totalCustomers = customersData.length;
  }

  return (
    <Box className="featured-grid">
      <Card className="featured-card revenue-card" elevation={3}>
        <CardContent>
          <Box className="featured-header">
            <Box className="featured-icon-wrapper" sx={{ backgroundColor: '#4CAF50' }}>
              <AttachMoney sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Typography variant="subtitle2" color="textSecondary" fontWeight={600}>
              Ingresos Totales
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight="bold" sx={{ my: 2, color: '#2c3e50' }}>
            ${totalRevenue.toLocaleString()}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              icon={<TrendingUp />} 
              label="+12.5%" 
              size="small" 
              sx={{ backgroundColor: '#E8F5E9', color: '#4CAF50', fontWeight: 600 }}
            />
            <Typography variant="caption" color="textSecondary">
              vs mes anterior
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Card className="featured-card sales-card" elevation={3}>
        <CardContent>
          <Box className="featured-header">
            <Box className="featured-icon-wrapper" sx={{ backgroundColor: '#2196F3' }}>
              <ShoppingCart sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Typography variant="subtitle2" color="textSecondary" fontWeight={600}>
              Pedidos Completados
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight="bold" sx={{ my: 2, color: '#2c3e50' }}>
            {completedOrders}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              icon={<TrendingUp />} 
              label="+8.2%" 
              size="small" 
              sx={{ backgroundColor: '#E3F2FD', color: '#2196F3', fontWeight: 600 }}
            />
            <Typography variant="caption" color="textSecondary">
              vs mes anterior
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Card className="featured-card customers-card" elevation={3}>
        <CardContent>
          <Box className="featured-header">
            <Box className="featured-icon-wrapper" sx={{ backgroundColor: '#FF9800' }}>
              <AccountBalance sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Typography variant="subtitle2" color="textSecondary" fontWeight={600}>
              Total Clientes
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight="bold" sx={{ my: 2, color: '#2c3e50' }}>
            {totalCustomers}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              icon={<TrendingUp />} 
              label="+15.3%" 
              size="small" 
              sx={{ backgroundColor: '#FFF3E0', color: '#FF9800', fontWeight: 600 }}
            />
            <Typography variant="caption" color="textSecondary">
              nuevos este mes
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
