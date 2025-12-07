import { useState } from 'react';
import { DesignOrderCard } from './Card/DesignOrderCard';
import { useSelector } from "react-redux";
import { useGetProfileOrderQuery } from '../../../services/customOrderApi';

export const ProfileDesignOrders = () => {
  const user = useSelector(state => state.user);
  const [active, setActive] = useState(-1);
  const response = useGetProfileOrderQuery(user.id);
  
  if (response.isLoading) {
    return (
      <div className='loading-container'>
        <div className='spinner'></div>
        <p>Cargando pedidos personalizados...</p>
      </div>
    );
  }
  
  if (response.isError) {
    return (
      <div className='error-container'>
        <div className='error-icon'>⚠️</div>
        <h3>No se pudieron cargar los pedidos</h3>
        <p className='error-message'>
          {response.error?.data?.detail || 
           response.error?.error || 
           'Ocurrió un problema al cargar tus pedidos personalizados'}
        </p>
        <button 
          className='retry-button'
          onClick={() => window.location.reload()}
        >
          Intentar nuevamente
        </button>
      </div>
    );
  }
  
  // Validar que response.data sea un array antes de usar slice
  const ordersData = Array.isArray(response.data) ? response.data : [];
  const orders = ordersData.slice().reverse();

  const handleCollapse = (indx) => {
    if (active === indx) {
      setActive(-1);
    } else {
      setActive(indx);
    }
  };

  if (orders.length === 0) {
    return (
      <div className='empty-state'>
        <div className='empty-icon'>🎂</div>
        <h3>No tienes pedidos personalizados</h3>
        <p>Crea tu diseño de pastel personalizado y aparecerá aquí</p>
      </div>
    );
  }

  return (
    <>
      <div className='profile-orders'>
        <div className='orders-header'>
          <h2>Pedidos de Diseño Personalizado</h2>
          <span className='orders-count'>{orders.length} pedido{orders.length !== 1 ? 's' : ''}</span>
        </div>
        
        <div className='profile-orders__row profile-orders__row-head'>
          <div className='profile-orders__col'>Fecha</div>
          <div className='profile-orders__col'>Dirección de Entrega</div>
          <div className='profile-orders__col'>Monto</div>
          <div className='profile-orders__col'>Estado</div>
        </div>
        
        {orders.map((order, index) => (
          <DesignOrderCard
            key={index}
            index={index}
            onCollapse={handleCollapse}
            order={order}
            active={active}
          />
        ))}
      </div>

      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          gap: 1rem;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #f39c12;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-container p {
          color: #7f8c8d;
          font-size: 1rem;
        }

        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
          border: 2px solid #ff6b6b;
          border-radius: 16px;
          padding: 3rem 2rem;
          text-align: center;
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.1);
        }

        .error-icon {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .error-container h3 {
          color: #e74c3c;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .error-message {
          color: #c0392b;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          max-width: 500px;
        }

        .retry-button {
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
        }

        .retry-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(231, 76, 60, 0.4);
        }

        .retry-button:active {
          transform: translateY(0);
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: #7f8c8d;
          font-size: 1rem;
        }

        .orders-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f0f0f0;
        }

        .orders-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .orders-count {
          background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
          color: white;
          padding: 0.375rem 0.875rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .profile-orders__row-head {
          background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
          color: white;
          border-radius: 12px;
          padding: 1rem 1.5rem;
          margin-bottom: 1rem;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.875rem;
          letter-spacing: 0.5px;
        }

        .profile-orders__row {
          display: grid;
          grid-template-columns: minmax(150px, 1fr) minmax(250px, 2.5fr) minmax(120px, 1fr) minmax(180px, 1.5fr);
          gap: 1rem;
          align-items: center;
          width: 100%;
        }

        .profile-orders__col {
          padding: 0.5rem;
          overflow: visible;
          word-wrap: break-word;
        }

        @media (max-width: 768px) {
          .profile-orders__row {
            grid-template-columns: 1fr;
          }

          .profile-orders__row-head {
            display: none;
          }

          .orders-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .orders-header h2 {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </>
  );
};