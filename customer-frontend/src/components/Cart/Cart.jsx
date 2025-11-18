import { Card } from "./Card/Card";
import socialData from "data/social";
import { CartContext } from "pages/_app";
import { useContext } from "react"; // Se eliminan useEffect y useState, ya no son necesarios
import Link from "next/link";

export const Cart = () => {
  const { cart, setCart } = useContext(CartContext);
  const socialLinks = [...socialData];

  // ***** CORRECCIÓN DE BUG *****
  // El costo de envío se calcula FUERA del reduce, de lo contrario se suma por cada item.
  const shippingCost = 50.00;
  const subtotal = cart.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0
  );
  const total = subtotal + shippingCost;

  // ***** FUNCIÓN MEJORADA *****
  // Lógica de cantidad simplificada y sin mutar el estado.
  const handleProductQuantity = (change, id) => {
    const updatedCart = cart.map(item => {
      if (item.id === id) {
        if (change === 'increment') {
          return { ...item, quantity: item.quantity + 1 };
        }
        if (change === 'decrement' && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
      }
      return item;
    });
    setCart(updatedCart);
  };

  // ***** NUEVA FUNCIÓN *****
  // Añadida la función para eliminar un producto
  const handleRemoveProduct = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
  };

  // El useEffect y el estado 'count' se eliminaron, ya que
  // 'setCart' es suficiente para manejar las actualizaciones.

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="wrapper">
          <div className="empty-state">
            <h2>Tu carrito está vacío</h2>
            <p>Agrega algunos productos deliciosos a tu carrito</p>
            <Link href="/shop">
              <a className="btn">Ir a la Tienda</a>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* */}
      <div className="cart">
        <div className="wrapper">
          <div className="cart-header">
            <h2>Mi Carrito de Compras</h2>
            <span className="cart-count">{cart.length} producto{cart.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="cart-table">
            <div className="cart-table__box">
              <div className="cart-table__row cart-table__row-head">
                <div className="cart-table__col">Producto</div>
                <div className="cart-table__col">Precio</div>
                <div className="cart-table__col">Cantidad</div>
                <div className="cart-table__col">Total</div>
              </div>

              {cart.map((cartItem) => ( // renombrado a cartItem para evitar confusión
                <Card
                  // Prop de cantidad simplificada
                  onChangeQuantity={(change) =>
                    handleProductQuantity(change, cartItem.id)
                  }
                  // Nueva prop para eliminar
                  onRemoveProduct={() => handleRemoveProduct(cartItem.id)}
                  key={cartItem.id}
                  cart={cartItem}
                />
              ))}
            </div>
          </div>

          <div className="cart-bottom">
            <div className="cart-bottom__promo">
              <h3>¿Por qué elegirnos?</h3>
              <p>
                Ofrecemos un servicio increíble y pasteles de la mejor calidad. 
                Trabajamos con socios de entrega confiables que garantizan que tu 
                pedido llegue a tiempo y en perfectas condiciones. Cuando desees 
                un pastel fresco y delicioso, solo llámanos. ¡Frescura y sabor 
                entregados directamente a tu puerta!
              </p>
              <div className="contacts-info__social">
                <span>Encuéntranos aquí:</span>
                <ul>
                  {socialLinks.map((social, index) => (
                    <li key={index}>
                      <a href={social.path} target="_blank" rel="noopener noreferrer">
                        <i className={social.icon}></i>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="cart-bottom__total">
              {/* ***** CORRECCIÓN DE BUG ***** */}
              {/* Usando las variables 'subtotal' y 'total' correctas */}
              <div className="cart-bottom__total-goods">
                Subtotal de Productos
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="cart-bottom__total-promo">
                Cargos de Envío
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <div className="cart-bottom__total-num">
                Total a Pagar:
                <span>${total.toFixed(2)}</span>
              </div>
              <Link href="/checkout">
                <a className="btn btn-checkout">Proceder al Pago</a>
              </Link>
            </div>
          </div>
        </div>
        <img
          className="promo-video__decor js-img"
          src="assets/img/promo-video__decor.jpg"
          alt=""
        />
      </div>
      {/* */}

      <style jsx>{`
        /* ... (Estilos existentes sin cambios) ... */
        .cart-empty {
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
        }

        .empty-icon {
          font-size: 5rem;
          margin-bottom: 1.5rem;
          opacity: 0.5;
        }

        .empty-state h2 {
          font-size: 2rem;
          color: #2c3e50;
          margin-bottom: 0.75rem;
        }

        .empty-state p {
          color: #7f8c8d;
          font-size: 1.125rem;
          margin-bottom: 2rem;
        }

        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f0f0f0;
        }

        .cart-header h2 {
          font-size: 1.75rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .cart-count {
          background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
          color: #4a1942;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .cart-bottom__promo h3 {
          font-size: 1.25rem;
          color: #2c3e50;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .btn-checkout {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
          color: #4a1942;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s ease;
        }

        .btn-checkout:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 154, 158, 0.4);
        }

        @media (max-width: 768px) {
          .cart-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
        }
      `}</style>
    </>
  );
};