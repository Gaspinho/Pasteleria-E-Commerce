import { useState, useEffect, useRef, useContext } from "react";
import { useInitTransactionMutation } from "../../../services/customOrderApi";
import { CartContext } from "pages/_app";

export const CheckoutStep2 = ({ onNext, onPrev }) => {
  const [payment, setPayment] = useState("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const inputRef = useRef(null);
  const [initTransaction] = useInitTransactionMutation();
  
  // Obtener el carrito del contexto
  const { cart } = useContext(CartContext);
  
  // Calcular solo el valor de los productos
  const productsAmount = cart.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0
  );
  
  // Costo de entrega fijo
  const deliveryCost = 5000;
  
  // Total con entrega (para ambos métodos de pago)
  const totalWithDelivery = productsAmount + deliveryCost;

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
        
        // Crear datos de la transacción con el monto total (productos + entrega)
        const transactionData = {
          amount: Math.round(totalWithDelivery), // Monto completo con entrega
          session_id: `session_${Date.now()}`,
          buy_order: `order_${Date.now()}`,
        };

        console.log(`💳 Pago con tarjeta - Total: $${totalWithDelivery.toLocaleString('es-CL')} CLP (Productos: $${productsAmount.toLocaleString('es-CL')} + Entrega: $${deliveryCost.toLocaleString('es-CL')})`);

        // Iniciar transacción con Transbank
        const response = await initTransaction(transactionData).unwrap();
        
        // Abrir el HTML de redirección en una nueva ventana
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(response);
          newWindow.document.close();
        }
        
        onNext();
        
      } catch (error) {
        console.error("Error al iniciar transacción:", error);
        
        // Preguntar si quiere continuar de todos modos
        const continuar = confirm(
          "No se pudo conectar con el sistema de pagos Transbank. ¿Desea continuar con el pedido como 'Pendiente de pago'?"
        );
        
        if (continuar) {
          onNext();
        }
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Si es efectivo, continuar normalmente (también incluye entrega)
      console.log(`💵 Pago en efectivo - Total: $${totalWithDelivery.toLocaleString('es-CL')} CLP (Productos: $${productsAmount.toLocaleString('es-CL')} + Entrega: $${deliveryCost.toLocaleString('es-CL')})`);
      onNext();
    }
  };

  return (
    <>
      {/* <!-- BEING CHECKOUT STEP TWO -->  */}
      <div className="checkout-payment checkout-form">
        <div className="payment-header">
          <h4>Selecciona tu método de pago</h4>
          <p className="payment-subtitle">Elige cómo prefieres pagar tu pedido</p>
        </div>
        
        {/* Tarjeta de crédito/débito */}
        <div
          className={`payment-card ${payment === "credit-card" ? "selected" : ""}`}
          onClick={() => setPayment("credit-card")}
        >
          <div className="payment-card-header">
            <div className="payment-icon">💳</div>
            <div className="payment-title">
              <h5>Tarjeta de Crédito o Débito</h5>
              <p>Webpay Plus - Pago seguro con Transbank</p>
            </div>
            <div className="radio-custom">
              <input
                type="radio"
                checked={payment === "credit-card"}
                name="payment-method"
                onChange={() => setPayment("credit-card")}
              />
              <span className="radio-checkmark"></span>
            </div>
          </div>
          
          {payment === "credit-card" && (
            <div className="payment-details">
              <div className="amount-breakdown">
                <div className="breakdown-item">
                  <span>Productos:</span>
                  <span>${productsAmount.toLocaleString('es-CL')} CLP</span>
                </div>
                <div className="breakdown-item">
                  <span>Entrega:</span>
                  <span>${deliveryCost.toLocaleString('es-CL')} CLP</span>
                </div>
                <div className="breakdown-divider"></div>
                <div className="breakdown-item total">
                  <span>Total a pagar:</span>
                  <span className="amount-value">${totalWithDelivery.toLocaleString('es-CL')} CLP</span>
                </div>
              </div>
              <p className="payment-info">
                Serás redirigido al portal seguro de Transbank para completar tu pago.
                Aceptamos todas las tarjetas de crédito y débito.
              </p>
              <div className="webpay-badge">
                <img src="/assets/img/webpay-logo.png" alt="Webpay" />
              </div>
            </div>
          )}
        </div>

        {/* Efectivo */}
        <div
          className={`payment-card ${payment === "cash" ? "selected" : ""}`}
          onClick={() => setPayment("cash")}
        >
          <div className="payment-card-header">
            <div className="payment-icon">💵</div>
            <div className="payment-title">
              <h5>Pago en Efectivo</h5>
              <p>Paga al recibir tu pedido</p>
            </div>
            <div className="radio-custom">
              <input
                type="radio"
                checked={payment === "cash"}
                name="payment-method"
                onChange={() => setPayment("cash")}
              />
              <span className="radio-checkmark"></span>
            </div>
          </div>
          
          {payment === "cash" && (
            <div className="payment-details">
              <div className="amount-breakdown">
                <div className="breakdown-item">
                  <span>Productos:</span>
                  <span>${productsAmount.toLocaleString('es-CL')} CLP</span>
                </div>
                <div className="breakdown-item">
                  <span>Entrega:</span>
                  <span>${deliveryCost.toLocaleString('es-CL')} CLP</span>
                </div>
                <div className="breakdown-divider"></div>
                <div className="breakdown-item total">
                  <span>Total a pagar:</span>
                  <span className="amount-value">${totalWithDelivery.toLocaleString('es-CL')} CLP</span>
                </div>
              </div>
              <p className="payment-info">
                Pagarás en efectivo al momento de recibir tu pedido.
                Por favor, ten el monto exacto preparado.
              </p>
            </div>
          )}
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
            {isProcessing ? "Procesando..." : "Continuar al pago"} <i className="icon-arrow"></i>
          </button>
        </div>
      </div>
      {/* <!-- CHECKOUT STEP TWO EOF -->  */}

      <style jsx>{`
        .checkout-payment {
          max-width: 700px;
          margin: 0 auto;
          padding: 20px;
        }

        .payment-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .payment-header h4 {
          font-size: 28px;
          font-weight: 700;
          color: #333;
          margin-bottom: 8px;
        }

        .payment-subtitle {
          font-size: 16px;
          color: #666;
          margin: 0;
        }

        .payment-card {
          background: white;
          border: 2px solid #e8e8e8;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .payment-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #ff6b6b, #ff8e8e);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .payment-card:hover {
          border-color: #ffb3b3;
          box-shadow: 0 4px 20px rgba(255, 107, 107, 0.15);
          transform: translateY(-2px);
        }

        .payment-card.selected {
          border-color: #ff6b6b;
          background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
          box-shadow: 0 6px 25px rgba(255, 107, 107, 0.2);
        }

        .payment-card.selected::before {
          transform: scaleX(1);
        }

        .payment-card-header {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .payment-icon {
          font-size: 40px;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #fff 0%, #ffe8e8 100%);
          border-radius: 12px;
          flex-shrink: 0;
        }

        .payment-card.selected .payment-icon {
          background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
        }

        .payment-title {
          flex: 1;
        }

        .payment-title h5 {
          font-size: 18px;
          font-weight: 700;
          color: #333;
          margin: 0 0 4px 0;
        }

        .payment-title p {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        .radio-custom {
          position: relative;
          width: 24px;
          height: 24px;
          flex-shrink: 0;
        }

        .radio-custom input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
        }

        .radio-checkmark {
          position: absolute;
          top: 0;
          left: 0;
          height: 24px;
          width: 24px;
          background-color: white;
          border: 2px solid #ddd;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .radio-custom input:checked ~ .radio-checkmark {
          background-color: #ff6b6b;
          border-color: #ff6b6b;
        }

        .radio-checkmark::after {
          content: "";
          position: absolute;
          display: none;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: white;
        }

        .radio-custom input:checked ~ .radio-checkmark::after {
          display: block;
        }

        .payment-details {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 107, 107, 0.2);
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .amount-breakdown {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .breakdown-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          font-size: 15px;
          color: #666;
        }

        .breakdown-item.total {
          font-weight: 600;
          font-size: 16px;
          color: #333;
        }

        .breakdown-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #e8e8e8, transparent);
          margin: 12px 0;
        }

        .amount-value {
          font-size: 24px;
          font-weight: 700;
          color: #ff6b6b;
        }

        .free-badge {
          background: linear-gradient(135deg, #4caf50, #66bb6a);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
        }

        .delivery-free span:first-child {
          text-decoration: line-through;
          color: #999;
        }

        .payment-info {
          font-size: 14px;
          color: #666;
          line-height: 1.6;
          margin: 0 0 16px 0;
        }

        .cash-benefit {
          background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
          border: 1px solid #66bb6a;
          border-radius: 8px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 16px;
        }

        .benefit-icon {
          font-size: 20px;
        }

        .benefit-text {
          color: #2e7d32;
          font-size: 14px;
          font-weight: 600;
        }

        .webpay-badge {
          text-align: center;
          padding: 12px;
          background: white;
          border-radius: 8px;
        }

        .webpay-badge img {
          max-width: 120px;
          height: auto;
        }

        .checkout-buttons {
          display: flex;
          gap: 15px;
          margin-top: 40px;
        }

        .btn {
          padding: 16px 32px !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          transition: all 0.3s ease !important;
          border: none !important;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .btn-next {
          background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%) !important;
          color: white !important;
          flex: 2;
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }

        .btn-next:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4) !important;
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
          .checkout-payment {
            padding: 15px;
          }

          .payment-header h4 {
            font-size: 24px;
          }

          .payment-card {
            padding: 20px;
          }

          .payment-card-header {
            gap: 12px;
          }

          .payment-icon {
            font-size: 32px;
            width: 50px;
            height: 50px;
          }

          .payment-title h5 {
            font-size: 16px;
          }

          .payment-title p {
            font-size: 13px;
          }

          .amount-value {
            font-size: 20px;
          }

          .checkout-buttons {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }

          .btn-next {
            order: 1;
          }

          .btn-grey {
            order: 2;
          }
        }
      `}</style>
    </>
  );
};
