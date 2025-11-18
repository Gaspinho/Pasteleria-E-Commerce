import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { setLoading, setError, setSavedDesignId, resetDesign } from '../../features/customCakeSlice';

// Componentes
import CakePreview from './CakePreview';
import StepNavigation from './StepNavigation';
import LayerSelection from './steps/LayerSelection';
import FlavorSelection from './steps/FlavorSelection';
import IcingSelection from './steps/IcingSelection';
import DecorationSelection from './steps/DecorationSelection';
import MessageCustomization from './steps/MessageCustomization';
import SpecialInstructions from './steps/SpecialInstructions';
import DesignSummary from './steps/DesignSummary';

const CustomCakeDesigner = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentStep = useSelector(state => state.customCake.currentStep);
  const design = useSelector(state => state.customCake.design);
  const isLoading = useSelector(state => state.customCake.isLoading);
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    // Verificar autenticación
    const token = sessionStorage.getItem('access_token');
    if (!token) {
      alert('Debes iniciar sesión para diseñar tu pastel personalizado');
      router.push('/login');
      return;
    }

    // Cargar diseño guardado de localStorage si existe
    const savedDesign = localStorage.getItem('customCakeDesign');
    if (savedDesign) {
      try {
        const parsedDesign = JSON.parse(savedDesign);
        // Aquí podrías cargar el diseño con dispatch(loadDesign(parsedDesign))
      } catch (e) {
        console.error('Error loading saved design:', e);
      }
    }

    // Guardar diseño en localStorage cuando cambie
    const saveInterval = setInterval(() => {
      localStorage.setItem('customCakeDesign', JSON.stringify(design));
    }, 5000); // Cada 5 segundos

    return () => clearInterval(saveInterval);
  }, [design, router]);

  const handleSaveDesign = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      // Obtener token
      const token = sessionStorage.getItem('access_token');
      if (!token) {
        throw new Error('No estás autenticado');
      }

      // Preparar FormData
      const formData = new FormData();
      formData.append('layer_id', design.layer_id || '');
      formData.append('spongeflavor_id', design.spongeflavor_id || '');
      formData.append('fillingtopdecoration_id', design.icing_id || '');
      formData.append('imagetopdecoration_id', design.imagetopdecoration_id || '0');
      formData.append('icing', design.icing_id || '');
      formData.append('amount', design.amount.toString());
      formData.append('msg_on_cake', design.msg_on_cake || '');
      formData.append('msg_color_id', design.msg_color_id || '');
      formData.append('special_instruction', design.special_instruction || '');

      // Llamar al endpoint
      const response = await fetch('http://127.0.0.1:8000/customizeorder/post/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al guardar el diseño');
      }

      const data = await response.json();
      
      // Guardar ID del diseño
      dispatch(setSavedDesignId(data.id));
      sessionStorage.setItem('CustomOrder_Id', data.id);
      
      // Limpiar localStorage
      localStorage.removeItem('customCakeDesign');
      
      // Mostrar mensaje de éxito
      alert('¡Diseño guardado exitosamente! Redirigiendo al checkout...');
      
      // Redirigir al checkout
      setTimeout(() => {
        router.push('/CustomOrderCheckout');
      }, 1000);

    } catch (error) {
      console.error('Error saving design:', error);
      dispatch(setError(error.message));
      alert(`Error: ${error.message}`);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleExit = () => {
    if (design.layer_id || design.spongeflavor_id) {
      setShowExitModal(true);
    } else {
      router.push('/');
    }
  };

  const confirmExit = () => {
    localStorage.removeItem('customCakeDesign');
    dispatch(resetDesign());
    router.push('/');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <LayerSelection />;
      case 2:
        return <FlavorSelection />;
      case 3:
        return <IcingSelection />;
      case 4:
        return <DecorationSelection />;
      case 5:
        return <MessageCustomization />;
      case 6:
        return <SpecialInstructions />;
      case 7:
        return <DesignSummary onSaveDesign={handleSaveDesign} isLoading={isLoading} />;
      default:
        return <LayerSelection />;
    }
  };

  return (
    <div className="custom-cake-designer">
      {/* Header */}
      <div className="designer-header">
        <div className="designer-header__content">
          <h1 className="designer-header__title">
            🎂 Diseña tu Pastel Personalizado
          </h1>
          <button 
            className="designer-header__exit"
            onClick={handleExit}
            aria-label="Salir"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="designer-content">
        {/* Preview - Lado izquierdo en desktop */}
        <div className="designer-preview">
          <CakePreview />
        </div>

        {/* Pasos - Lado derecho en desktop */}
        <div className="designer-steps">
          <StepNavigation />
          
          <div className="step-content">
            {renderStep()}
          </div>
        </div>
      </div>

      {/* Modal de confirmación de salida */}
      {showExitModal && (
        <div className="modal-overlay" onClick={() => setShowExitModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>¿Salir sin guardar?</h2>
            <p>Tienes un diseño en progreso. Si sales ahora, se perderá.</p>
            <div className="modal-actions">
              <button 
                className="modal-btn modal-btn--secondary"
                onClick={() => setShowExitModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="modal-btn modal-btn--danger"
                onClick={confirmExit}
              >
                Salir sin Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCakeDesigner;
