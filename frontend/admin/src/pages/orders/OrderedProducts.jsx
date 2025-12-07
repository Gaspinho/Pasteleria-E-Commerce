import React from 'react'
import {useOrderedProductsQuery}  from '../../services/orderApi'
import './orderedProducts.css'
import { Box, Card, CardContent, Typography, Grid, CircularProgress, Alert, Chip } from '@mui/material'
import { ShoppingCart } from '@mui/icons-material'

function OrderdProducts(props) {
  let order_Id= props.data;
  const products = useOrderedProductsQuery(order_Id);
  
  if (products.isLoading) return (
    <Box display="flex" justifyContent="center" p={3}>
      <CircularProgress />
    </Box>
  );
  
  if (products.isError) return (
    <Alert severity="error" sx={{ m: 2 }}>
      Error al cargar productos: {products.error?.error || 'Error desconocido'}
    </Alert>
  );
  
  if (!products.data || products.data.length === 0) return (
    <Alert severity="info" sx={{ m: 2 }}>
      No hay productos en este pedido
    </Alert>
  );
  
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ShoppingCart /> Productos del Pedido
      </Typography>
      <Grid container spacing={2}>
        {products.data.map((data, index) => (
          <Grid item xs={12} key={index}>
            <Card className="product-card" elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Box className='image-section'>
                    <img 
                      src={`http://127.0.0.1:8000${data.product_Id?.imageGallery?.image1}`} 
                      alt={data.product_Id?.product_Name || 'Producto'}
                      style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/100';
                      }}
                    />
                  </Box>
                  <Box className='product-details' sx={{ flex: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={3}>
                        <Typography variant="caption" color="textSecondary">Número de Producto</Typography>
                        <Typography variant="body2" fontWeight="500">
                          {data.product_Id?.product_Id || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="caption" color="textSecondary">Nombre</Typography>
                        <Typography variant="body2" fontWeight="500">
                          {data.product_Id?.product_Name || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="caption" color="textSecondary">Precio</Typography>
                        <Typography variant="body2" fontWeight="500" color="primary">
                          ${data.product_Id?.product_Price || 0}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="caption" color="textSecondary">Cantidad</Typography>
                        <Chip 
                          label={data.quantity || 0} 
                          size="small" 
                          color="primary"
                        />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Typography variant="caption" color="textSecondary">Subtotal</Typography>
                        <Typography variant="body2" fontWeight="bold" color="secondary">
                          ${((data.product_Id?.product_Price || 0) * (data.quantity || 0)).toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>   
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default OrderdProducts