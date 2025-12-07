import React, { useState, useEffect } from 'react'
import { BrowserRouter, Route, Navigate,Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {UserLogin,Logout, Question, CustomerEdit,AppLayout,AdminDashboard, Orders,OrderDetails,Customers,
  Designtool,CustomOrderDetails ,Sales,Notifications,Feedbacks,Staff,NewStaff, Products,ProductEdit
  ,NewProduct ,Profile, RolesPermissions } from "./adminExportFiles";
import ErrorBoundary from './components/ErrorBoundary';


const theme = createTheme({
  palette: {
    primary: {
      main: '#DA627D',
      dark:'#A53860'
    },
  },
});

function App() {
  // Estado para manejar el token de forma reactiva
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  useEffect(() => {
    // Función para verificar el token
    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      setIsAuthenticated(!!token);
      setIsCheckingAuth(false);
    };
    
    // Verificar al cargar
    checkAuth();
    
    // Escuchar cambios en localStorage (para sincronizar entre tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'access_token') {
        checkAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Escuchar evento personalizado para cambios en la misma pestaña
    const handleAuthChange = () => {
      checkAuth();
    };
    
    window.addEventListener('authChange', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);
  
  // Mostrar nada mientras se verifica la autenticación
  if (isCheckingAuth) {
    return null;
  }
  
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/logout" element={<Logout /> } />
            <Route path="/login" element={!isAuthenticated ? <UserLogin /> : <Navigate to="/admin/dashboard" />} />
            
            {/* admin routes */}
            <Route path="/admin" element={isAuthenticated ? <AppLayout/> : <Navigate to="/login" />} >
              <Route index element={<Navigate to="/admin/dashboard" />} />
              <Route path="dashboard" element={<AdminDashboard />}/>
              <Route path="customers" element={<Customers />} />
              <Route path="customer/edit/:id" element={<CustomerEdit />} />
              <Route path="orders" element={<Orders />} />
              <Route path="order/details/:id" element={<OrderDetails/>} />
              <Route path="designtool" element={<Designtool />} />
              <Route path="customorder/details/:id" element={<CustomOrderDetails />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="question" element={<Question />} />
              <Route path="feedbacks" element={<Feedbacks />} />
              <Route path="products" element={<Products />} />
              <Route path="product/new" element={<NewProduct />} />
              <Route path="product/edit/:id" element={<ProductEdit />} />
              <Route path="profile" element={<Profile />} />
              <Route path="sales" element={<Sales />} />
              <Route path="staff" element={<Staff/>} />
              <Route path="staff/edit/:id" element={<CustomerEdit />} />
              <Route path="newstaff" element={<NewStaff/>} />
              <Route path="roles" element={<RolesPermissions/>} />
            </Route>
            
            {/* Ruta por defecto - redirigir al login */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
    
export default App;
