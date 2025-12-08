import { useState, useEffect, useRef } from "react";
import { useInitTransactionMutation } from "../../../services/customOrderApi";
import { useSelector } from "react-redux";

export const CheckoutStep2 = ({ onNext, onPrev }) => {
  const [payment, setPayment] = useState("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const inputRef = useRef(null);
  const [initTransaction] = useInitTransactionMutation();
  
  // Obtener el total del carrito
  const cartItems = useSelector((state) => state.cart?.items || []);
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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

  const handlePaymentMethod = async () => {
    if (payment === "credit-card") {
      try {
        setIsProcessing(true);
        
        // Crear datos de la transacción
        const transactionData = {
          amount: Math.round(totalAmount), // Monto en pesos chilenos
          session_id: `session_${Date.now()}`, // ID único de sesión
          buy_order: `order_${Date.now()}`, // Número de orden único
        };

        // Iniciar transacción con Transbank
        const response = await initTransaction(transactionData).unwrap();
        
        // Abrir el HTML de redirección en una nueva ventana o en la misma
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(response);
          newWindow.document.close();
        }
        
      } catch (error) {
        console.error("Error al iniciar transacción:", error);
        alert("Error al procesar el pago. Por favor intente nuevamente.");
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Si es efectivo, continuar normalmente
      onNext();
    }
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
              Tarjeta de crédito o débito (Webpay Plus)
              <input
                type="radio"
                checked={payment === "credit-card"}
                name="radio"
                onChange={() => setPayment("credit-card")}
              />
              <span className="checkmark"></span>
              <span className="radio-box__info">
                <i className="icon-info"></i>
                <span className="radio-box__info-content">
                  Serás redirigido al portal seguro de Transbank Webpay para completar tu pago.
                  Todas las tarjetas de crédito y débito son aceptadas.
                </span>
              </span>
            </label>
          </div>
          <div className="checkout-payment__item-content">
            <div className="payment-info">
              <p>
                <strong>Monto total:</strong> ${totalAmount.toLocaleString('es-CL')} CLP
              </p>
              <p>
                Al hacer clic en "Siguiente", serás redirigido a Webpay Plus 
                para ingresar tus datos de pago de forma segura.
              </p>
              <div className="webpay-logos">
                <img src="/assets/img/webpay-logo.png" alt="Webpay" style={{maxWidth: '120px', margin: '10px 0'}} />
              </div>
            </div>
          </div>
        </div> 

        <div
          className={`checkout-payment__item ${payment === "cash" && "active"}`}
        >
          <div className="checkout-payment__item-head">
            <label onClick={() => setPayment("cash")} className="radio-box">
              Efectivo (Pago contra entrega)
              <input 
                type="radio" 
                checked={payment === "cash"} 
                name="radio"
                onChange={() => setPayment("cash")}
              />
              <span className="checkmark"></span>
              <span className="radio-box__info">
                <i className="icon-info"></i>
                <span className="radio-box__info-content">
                  Pagarás en efectivo al momento de recibir tu pedido.
                </span>
              </span>
            </label>
          </div>
        </div>
        
        <div className="checkout-buttons">
          <button 
            onClick={onPrev} 
            className="btn btn-grey btn-icon"
            disabled={isProcessing}
          >
            <i className="icon-arrow"></i> Anterior
          </button>
          <button 
            onClick={handlePaymentMethod} 
            className="btn btn-icon btn-next"
            disabled={isProcessing}
          >
            {isProcessing ? "Procesando..." : "Siguiente"} <i className="icon-arrow"></i>
          </button>
        </div>
      </div>
      {/* <!-- CHECKOUT STEP TWO EOF -->  */}

      <style jsx>{`
        .checkout-buttons {
          display: flex;
          gap: 15px;
          margin-top: 30px;
        }

        .btn {
          padding: 14px 30px !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          transition: all 0.3s ease !important;
          border: none !important;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-next {
          background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%) !important;
          color: white !important;
          flex: 1;
        }

        .btn-next:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4) !important;
        }

        .btn-grey {
          background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%) !important;
          color: #666 !important;
          flex: 1;
        }

        .btn-grey:hover:not(:disabled) {
          background: linear-gradient(135deg, #e8e8e8 0%, #d8d8d8 100%) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn .icon-arrow {
          font-size: 14px;
          transition: transform 0.3s ease;
        }

        .btn-next:hover:not(:disabled) .icon-arrow {
          transform: translateX(3px);
        }

        .btn-grey:hover:not(:disabled) .icon-arrow {
          transform: translateX(-3px);
        }

        @media (max-width: 768px) {
          .checkout-buttons {
            flex-direction: column;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};
