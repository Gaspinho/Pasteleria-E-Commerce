import React from "react";
import "./dashboard.css";
import Chart from "./chart/Chart";
import FeaturedInfo from "./featuredInfo/FeaturedInfo";
import WidgetSm from "./widgetSm/WidgetSm";
import WidgetLg from "./widgetLg/WidgetLg";
import { Box, Grid, Typography, Card, CardContent, Chip, CircularProgress } from '@mui/material';
import { Dashboard as DashboardIcon, TrendingUp, Assessment } from '@mui/icons-material';
import { useGetSalesChartQuery } from "../../services/dashboardApi";

function AdminDashboard() {
  const { data: chartData, isLoading: chartLoading } = useGetSalesChartQuery();

  return (
    <Box className="dashboard-container">
      <Box className="dashboard-header">
        <Box>
          <Typography variant="h4" className="dashboard-title">
            <DashboardIcon sx={{ mr: 2, fontSize: 32 }} />
            Panel de Control
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Resumen general de tu negocio
          </Typography>
        </Box>
        <Chip 
          icon={<TrendingUp />}
          label="En tiempo real" 
          color="success" 
          sx={{ fontWeight: 600 }}
        />
      </Box>

      <FeaturedInfo />
      
      <Box className="chart-section" sx={{ mb: 3 }}>
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Assessment sx={{ mr: 1, color: '#5550bd' }} />
              <Typography variant="h6" fontWeight={600}>
                Análisis de Ventas (Últimos 12 Meses)
              </Typography>
            </Box>
            {chartLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Chart data={chartData || []} title="" grid dataKey="ventas"/>
            )}
          </CardContent>
        </Card>
      </Box>

      <Grid container spacing={3} className="homeWidgets">
        <Grid item xs={12} lg={6}>
          <WidgetSm/>
        </Grid>
        <Grid item xs={12} lg={6}>
          <WidgetLg/>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboard;
