import { useOrderedProductsQuery } from '../../../../services/orderApi';

export const Card = ({ order, index, onCollapse, active }) => {
  // El backend devuelve 'id', pero antes se esperaba 'order_Id'
  const orderId = order.id || order.order_Id;
  const orderItems = useOrderedProductsQuery(orderId, {
    skip: !orderId // No hacer la petición si no hay ID
  });
  
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

  const statusConfig = getStatusConfig(order.status || order.order_Status);

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <div className={`profile-orders__item ${active === index ? 'active' : ''}`}>
        <div className='profile-orders__row order-summary'>
          <div className='profile-orders__col'>
            <span className='profile-orders__col-mob'>Fecha</span>
            <span className='profile-orders__item-date'>
              <span className='date-icon'>📅</span>
              {formatDate(order.placed_at || order.order_Placment_Date)}
            </span>
          </div>
          <div className='profile-orders__col'>
            <span className='profile-orders__col-mob'>Dirección de Entrega</span>
            <span className='profile-orders__item-addr'>
              <span className='addr-icon'>📍</span>
              {order.address ? (
                <>
                  Casa: {order.address.house_number}, Calle: {order.address.street_number}, 
                  Área: {order.address.area}, Ciudad: {order.address.city}
                </>
              ) : 'Dirección no disponible'}
            </span>
          </div>
          <div className='profile-orders__col'>
            <span className='profile-orders__col-mob'>Monto</span>
            <span className='profile-orders__item-price'>
              ${(order.total_amount || order.total_Amount || 0).toLocaleString('es-CL')}
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
              {orderItems.data && orderItems.data.length > 0 ? (
                orderItems.data.map((item, idx) => {
                  const product = item.productos || item.product_Id;
                  return (
                    <div key={idx} className='product-item'>
                      <div className='product-image'>
                        <img 
                          src={product.image_path ? `http://127.0.0.1:8000${product.image_path}` : '/assets/img/placeholder.jpg'} 
                          alt={product.nombre || product.product_Name}
                        />
                      </div>
                      <div className='product-info'>
                        <h5 className='product-name'>{product.nombre || product.product_Name}</h5>
                        <div className='product-details'>
                          <span className='product-price'>${(product.precio || product.product_Price || 0).toLocaleString('es-CL')}</span>
                          <span className='product-quantity'>Cantidad: {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className='no-products'>
                  <p>No hay productos en este pedido</p>
                </div>
              )}
            </div>
            <div className='order-summary-info'>
              <div className='summary-row'>
                <span className='summary-label'>Subtotal:</span>
                <span className='summary-value'>${((order.total_amount || order.total_Amount || 0) - (order.delivery_charges || order.delivery_Charges || 0)).toLocaleString('es-CL')}</span>
              </div>
              <div className='summary-row'>
                <span className='summary-label'>Entrega:</span>
                <span className='summary-value'>${(order.delivery_charges || order.delivery_Charges || 0).toLocaleString('es-CL')}</span>
              </div>
              <div className='summary-row total'>
                <span className='summary-label'>Total:</span>
                <span className='summary-value'>${(order.total_amount || order.total_Amount || 0).toLocaleString('es-CL')}</span>
              </div>
            </div>
            <div className='payment-info'>
              <span className='payment-label'>Método de Pago:</span>
              <span className='payment-method'>💵 {order.payment?.payment_type || 'Pago Contra Entrega'}</span>
            </div>
            {order.note && (
              <div className='order-note'>
                <span className='note-label'>Nota:</span>
                <p className='note-text'>{order.note}</p>
              </div>
            )}
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

        .product-details {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .product-price {
          font-size: 1.125rem;
          font-weight: 700;
          color: #27ae60;
        }

        .product-quantity {
          font-size: 0.875rem;
          color: #7f8c8d;
          font-weight: 500;
        }

        .no-products {
          text-align: center;
          padding: 2rem;
          color: #7f8c8d;
        }

        .order-summary-info {
          background: white;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #e9ecef;
        }

        .summary-row:last-child {
          border-bottom: none;
        }

        .summary-row.total {
          font-weight: 700;
          font-size: 1.125rem;
          color: #2c3e50;
          padding-top: 0.75rem;
          margin-top: 0.5rem;
          border-top: 2px solid #dee2e6;
        }

        .summary-label {
          color: #7f8c8d;
        }

        .summary-value {
          color: #27ae60;
          font-weight: 600;
        }

        .summary-row.total .summary-value {
          color: #2c3e50;
        }

        .order-note {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1rem;
        }

        .note-label {
          font-weight: 600;
          color: #856404;
          display: block;
          margin-bottom: 0.5rem;
        }

        .note-text {
          color: #856404;
          margin: 0;
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