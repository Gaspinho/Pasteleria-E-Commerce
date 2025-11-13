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
      <div className="info-blocks" style={{ marginTop: "60px" }}>
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
              <span className="saint-text">¿Quienes somos?</span>
              <h2>Pastelería 1000 Sabores</h2>
              <p>
              En Pastelería 1000 Sabores no solo hacemos pasteles: creamos recuerdos dulces que perduran en el tiempo.
              Desde hace más de 50 años endulzamos la vida de los chilenos, combinando tradición, innovación y una pasión inagotable por la repostería.

              Cada torta, cada postre y cada detalle están hechos con los mejores ingredientes, pero sobre todo, con cariño, dedicación y un profundo respeto por nuestras raíces.
              En 1000 Sabores, creemos que detrás de cada bocado hay una historia, y la tuya merece ser celebrada con el sabor perfecto.
              </p>
              <p>
              Revisa nuestro catálogo y descubre la variedad de sabores y diseños que ofrecemos.
              </p>
              <Link href="/shop">
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
