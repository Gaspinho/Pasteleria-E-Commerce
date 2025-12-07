import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const CakePreview = () => {
  const design = useSelector(state => state.customCake.design);
  
  // Debug: mostrar el estado actual del diseño
  useEffect(() => {
    console.log('Current design state:', {
      shape_id: design.shape_id,
      layer_id: design.layer_id,
      spongeflavor_id: design.spongeflavor_id,
      icing_id: design.icing_id
    });
  }, [design]);
  
  // Construir ruta de imagen basada en selecciones
  const getImagePath = () => {
    // Si no hay capa seleccionada, mostrar imagen por defecto
    if (!design.layer_id) {
      return '/data/images/customDesign/1_14_2.png';
    }
    
    const shapeId = design.shape_id || '1';
    const layerId = design.layer_id;
    
    // Prioridad 1: Si hay icing Y sabor (y NO es "sin cobertura"), mostrar imagen con icing
    if (design.icing_id && design.icing_id !== '0' && design.spongeflavor_id) {
      const icingPath = `/data/images/customDesign/${shapeId}_${layerId}_Y_${design.icing_id}.png`;
      console.log('Image path with icing:', icingPath);
      return icingPath;
    }
    
    // Prioridad 2: Si solo hay sabor, mostrar imagen con sabor
    if (design.spongeflavor_id) {
      const flavorPath = `/data/images/customDesign/${shapeId}_${layerId}_${design.spongeflavor_id}.png`;
      console.log('Image path with flavor:', flavorPath);
      return flavorPath;
    }
    
    // Prioridad 3: Solo capa seleccionada, usar chocolate (3) por defecto
    const defaultPath = `/data/images/customDesign/${shapeId}_${layerId}_3.png`;
    console.log('Image path default:', defaultPath);
    return defaultPath;
  };

  const cakeImage = getImagePath();

  return (
    <div className="cake-preview">
      <div className="cake-preview__container">
        <div className="cake-preview__stage">
          {/* Imagen base del pastel */}
          <div className="cake-preview__base">
            <img 
              src={cakeImage} 
              alt="Tu diseño de pastel"
              className="cake-preview__image"
              onError={(e) => {
                console.error('Failed to load image:', cakeImage);
                // Intentar con imagen base sin icing
                if (cakeImage.includes('_Y_')) {
                  const basePath = cakeImage.replace(/_Y_\d+/, '_2');
                  e.target.src = basePath;
                } else {
                  e.target.src = '/data/images/customDesign/1_14_2.png';
                }
              }}
            />
          </div>

          {/* Decoración superior (si existe) */}
          {design.decoration_image && design.imagetopdecoration_id !== '0' && (
            <div className="cake-preview__decoration">
              <img 
                src={design.decoration_image} 
                alt="Decoración"
                className="cake-preview__decoration-image"
              />
            </div>
          )}

          {/* Mensaje (si existe) */}
          {design.msg_on_cake && (
            <div className="cake-preview__message">
              <p 
                className="cake-preview__message-text"
                style={{ color: design.msg_color_code }}
              >
                {design.msg_on_cake}
              </p>
            </div>
          )}
        </div>

        {/* Información del diseño */}
        <div className="cake-preview__info">
          <h3 className="cake-preview__title">Tu Diseño Personalizado</h3>
          
          {design.flavor_name && (
            <div className="cake-preview__detail">
              <span className="cake-preview__icon">🍰</span>
              <span>{design.flavor_name}</span>
            </div>
          )}
          
          {design.icing_name && (
            <div className="cake-preview__detail">
              <span className="cake-preview__icon">🧈</span>
              <span>{design.icing_name}</span>
            </div>
          )}
          
          {design.layer_number && (
            <div className="cake-preview__detail">
              <span className="cake-preview__icon">📏</span>
              <span>
                {design.layer_number} {design.layer_number === 1 ? 'Capa' : 'Capas'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CakePreview;
