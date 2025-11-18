export const Subscribe = () => {
  return (
    <>
      {/* <!-- BEGIN SUBSCRIBE --> */}
      <div className='subscribe'>
        <div className='wrapper'>
          <div className='subscribe-form'>
            <div className='subscribe-form__img'>
              <img
                src='/assets/img/subscribe-img.png'
                className='js-img'
                alt=''
              />
            </div>
            <form>
              <h3>Mantente en contacto</h3>
              <p>Recibe nuestras últimas ofertas y novedades.</p>
              <div className='box-field__row'>
                <div className='box-field'>
                  <input
                    type='email'
                    className='form-control'
                    placeholder='Ingresa tu correo electrónico'
                  />
                </div>
                <button type='submit' className='btn'>
                  Suscribirse
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* <!-- SUBSCRIBE EOF   --> */}
    </>
  );
};
