import Link from "next/link";

export const Banner = () => {
  return (
    <>
      {/* <!-- BEGIN MAIN BLOCK --> */}
      <div className="main-block load-bg">
        <div className="wrapper">
          <div className="main-block__content">
            {/* <span className='saint-text'>Professional</span> */}
            <h1 className="main-text">Pasteleria Mil Sabores</h1>
            <p>
              Estamos emocionados de compartir nuestras delicias contigo. <br />
              <strong>Descubre, saborea y crea momentos inolvidables con nosotros.</strong>
            </p>

            <Link href="/shop">
              <a className="btn">Compra ya!</a>
            </Link>
          </div>
        </div>
        <img
          className="main-block__decor"
          src="/assets/img/main-block-decor.png"
          alt=""
        />
      </div>
      {/* <!-- MAIN BLOCK EOF --> */}
    </>
  );
};
