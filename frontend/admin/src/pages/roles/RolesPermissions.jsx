import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Tooltip
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ExpandMore,
  Security,
  CheckCircle
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { addRole, updateRole, deleteRole } from '../../features/rolesSlice';
import {
  PERMISSIONS,
  PERMISSION_CATEGORIES,
  getPermissionsByCategory,
  getCategoryName
} from '../../constants/permissions';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './rolesPermissions.css';

const RolesPermissions = () => {
  const dispatch = useDispatch();
  const roles = useSelector(state => state.roles?.roles || []);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#4169E1',
    permissions: []
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  // Abrir diálogo para crear nuevo rol
  const handleCreate = () => {
    setEditingRole(null);
    setFormData({
      name: '',
      description: '',
      color: '#4169E1',
      permissions: []
    });
    setErrors({});
    setOpenDialog(true);
  };

  // Abrir diálogo para editar rol
  const handleEdit = (role) => {
    if (role.isSystem) {
      confirmAlert({
        title: 'Rol del Sistema',
        message: 'Este es un rol del sistema y no puede ser editado directamente. Puedes crear una copia personalizada.',
        buttons: [
          {
            label: 'Crear Copia',
            onClick: () => {
              setEditingRole(null);
              setFormData({
                name: `${role.name} (Copia)`,
                description: role.description,
                color: role.color,
                permissions: [...role.permissions]
              });
              setOpenDialog(true);
            }
          },
          {
            label: 'Cancelar',
            onClick: () => {}
          }
        ]
      });
      return;
    }

    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      color: role.color,
      permissions: [...role.permissions]
    });
    setErrors({});
    setOpenDialog(true);
  };

  // Eliminar rol
  const handleDelete = (role) => {
    if (role.isSystem) {
      confirmAlert({
        title: 'No se puede eliminar',
        message: 'Los roles del sistema no pueden ser eliminados.',
        buttons: [{ label: 'Entendido', onClick: () => {} }]
      });
      return;
    }

    confirmAlert({
      title: 'Confirmar Eliminación',
      message: `¿Está seguro de eliminar el rol "${role.name}"? Esta acción no se puede deshacer.`,
      buttons: [
        {
          label: 'Sí, Eliminar',
          onClick: () => {
            dispatch(deleteRole(role.id));
            setSuccess(`Rol "${role.name}" eliminado exitosamente`);
            setTimeout(() => setSuccess(''), 3000);
          }
        },
        {
          label: 'Cancelar',
          onClick: () => {}
        }
      ]
    });
  };

  // Guardar rol (crear o actualizar)
  const handleSave = () => {
    // Validaciones
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (formData.permissions.length === 0) {
      newErrors.permissions = 'Debe seleccionar al menos un permiso';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const roleData = {
      id: editingRole?.id || `custom_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      color: formData.color,
      permissions: formData.permissions,
      isSystem: false
    };

    if (editingRole) {
      dispatch(updateRole(roleData));
      setSuccess(`Rol "${roleData.name}" actualizado exitosamente`);
    } else {
      dispatch(addRole(roleData));
      setSuccess(`Rol "${roleData.name}" creado exitosamente`);
    }

    setOpenDialog(false);
    setTimeout(() => setSuccess(''), 3000);
  };

  // Toggle permiso
  const togglePermission = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  // Seleccionar todos los permisos de una categoría
  const toggleCategoryPermissions = (category) => {
    const categoryPermissions = getPermissionsByCategory(category).map(p => p.id);
    const allSelected = categoryPermissions.every(p => formData.permissions.includes(p));

    if (allSelected) {
      // Deseleccionar todos
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(p => !categoryPermissions.includes(p))
      }));
    } else {
      // Seleccionar todos
      setFormData(prev => ({
        ...prev,
        permissions: [...new Set([...prev.permissions, ...categoryPermissions])]
      }));
    }
  };

  return (
    <div className="roles-permissions-container">
      <Box className="roles-header">
        <Box>
          <Typography variant="h4" className="roles-title">
            <Security sx={{ mr: 2, fontSize: 32 }} />
            Gestión de Roles y Permisos
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
            Configure roles personalizados y asigne permisos específicos al personal
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
          className="btn-create-role"
        >
          Crear Rol Personalizado
        </Button>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {roles.map(role => (
          <Grid item xs={12} md={6} lg={4} key={role.id}>
            <Card className="role-card" sx={{ borderTop: `4px solid ${role.color}` }}>
              <CardContent>
                <Box className="role-card-header">
                  <Box className="role-info">
                    <Typography variant="h6" className="role-name">
                      {role.name}
                    </Typography>
                    {role.isSystem && (
                      <Chip
                        label="Sistema"
                        size="small"
                        color="primary"
                        icon={<Security />}
                      />
                    )}
                  </Box>
                  {!role.isSystem && (
                    <Box className="role-actions">
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(role)}
                          className="btn-edit"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(role)}
                          className="btn-delete"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                  {role.isSystem && (
                    <Tooltip title="Crear Copia Personalizada">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(role)}
                        className="btn-edit"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                <Typography variant="body2" color="textSecondary" sx={{ mb: 2, minHeight: 40 }}>
                  {role.description}
                </Typography>

                <Box className="role-stats">
                  <Chip
                    icon={<CheckCircle />}
                    label={`${role.permissions.length} permisos`}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Box className="role-permissions-preview">
                  <Typography variant="caption" color="textSecondary" gutterBottom>
                    Permisos incluidos:
                  </Typography>
                  <Box className="permissions-list">
                    {role.permissions.slice(0, 5).map(permId => {
                      const perm = Object.values(PERMISSIONS).find(p => p.id === permId);
                      return perm ? (
                        <Chip
                          key={permId}
                          label={perm.name}
                          size="small"
                          sx={{ m: 0.5 }}
                        />
                      ) : null;
                    })}
                    {role.permissions.length > 5 && (
                      <Chip
                        label={`+${role.permissions.length - 5} más`}
                        size="small"
                        sx={{ m: 0.5 }}
                      />
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Diálogo para crear/editar rol */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        className="role-dialog"
      >
        <DialogTitle>
          {editingRole ? `Editar Rol: ${editingRole.name}` : 'Crear Nuevo Rol'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nombre del Rol"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={!!errors.name}
              helperText={errors.name}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Color del Rol
              </Typography>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                style={{ width: '100px', height: '40px', cursor: 'pointer' }}
              />
            </Box>

            <Typography variant="h6" gutterBottom>
              Permisos
            </Typography>
            {errors.permissions && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.permissions}
              </Alert>
            )}

            {Object.values(PERMISSION_CATEGORIES).map(category => {
              const categoryPerms = getPermissionsByCategory(category);
              const allSelected = categoryPerms.every(p => formData.permissions.includes(p.id));
              const someSelected = categoryPerms.some(p => formData.permissions.includes(p.id));

              return (
                <Accordion key={category} defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={allSelected}
                          indeterminate={someSelected && !allSelected}
                          onChange={() => toggleCategoryPermissions(category)}
                        />
                      }
                      label={
                        <Typography variant="subtitle1" fontWeight="bold">
                          {getCategoryName(category)} ({categoryPerms.length})
                        </Typography>
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormGroup>
                      {categoryPerms.map(permission => (
                        <FormControlLabel
                          key={permission.id}
                          control={
                            <Checkbox
                              checked={formData.permissions.includes(permission.id)}
                              onChange={() => togglePermission(permission.id)}
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {permission.name}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {permission.description}
                              </Typography>
                            </Box>
                          }
                        />
                      ))}
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editingRole ? 'Actualizar' : 'Crear'} Rol
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RolesPermissions;
