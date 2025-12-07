import { useState } from 'react';
import { ProfileAside } from './ProfileAside/ProfileAside';
import { ProfileOrders } from './ProfileOrders/ProfileOrders';
import { ProfileDesignOrders} from './ProfileDesignOrders/ProfileDesignOrders';
import { useSelector } from "react-redux";

export const Profile = () => {
  const user = useSelector(state => state.user)

  const [activeTab, setActiveTab] = useState('myInfo');
  
  return (
    <>
      {/* <!-- INICIO PERFIL --> */}
      <div className='profile'>
        <div className='wrapper'>
          <div className='profile-content'>
            <ProfileAside />
            <div className='profile-main'>
              <div className='tab-wrap'>
                <ul className='nav-tab-list tabs'>
                  <li
                    onClick={() => setActiveTab('myInfo')}
                    className={activeTab === 'myInfo' ? 'active' : ''}
                  >
                    Mi Información
                  </li>
                  <li
                    onClick={() => setActiveTab('orders')}
                    className={activeTab === 'orders' ? 'active' : ''}
                  >
                    Mis Pedidos
                  </li>
                  <li
                    onClick={() => setActiveTab('wishList')}
                    className={activeTab === 'wishList' ? 'active' : ''}
                  >
                    Pedidos de Diseño
                  </li> 
                </ul>

                <div className='box-tab-cont'>
                  {activeTab === 'myInfo' && (
                    <div className='tab-cont' id='profile-tab_1'>
                      <div className='info-card'>
                        <h3 className='info-card-title'>Información Personal</h3>
                        <div className='info-grid'>
                          <div className='info-item'>
                            <label className='info-label'>Nombre</label>
                            <p className='info-value'>{user.first_name || 'No especificado'}</p>
                          </div>
                          <div className='info-item'>
                            <label className='info-label'>Apellido</label>
                            <p className='info-value'>{user.last_name || 'No especificado'}</p>
                          </div>
                          <div className='info-item'>
                            <label className='info-label'>Correo Electrónico</label>
                            <p className='info-value'>{user.email || 'No especificado'}</p>
                          </div>
                          <div className='info-item'>
                            <label className='info-label'>Número de Teléfono</label>
                            <p className='info-value'>{user.phone_number || 'No especificado'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'orders' && <ProfileOrders />}

                  {activeTab === 'wishList' && <ProfileDesignOrders />}
                </div>
              </div>
            </div>
          </div>
        </div>
        <img
          className='promo-video__decor js-img'
          src='/assets/img/promo-video__decor.jpg'
          alt=''
        />
      </div>
      {/* <!-- FIN PERFIL --> */}

      <style jsx>{`
        .info-card {
          background: #fff;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .info-card-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f0f0f0;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .info-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #7f8c8d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          font-size: 1rem;
          color: #2c3e50;
          font-weight: 500;
          padding: 0.75rem;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 3px solid #3498db;
        }

        @media (max-width: 768px) {
          .info-grid {
            grid-template-columns: 1fr;
          }
          
          .info-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </>
  );
};