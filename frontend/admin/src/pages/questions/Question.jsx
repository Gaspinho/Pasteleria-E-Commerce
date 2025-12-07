import React, { useState } from 'react'
import '../feedbacks/feedbacks.css'
import './questions.css'
import {useGetAllQuestionQuery, useDeleteQuestionMutation}  from '../../services/feedbackApi'
import afatar from "../../images/femaleAfatar.png";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { 
  Box, Card, CardContent, Typography, IconButton, Chip, TextField, 
  Avatar, Button, Alert, Divider
} from '@mui/material';
import {
  QuestionAnswer, Delete, Search, Email, CalendarToday,
  Message
} from '@mui/icons-material';

function Question() {
  const response = useGetAllQuestionQuery();
  const [deleteQuestion] = useDeleteQuestionMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [success, setSuccess] = useState('');

  console.log("qdata: ", response.data);
  console.log("Success: ", response.isSuccess);

  if (response.isLoading) return <div className="loading-state">Cargando mensajes...</div>;
  if (response.isError) return <h1>An error occured {response.error.error}</h1>;
  
  const arr = response.data.slice().reverse();

  const handleDelete = (questionId, userName) => {
    confirmAlert({
      title: 'Confirmar Eliminación',
      message: `¿Está seguro de eliminar el mensaje de "${userName}"?`,
      buttons: [
        {
          label: 'Sí, Eliminar',
          onClick: async() => {
            const res = await deleteQuestion(questionId);
            if(!res.error) {
              setSuccess('Mensaje eliminado exitosamente');
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

  // Filtrar mensajes
  const filteredQuestions = arr.filter(question => {
    const matchesSearch = searchTerm === '' || 
      question.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Calcular estadísticas
  const totalMessages = arr.length;
  const recentMessages = arr.filter(q => {
    const messageDate = new Date(q.messageDate);
    const daysDiff = (new Date() - messageDate) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  }).length;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString();
  };

  return (
    <Box className="questions-container">
      <Box className="questions-header">
        <Box>
          <Typography variant="h4" className="questions-title">
            <QuestionAnswer sx={{ mr: 2, fontSize: 32 }} />
            Mensajes y Consultas
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Gestiona las consultas y mensajes de tus clientes
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Message sx={{ fontSize: 40, color: 'var(--color-primary, #DA627D)' }} />
              <Box>
                <Typography variant="h6" color="textSecondary">Total de Mensajes</Typography>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  {totalMessages}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CalendarToday sx={{ fontSize: 40, color: '#4CAF50' }} />
              <Box>
                <Typography variant="h6" color="textSecondary">Mensajes Recientes</Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ color: '#4CAF50' }}>
                  {recentMessages}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Últimos 7 días
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Filtros */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Buscar por nombre, email o mensaje..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />
            }}
            sx={{ flexGrow: 1, minWidth: 300 }}
          />
          <Chip 
            label={`${filteredQuestions.length} mensajes`}
            color="primary"
            variant="outlined"
          />
        </Box>
      </Card>

      {/* Lista de Mensajes */}
      <Box className="reviewsGrid">
        {filteredQuestions.length === 0 ? (
          <Card sx={{ p: 4, textAlign: 'center', gridColumn: '1 / -1' }}>
            <Typography variant="h6" color="textSecondary">
              No se encontraron mensajes
            </Typography>
          </Card>
        ) : (
          filteredQuestions.map((qdata, index) => (
            <Card key={index} className="message-card modern-review-card">
              <CardContent>
                <Box className="message-header">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      src={afatar} 
                      alt={qdata.userName}
                      sx={{ width: 56, height: 56 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {qdata.userName}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                        <Email fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary">
                          {qdata.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <IconButton
                    onClick={() => handleDelete(qdata.id, qdata.userName)}
                    color="error"
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box className="message-content">
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Mensaje:
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {qdata.message}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Chip 
                      icon={<CalendarToday />}
                      label={formatDate(qdata.messageDate)}
                      size="small"
                      variant="outlined"
                    />
                    <Button
                      size="small"
                      startIcon={<Email />}
                      href={`mailto:${qdata.email}`}
                      sx={{ textTransform: 'none' }}
                    >
                      Responder
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
}

export default Question