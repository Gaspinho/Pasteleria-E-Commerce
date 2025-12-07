import React from 'react';
import { useSelector } from 'react-redux';

const DesignSummary = ({ onSaveDesign, isLoading }) => {
  const design = useSelector(state => state.customCake.design);
  const basePrice = useSelector(state => state.customCake.basePrice);
  const deliveryCharge = useSelector(state => state.customCake.deliveryCharge);

  const total = basePrice + deliveryCharge;

  return (
    <div className="design-summary">
      <h2 className="step-title">Resumen de tu Diseño</h2>
      <p className="step-description">Revisa todos los detalles antes de continuar</p>
      
      <div className="summary-content">
        <div className="summary-section">
          <h3 className="summary-section__title">📏 Forma y Capas</h3>
          <p className="summary-section__text">
            {design.layer_number} {design.layer_number === 1 ? 'Capa' : 'Capas'}
          </p>
        </div>

        <div className="summary-section">
          <h3 className="summary-section__title">🍰 Sabor del Bizcocho</h3>
          <p className="summary-section__text">
            {design.flavor_name || 'No seleccionado'}
          </p>
        </div>

        <div className="summary-section">
          <h3 className="summary-section__title">🧈 Cobertura</h3>
          <p className="summary-section__text">
            {design.icing_name || 'No seleccionado'}
          </p>
        </div>

        {design.imagetopdecoration_id && design.imagetopdecoration_id !== '0' && (
          <div className="summary-section">
            <h3 className="summary-section__title">✨ Decoración Superior</h3>
            <p className="summary-section__text">Incluida</p>
          </div>
        )}

        {design.msg_on_cake && (
          <div className="summary-section">
            <h3 className="summary-section__title">💬 Mensaje</h3>
            <p 
              className="summary-section__message"
              style={{ color: design.msg_color_code }}
            >
              "{design.msg_on_cake}"
            </p>
          </div>
        )}

        {design.special_instruction && (
          <div className="summary-section">
            <h3 className="summary-section__title">📝 Instrucciones Especiales</h3>
            <p className="summary-section__text">
              {design.special_instruction}
            </p>
          </div>
        )}

        <div className="summary-pricing">
          <div className="summary-pricing__row">
            <span>Precio Base:</span>
            <span>${basePrice.toLocaleString('es-CL')}</span>
          </div>
          <div className="summary-pricing__row">
            <span>Cargo de Entrega:</span>
            <span>${deliveryCharge.toLocaleString('es-CL')}</span>
          </div>
          <div className="summary-pricing__row summary-pricing__total">
            <span>Total:</span>
            <span>${total.toLocaleString('es-CL')}</span>
          </div>
        </div>

        <div className="summary-actions">
          <button
            className="summary-btn summary-btn--primary"
            onClick={onSaveDesign}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Guardando...
              </>
            ) : (
              <>
                💾 Guardar Diseño y Continuar al Checkout
              </>
            )}
          </button>
          
          <p className="summary-note">
            Al continuar, guardaremos tu diseño y podrás completar los datos de entrega
          </p>
        </div>
      </div>
    </div>
  );
};

export default DesignSummary;
