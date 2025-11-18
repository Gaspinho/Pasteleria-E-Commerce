import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage, setMessageColor } from '../../../features/customCakeSlice';

const MessageCustomization = () => {
  const dispatch = useDispatch();
  const message = useSelector(state => state.customCake.design.msg_on_cake);
  const selectedColorId = useSelector(state => state.customCake.design.msg_color_id);
  const selectedColorCode = useSelector(state => state.customCake.design.msg_color_code);
  
  // Mock de colores - en producción vendría de la BD
  const [colors] = useState([
    { id: '1', color_name: 'Negro', color_code: '#000000' },
    { id: '2', color_name: 'Blanco', color_code: '#FFFFFF' },
    { id: '3', color_name: 'Rosa', color_code: '#FF69B4' },
    { id: '4', color_name: 'Azul', color_code: '#4169E1' },
    { id: '5', color_name: 'Dorado', color_code: '#FFD700' },
    { id: '6', color_name: 'Plateado', color_code: '#C0C0C0' },
    { id: '7', color_name: 'Rojo', color_code: '#DC143C' },
    { id: '8', color_name: 'Verde', color_code: '#32CD32' },
  ]);

  const handleMessageChange = (e) => {
    const value = e.target.value;
    if (value.length <= 50) {
      dispatch(setMessage(value));
    }
  };

  const handleColorSelect = (color) => {
    dispatch(setMessageColor({
      id: color.id,
      color_code: color.color_code
    }));
  };

  return (
    <div className="message-customization">
      <h2 className="step-title">Mensaje Personalizado (Opcional)</h2>
      <p className="step-description">Añade un mensaje especial en tu pastel</p>
      
      <div className="message-form">
        <div className="message-input-group">
          <label htmlFor="cake-message" className="message-label">
            Tu Mensaje
          </label>
          <input
            type="text"
            id="cake-message"
            className="message-input"
            placeholder="Ej: Feliz Cumpleaños, ¡Felicidades!, Te Amo..."
            value={message}
            onChange={handleMessageChange}
            maxLength={50}
          />
          <span className="message-counter">
            {message.length}/50 caracteres
          </span>
        </div>

        {message && (
          <>
            <div className="message-preview">
              <h3 className="message-preview__title">Vista Previa del Mensaje:</h3>
              <div 
                className="message-preview__text"
                style={{ color: selectedColorCode }}
              >
                {message}
              </div>
            </div>

            <div className="color-selection">
              <h3 className="color-selection__title">Color del Mensaje</h3>
              <div className="color-palette">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    className={`color-swatch ${selectedColorId === color.id ? 'selected' : ''}`}
                    style={{ backgroundColor: color.color_code }}
                    onClick={() => handleColorSelect(color)}
                    title={color.color_name}
                    aria-label={color.color_name}
                  >
                    {selectedColorId === color.id && (
                      <span className="color-swatch__check">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {!message && (
          <div className="message-hint">
            <span className="message-hint__icon">💡</span>
            <p>Puedes dejar este campo vacío si no deseas un mensaje en tu pastel</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageCustomization;
