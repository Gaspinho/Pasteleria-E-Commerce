import { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import socialData from "data/social";
import { Reviews } from "../Reviews/Reviews";
import { ReviewFrom } from "../ReviewForm/ReviewFrom";
import { useRouter } from "next/router";
import { CartContext } from "pages/_app";
import { getToken } from '../../../services/LocalStorageService';
import { useDetailedProductQuery } from '../../../services/productApi';

export const ProductDetails = () => {
  const router = useRouter();
  const { access_token } = getToken();
  const { cart, setCart } = useContext(CartContext);
  
  // Obtener producto de la API
  const productId = router.query.id;
  const { data: apiProduct, isLoading, error } = useDetailedProductQuery(productId, {
    skip: !productId // No hacer la query si no hay ID
  });

  const socialLinks = [...socialData];
  const [product, setProduct] = useState(null);
  const [addedInCart, setAddedInCart] = useState(false);

  useEffect(() => {
    if (apiProduct) {
      // Adaptar producto de la API al formato esperado
      const adapted = {
        id: apiProduct.product_id?.toString(),
        name: apiProduct.product_name,
        price: apiProduct.product_price,
        oldPrice: apiProduct.product_price * 1.1,
        category: apiProduct.category_name,
        isSale: apiProduct.product_is_sale === "Yes",
        isNew: false,
        isStocked: apiProduct.product_stock > 0,
        productNumber: apiProduct.product_sku || apiProduct.product_id?.toString(),
        imageGallery: [
          apiProduct.image1,
          apiProduct.image2,
          apiProduct.image3,
          apiProduct.image4
        ].filter(Boolean),
        content: apiProduct.product_description,
        description: apiProduct.product_description,
        reviews: [], // Se cargarán por separado
        review_count: apiProduct.review_count || 0,
        avg_rating: apiProduct.avg_rating || 0,
        colors: ["#FCEDEA", "#FEE1DB", "#FFD9D1", "#FDC5B9"],
        stock: apiProduct.product_stock
      };
      setProduct(adapted);
    }
  }, [apiProduct]);

  useEffect(() => {
    if (product) {
      setAddedInCart(Boolean(cart?.find((pd) => pd.id === product.id)));
    }
  }, [product, cart]);

  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState(2);
  const [activeColor, setActiveColor] = useState(2);
  const [nav1, setNav1] = useState();
  const [nav2, setNav2] = useState();

  const handleAddToCart = () => {
    const newProduct = { ...product, quantity: quantity };
    setCart([...cart, newProduct]);
  };

  // Estados de carga y error
  if (isLoading) {
    return (
      <div className="product">
        <div className="wrapper">
          <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <h2>Cargando producto...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product">
        <div className="wrapper">
          <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <h2>Error al cargar el producto</h2>
            <p style={{ color: 'red', marginTop: '20px' }}>
              {error.message || 'No se pudo cargar el producto'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <></>;
  return (
    <>
      {/* <!-- BEGIN PRODUCT --> */}
      <div className="product">
        <div className="wrapper">
          <div className="product-content">
            {/* <!-- Product Main Slider --> */}
            <div className="product-slider">
              <div className="product-slider__main">
                <Slider
                  fade={true}
                  asNavFor={nav2}
                  arrows={false}
                  lazyLoad={true}
                  ref={(slider1) => setNav1(slider1)}
                >
                  {product.imageGallery.map((img, index) => (
                    <div key={index} className="product-slider__main-item">
                      <div className="products-item__type">
                        {/* {product.isSale && (
                          <span className='products-item__sale'>sale</span>
                        )}
                        {product.isNew && (
                          <span className='products-item__new'>new</span>
                        )} */}
                      </div>
                      <img src={img} alt="product" />
                    </div>
                  ))}
                </Slider>
              </div>

              {/* <!-- Product Slide Nav --> */}
              <div className="product-slider__nav">
                <Slider
                  arrows={false}
                  asNavFor={nav1}
                  ref={(slider2) => setNav2(slider2)}
                  slidesToShow={4}
                  swipeToSlide={true}
                  focusOnSelect={true}
                >
                  {product.imageGallery.map((img, index) => (
                    <div key={index} className="product-slider__nav-item">
                      <img src={img} alt="product" />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              {product.isStocked ? (
                <span className="product-stock">En stock</span>
              ) : (
                <span className="product-stock">Agotado</span>
              )}

              <span className="product-num">ID del Producto: {product.productNumber}</span>
              <span className="product-price" style={{ color: '#27ae60', fontSize: '1.5rem', fontWeight: '600' }}>
                ${product.price?.toLocaleString('es-CL')}
              </span>
              <p>{product.content}</p>

              {/* <!-- Social Share Link --> */}
              <div className="contacts-info__social">
                <span> Sigue nuestras redes:</span>
                <ul>
                  {socialLinks.map((social, index) => (
                    <li key={index}>
                      <a href={social.path}>
                        <i className={social.icon ? social.icon : ""}></i>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* {/* <!-- Product Color info--> */}
              <div className="product-options">
                {/* <div className="product-info__color">
                  <span>Color:</span>
                  <ul>
                    {product?.colors.map((color, index) => (
                      <li
                        onClick={() => setActiveColor(index)}
                        className={activeColor === index ? "active" : ""}
                        key={index}
                        style={{ backgroundColor: color }}
                      ></li>
                    ))}
                  </ul>
                </div> */}

                {/* <!-- Order Item counter --> */}
                <div className="product-info__quantity">
                  <span className="product-info__quantity-title">
                    Cantidad:
                  </span>
                  <div className="counter-box">
                    <span
                      onClick={() => {
                        if (quantity > 1) {
                          setQuantity(quantity - 1);
                        }
                      }}
                      className="counter-link counter-link__prev"
                    >
                      <i className="icon-arrow"></i>
                    </span>
                    <input
                      type="text"
                      className="counter-input"
                      disabled
                      value={quantity}
                    />
                    <span
                      onClick={() => setQuantity(quantity + 1)}
                      className="counter-link counter-link__next"
                    >
                      <i className="icon-arrow"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div className="product-buttons">
                <button
                  disabled={addedInCart}
                  onClick={ access_token ? () => handleAddToCart(): () => console.log('login please')}
                  className="btn btn-icon"
                >
                  <i className="icon-cart"></i> {addedInCart ? 'En el carrito' : 'Agregar al carrito'}
                </button>
                {/* <button className="btn btn-grey btn-icon">
                  <i className="icon-heart"></i> Favorito
                </button> */}
              </div>
            </div>
          </div>

          {/* <!-- Product Details Tab --> */}
          <div className="product-detail">
            <div className="tab-wrap product-detail-tabs">
              <ul className="nav-tab-list tabs pd-tab">
                <li
                  className={tab === 1 ? "active" : ""}
                  onClick={() => setTab(1)}
                >
                  Descripción
                </li>
                <li
                  className={tab === 2 ? "active" : ""}
                  onClick={() => setTab(2)}
                >
                  Reseñas
                </li>
              </ul>
              <div className="box-tab-cont">
                {/* <!-- Product description --> */}
                {tab === 1 && (
                  <div className="tab-cont">
                    <p>{product.description}</p>
                    
                  </div>
                )}

                {tab === 2 && (
                  <div className="tab-cont product-reviews">
                    {/* <!-- Product Reviews --> */}
                    <Reviews reviews={product.reviews} />

                    {/* <!-- Product Review Form --> */}
                    <ReviewFrom data ={product.id}/>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <img
          className="promo-video__decor js-img"
          src="/assets/img/promo-video__decor.jpg"
          alt=""
        />
      </div>
      {/* <!-- PRODUCT EOF   --> */}
    </>
  );
};
