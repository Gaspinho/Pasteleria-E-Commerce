import "./widgetLg.css";
import { useGetAllOrderQuery } from '../../../services/orderApi';
import logo from '../../../images/logo.ico';
import { 
  Card, CardContent, Typography, Box, Chip, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, CircularProgress, Paper
} from '@mui/material';
import { Receipt, CheckCircle, LocalShipping, HourglassEmpty, Cancel } from '@mui/icons-material';

export default function WidgetLg() {
  const { data, isSuccess, isLoading } = useGetAllOrderQuery();
  let arr = [];
  
  if (isLoading) {
    return (
      <Card elevation={2} sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (isSuccess && data) {
    // Mapear los datos del backend al formato esperado
    arr = data.slice(-5).reverse().map(order => ({
      order_Id: order.id,
      order_Status: order.order_Status,
      total_Amount: order.total_Amount,
      order_Placment_Date: order.placed_at,
    }));
  }

  const getStatusConfig = (status) => {
    const configs = {
      'Deliverd': { 
        color: '#4CAF50', 
        bgColor: '#E8F5E9', 
        icon: <CheckCircle sx={{ fontSize: 16 }} />,
        label: 'Entregado'
      },
      'On The way to deliver': { 
        color: '#2196F3', 
        bgColor: '#E3F2FD', 
        icon: <LocalShipping sx={{ fontSize: 16 }} />,
        label: 'En Camino'
      },
      'Order Placed': { 
        color: '#FF9800', 
        bgColor: '#FFF3E0', 
        icon: <HourglassEmpty sx={{ fontSize: 16 }} />,
        label: 'Pedido Realizado'
      },
      'Under Package': { 
        color: '#9C27B0', 
        bgColor: '#F3E5F5', 
        icon: <Receipt sx={{ fontSize: 16 }} />,
        label: 'En Empaque'
      },
      'Canceled': { 
        color: '#F44336', 
        bgColor: '#FFEBEE', 
        icon: <Cancel sx={{ fontSize: 16 }} />,
        label: 'Cancelado'
      }
    };
    return configs[status] || configs['Order Placed'];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="widget-card" elevation={2}>
      <CardContent>
        <Box className="widget-header" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Receipt sx={{ color: '#FF9800', fontSize: 28 }} />
            <Typography variant="h6" fontWeight={600}>
              Últimos Pedidos
            </Typography>
          </Box>
          <Chip 
            label={`${arr.length} recientes`} 
            size="small" 
            color="warning" 
            variant="outlined" 
          />
        </Box>

        {arr.length === 0 ? (
          <Typography variant="body2" color="textSecondary" textAlign="center" py={4}>
            No hay pedidos registrados
          </Typography>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f0f0f0', borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#fafafa' }}>
                  <TableCell><strong>Pedido</strong></TableCell>
                  <TableCell><strong>Fecha</strong></TableCell>
                  <TableCell align="right"><strong>Monto</strong></TableCell>
                  <TableCell align="center"><strong>Estado</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {arr.map((order, index) => {
                  const statusConfig = getStatusConfig(order.order_Status);
                  return (
                    <TableRow 
                      key={index}
                      sx={{ 
                        '&:hover': { backgroundColor: '#f5f5f5' },
                        '&:last-child td': { border: 0 }
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar 
                            src={logo} 
                            sx={{ width: 32, height: 32 }}
                          />
                          <Typography variant="body2" fontWeight={500}>
                            #{order.order_Id}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {formatDate(order.order_Placment_Date)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600} color="primary">
                          ${order.total_Amount}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          icon={statusConfig.icon}
                          label={statusConfig.label}
                          size="small"
                          sx={{
                            backgroundColor: statusConfig.bgColor,
                            color: statusConfig.color,
                            fontWeight: 600,
                            fontSize: '0.75rem'
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}
