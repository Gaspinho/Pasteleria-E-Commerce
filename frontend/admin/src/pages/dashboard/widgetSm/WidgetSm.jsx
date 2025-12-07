import "./widgetSm.css";
import { PersonAdd, Visibility, Phone, Badge } from "@mui/icons-material";
import { useGetAllCustomersQuery } from '../../../services/userCRUDApi';
import userAfatar from '../../../images/femaleAfatar.png';
import { useNavigate } from 'react-router-dom';
import { 
  Card, CardContent, Typography, Box, Avatar, 
  IconButton, Chip, CircularProgress 
} from '@mui/material';

export default function WidgetSm() {
  const { data, isSuccess, isLoading } = useGetAllCustomersQuery();
  const navigate = useNavigate();
  let arr = [];

  const handleDisplay = (props) => {
    navigate(`/admin/customer/edit/${props}`);
  };
  
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

  if (isSuccess) {
    arr = data.slice(-5).reverse();
  }

  return (
    <Card className="widget-card" elevation={2}>
      <CardContent>
        <Box className="widget-header" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonAdd sx={{ color: '#2196F3', fontSize: 28 }} />
            <Typography variant="h6" fontWeight={600}>
              Nuevos Clientes
            </Typography>
          </Box>
          <Chip 
            label={`${arr.length} recientes`} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
        </Box>

        <Box className="widget-list">
          {arr.length === 0 ? (
            <Typography variant="body2" color="textSecondary" textAlign="center" py={4}>
              No hay clientes registrados
            </Typography>
          ) : (
            arr.map((user, index) => (
              <Box 
                key={index} 
                className="widget-list-item"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 8px',
                  borderBottom: index < arr.length - 1 ? '1px solid #f0f0f0' : 'none',
                  transition: 'background-color 0.2s',
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                  <Avatar 
                    src={userAfatar} 
                    alt={user.first_Name}
                    sx={{ width: 45, height: 45 }}
                  />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {user.first_Name} {user.last_Name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      <Badge sx={{ fontSize: 14, color: '#757575' }} />
                      <Typography variant="caption" color="textSecondary">
                        ID: {user.id}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Phone sx={{ fontSize: 16, color: '#757575' }} />
                    <Typography variant="caption" color="textSecondary">
                      {user.phone_Number}
                    </Typography>
                  </Box>
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => handleDisplay(user.id)}
                    sx={{
                      backgroundColor: '#E3F2FD',
                      '&:hover': { backgroundColor: '#BBDEFB' }
                    }}
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
