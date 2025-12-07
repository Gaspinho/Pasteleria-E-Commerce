import React ,{useState} from 'react'
import './feedbacks.css'
import {Star, Delete, Search} from "@mui/icons-material"; 
import {useGetAllReviewQuery ,useDeleteReviewMutation}  from '../../services/feedbackApi'
import afatar from "../../images/femaleAfatar.png";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Box, Card, CardContent, Typography, IconButton, Chip, TextField, Select, MenuItem, FormControl, InputLabel, Rating, Avatar, Alert } from '@mui/material';

function Feedbacks() {
    const response = useGetAllReviewQuery();
    const [deleteReview] = useDeleteReviewMutation();
    const [filterRating, setFilterRating] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [success, setSuccess] = useState('');

  console.log("Data: ", response.data);
  console.log("Success: ", response.isSuccess);

  if (response.isLoading) return <div className="loading-state">Cargando reseñas...</div>;
  if (response.isError) return <h1>An error occured {response.error.error}</h1>;
  
  const arr = (response.data || []).slice().reverse();

  const handleDelete = (reviewId, productName) => {
    confirmAlert({
      title: 'Confirmar Eliminación',
      message: `¿Está seguro de eliminar esta reseña${productName ? ` del producto "${productName}"` : ''}?`,
      buttons: [
        {
          label: 'Sí, Eliminar',
          onClick: async() => {
            const res = await deleteReview(reviewId);
            if(!res.error) {
              setSuccess('Reseña eliminada exitosamente');
              setTimeout(() => setSuccess(''), 3000);
            }
          }
        },
        {
          label: 'Cancelar',
          onClick: () => {}
        }
      ]
    });
  };

  // Filtrar reseñas
  const filteredReviews = arr.filter(review => {
    const matchesRating = filterRating === 'all' || review.rating === parseInt(filterRating);
    
    const customerFirstName = review.customer?.first_Name || review.author_name?.split(' ')[0] || '';
    const customerLastName = review.customer?.last_Name || review.author_name?.split(' ').slice(1).join(' ') || '';
    const productName = review.product_Name || '';
    const content = review.content || '';
    
    const matchesSearch = searchTerm === '' || 
      customerFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRating && matchesSearch;
  });

  // Calcular estadísticas
  const totalReviews = arr.length;
  const averageRating = arr.length > 0 
    ? (arr.reduce((sum, review) => sum + review.rating, 0) / arr.length / 20).toFixed(1)
    : 0;
  const ratingCounts = {
    5: arr.filter(r => r.rating === 100).length,
    4: arr.filter(r => r.rating === 80).length,
    3: arr.filter(r => r.rating === 60).length,
    2: arr.filter(r => r.rating === 40).length,
    1: arr.filter(r => r.rating === 20).length
  };
  
  const getRatingValue = (rating) => {
    return rating / 20; // Convertir de 0-100 a 0-5
  };
  
  return (
    <Box className="feedbacks-container">
      <Box className="feedbacks-header">
        <Box>
          <Typography variant="h4" className="feedbacks-title">
            <Star sx={{ mr: 2, fontSize: 32, color: '#FFD700' }} />
            Gestión de Reseñas
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Administra y modera las reseñas de tus clientes
          </Typography>
        </Box>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Estadísticas */}
      <Box className="stats-grid">
        <Card className="stat-card">
          <CardContent>
            <Typography variant="h6" color="textSecondary">Total de Reseñas</Typography>
            <Typography variant="h3" fontWeight="bold" color="primary">
              {totalReviews}
            </Typography>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent>
            <Typography variant="h6" color="textSecondary">Calificación Promedio</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h3" fontWeight="bold" sx={{ color: '#FFD700' }}>
                {averageRating}
              </Typography>
              <Rating value={parseFloat(averageRating)} precision={0.1} readOnly />
            </Box>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Distribución
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {[5, 4, 3, 2, 1].map(stars => (
                <Box key={stars} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ minWidth: 20 }}>{stars}★</Typography>
                  <Box sx={{ 
                    flex: 1, 
                    height: 8, 
                    bgcolor: '#f0f0f0', 
                    borderRadius: 4,
                    overflow: 'hidden'
                  }}>
                    <Box sx={{ 
                      width: `${totalReviews > 0 ? (ratingCounts[stars] / totalReviews * 100) : 0}%`,
                      height: '100%',
                      bgcolor: '#FFD700',
                      transition: 'width 0.3s ease'
                    }} />
                  </Box>
                  <Typography variant="body2" sx={{ minWidth: 30 }}>
                    {ratingCounts[stars]}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Filtros */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Buscar por cliente, producto o contenido..."
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
            <InputLabel>Filtrar por Calificación</InputLabel>
            <Select
              value={filterRating}
              label="Filtrar por Calificación"
              onChange={(e) => setFilterRating(e.target.value)}
            >
              <MenuItem value="all">Todas</MenuItem>
              <MenuItem value="100">5 Estrellas</MenuItem>
              <MenuItem value="80">4 Estrellas</MenuItem>
              <MenuItem value="60">3 Estrellas</MenuItem>
              <MenuItem value="40">2 Estrellas</MenuItem>
              <MenuItem value="20">1 Estrella</MenuItem>
            </Select>
          </FormControl>
          <Chip 
            label={`${filteredReviews.length} resultados`}
            color="primary"
            variant="outlined"
          />
        </Box>
      </Card>

      {/* Lista de Reseñas */}
      <Box className="reviewsGrid">
        {filteredReviews.length === 0 ? (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">
              No se encontraron reseñas
            </Typography>
          </Card>
        ) : (
          filteredReviews.map((data, index) => {
            const customerFirstName = data.customer?.first_Name || data.author_name?.split(' ')[0] || 'Usuario';
            const customerLastName = data.customer?.last_Name || data.author_name?.split(' ').slice(1).join(' ') || '';
            const productName = data.product_Name || 'Producto sin nombre';
            const reviewDate = data.review_Date || data.reviewDate || data.created_at;
            const reviewId = data.review_Id || data.id;
            
            return (
            <Card key={index} className="review-card modern-review-card">
              <CardContent>
                <Box className="review-header">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      src={afatar} 
                      alt={`${customerFirstName} ${customerLastName}`}
                      sx={{ width: 56, height: 56 }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {customerFirstName} {customerLastName}
                      </Typography>
                      <Rating 
                        value={getRatingValue(data.rating)} 
                        readOnly 
                        precision={0.5}
                        size="small"
                      />
                    </Box>
                  </Box>
                  <IconButton
                    onClick={() => handleDelete(reviewId, productName)}
                    color="error"
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </Box>

                <Box className="review-content" sx={{ mt: 2 }}>
                  <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                    "{data.content || 'Sin comentario'}"
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    <Chip 
                      label={productName}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip 
                      label={reviewDate ? new Date(reviewDate).toLocaleDateString() : 'Fecha no disponible'}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )})
        )}
      </Box>
    </Box>
  );
}

export default Feedbacks