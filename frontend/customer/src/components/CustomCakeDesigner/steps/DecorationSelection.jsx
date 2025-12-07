import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDecoration } from '../../../features/customCakeSlice';

const DecorationSelection = () => {
  const dispatch = useDispatch();
  const selectedDecorationId = useSelector(state => state.customCake.design.imagetopdecoration_id);
  
  // Mock de opciones - en producción vendría de la BD
  const [decorations] = useState([
    {
      id: '0',
      name: 'Sin decoración',
      image: null,
      description: 'Cobertura simple'
    },
    {
      id: '1',
      name: 'Flores Comestibles',
      image: 'bundles/design/imagetopdecorationimage/flowers.png',
      description: 'Flores decorativas'
    },
    {
      id: '2',
      name: 'Frutas Frescas',
      image: 'bundles/design/imagetopdecorationimage/fruits.png',
      description: 'Fresas y arándanos'
    },
    {
      id: '3',
      name: 'Chocolate Rallado',
      image: 'bundles/design/imagetopdecorationimage/chocolate.png',
      description: 'Virutas de chocolate'
    },
    {
      id: '4',
      name: 'Confeti Comestible',
      image: 'bundles/design/imagetopdecorationimage/confetti.png',
      description: 'Colorido y festivo'
    },
    {
      id: '5',
      name: 'Perlas de Azúcar',
      image: 'bundles/design/imagetopdecorationimage/pearls.png',
      description: 'Elegante y brillante'
    },
  ]);

  const handleDecorationSelect = (decoration) => {
    dispatch(setDecoration({
      id: decoration.id,
      image: decoration.image
    }));
  };

  return (
    <div className="decoration-selection">
      <h2 className="step-title">Decoración Superior (Opcional)</h2>
      <p className="step-description">Añade un toque especial a tu pastel</p>
      
      <div className="decoration-grid">
        {decorations.map((decoration) => (
          <div
            key={decoration.id}
            className={`decoration-card ${selectedDecorationId === decoration.id ? 'selected' : ''}`}
            onClick={() => handleDecorationSelect(decoration)}
          >
            <div className="decoration-card__image">
              {decoration.image ? (
                <img src={decoration.image} alt={decoration.name} />
              ) : (
                <div className="decoration-card__no-image">
                  <span>🎂</span>
                </div>
              )}
            </div>
            <div className="decoration-card__content">
              <h3 className="decoration-card__name">{decoration.name}</h3>
              <p className="decoration-card__description">{decoration.description}</p>
            </div>
            {selectedDecorationId === decoration.id && (
              <div className="decoration-card__checkmark">✓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DecorationSelection;
