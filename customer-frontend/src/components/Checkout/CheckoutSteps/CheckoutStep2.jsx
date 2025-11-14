import { useState, useRef } from "react";

export const CheckoutStep2 = ({ onNext, onPrev }) => {
  const [payment, setPayment] = useState("cash");
  const [cardNumber, setCardNumber] = useState("");
  const inputRef = useRef(null);

  // Quitar todo lo que no sea número
  const onlyDigits = (s) => s.replace(/\D/g, "");

  // Formatear en grupos de 4
  const formatCardNumber = (value) => {
    return value
      .replace(/\s+/g, "") // quitar espacios existentes
      .replace(/(\d{4})/g, "$1 ") // agregar espacio cada 4 dígitos
      .trim(); // quitar espacio final
  };

  // Se ejecuta cada vez que se escribe algo
  const handleCardChange = (e) => {
    const input = e.target.value;
    const digits = onlyDigits(input).slice(0, 16); // máximo 16 dígitos
    const formatted = formatCardNumber(digits);
    setCardNumber(formatted);
  };

  // Permitir pegar número formateado correctamente
  const handlePasteCard = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    const digits = onlyDigits(text).slice(0, 16);
    const formatted = formatCardNumber(digits);
    setCardNumber(formatted);
  };
  return (
    <>
      {/* <!-- BEING CHECKOUT STEP TWO -->  */}
      <div className="checkout-payment checkout-form">
        <h4>Elige tu método de pago</h4>
     <div
          className={`checkout-payment__item ${
            payment === "credit-card" && "active"
          }`}
        >
          <div className="checkout-payment__item-head">
            <label
              onClick={() => setPayment("credit-card")}
              className="radio-box"
            >
              Tarjeta de crédito o débito
              <input
                type="radio"
                checked={payment === "credit-card"}
                name="radio"
              />
              <span className="checkmark"></span>
              <span className="radio-box__info">
                <i className="icon-info"></i>
                <span className="radio-box__info-content">
                  Aliqua nulla id aliqua minim ullamco adipisicing enim. Do sint
                  nisi velit qui. Ullamco Lorem aliquip dolor nostrud cupidatat
                  amet.
                </span>
              </span>
            </label>
          </div>
          <div className="checkout-payment__item-content">
            <div className="box-field">
              <span>Número de la tarjeta</span>
              <input
                ref={inputRef}
                type="text"
                className="form-control"
                placeholder="xxxx xxxx xxxx xxxx"
                value={cardNumber}
                onChange={handleCardChange}
                onPaste={handlePasteCard}
              />
            </div>
            <div className="box-field__row">
              <div className="box-field">
                <span>Fecha de vencimiento</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="MM"
                  maxlength="2"
                />
              </div>
              <div className="box-field">
                <input
                  type="text"
                  className="form-control"
                  placeholder="AA"
                  maxlength="2"
                />
              </div>
              <div className="box-field">
                <span>Código de seguridad</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="CVV"
                  maxlength="3"
                />
              </div>
            </div>
          </div>
        </div> 

        <div
          className={`checkout-payment__item ${payment === "cash" && "active"}`}
        >
          <div className="checkout-payment__item-head">
            <label onClick={() => setPayment("cash")} className="radio-box">
              Efectivo
              <input type="radio" checked={payment === "cash"} name="radio" />
              <span className="checkmark"></span>
              <span className="radio-box__info">
                <i className="icon-info"></i>
                <span className="radio-box__info-content">
                  Currently We only Offer Cash on Delivery
                </span>
              </span>
            </label>
          </div>
        </div>
        <div className="checkout-buttons">
          <button onClick={onPrev} className="btn btn-grey btn-icon">
            <i className="icon-arrow"></i> Anterior
          </button>
          <button onClick={onNext} className="btn btn-icon btn-next">
            Siguiente <i className="icon-arrow"></i>
          </button>
        </div>
      </div>
      {/* <!-- CHECKOUT STEP TWO EOF -->  */}
    </>
  );
};
