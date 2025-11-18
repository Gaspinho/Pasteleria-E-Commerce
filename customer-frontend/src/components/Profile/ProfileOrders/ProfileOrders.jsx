import { useState } from 'react';
import { Card } from './Card/Card';
import { useSelector } from "react-redux";
import { useGetOrdersQuery } from '../../../services/orderApi';

export const ProfileOrders = () => {
  const user = useSelector(state => state.user);
  const [active, setActive] = useState(-1);
  const response = useGetOrdersQuery(user.id);
  
  if (response.isLoading) {
    return (
      <div className='loading-container'>
        <div className='spinner'></div>
        <p>Cargando pedidos...</p>
      </div>
    );
  }
  
  if (response.isError) {
    return (
      <div className='error-container'>
        <h6>Ha ocurrido un error: {response.error.error}</h6>
      </div>
    );
  }
  
  const orders = (response.data).slice().reverse();

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
        <div className='empty-icon'>📦</div>
        <h3>No tienes pedidos aún</h3>
        <p>Tus pedidos aparecerán aquí una vez que realices una compra</p>
      </div>
    );
  }

  return (
    <>
      <div className='profile-orders'>
        <div className='orders-header'>
          <h2>Mis Pedidos</h2>
          <span className='orders-count'>{orders.length} pedido{orders.length !== 1 ? 's' : ''}</span>
        </div>
        
        <div className='profile-orders__row profile-orders__row-head'>
          <div className='profile-orders__col'>Fecha</div>
          <div className='profile-orders__col'>Dirección de Entrega</div>
          <div className='profile-orders__col'>Monto</div>
          <div className='profile-orders__col'>Estado</div>
        </div>
        
        {orders.map((order, index) => (
          <Card
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
          border-top: 4px solid #667eea;
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
          background: #fee;
          border: 2px solid #fcc;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          color: #c33;
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
          background: #667eea;
          color: white;
          padding: 0.375rem 0.875rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .profile-orders__row-head {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          grid-template-columns: 1fr 2fr 1fr 1.5fr;
          gap: 1rem;
          align-items: center;
        }

        .profile-orders__col {
          padding: 0.5rem;
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
        }
      `}</style>
    </>
  );
};