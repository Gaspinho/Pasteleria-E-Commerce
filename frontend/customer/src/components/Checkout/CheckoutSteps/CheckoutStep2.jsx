import { useState } from "react";

export const CheckoutStep2 = ({ onNext, onPrev }) => {
  const [payment, setPayment] = useState("cash");
  return (
    <>
      {/* <!-- BEING CHECKOUT STEP TWO -->  */}
      <div className="checkout-payment checkout-form">
);        <h4>Métodos de Pago</h4>
     {/* <div
          className={`checkout-payment__item ${
            payment === "credit-card" && "active"
          }`}
        >
          <div className="checkout-payment__item-head">
            <label
              onChange={() => setPayment("credit-card")}
              className="radio-box"
            >
              Credit card
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
              <span>Card number</span>
              <input
                type="text"
                className="form-control"
                placeholder="xxxx xxxx xxxx xxxx"
                maxlength="16"
              />
            </div>
            <div className="box-field__row">
              <div className="box-field">
                <span>Expiration date</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="mm"
                  maxlength="2"
                />
              </div>
              <div className="box-field">
                <input
                  type="text"
                  className="form-control"
                  placeholder="yy"
                  maxlength="2"
                />
              </div>
              <div className="box-field">
                <span>Security code</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="CVV"
                  maxlength="3"
                />
              </div>
            </div>
          </div>
        </div> */}

        <div
          className={`checkout-payment__item ${payment === "cash" && "active"}`}
        >
          <div className="checkout-payment__item-head">
            <label onClick={() => setPayment("cash")} className="radio-box">
              Pago en Efectivo
              <input type="radio" checked={payment === "cash"} name="radio" />
              <span className="checkmark"></span>
              <span className="radio-box__info">
                <i className="icon-info"></i>
                <span className="radio-box__info-content">
                  Actualmente solo ofrecemos Pago Contra Entrega
                </span>
              </span>
            </label>
          </div>
        </div>
        <div className="checkout-buttons">
          <button onClick={onPrev} className="btn btn-grey btn-icon">
            <i className="icon-arrow"></i> Atrás
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
