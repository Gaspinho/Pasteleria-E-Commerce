import React from "react";
import { useState} from "react";
import {useNavigate } from "react-router-dom";
import {usePostProductMutation } from "../../services/productApi";
import "./newProduct.css";
import { CircularProgress} from "@mui/material";
import { DriveFolderUpload} from "@mui/icons-material";
import { Alert } from '@mui/material';

function NewProduct() {
  const navigate = useNavigate();
  const [server_error, setServerError] = useState({});
  const [success , setSuccess] = useState(false)
  const [postProduct, { isLoading }] = usePostProductMutation();
 
  const [imge, setImge] = useState({
    image1: '', image2: '', image3: '', image4: '',
  });

  const [data, setData] = useState({
      product_Name: '',
      product_Is_Sale: 'Yes',
      product_Price: '',
      product_Stock: '',
      product_Description: '',
      image1: '',
      image2: '',
      image3: '',
      image4: '',
      category_Name: 'Chocolate',
  })
  
  const handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    setData(values => ({ ...values, [name]: value }));
  };

  const handleImage = event => {
    console.log(event.target.files);
    const name = event.target.name;
    const value = event.target.files[0];
    setImge(values => ({ ...values, [name]: value}));
    const objectUrl = URL.createObjectURL(value)
    setData(values => ({ ...values, [name]: objectUrl}));
  };

  const handleSubmit = async(e) => {
    e.preventDefault()
    
    // Convertir las imágenes a base64 o URLs (el backend actual espera URLs de string)
    const productData = {
      product_name: data.product_Name,
      product_description: data.product_Description,
      product_price: parseFloat(data.product_Price),
      product_stock: parseInt(data.product_Stock),
      product_is_sale: data.product_Is_Sale === 'Yes' || data.product_Is_Sale === 'true' || data.product_Is_Sale === true ? 'Yes' : 'No',
      category_name: data.category_Name,
      image_gallery: {
        image1: data.image1 || null,
        image2: data.image2 || null,
        image3: data.image3 || null,
        image4: data.image4 || null,
      }
    };
        
    const res = await postProduct(productData)
    
    if (res.error) {
      if (typeof (res.error.data?.errors) === 'undefined') {
        alert('A server/network error occurred. ' +'Looks like CORS might be the problem. ' +
        'Sorry about this - we will get it fixed shortly.');
      }
      console.log(typeof (res.error.data?.errors))   
      console.log(res.error.data?.errors)
      setServerError(res.error.data?.errors || {})
    } 
    
    if (res.data) {
      console.log(typeof (res.data))
      console.log(res.data)
      setSuccess(true)
      setTimeout(function(){ navigate('/admin/products')} , 3000);
    }
  }
  return (
      <div className="container1">
        <div className="photoContainer">
          <div className="photoGrid">
            <div className="productPhoto"> <img src={data.image1} alt="1" /> 
            <div className="uploadContainer"><DriveFolderUpload sx={{ fontSize: "40px" }}  /> <input type="file" name="image1" onChange={handleImage}/> </div></div>
            <div className="productPhoto"><img src={data.image2} alt="2" />
            <div className="uploadContainer"><DriveFolderUpload sx={{ fontSize: "40px" }}  /> <input type="file" name="image2" onChange={handleImage}/> </div></div>
            <div className="productPhoto"><img src={data.image3} alt="3" /> 
            <div className="uploadContainer"><DriveFolderUpload sx={{ fontSize: "40px" }}  /> <input type="file" name="image3" onChange={handleImage}/> </div></div>
            <div className="productPhoto"><img src={data.image4} alt="4" />
            <div className="uploadContainer"><DriveFolderUpload sx={{ fontSize: "40px" }}  /> <input type="file" name="image4" onChange={handleImage}/> </div></div>
            
          </div>
        </div>
        <div className="dataContainer"><div className="info_data"><div className="name"><h1> Nombre: {''} {data.product_Name}</h1></div>
            <div className="productInfo "><h3>Estado de Venta:</h3><span> {data.product_Is_Sale === 'Yes' || data.product_Is_Sale === 'true' || data.product_Is_Sale === true ? 'Sí' : 'No'}</span></div>
            <div className="productInfo "><h3> Precio del Producto:</h3><span> Rs. {' '}{data.product_Price}</span></div>
            <div className="productInfo"><h3>Stock del Producto:</h3><span> {data.product_Stock} </span></div>
            <div className="productInfo "><h3>Categoría del Producto:</h3><span> {data.category_Name} {''} Cake </span></div>
            <div className="descript"><h3> Descripción del Producto:</h3><p>{data.product_Description}</p></div>
          </div>
        <form className="editProductForm" onSubmit={handleSubmit}>
          <div className="newproductItem">
            <label>Nombre del Producto</label>
            <input
              type="text"
              name="product_Name"
              value={data.product_Name || ""}
              onChange={handleChange}
            />
            {server_error.product_Name ? (
              <lable style={{ fontSize: 16, color: "red", paddingLeft: 10 }}>
                {server_error.product_Name[0]} </lable>) : ("")}
          </div>
          <div className="newproductItem">
            <label>Descripción del Producto</label>
            <input type="text" name="product_Description" 
            value={data.product_Description || ""}
            onChange={handleChange}
             />
            {server_error.product_Name ? (
              <lable style={{ fontSize: 16, color: "red", paddingLeft: 10 }}>
                {server_error.product_Name[0]} </lable>) : ("")}
          </div>
          <div className="newproductItem">
            <label>Precio del Producto</label>
            <input type="text"  name="product_Price"
             value={data.product_Price || ""}
            onChange={handleChange}
            />
            {server_error.product_Price ? (
              <lable style={{ fontSize: 16, color: "red", paddingLeft: 10 }}>
                {server_error.product_Price[0]}
              </lable>) : ("")}
          </div>
          <div className="newproductItem">
            <label>Stock del Producto</label>
            <input type="text" name="product_Stock" value={data.product_Stock || ""}
              onChange={handleChange} />
            {server_error.product_Stock ? (
              <lable style={{ fontSize: 16, color: "red", paddingLeft: 10 }}>
              {server_error.product_Stock[0]}</lable>) : ("")}
          </div>
          <div className="newproductItem">
            <label>Estado de Venta del Producto</label>
            <select className="newProductSelect" name="product_Is_Sale" id="product_Is_Sale" 
            value={data.product_Is_Sale || "Yes"}
            onChange={handleChange} >
              <option value="Yes" >Yes</option>
              <option value= "No">No</option>
            </select>
          </div>
          <div className="btn_con">
          <div className="newproductItem">
            <label>Actualizar Categoría</label>
            <select className="newProductSelect" name="category_Name" id="category_Name"
            value={data.category_Name || ""}
            onChange={handleChange} required>
              <option value="Chocolate">Chocolate Cake</option>
              <option value="Cupcakes">Cup Cake</option>
              <option value="Aniversary">Aniversary Cake</option>
              <option value="Birthday">Birthday Cake</option>
            </select>
          </div>
          {isLoading ? (<CircularProgress /> ) : (
            <button type="submit" className="btn1">
              Agregar Producto</button>
          )}
          </div>       
        </form>
        {server_error.image1 ? <Alert severity='error'>{ `image1: ${server_error.image1[0]}`}</Alert> : ''} 
        {server_error.image2 ? <Alert severity='error'>{ `image2: ${server_error.image2[0]}`}</Alert> : ''} 
        {server_error.image3 ? <Alert severity='error'>{ `image3: ${server_error.image3[0]}`}</Alert> : ''} 
        {server_error.image4 ? <Alert severity='error'>{ `image4: ${server_error.image4[0]}`}</Alert> : ''} 
        {success? <Alert severity='success'> Producto agregado exitosamente </Alert> : ''} 
        
      </div>
      </div>
  );
}

export default NewProduct;
