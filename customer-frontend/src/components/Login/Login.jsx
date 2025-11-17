import { SocialLogin } from "components/shared/SocialLogin/SocialLogin";
import router from "next/router";
import {  useState } from 'react';
import { setUserToken } from '../../features/authSlice';
import { storeToken } from '../../services/LocalStorageService';
import { useLoginUserMutation } from '../../services/userAuthApi';
import { useDispatch } from 'react-redux';

export const Login = () => {
  const [server_error, setServerError] = useState({})
  const [loginUser] = useLoginUserMutation()
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {

    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      email: data.get('email'),
      password: data.get('password'),
    }
    const res = await loginUser(actualData)
    if (res.error) {
      // Manejar diferentes estructuras de error de FastAPI
      if (res.error.data && res.error.data.detail) {
        setServerError({ non_field_errors: [res.error.data.detail] })
      } else if (res.error.data && res.error.data.errors) {
        setServerError(res.error.data.errors)
      } else {
        setServerError({ non_field_errors: ['An error occurred. Please try again.'] })
      }
    }
    if (res.data) {
      // FastAPI/Supabase devuelve { access_token, refresh_token, user_id }
      storeToken({
        access: res.data.access_token,
        refresh: res.data.refresh_token
      })
      dispatch(setUserToken({ access_token: res.data.access_token }))
      router.push("/")
    }
  }
  return (
    <>
      {/* <!-- BEGIN LOGIN --> */}
      <div className="login">
        <div className="wrapper">
          <div
            className="login-form js-img"
            style={{ backgroundImage: `url('/assets/img/login-form__bg.png')` }}
          >
            <form onSubmit={handleSubmit} >
            <div className="box-field">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your Email "
                  name='email'
                />
              </div>
              {server_error?.email ? <p style={{ fontSize: 16, color: 'red', paddingLeft: 10 }}>{server_error.email[0]}</p> : ""}
              <div className="box-field">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  name='password'
                />
              </div>
              {server_error?.password ? <p style={{ fontSize: 16, color: 'red', paddingLeft: 10 }}>{server_error.password[0]}</p> : ""}

              <button className="btn" type="submit">
                login
              </button>
              <div className="login-form__bottom">
                <span>
                  No account?{" "}
                  <a onClick={() => router.push("/registration")}>
                    Register now
                  </a>
                </span>
                {/* //<a href="#">Lost your password?</a> */}
              </div>
              {server_error?.non_field_errors ? <label style={{ fontSize: 16, color: 'red', paddingTop: 20 }} severity='error'>{server_error.non_field_errors[0]}</label> : ''}
            </form>
          </div>
          
        </div>
        <img
          className="promo-video__decor js-img"
          src="/assets/img/promo-video__decor.jpg"
          alt=""
        />
      </div>
      {/* <!-- LOGIN EOF   --> */}
    </>
  );
};
