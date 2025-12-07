import Link from 'next/link';

// Recibimos la nueva prop 'onRemoveProduct'
export const Card = ({ cart, onChangeQuantity, onRemoveProduct }) => {
  const {
    name,
    image,
    id,
    isStocked,
    productNumber,
    oldPrice,
    price,
    quantity,
  } = cart;

  return (
    <>
      <div className='cart-table__row'>
        <div className='cart-table__col cart-table__col-product'>
          <Link href={`/product/${id}`}>
            <a className='cart-table__img'>
              <img src={image} className='js-img' alt={name} />
            </a>
          </Link>
          <div className='cart-table__info'>
            <Link href={`/product/${id}`}>
              <a className='title5'>{name}</a>
            </Link>
            {isStocked && (
              <span className='cart-table__info-stock'>
                ✓ En Stock
              </span>
            )}
            <span className='cart-table__info-num'>
              ID del Producto: {productNumber}
            </span>
          </div>
        </div>

        <div className='cart-table__col cart-table__col-price'>
          <span className='cart-table__col-mob'>Precio</span>
          {oldPrice ? (
            <span className='cart-table__price'>
              <span className='old-price'>${oldPrice}</span>
              <span className='current-price'>${price}</span>
            </span>
          ) : (
            <span className='cart-table__price current-price'>${price}</span>
          )}
        </div>

        <div className='cart-table__col cart-table__col-quantity'>
          <span className='cart-table__col-mob'>Cantidad</span>
          <div className='cart-table__quantity'>
            <div className='counter-box'>
              <span
                // Lógica de onClick simplificada
                onClick={() => onChangeQuantity('decrement')}
                className='counter-link counter-link__prev'
              >
                <i className='icon-arrow'></i>
              </span>
              <input
                type='text'
                className='counter-input'
                disabled
                value={quantity}
              />
              <span
                // Lógica de onClick simplificada
                onClick={() => onChangeQuantity('increment')}
                className='counter-link counter-link__next'
              >
                <i className='icon-arrow'></i>
              </span>
            </div>
          </div>
        </div>

        <div className='cart-table__col cart-table__col-total'>
          <span className='cart-table__col-mob'>Total</span>
          <span className='cart-table__total'>
            ${(price * quantity).toFixed(2)}
          </span>
          {/* ----- NUEVO BOTÓN DE ELIMINAR ----- */}
          <button 
            onClick={onRemoveProduct} 
            className="cart-table__remove" 
            title="Eliminar Producto"
          >
            &times;
          </button>
          {/* ----------------------------------- */}
        </div>
      </div>

      <style jsx>{`
        .cart-table__row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 1rem;
          align-items: center;
          padding: 1.5rem;
          background: white;
          border-radius: 12px;
          margin-bottom: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
        }

        .cart-table__row:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .cart-table__col-product {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .cart-table__img {
          width: 100px;
          height: 100px;
          border-radius: 10px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .cart-table__img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .cart-table__row:hover .cart-table__img img {
          transform: scale(1.1);
        }

        .cart-table__info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .title5 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #2c3e50;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .title5:hover {
          color: #ff6b9d;
        }

        .cart-table__info-stock {
          color: #27ae60;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .cart-table__info-num {
          color: #7f8c8d;
          font-size: 0.875rem;
        }

        .cart-table__price {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .old-price {
          text-decoration: line-through;
          color: #95a5a6;
          font-size: 0.875rem;
        }

        .current-price {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2c3e50;
        }

        .counter-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f8f9fa;
          border-radius: 10px;
          padding: 0.5rem;
        }

        .counter-link {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid #e9ecef;
        }

        .counter-link:hover {
          background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
          border-color: #ff9a9e;
          transform: scale(1.1);
        }

        .counter-input {
          width: 50px;
          text-align: center;
          border: none;
          background: transparent;
          font-weight: 600;
          color: #2c3e50;
          font-size: 1rem;
        }

        .counter-link__next .icon-arrow {
          transform: none;
        }
        
        /* --- ESTILOS PARA EL TOTAL Y ELIMINAR --- */

        .cart-table__col-total {
          display: flex;
          align-items: center;
          justify-content: flex-start; /* Alineado al inicio en desktop */
          gap: 1rem; /* Espacio entre el total y el 'x' */
        }

        .cart-table__total {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ff6b9d;
          flex-shrink: 0;
        }
        
        .cart-table__remove {
          border: none;
          background: transparent;
          color: #e74c3c; /* Rojo para 'eliminar' */
          font-size: 1.75rem;
          font-weight: 700;
          cursor: pointer;
          padding: 0 0.25rem;
          line-height: 1;
          transition: all 0.3s ease;
        }
        .cart-table__remove:hover {
          color: #c0392b;
          transform: scale(1.2);
        }
        
        /* --- FIN NUEVOS ESTILOS --- */


        .cart-table__col-mob {
          display: none;
        }

        @media (max-width: 768px) {
          .cart-table__row {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .cart-table__col-product {
            flex-direction: column;
            text-align: center;
          }

          .cart-table__img {
            width: 100%;
            height: 150px;
          }

          .cart-table__col-mob {
            display: block;
            font-weight: 600;
            color: #7f8c8d;
            font-size: 0.75rem;
            text-transform: uppercase;
            margin-bottom: 0.5rem;
          }

          .cart-table__col {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          /* --- AJUSTE MÓVIL PARA ELIMINAR --- */
          .cart-table__col-total {
            flex-direction: column; /* Apila el total y el 'x' */
            align-items: center;
            gap: 0.5rem;
          }
          
          .cart-table__remove {
            margin-top: 0.5rem;
            font-size: 1.5rem;
            padding: 0.25rem 1rem; /* Área de toque más grande */
            background: #fdf2f2;
            border-radius: 8px;
          }
        }
      `}</style>
    </>
  );
};