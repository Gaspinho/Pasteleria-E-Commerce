import { PromoVideo } from "components/shared/PromoVideo/PromoVideo";
import { useState } from "react";
import Link from "next/link";

export const Info = () => {
  const [play, setPlay] = useState(false);
  const url = play
    ? "https://www.youtube.com/embed/K1yp7Q1hH1c?autoplay=1"
    : "";
  return (
    <>
      {/* <!-- BEGIN INFO BLOCKS --> */}
      <div className="info-blocks">
        <div
          className="info-blocks__item js-img"
          style={{ backgroundImage: `url('/assets/img/info-item-bg1.jpg')` }}
        >
          <div className="wrapper">
            <div className="info-blocks__item-img">
              <img
                src="/assets/img/info-item-img1.jpg"
                className="js-img"
                alt=""
              />
            </div>
            <div className="info-blocks__item-text">
              <span className="saint-text">Diseña con nosotros</span>
              <h2>Personaliza tu pastel</h2>
                <p>
                Cada ingrediente —desde la base hasta la última decoración— es cuidadosamente seleccionado para reflejar nuestra tradición y las tendencias más dulces de hoy.  
                En <strong>Pastelería 1000 Sabores</strong> puedes combinar nuestros diseños clásicos con las últimas inspiraciones en repostería para crear algo verdaderamente único.
                </p>
                <p>
                Paso a paso, diseña el pastel perfecto para tu celebración.  
                Ofrecemos diversas opciones, todas elaboradas con la misma pasión y calidad que nos han acompañado por más de 50 años.
                </p>
              <Link href="/customisecake">
                <a className="btn">Compra ya!</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- INFO BLOCKS EOF   --> */}
    </>
  );
};
