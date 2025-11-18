export const DesignOrderCard = ({ order, index, onCollapse, active }) => {
  const getStatusConfig = (status) => {
    const configs = {
      "Order Placed": { 
        color: "#3498db", 
        bgColor: "#ebf5fb", 
        icon: "📝",
        label: "Pedido Realizado"
      },
      "Under Package": { 
        color: "#f39c12", 
        bgColor: "#fef5e7", 
        icon: "📦",
        label: "En Empaque"
      },
      "On The way to deliver": { 
        color: "#9b59b6", 
        bgColor: "#f4ecf7", 
        icon: "🚚",
        label: "En Camino"
      },
      "Delivered": { 
        color: "#27ae60", 
        bgColor: "#eafaf1", 
        icon: "✅",
        label: "Entregado"
      },
      "Canceled": { 
        color: "#e74c3c", 
        bgColor: "#fadbd8", 
        icon: "❌",
        label: "Cancelado"
      }
    };
    return configs[status] || configs["Order Placed"];
  };

  const statusConfig = getStatusConfig(order.CustomCake.order_Status);

  return (
    <>
      <div className={`profile-orders__item ${active === index ? 'active' : ''}`}>
        <div className='profile-orders__row order-summary'>
          <div className='profile-orders__col'>
            <span className='profile-orders__col-mob'>Fecha</span>
            <span className='profile-orders__item-date'>
              <span className='date-icon'>📅</span>
              {order.order_Placment_Date}
            </span>
          </div>
          <div className='profile-orders__col'>
            <span className='profile-orders__col-mob'>Dirección de Entrega</span>
            <span className='profile-orders__item-addr'>
              <span className='addr-icon'>📍</span>
              Casa: {order.address.house_Number}, Calle: {order.address.street_Number}, 
              Área: {order.address.area}, Ciudad: {order.address.city}
            </span>
          </div>
          <div className='profile-orders__col'>
            <span className='profile-orders__col-mob'>Monto</span>
            <span className='profile-orders__item-price'>
              ${order.CustomCake.amount}
            </span>
          </div>
          <div className='profile-orders__col status-col'>
            <span className='profile-orders__col-mob'>Estado</span>
            <span 
              className='status-badge'
              style={{
                color: statusConfig.color,
                background: statusConfig.bgColor
              }}
            >
              <span className='status-icon'>{statusConfig.icon}</span>
              {statusConfig.label}
            </span>
            <button
              onClick={() => onCollapse(index)}
              className='toggle-btn'
              aria-label={active === index ? 'Contraer' : 'Expandir'}
            >
              {active === index ? '▲' : '▼'}
            </button>
          </div>
        </div>
        
        <div className='profile-orders__content'>
          <div className='order-details'>
            <h4 className='details-title'>Detalles del Diseño Personalizado</h4>
            <div className='custom-cake-details'>
              <div className='cake-image-container'>
                <img 
                  src={`http://127.0.0.1:8000${order.CustomCake.finalProduct.finalProductImg}`} 
                  alt="Diseño de pastel personalizado"
                  className='cake-image'
                />
                <div className='cake-badge'>🎂 Diseño Personalizado</div>
              </div>
              <div className='cake-specifications'>
                <div className='spec-item'>
                  <div className='spec-icon'>🎂</div>
                  <div className='spec-content'>
                    <span className='spec-label'>Capas y Forma</span>
                    <span className='spec-value'>{order.CustomCake.Cake_Shape_layers.layer_description}</span>
                  </div>
                </div>
                <div className='spec-item'>
                  <div className='spec-icon'>🍰</div>
                  <div className='spec-content'>
                    <span className='spec-label'>Sabor del Bizcocho</span>
                    <span className='spec-value'>{order.CustomCake.sponge_Flavor.flavor_name}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='payment-info'>
              <span className='payment-label'>Método de Pago:</span>
              <span className='payment-method'>💵 Pago Contra Entrega</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-orders__item {
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          margin-bottom: 1rem;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .profile-orders__item:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
        }

        .order-summary {
          padding: 1.25rem 1.5rem;
          cursor: pointer;
        }

        .profile-orders__item-date,
        .profile-orders__item-addr,
        .profile-orders__item-price {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #2c3e50;
          font-size: 0.95rem;
        }

        .date-icon, .addr-icon {
          font-size: 1.125rem;
        }

        .profile-orders__item-price {
          font-weight: 700;
          color: #f39c12;
          font-size: 1.125rem;
        }

        .status-col {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.875rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
        }

        .status-icon {
          font-size: 1rem;
        }

        .toggle-btn {
          background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
          color: white;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          font-size: 0.75rem;
          margin-left: auto;
        }

        .toggle-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3);
        }

        .profile-orders__content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease;
          background: #f8f9fa;
        }

        .profile-orders__item.active .profile-orders__content {
          max-height: 1000px;
          border-top: 2px solid #e9ecef;
        }

        .order-details {
          padding: 1.5rem;
        }

        .details-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #dee2e6;
        }

        .custom-cake-details {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 2rem;
          margin-bottom: 1.5rem;
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
        }

        .cake-image-container {
          position: relative;
        }

        .cake-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .cake-badge {
          position: absolute;
          top: -10px;
          left: -10px;
          background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
          color: white;
          padding: 0.5rem 0.875rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3);
        }

        .cake-specifications {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .spec-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 10px;
          align-items: center;
          transition: all 0.3s ease;
        }

        .spec-item:hover {
          background: #e9ecef;
          transform: translateX(5px);
        }

        .spec-icon {
          font-size: 2rem;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 10px;
          flex-shrink: 0;
        }

        .spec-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
        }

        .spec-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #7f8c8d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .spec-value {
          font-size: 1rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .payment-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 12px;
          border-left: 4px solid #f39c12;
        }

        .payment-label {
          font-weight: 600;
          color: #7f8c8d;
        }

        .payment-method {
          color: #2c3e50;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .profile-orders__row {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .profile-orders__col-mob {
            display: block;
            font-weight: 600;
            color: #7f8c8d;
            font-size: 0.75rem;
            text-transform: uppercase;
            margin-bottom: 0.25rem;
          }

          .status-col {
            flex-direction: row;
            justify-content: space-between;
          }

          .custom-cake-details {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .cake-image-container {
            display: flex;
            justify-content: center;
          }

          .cake-image {
            max-width: 250px;
          }

          .payment-info {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
};