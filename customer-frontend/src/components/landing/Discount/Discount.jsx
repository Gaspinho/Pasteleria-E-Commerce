import Link from "next/link";

export const Discount = () => {
  return (
    <>
      {/* <!-- BEGIN DISCOUNT --> */}
      <div
        className="discount js-img"
        style={{
          backgroundImage: `url('/assets/img/discount-bg.jpg')`,
          height: "600px",
        }}
      >
        <div className="wrapper">
          <div className="discount-info">
            <span className="main-text">¿Quienes somos?</span>
            <p style={{ fontSize: "17px", color: "#000" }}>
            En Pastelería 1000 Sabores no solo hacemos pasteles: creamos recuerdos dulces que perduran en el tiempo.
            Desde hace más de 50 años endulzamos la vida de los chilenos, combinando tradición, innovación y una pasión inagotable por la repostería.

            Cada torta, cada postre y cada detalle están hechos con los mejores ingredientes, pero sobre todo, con cariño, dedicación y un profundo respeto por nuestras raíces.
            En 1000 Sabores, creemos que detrás de cada bocado hay una historia, y la tuya merece ser celebrada con el sabor perfecto.
            </p>
          </div>
        </div>
      </div>
      {/* <!-- DISCOUNT EOF   --> */}
    </>
  );
};
