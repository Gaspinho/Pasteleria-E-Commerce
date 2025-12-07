import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nextStep, previousStep, goToStep } from '../../features/customCakeSlice';

const StepNavigation = ({ onValidateStep }) => {
  const dispatch = useDispatch();
  const currentStep = useSelector(state => state.customCake.currentStep);
  const totalSteps = useSelector(state => state.customCake.totalSteps);
  const design = useSelector(state => state.customCake.design);

  const steps = [
    { number: 1, title: 'Forma y Capas', icon: '📏' },
    { number: 2, title: 'Sabor', icon: '🍰' },
    { number: 3, title: 'Cobertura', icon: '🧈' },
    { number: 4, title: 'Decoración', icon: '✨' },
    { number: 5, title: 'Mensaje', icon: '💬' },
    { number: 6, title: 'Instrucciones', icon: '📝' },
    { number: 7, title: 'Resumen', icon: '✅' },
  ];

  const handleNext = () => {
    // Validar pasos obligatorios
    if (currentStep === 1 && !design.layer_id) {
      alert('Por favor selecciona una forma y capas para tu pastel');
      return;
    }
    if (currentStep === 2 && !design.spongeflavor_id) {
      alert('Por favor selecciona el sabor del bizcocho');
      return;
    }
    if (currentStep === 3 && !design.icing_id) {
      alert('Por favor selecciona la cobertura');
      return;
    }

    if (onValidateStep) {
      const isValid = onValidateStep(currentStep);
      if (!isValid) return;
    }

    dispatch(nextStep());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    dispatch(previousStep());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStepClick = (stepNumber) => {
    // Solo permitir navegar a pasos completados o el siguiente
    if (stepNumber <= currentStep + 1) {
      dispatch(goToStep(stepNumber));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getStepStatus = (stepNumber) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'active';
    return 'pending';
  };

  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="step-navigation">
      {/* Barra de progreso */}
      <div className="progress-bar">
        <div className="progress-bar__track">
          <div 
            className="progress-bar__fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="progress-bar__label">
          Paso {currentStep} de {totalSteps}
        </div>
      </div>

      {/* Steps */}
      <div className="steps-indicator">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`step-item ${getStepStatus(step.number)}`}
            onClick={() => handleStepClick(step.number)}
          >
            <div className="step-item__circle">
              {getStepStatus(step.number) === 'completed' ? (
                <span>✓</span>
              ) : (
                <span className="step-item__icon">{step.icon}</span>
              )}
            </div>
            <div className="step-item__label">{step.title}</div>
          </div>
        ))}
      </div>

      {/* Botones de navegación */}
      <div className="navigation-buttons">
        <button
          className="nav-btn nav-btn--secondary"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          ← Anterior
        </button>
        
        {currentStep < totalSteps && (
          <button
            className="nav-btn nav-btn--primary"
            onClick={handleNext}
          >
            Siguiente →
          </button>
        )}
      </div>
    </div>
  );
};

export default StepNavigation;
