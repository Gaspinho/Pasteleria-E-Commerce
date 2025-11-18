import { useOrderedProductsQuery } from '../../../../services/orderApi';

export const Card = ({ order, index, onCollapse, active }) => {
  const orderItems = useOrderedProductsQuery(order.order_Id);
  
  if (orderItems.isLoading) {
    return (
      <div className='order-loading'>
        <div className='mini-spinner'></div>
        <span>Cargando...</span>
      </div>
    );
  }
  
  if (orderItems.isError) {
    return (
      <div className='order-error'>
        <span>Error al cargar el pedido</span>
      </div>
    );
  }

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

  const statusConfig = getStatusConfig(order.order_Status);

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
              ${order.total_Amount}
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
            <h4 className='details-title'>Detalles del Pedido</h4>
            <div className='products-list'>
              {orderItems.data.map((item, idx) => (
                <div key={idx} className='product-item'>
                  <div className='product-image'>
                    <img 
                      src={`http://127.0.0.1:8000${item.product_Id.imageGallery.image1}`} 
                      alt={item.product_Id.product_Name}
                    />
                  </div>
                  <div className='product-info'>
                    <h5 className='product-name'>{item.product_Id.product_Name}</h5>
                    <span className='product-price'>${item.product_Id.product_Price}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className='payment-info'>
              <span className='payment-label'>Método de Pago:</span>
              <span className='payment-method'>💵 Pago Contra Entrega</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .order-loading, .order-error {
          padding: 1rem;
          text-align: center;
          border-radius: 12px;
          margin-bottom: 1rem;
        }

        .order-loading {
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        .mini-spinner {
          width: 20px;
          height: 20px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .order-error {
          background: #fee;
          color: #c33;
        }

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
          color: #27ae60;
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
          background: #667eea;
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
          background: #5568d3;
          transform: scale(1.1);
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
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #dee2e6;
        }

        .products-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .product-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 12px;
          align-items: center;
          transition: all 0.3s ease;
        }

        .product-item:hover {
          transform: translateX(5px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .product-image {
          width: 80px;
          height: 80px;
          border-radius: 10px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
        }

        .product-name {
          font-size: 1rem;
          font-weight: 500;
          color: #2c3e50;
        }

        .product-price {
          font-size: 1.125rem;
          font-weight: 700;
          color: #27ae60;
        }

        .payment-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 12px;
          border-left: 4px solid #667eea;
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

          .product-item {
            flex-direction: column;
            text-align: center;
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