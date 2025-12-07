import React from 'react';
import { Box, Typography, Button } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: 3,
            backgroundColor: '#f5f5f5'
          }}
        >
          <Typography variant="h4" color="error" gutterBottom>
            Algo salió mal
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
            La aplicación encontró un error inesperado.
          </Typography>
          {this.state.error && (
            <Box sx={{ mb: 2, p: 2, backgroundColor: '#fff', borderRadius: 1, maxWidth: 600 }}>
              <Typography variant="body2" color="error">
                {this.state.error.toString()}
              </Typography>
            </Box>
          )}
          <Button variant="contained" color="primary" onClick={this.handleReload}>
            Recargar Página
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
