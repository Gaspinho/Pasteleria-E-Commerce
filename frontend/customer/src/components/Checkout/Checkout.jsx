import { useState, useRef, useEffect } from "react";
import { CheckoutOrders } from "./CheckoutOrder/CheckoutOrders";
import { CheckoutStep1 } from "./CheckoutSteps/CheckoutStep1";
import { CheckoutStep2 } from "./CheckoutSteps/CheckoutStep2";
import { CheckoutStep3 } from "./CheckoutSteps/CheckoutStep3";

const detailBlocks = [
  {
    step: "Paso 1",
    title: "Detalles del Pedido",
    icon: "icon-step1",
  },
  {
    step: "Paso 2",
    title: "Método de pago",
    icon: "icon-step2",
  },
  {
    step: "Paso 3",
    title: "¡Finalizar!",
    icon: "icon-step3",
  },
];

export const Checkout = () => {
  const [activeStep, setActiveStep] = useState(1);
  const componentRef = useRef();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };
  const handlePrev = () => {
    setActiveStep(activeStep - 1);
  };
  return (
    <>
      <div className="wrapper">
        {/* <!-- BEGIN DETAIL MAIN BLOCK --> */}
        <div className="detail-block__items" style={{marginTop:"35px"}}>
          {detailBlocks.map((block, index) => (
            <div
              key={index}
              className={`detail-block__item ${
                activeStep <= index && "detail-block__item-inactive"
              }`}
            >
              <div className="detail-block__item-icon">
                <img
                  src={
                    activeStep <= index
                      ? "/assets/img/main-text-decor2.svg"
                      : "/assets/img/main-text-decor.svg"
                  }
                  className="js-img"
                  alt=""
                />
                <i className={block.icon}></i>
              </div>
              <div
                className="detail-block__item-info"
                style={{ color: "#000" }}
              >
                <h6>{block.step}</h6>
                {block.title}
              </div>
            </div>
          ))}
        </div>
        {/* <!-- DETAIL MAIN BLOCK EOF --> */}
      </div>

      {/* <!-- BEGIN CHECKOUT --> */}
      <div className={`checkout ${activeStep == 2 && "checkout-step2"}`}>
        <div className="wrapper">
          <div className="checkout-content" ref={componentRef}>
            {(() => {
              switch (activeStep) {
                case 1:
                  return <CheckoutStep1 onNext={handleNext} />;
                case 2:
                  return (
                    <CheckoutStep2 onNext={handleNext} onPrev={handlePrev} />
                  );
                case 3:
                  return <CheckoutStep3 />;

                default:
                  return null;
              }
            })()}
            <div className="checkout-info">
              <CheckoutOrders />
            </div>
          </div>
          {isClient && activeStep === 3 && (
            <div className="checkout-print-button">
              <button onClick={handlePrint} className="btn btn-icon btn-print">
                <i className="icon-printer"></i> Imprimir Detalles del Pedido 
              </button>
            </div>
          )}
        </div>
        <img
          className="promo-video__decor js-img"
          src="/assets/img/promo-video__decor.jpg"
          alt=""
        />
      </div>
      {/* <!-- CHECKOUT EOF   --> */}

      <style jsx>{`
        .checkout-print-button {
          display: flex;
          justify-content: center;
          margin-top: 30px;
          margin-bottom: 40px;
        }

        .btn-print {
          padding: 14px 30px !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          transition: all 0.3s ease !important;
          border: none !important;
          background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%) !important;
          color: white !important;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-print:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4) !important;
        }

        .btn-print i {
          font-size: 18px;
        }

        @media (max-width: 768px) {
          .btn-print {
            width: 100%;
            justify-content: center;
          }
        }

        @media print {
          .checkout-print-button,
          .header,
          .detail-block__items,
          img.promo-video__decor {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};
