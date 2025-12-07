import { SocialLogin } from "components/shared/SocialLogin/SocialLogin";
import router from "next/router";
import { useState } from 'react';
import { useRegisterUserMutation } from '../../services/userAuthApi'
import { storeToken } from '../../services/LocalStorageService';

export const Registration = () => {
 
  const [server_error, setServerError] = useState({})
  const [registerUser, { isLoading }] = useRegisterUserMutation()
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const actualData = {
      first_name: data.get('first_name'),
      last_name: data.get('last_name'),
      email: data.get('email'),
      password: data.get('password'),
      phone_number: '03000000000',
      type: "CUSTOMER",
    }
    const res = await registerUser(actualData)
    if (res.error) {
      console.log('Error completo:', res.error)
      // Manejar diferentes estructuras de error
      if (res.error.data?.errors) {
        setServerError(res.error.data.errors)
      } else if (res.error.data?.detail) {
        // Error simple de FastAPI
        setServerError({ general: res.error.data.detail })
      } else {
        setServerError({ general: 'Error durante el registro' })
      }
    }
    if (res.data) {
      console.log(typeof (res.data))
      console.log(res.data)
      storeToken(res.data.token)
      router.push("/")
    }
  }
  return (
    <>
      {/* <!-- BEGIN REGISTRATION --> */}
      <div className="login registration">
        <div className="wrapper">
          <div
            className="login-form js-img"
            style={{
              backgroundImage: `url('/assets/img/registration-form__bg.png')`,
            }}
          >
            <form onSubmit={handleSubmit}>
              <h3>Regístrate Ahora</h3>
              {server_error.general && (
                <div style={{ 
                  backgroundColor: '#fee', 
                  padding: '10px', 
                  borderRadius: '5px',
                  marginBottom: '15px',
                  border: '1px solid #fcc'
                }}>
                  <p style={{ fontSize: 14, color: "red", margin: 0 }}>
                    {server_error.general}
                  </p>
                </div>
              )}
                <div
                  className="box-field "
                  style={{ width: "100% !important" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ingresa tu nombre"
                    name="first_name"
                  />
                  {server_error?.first_name && Array.isArray(server_error.first_name) ? (
                    <p style={{ fontSize: 16, color: "red", paddingLeft: 10 }}>
                      {server_error.first_name[0]}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <div className="box-field" style={{ width: "100% !important" }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ingresa tu apellido"
                    name="last_name"
                  />
                </div>
                {server_error?.last_name && Array.isArray(server_error.last_name) ? (
                  <p style={{ fontSize: 16, color: "red", paddingLeft: 10 }}>
                    {server_error.last_name[0]}
                  </p>
                ) : (
                  ""
                )}
              <div className="box-field" style={{ width: "100% !important" }}>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Ingresa tu correo electrónico"
                  name="email"
                />
              </div>
              {server_error?.email && Array.isArray(server_error.email) ? (
                <p style={{ fontSize: 16, color: "red", paddingLeft: 10 }}>
                  {server_error.email[0]}
                </p>
              ) : (
                ""
              )}
              <div className="box-field " style={{ width: "100% !important" }}>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Ingresa tu contraseña"
                  name="password"
                />
              </div>
              {server_error?.password && Array.isArray(server_error.password) ? (
                <p style={{ fontSize: 16, color: "red", paddingLeft: 10 }}>
                  {server_error.password[0]}
                </p>
              ) : (
                ""
              )}
              <button className="btn" type="submit">
                Registrarse
              </button>
              <div className="login-form__bottom">
                <span>
                  ¿Ya tienes una cuenta?{" "}
                  <a onClick={() => router.push("/login")}>Iniciar sesión</a>
                </span>
              </div>
            </form>
          </div>
        </div>
        <img
          className="promo-video__decor js-img"
          src="/assets/img/promo-video__decor.jpg"
          alt=""
        />
      </div>
      {/* <!-- REGISTRATION EOF   -->  */}
    </>
  );
};
