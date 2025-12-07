import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Badge,
  Avatar,
  Divider,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  MarkEmailRead,
  Delete,
  CheckCircle,
  Info,
  Warning,
  ShoppingCart,
  People,
  Inventory
} from '@mui/icons-material';
import './notifications.css';

const Notifications = () => {
  const [tabValue, setTabValue] = useState(0);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'order',
      title: 'Nueva Orden Recibida',
      message: 'Pedido #12345 de Juan Pérez',
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
      icon: <ShoppingCart />,
      color: '#4CAF50'
    },
    {
      id: 2,
      type: 'custom_order',
      title: 'Orden Personalizada',
      message: 'Nueva solicitud de pastel personalizado',
      timestamp: new Date(Date.now() - 15 * 60000),
      read: false,
      icon: <Inventory />,
      color: '#FF9800'
    },
    {
      id: 3,
      type: 'user',
      title: 'Nuevo Cliente Registrado',
      message: 'María González se ha registrado',
      timestamp: new Date(Date.now() - 30 * 60000),
      read: true,
      icon: <People />,
      color: '#2196F3'
    },
    {
      id: 4,
      type: 'warning',
      title: 'Stock Bajo',
      message: 'El producto "Pastel de Chocolate" tiene bajo stock',
      timestamp: new Date(Date.now() - 60 * 60000),
      read: false,
      icon: <Warning />,
      color: '#FFC107'
    },
    {
      id: 5,
      type: 'info',
      title: 'Actualización del Sistema',
      message: 'Nueva versión disponible',
      timestamp: new Date(Date.now() - 2 * 60 * 60000),
      read: true,
      icon: <Info />,
      color: '#9C27B0'
    }
  ]);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    orderAlerts: true,
    systemAlerts: true
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getFilteredNotifications = () => {
    switch (tabValue) {
      case 0:
        return notifications;
      case 1:
        return notifications.filter(n => !n.read);
      case 2:
        return notifications.filter(n => n.read);
      default:
        return notifications;
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora mismo';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    return `Hace ${days} día${days > 1 ? 's' : ''}`;
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="notifications-container">
      <Box className="notifications-header">
        <Box className="header-left">
          <Typography variant="h4" className="notifications-title">
            <NotificationsIcon sx={{ mr: 2, fontSize: 32 }} />
            Notificaciones
          </Typography>
          <Badge badgeContent={unreadCount} color="error" sx={{ ml: 2 }}>
            <Chip label={`${notifications.length} Total`} />
          </Badge>
        </Box>
        <Box className="header-actions">
          <Button
            variant="outlined"
            startIcon={<MarkEmailRead />}
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Marcar todo como leído
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={clearAll}
            disabled={notifications.length === 0}
          >
            Limpiar Todo
          </Button>
        </Box>
      </Box>

      <Box className="notifications-settings">
        <Typography variant="h6" gutterBottom>
          Configuración de Notificaciones
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
              />
            }
            label="Notificaciones por Email"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.pushNotifications}
                onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
              />
            }
            label="Notificaciones Push"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.orderAlerts}
                onChange={(e) => setSettings({ ...settings, orderAlerts: e.target.checked })}
              />
            }
            label="Alertas de Pedidos"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.systemAlerts}
                onChange={(e) => setSettings({ ...settings, systemAlerts: e.target.checked })}
              />
            }
            label="Alertas del Sistema"
          />
        </Box>
      </Box>

      <Card className="notifications-card">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          className="notifications-tabs"
          variant="fullWidth"
        >
          <Tab label={`Todas (${notifications.length})`} />
          <Tab label={`No leídas (${unreadCount})`} />
          <Tab label={`Leídas (${notifications.length - unreadCount})`} />
        </Tabs>

        <CardContent>
          {filteredNotifications.length === 0 ? (
            <Box className="empty-state">
              <NotificationsIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" color="textSecondary">
                No hay notificaciones
              </Typography>
            </Box>
          ) : (
            <Box className="notifications-list">
              {filteredNotifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <Box
                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  >
                    <Avatar
                      sx={{
                        backgroundColor: notification.color,
                        width: 48,
                        height: 48
                      }}
                    >
                      {notification.icon}
                    </Avatar>

                    <Box className="notification-content">
                      <Typography variant="subtitle1" fontWeight="bold">
                        {notification.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {formatTimestamp(notification.timestamp)}
                      </Typography>
                    </Box>

                    <Box className="notification-actions">
                      {!notification.read && (
                        <IconButton
                          size="small"
                          onClick={() => markAsRead(notification.id)}
                          title="Marcar como leído"
                        >
                          <CheckCircle color="success" />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => deleteNotification(notification.id)}
                        title="Eliminar"
                      >
                        <Delete color="error" />
                      </IconButton>
                    </Box>
                  </Box>
                  {index < filteredNotifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
