import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFlavor } from '../../../features/customCakeSlice';

const FlavorSelection = () => {
  const dispatch = useDispatch();
  const selectedFlavorId = useSelector(state => state.customCake.design.spongeflavor_id);
  
  // Mock de opciones - en producción vendría de la BD
  const [flavors] = useState([
    {
      id: '5',
      flavor_name: 'Vainilla',
      description: 'Clásico y suave sabor a vainilla',
      icon: '🍰',
      color: '#FFF8DC'
    },
    {
      id: '4',
      flavor_name: 'Chocolate',
      description: 'Intenso sabor a chocolate',
      icon: '🍫',
      color: '#8B4513'
    },
    {
      id: '6',
      flavor_name: 'Red Velvet',
      description: 'Delicioso pastel de terciopelo rojo',
      icon: '❤️',
      color: '#DC143C'
    },
    {
      id: '2',
      flavor_name: 'Zanahoria',
      description: 'Pastel de zanahoria con especias',
      icon: '🥕',
      color: '#FF8C00'
    },
    {
      id: '7',
      flavor_name: 'Limón',
      description: 'Refrescante sabor cítrico',
      icon: '🍋',
      color: '#FFFF00'
    },
    {
      id: '3',
      flavor_name: 'Fresa',
      description: 'Dulce y delicado sabor a fresa',
      icon: '�草',
      color: '#FFB6C1'
    },
    {
      id: '1',
      flavor_name: 'Marmolado',
      description: 'Combinación perfecta de vainilla y chocolate',
      icon: '🎨',
      color: '#D2B48C'
    },
    {
      id: '8',
      flavor_name: 'Café',
      description: 'Sabor intenso a café',
      icon: '☕',
      color: '#6F4E37'
    },
  ]);

  const handleFlavorSelect = (flavor) => {
    dispatch(setFlavor({
      id: String(flavor.id),
      name: flavor.flavor_name
    }));
  };

  return (
    <div className="flavor-selection">
      <h2 className="step-title">Elige el Sabor del Bizcocho</h2>
      <p className="step-description">El sabor que hará especial tu pastel</p>
      
      <div className="flavor-grid">
        {flavors.map((flavor) => (
          <div
            key={flavor.id}
            className={`flavor-card ${selectedFlavorId === flavor.id ? 'selected' : ''}`}
            onClick={() => handleFlavorSelect(flavor)}
            style={{ '--flavor-color': flavor.color }}
          >
            <div className="flavor-card__icon">{flavor.icon}</div>
            <h3 className="flavor-card__name">{flavor.flavor_name}</h3>
            <p className="flavor-card__description">{flavor.description}</p>
            {selectedFlavorId === flavor.id && (
              <div className="flavor-card__checkmark">✓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlavorSelection;
