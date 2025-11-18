import socialData from "data/social";

export const ContactInfo = () => {
  const footerSocial = [...socialData];
  return (
    <>
      {/* <!-- BEGIN CONTACTS INFO --> */}
      <div className="contacts-info">
        <div className="wrapper">
          <div className="contacts-info__content">
            <div className="contacts-info__text">
              <h4>Nos preocupamos por ti</h4>
              <p>
                Si tienes cualquier duda, escríbenos por correo y nos pondremos en contacto contigo para encontrar una solución.
                 Además, nuestro equipo te ayudará a elegir el producto que más te acomode, al mejor precio. 
                 Año a año, la red de Pasteleria Mil Sabores crece y mejora, considerando las necesidades de nuestros clientes.
                 Pero para nosotros, lo más importante es que cuando vengas a la tienda Bake and Take, no tengas dudas sobre la comodidad de la compra, 
                 la calidad de los productos ni el profesionalismo de nuestros vendedores.
              </p>
            </div>
            <div className="contacts-info__social">
              <span>Encuentranos aqui:</span>
              <ul>
                {footerSocial.map((social, index) => (
                  <li key={index}>
                    <a href={social.path}>
                      <i className={social.icon}></i>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- CONTACTS INFO EOF   -->  */}
    </>
  );
};
