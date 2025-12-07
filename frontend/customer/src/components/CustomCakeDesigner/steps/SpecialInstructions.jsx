import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSpecialInstructions } from '../../../features/customCakeSlice';

const SpecialInstructions = () => {
  const dispatch = useDispatch();
  const instructions = useSelector(state => state.customCake.design.special_instruction);

  const handleInstructionsChange = (e) => {
    dispatch(setSpecialInstructions(e.target.value));
  };

  return (
    <div className="special-instructions">
      <h2 className="step-title">Instrucciones Especiales (Opcional)</h2>
      <p className="step-description">¿Hay algo más que debamos saber?</p>
      
      <div className="instructions-form">
        <textarea
          className="instructions-textarea"
          placeholder="Ej: Sin azúcar, alergias al maní, preferencia de flores, etc."
          value={instructions}
          onChange={handleInstructionsChange}
          rows={6}
          maxLength={500}
        />
        <span className="instructions-counter">
          {instructions.length}/500 caracteres
        </span>

        <div className="instructions-examples">
          <h3 className="instructions-examples__title">Ejemplos comunes:</h3>
          <ul className="instructions-examples__list">
            <li>🥜 "Sin frutos secos por alergias"</li>
            <li>🍬 "Reducir el azúcar en la cobertura"</li>
            <li>🌸 "Preferencia por flores rosadas"</li>
            <li>📦 "Empacar separadamente la decoración"</li>
            <li>🎉 "Es para una celebración sorpresa"</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SpecialInstructions;
