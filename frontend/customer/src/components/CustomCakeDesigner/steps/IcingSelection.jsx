import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIcing } from '../../../features/customCakeSlice';

const IcingSelection = () => {
  const dispatch = useDispatch();
  const selectedIcingId = useSelector(state => state.customCake.design.icing_id);
  
  // Mock de opciones - en producción vendría de la BD
  const [icings] = useState([
    {
      id: '0',
      decoration_name: 'Sin Cobertura',
      description: 'Solo el bizcocho',
      icon: '🚫'
    },
    {
      id: '1',
      decoration_name: 'Crema de Mantequilla',
      description: 'Suave y cremosa',
      icon: '🧈'
    },
    {
      id: '3',
      decoration_name: 'Chocolate',
      description: 'Ganache de chocolate oscuro',
      icon: '🍫'
    },
    {
      id: '4',
      decoration_name: 'Crema de Queso',
      description: 'Perfecta para red velvet',
      icon: '🧀'
    },
    {
      id: '6',
      decoration_name: 'Merengue Italiano',
      description: 'Ligero y esponjoso',
      icon: '☁️'
    },
    {
      id: '7',
      decoration_name: 'Frutas Frescas',
      description: 'Con frutas de temporada',
      icon: '🍓'
    },
  ]);

  const handleIcingSelect = (icing) => {
    dispatch(setIcing({
      id: String(icing.id),
      name: icing.decoration_name
    }));
  };

  return (
    <div className="icing-selection">
      <h2 className="step-title">Selecciona la Cobertura</h2>
      <p className="step-description">El toque final que hará lucir tu pastel</p>
      
      <div className="icing-grid">
        {icings.map((icing) => (
          <div
            key={icing.id}
            className={`icing-card ${selectedIcingId === icing.id ? 'selected' : ''}`}
            onClick={() => handleIcingSelect(icing)}
          >
            <div className="icing-card__icon">{icing.icon}</div>
            <h3 className="icing-card__name">{icing.decoration_name}</h3>
            <p className="icing-card__description">{icing.description}</p>
            {selectedIcingId === icing.id && (
              <div className="icing-card__checkmark">✓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IcingSelection;
