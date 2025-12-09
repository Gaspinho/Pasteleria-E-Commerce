import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLayer } from '../../../features/customCakeSlice';

const LayerSelection = () => {
  const dispatch = useDispatch();
  const selectedLayerId = useSelector(state => state.customCake.design.layer_id);
  
  // Mock de opciones - en producción vendría de la BD
  const [layers] = useState([
    {
      id: '1',
      shape_id: '1',
      layer_number: 1,
      shape_name: 'Redondo',
      layer_description: '15 x 21 cm para 6 personas',
      price: 10000,
      image: '/data/images/customDesign/1_5_2.png'
    },
    {
      id: '2',
      shape_id: '1',
      layer_number: 2,
      shape_name: 'Redondo',
      layer_description: '15 x 21 cm (1.° piso) + 10 x 14 cm (2.° piso) para 15 personas',
      price: 20000,
      image: '/data/images/customDesign/1_14_2.png'
    },
    {
      id: '3',
      shape_id: '1',
      layer_number: 3,
      shape_name: 'Redondo',
      layer_description: '15 x 21 cm (1.° piso) + 10 x 14 cm (2.° piso) + 7 x 10 cm (3.° piso) para 25 personas',
      price: 30000,
      image: '/data/images/customDesign/1_16_2.png'
    },
    {
      id: '4',
      shape_id: '3',
      layer_number: 1,
      shape_name: 'Rectangular',
      layer_description: '21 x 29.7 cm para 20 personas',
      price: 15000,
      image: '/data/images/customDesign/3_18_2.png'
    },
    {
      id: '5',
      shape_id: '3',
      layer_number: 2,
      shape_name: 'Rectangular',
      layer_description: '30 x 40 cm (1.° piso) + 21 x 29.7 cm (2.° piso) para 55 personas',
      price: 25000,
      image: '/data/images/customDesign/3_19_2.png'
    },
    {
      id: '6',
      shape_id: '3',
      layer_number: 3,
      shape_name: 'Rectangular',
      layer_description: '30 x 40 cm (1.°) + 21 x 29.7 cm (2.°) + 15 x 21 cm (3.°) para 80 personas',
      price: 35000,
      image: '/data/images/customDesign/3_20_2.png'
    },
  ]);

  const handleLayerSelect = (layer) => {
    dispatch(setLayer({
      id: String(layer.id),
      shape_id: String(layer.shape_id),
      layer_number: layer.layer_number,
      price: layer.price
    }));
  };

  return (
    <div className="layer-selection">
      <h2 className="step-title">Selecciona la Forma y Capas de tu Pastel</h2>
      <p className="step-description">Elige el tamaño perfecto para tu celebración</p>
      
      <div className="layer-grid">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className={`layer-card ${selectedLayerId === layer.id ? 'selected' : ''}`}
            onClick={() => handleLayerSelect(layer)}
          >
            <div className="layer-card__image">
              <img src={layer.image} alt={layer.layer_description} />
            </div>
            <div className="layer-card__content">
              <h3 className="layer-card__shape">{layer.shape_name}</h3>
              <p className="layer-card__description">{layer.layer_description}</p>
              <div className="layer-card__footer">
                <span className="layer-card__layers">
                  {layer.layer_number} {layer.layer_number === 1 ? 'Capa' : 'Capas'}
                </span>
                <span className="layer-card__price">
                  ${layer.price.toLocaleString('es-CL')}
                </span>
              </div>
            </div>
            {selectedLayerId === layer.id && (
              <div className="layer-card__checkmark">✓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayerSelection;
