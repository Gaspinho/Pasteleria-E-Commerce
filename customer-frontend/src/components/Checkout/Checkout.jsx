import { useState  ,useRef } from "react";
import { CheckoutOrders } from "./CheckoutOrder/CheckoutOrders";
import { CheckoutStep1 } from "./CheckoutSteps/CheckoutStep1";
import { CheckoutStep2 } from "./CheckoutSteps/CheckoutStep2";
import { CheckoutStep3 } from "./CheckoutSteps/CheckoutStep3";
import {useReactToPrint} from 'react-to-print';
import dynamic from "next/dynamic";

const html2pdf = dynamic(() => import("html2pdf.js"), { ssr: false });

const detailBlocks = [
  {
    step: "Step 1",
    title: "Order Details",
    icon: "icon-step1",
  },
  {
    step: "Step 2",
    title: "Payment method",
    icon: "icon-step2",
  },
  {
    step: "Step 3",
    title: "Finish!",
    icon: "icon-step3",
  },
];

export const Checkout = () => {
  const [activeStep, setActiveStep] = useState(1);
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Order_Invoice",
  });
  const handleDownload = async () => {
  if (typeof window === "undefined") return; // protección SSR

  const element = componentRef.current;
  const html2pdfLib = (await import("html2pdf.js")).default;

  // 🔹 Estilos temporales para asegurar que el contenido quede centrado y en una sola hoja
  const originalStyle = element.getAttribute("style");
  element.style.width = "700px";
  element.style.margin = "0 auto";
  element.style.padding = "40px 50px";
  element.style.background = "white";
  element.style.color = "black";
  element.style.fontFamily = "Poppins, Arial, sans-serif";
  element.style.lineHeight = "1.6";
  element.style.fontSize = "13px";
  element.style.overflow = "hidden";
  element.style.boxSizing = "border-box";

  // 🔹 Configuración optimizada del PDF
  const options = {
    margin: 0,
    filename: "Boleta_Bake&Take.pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      scrollY: 0,
      windowWidth: element.scrollWidth,
      letterRendering: true,
    },
    jsPDF: {
      unit: "pt",
      format: "a4",
      orientation: "portrait",
    },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  };

  await html2pdfLib().set(options).from(element).save();

  // 🔹 Restaurar los estilos originales
  if (originalStyle) element.setAttribute("style", originalStyle);
  else element.removeAttribute("style");
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
        <div className="detail-block__items">
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
          {activeStep === 3 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              <button onClick={handlePrint} className="btn btn-icon">
                🖨️ Imprimir boleta
              </button>
              <button onClick={handleDownload} className="btn btn-icon">
                💾 Descargar boleta
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
    </>
  );
};