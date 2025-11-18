// --- CAMBIO ---
// Volvemos a usar el query original 'useGetUserCustomOrderQuery'
import { useGetUserCustomOrderQuery } from '../../services/customOrderApi'

export const CustomOrderCheckoutOrders = (props) => {
  
  console.log("card id" ,props.CustomOrder_Id)

  // --- CAMBIO ---
  // Usamos 'useGetUserCustomOrderQuery' con el ID del pastel (CustomOrder_Id)
  let { data: customOrder, isLoading, isError, error } = useGetUserCustomOrderQuery(props.CustomOrder_Id)

  if (isLoading) return <div>Cargando....</div>;
  if (isError) return <h1>Ocurrió un error {error?.message || 'Por favor intente nuevamente'}</h1>;
  
  const deliveryCost = 5000; // Como definimos
  
  // --- CAMBIO ---
  // El 'amount' (subtotal) está en el nivel superior de la respuesta
  const subtotal = customOrder?.amount || 0;
  const total = subtotal;

  return (
    <>
      <div className="checkout-order">
        <h5>Tu Pedido de Pastel Personalizado</h5>
        <div className='checkout-order__item'>
          
          <div className='checkout-order__item-info'>
            
            {/* --- CAMBIO ---
                Accedemos a los datos directamente desde 'customOrder', 
                sin el '.CustomCake' que usamos erróneamente antes.
                La estructura de la API es: customOrder.sponge_Flavor.flavor_name
            */}
            <div className='title6'>
              Sabor del Pastel: <span>{customOrder.sponge_Flavor?.flavor_name || 'No especificado'}</span>
            </div>
            <div className='title6'>
              Forma del Pastel: <span>{customOrder.Cake_Shape_layers?.cake_shape || 'No especificado'}</span>
            </div>
            <div className='title6'>
              Capas del Pastel: <span>{customOrder.Cake_Shape_layers?.layer_description || 'No especificado'}</span>
            </div>
            <div className='title6'>
              Cobertura: <span>{customOrder.Icing?.decoration_name || 'No especificado'}</span>
            </div>
            {customOrder.msg_on_cake && (
              <div className='title6'>
                Mensaje en el Pastel: <span>{customOrder.msg_on_cake}</span>
              </div>
            )}
            <div className='title6'>
              Imagen Superior: <span>{customOrder.Top_Img_Decoration?.name || 'Ninguna'}</span>
            </div>
            {customOrder.special_instruction && (
              <div className='title6'>
                Instrucción Especial: <span>{customOrder.special_instruction}</span>
              </div>
            )}
          </div>
        
        </div>
        <div className="cart-bottom__total-delivery">
          Entrega{" "}
          <span>${deliveryCost.toLocaleString('es-CL')}</span>
        </div>
        <div className="cart-bottom__total-num">
          total:
          <span>${total.toLocaleString('es-CL')}</span>
        </div>
      </div>
    </>
  );
};