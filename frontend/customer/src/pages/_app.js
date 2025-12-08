import { createContext, useState, useEffect } from 'react';
import '../styles/styles.scss';
import '../components/CustomCakeDesigner/styles/customCakeDesigner.scss';
import { Provider } from 'react-redux'
import { store } from '../app/store'

export const CartContext = createContext();

const MyApp = ({ Component, pageProps }) => {
  const [cart, setCart] = useState([]);
  const [isClient, setIsClient] = useState(false);

  // Marcar cuando estamos en el cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Cargar el carrito desde localStorage cuando el componente se monta
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error al cargar el carrito:', error);
          setCart([]);
        }
      }
    }
  }, []);

  // Guardar el carrito en localStorage cada vez que cambie
  useEffect(() => {
    if (typeof window !== 'undefined' && isClient) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isClient]);

  return (
    <Provider store={store}>
      <CartContext.Provider value={{ cart, setCart }}>
        <Component {...pageProps} />
      </CartContext.Provider>
    </Provider>
  );
};

export default MyApp;
