import Link from 'next/link';
import productData from 'data/product/product';

export const ProfileAside = () => {
  const recentlyViewed = [...productData].slice(0, 3);
  
  return (
    <>
      <div className='profile-aside'>
        <div className='profile-aside__notifications'>
          <h3>Notificaciones</h3>
          <p className='notifications-text'>Recibe ofertas exclusivas y novedades</p>
          
          <div className='notification-options'>
            <label className='notification-item'>
              <input type='checkbox' defaultChecked />
              <span className='checkbox-custom'></span>
              <div className='notification-content'>
                <span className='notification-title'>📧 Correo Electrónico</span>
                <span className='notification-desc'>Ofertas y promociones</span>
              </div>
            </label>
            
            <label className='notification-item'>
              <input type='checkbox' />
              <span className='checkbox-custom'></span>
              <div className='notification-content'>
                <span className='notification-title'>📱 SMS</span>
                <span className='notification-desc'>Alertas importantes</span>
              </div>
            </label>
          </div>
          
          <img
            src='/assets/img/subscribe-img-decor-sm.png'
            className='js-img'
            alt=''
          />
        </div>
        
        <div className='profile-aside__viewed'>
          <h5>Has Visto Recientemente</h5>
          <div className='viewed-list'>
            {recentlyViewed.map((product) => (
              <div key={product.id} className='profile-aside__viewed-item'>
                <Link href={`/product/${product.id}`}>
                  <a className='profile-aside__viewed-item-img'>
                    <img src={product.image} className='js-img' alt={product.name} />
                  </a>
                </Link>
                <div className='profile-aside__viewed-item-info'>
                  <Link href={`/product/${product.id}`}>
                    <a className='profile-aside__viewed-item-title'>
                      {product.name}
                    </a>
                  </Link>
                  <span className='profile-aside__viewed-item-price'>
                    ${product.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-aside__notifications {
          background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
          border-radius: 16px;
          padding: 2rem;
          color: #4a1942;
          position: relative;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }

        .profile-aside__notifications h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .notifications-text {
          font-size: 0.875rem;
          opacity: 0.85;
          margin-bottom: 1.5rem;
        }

        .notification-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .notification-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .notification-item:hover {
          background: rgba(255, 255, 255, 0.6);
          transform: translateX(5px);
        }

        .notification-item input[type='checkbox'] {
          display: none;
        }

        .checkbox-custom {
          width: 24px;
          height: 24px;
          border: 2px solid rgba(74, 25, 66, 0.4);
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.3s ease;
          margin-top: 2px;
        }

        .checkbox-custom::after {
          content: '✓';
          color: white;
          font-size: 16px;
          font-weight: bold;
          opacity: 0;
          transform: scale(0);
          transition: all 0.3s ease;
        }

        .notification-item input[type='checkbox']:checked + .checkbox-custom {
          background: #ff6b9d;
          border-color: #ff6b9d;
        }

        .notification-item input[type='checkbox']:checked + .checkbox-custom::after {
          opacity: 1;
          transform: scale(1);
          color: white;
        }

        .notification-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .notification-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #4a1942;
        }

        .notification-desc {
          font-size: 0.8rem;
          opacity: 0.75;
          color: #4a1942;
        }

        .profile-aside__viewed {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .profile-aside__viewed h5 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #f0f0f0;
        }

        .viewed-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .profile-aside__viewed-item {
          display: flex;
          gap: 1rem;
          padding: 0.75rem;
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .profile-aside__viewed-item:hover {
          background: #f8f9fa;
          transform: translateX(5px);
        }

        .profile-aside__viewed-item-img {
          width: 70px;
          height: 70px;
          border-radius: 10px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .profile-aside__viewed-item-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .profile-aside__viewed-item:hover img {
          transform: scale(1.1);
        }

        .profile-aside__viewed-item-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0.25rem;
        }

        .profile-aside__viewed-item-title {
          color: #2c3e50;
          font-weight: 500;
          font-size: 0.95rem;
          text-decoration: none;
          transition: color 0.3s ease;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .profile-aside__viewed-item-title:hover {
          color: #667eea;
        }

        .profile-aside__viewed-item-price {
          color: #27ae60;
          font-weight: 700;
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .profile-aside__subscribe {
            padding: 1.5rem;
          }
        }
      `}</style>
    </>
  );
};