import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { unSetUserToken } from '../features/authSlice';
import { unsetUserInfo } from '../features/userSlice';
import { useEffect } from 'react';

const Logout = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    useEffect(() => {
      const handleLogout = () => {
        // Limpiar Redux
        dispatch(unsetUserInfo({ first_Name: "",last_Name: "",email: "",type: "", }))
        dispatch(unSetUserToken({ access_token: null }))
        
        // Limpiar localStorage
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        
        // Disparar evento para actualizar el estado de autenticación
        window.dispatchEvent(new Event('authChange'))
        
        // Redirigir al login
        navigate('/login')
      }
      
      handleLogout()
    }, [dispatch, navigate])
    
    return null;
};
  
export default Logout;