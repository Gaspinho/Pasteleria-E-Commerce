import { createApi } from '@reduxjs/toolkit/query/react'
import baseQueryWithAuth from './baseQuery'

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => ({
        url: 'api/dashboard/stats',
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        }
      }),
      // Transformar la respuesta o crear datos calculados desde otros endpoints
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        // Como no existe el endpoint de stats, vamos a crear estadísticas desde los datos existentes
        try {
          const ordersResult = await fetchWithBQ('user/getAllorder');
          const customOrdersResult = await fetchWithBQ('customizeorder/getAllCustomizeOrder/');
          const customersResult = await fetchWithBQ('user/getAllcustomers');
          const productsResult = await fetchWithBQ('product/getAllproduct');
          const reviewsResult = await fetchWithBQ('feedback/getAllReview');

          if (ordersResult.error) return { error: ordersResult.error };

          const orders = ordersResult.data || [];
          const customOrders = customOrdersResult.data || [];
          const customers = customersResult.data || [];
          const products = productsResult.data || [];
          const reviews = reviewsResult.data || [];

          // Calcular estadísticas
          const totalRevenue = orders.reduce((sum, order) => sum + (order.total_Amount || 0), 0);
          const totalCustomOrders = customOrders.length;
          const totalOrders = orders.length + totalCustomOrders;
          
          // Pedidos por estado
          const ordersByStatus = {
            pending: orders.filter(o => o.order_Status === 'Order Placed').length,
            processing: orders.filter(o => o.order_Status === 'Under Package').length,
            shipping: orders.filter(o => o.order_Status === 'On The way to deliver').length,
            delivered: orders.filter(o => o.order_Status === 'Deliverd').length,
            canceled: orders.filter(o => o.order_Status === 'Canceled').length,
          };

          // Ventas del mes actual
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          const monthlyOrders = orders.filter(order => {
            if (!order.placed_at) return false;
            const orderDate = new Date(order.placed_at);
            return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
          });
          const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + (order.total_Amount || 0), 0);

          // Productos más vendidos (necesitaríamos un endpoint específico)
          const productsLowStock = products.filter(p => p.product_Stock < 10);

          // Promedio de calificaciones
          const avgRating = reviews.length > 0 
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length / 20
            : 0;

          return {
            data: {
              totalRevenue,
              totalOrders,
              totalCustomers: customers.length,
              totalProducts: products.length,
              ordersByStatus,
              monthlyRevenue,
              monthlyOrders: monthlyOrders.length,
              productsLowStock: productsLowStock.length,
              avgRating: avgRating.toFixed(1),
              totalReviews: reviews.length,
              recentCustomers: customers.slice(-5).reverse(),
              recentOrders: orders.slice(-10).reverse(),
            }
          };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: 'Error al obtener estadísticas' } };
        }
      }
    }),
    getSalesChart: builder.query({
      query: () => ({
        url: 'api/dashboard/sales-chart',
        method: 'GET',
      }),
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const ordersResult = await fetchWithBQ('user/getAllorder');
          if (ordersResult.error) return { error: ordersResult.error };

          const orders = ordersResult.data || [];
          
          // Generar datos de los últimos 12 meses
          const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
          const currentDate = new Date();
          const chartData = [];

          for (let i = 11; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthOrders = orders.filter(order => {
              if (!order.placed_at) return false;
              const orderDate = new Date(order.placed_at);
              return orderDate.getMonth() === date.getMonth() && 
                     orderDate.getFullYear() === date.getFullYear();
            });

            chartData.push({
              name: months[date.getMonth()],
              ventas: monthOrders.reduce((sum, o) => sum + (o.total_Amount || 0), 0),
              pedidos: monthOrders.length
            });
          }

          return { data: chartData };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: 'Error al obtener datos del gráfico' } };
        }
      }
    })
  }),
})

export const { useGetDashboardStatsQuery, useGetSalesChartQuery } = dashboardApi
