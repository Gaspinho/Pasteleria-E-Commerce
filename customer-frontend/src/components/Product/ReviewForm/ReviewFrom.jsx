import { useState } from 'react';
import { Rating } from 'react-simple-star-rating';
import { getToken } from '../../../services/LocalStorageService';
import {usePostReviewMutation} from '../../../services/feedbackApi'


export const ReviewFrom = (props) => {
  const [rating, setRating] = useState(0);
  const [postReview] = usePostReviewMutation(); 
  const [success , setSuccess] = useState(false)
  const [server_error, setServerError] = useState({})
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      product_id: Number(props.data), // Backend espera product_id como número
      author_email: data.get('email'),
      author_name: data.get('userName'),
      content: data.get('content'),
      rating: Math.round(rating / 20), // Convertir de 0-100 a 1-5
    }
    console.log("data " , actualData)
    const res = await postReview(actualData)

    if (res.error) {
      console.log(typeof (res.error.data))
      console.log(res.error.data)
      // Manejar errores del backend FastAPI
      if (res.error.data?.detail) {
        if (typeof res.error.data.detail === 'string') {
          setServerError({ general: res.error.data.detail })
        } else if (Array.isArray(res.error.data.detail)) {
          // Errores de validación de Pydantic
          const errors = {}
          res.error.data.detail.forEach(err => {
            const field = err.loc[err.loc.length - 1]
            errors[field] = err.msg
          })
          setServerError(errors)
        }
      }
    }
    if (res.data) {
      console.log(typeof (res.data))
      console.log(res.data)
      setSuccess(true)
      // Resetear el formulario después de 2 segundos
      setTimeout(() => {
        setSuccess(false)
        setRating(0)
        e.target.reset()
      }, 3000)
    }
  }
  // Catch Rating value
  const handleRating = (rate) => {
    setRating(rate);
    console.log(rating)
  };
  return (
    <>
      {/* <!-- Product Review Form --> */}
      <div className='product-detail__form post-comment__form'>
        <div className='subscribe-form__img'>
          <img src='/assets/img/subscribe-img.png' />
        </div>
        <form  onSubmit={handleSubmit}>
          <h4> Escribe una reseña</h4>
          <p>Muchas gracias!</p>
          <div className='rating' data-id='rating_1'>
            <Rating
              onClick={handleRating}
              ratingValue={rating}
              fillColor='#cfc819'
              size='20px'
              emptyColor='#fff'
            />
          </div>
          <div className='box-field'>
            <input
              type='text'
              className='form-control'
              placeholder='Nombre'
              name='userName'
            />
            {server_error.author_name ? (
              <label style={{ fontSize: 16, color: "red", paddingTop: 10 }}>
                {server_error.author_name} </label>) : ("")}
          </div>
          <div className='box-field'>
            <input
              type='email'
              className='form-control'
              placeholder='Correo electrónico'
              name='email'
              required
            />
            {server_error.author_email ? (
              <label style={{ fontSize: 16, color: "red", paddingTop: 10 }}>
                {server_error.author_email} </label>) : ("")}
            {server_error.general ? (
              <label style={{ fontSize: 16, color: "red", paddingTop: 10 }}>
                {server_error.general} </label>) : ("")}
          </div> 
          <div className='box-field box-field__textarea'>
            <textarea
              className='form-control'
              placeholder='Reseña'
              name='content'
            ></textarea>
            {server_error.content ? (
              <label style={{ fontSize: 16, color: "red", paddingTop: 10 }}>
                {server_error.content} </label>) : ("")}
          </div>
          <button type='send' className='btn'>
            Enviar
          </button>
        </form>
        <div style={{marginTop:"1.5rem"}}>  
          {success? <label style={{fontSize: 16,  paddingTop: 10 , color:'#450920'}}> Gracias por tu reseña </label > : ''}
        </div>
        
      </div>
    </>
  );
};
