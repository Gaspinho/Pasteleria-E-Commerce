import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePostProductMutation, useGetCategoriesQuery } from "../../services/productApi"; 
import "./newProduct.css";
import { CircularProgress } from "@mui/material";
import { Alert } from '@mui/material';

function NewProduct() {
  const navigate = useNavigate();
  const [server_error, setServerError] = useState({});
  const [success, setSuccess] = useState(false);
  const [postProduct, { isLoading }] = usePostProductMutation();
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategoriesQuery();

  const [data, setData] = useState({
      product_Name: '',
      product_Is_Sale: 'Yes',
      product_Price: '',
      product_Stock: '',
      product_Description: '',
      image1: '', // Ahora guardaremos URLs de texto aquí
      image2: '',
      image3: '',
      image4: '',
      category_Name: 'Chocolate', //valor por defecto
  });
  
  const handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    setData(values => ({ ...values, [name]: value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    const productData = {
      product_name: data.product_Name,
      product_description: data.product_Description,
      product_price: parseFloat(data.product_Price),
      product_stock: parseInt(data.product_Stock),
      product_is_sale: data.product_Is_Sale === 'Yes' || data.product_Is_Sale === true,
      category_name: data.category_Name,
      image_gallery: {
        image1: data.image1 || null,
        image2: data.image2 || null,
        image3: data.image3 || null,
        image4: data.image4 || null,
      }
    };
    console.log("=== DATOS QUE SE ENVIARÁN ===");
    console.log(productData.image_gallery);
    console.log("=============================");
    
    const res = await postProduct(productData);
    
    if (res.error) {
      if (typeof (res.error.data?.errors) === 'undefined') {
        // Este mensaje sale si falla CORS o el servidor se cae
        alert('Error de conexión. Revisa que el puerto de tu frontend esté en server.py');
      }
      setServerError(res.error.data?.errors || {});
    } 
    
    if (res.data) {
      setSuccess(true);
      setTimeout(function(){ navigate('/admin/products')} , 3000);
    }
  }

  return (
      <div className="container1">
        {/* === SECCIÓN DE FOTOS (Simplificada) === */}
        <div className="photoContainer" style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <h3 style={{marginBottom: '10px'}}>Imágenes (URLs)</h3>
            
            {/* Input 1 */}
            <div className="url-input-group">
                <input type="text" name="image1" placeholder="Pegar URL Imagen Principal" 
                       value={data.image1} onChange={handleChange} style={{width: '100%', padding: '5px'}}/>
                {data.image1 && <img src={data.image1} alt="Prev" style={{width: '100px', height: '100px', objectFit: 'cover', marginTop: '5px'}}/>}
            </div>

            {/* Input 2 */}
            <div className="url-input-group">
                <input type="text" name="image2" placeholder="URL Imagen 2" 
                       value={data.image2} onChange={handleChange} style={{width: '100%', padding: '5px'}}/>
                {data.image2 && <img src={data.image2} alt="Prev" style={{width: '60px', height: '60px', objectFit: 'cover', marginTop: '5px'}}/>}
            </div>

             {/* Input 3 */}
             <div className="url-input-group">
                <input type="text" name="image3" placeholder="URL Imagen 3" 
                       value={data.image3} onChange={handleChange} style={{width: '100%', padding: '5px'}}/>
                {data.image3 && <img src={data.image3} alt="Prev" style={{width: '60px', height: '60px', objectFit: 'cover', marginTop: '5px'}}/>}
            </div>

             {/* Input 4 */}
             <div className="url-input-group">
                <input type="text" name="image4" placeholder="URL Imagen 4" 
                       value={data.image4} onChange={handleChange} style={{width: '100%', padding: '5px'}}/>
                {data.image4 && <img src={data.image4} alt="Prev" style={{width: '60px', height: '60px', objectFit: 'cover', marginTop: '5px'}}/>}
            </div>
        </div>
        
        {/* === SECCIÓN DE DATOS === */}
        <div className="dataContainer">
          <div className="info_data">
             <div className="name"><h1> Nuevo Producto </h1></div>
          </div>
          
          <form className="editProductForm" onSubmit={handleSubmit}>
            
            <div className="newproductItem">
              <label>Nombre del Producto</label>
              <input type="text" name="product_Name" value={data.product_Name || ""} onChange={handleChange} />
              {server_error.product_name && <p style={{color:'red'}}>{server_error.product_name}</p>}
            </div>

            <div className="newproductItem">
              <label>Descripción</label>
              <input type="text" name="product_Description" value={data.product_Description || ""} onChange={handleChange} />
            </div>

            <div className="newproductItem">
              <label>Precio</label>
              <input type="number" name="product_Price" value={data.product_Price || ""} onChange={handleChange} />
            </div>

            <div className="newproductItem">
              <label>Stock</label>
              <input type="number" name="product_Stock" value={data.product_Stock || ""} onChange={handleChange} />
            </div>

            <div className="newproductItem">
              <label>¿En Oferta?</label>
              <select className="newProductSelect" name="product_Is_Sale" value={data.product_Is_Sale} onChange={handleChange}>
                <option value="Yes">Sí</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="newproductItem">
              <label>Categoría</label>
              <select className="newProductSelect" name="category_Name" value={data.category_Name} onChange={handleChange} required>
                 <option value="" disabled>Selecciona una categoría</option>
                 {/* Si usaste el hook de categorías úsalo aquí, si no, deja tus options manuales */}
                 {categoriesData?.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                 ))}
                 {!categoriesData && <option value="Chocolate">Cargando...</option>}
              </select>
            </div>

            <div className="btn_con">
              {isLoading ? (<CircularProgress /> ) : (
                <button type="submit" className="btn1">Guardar Producto</button>
              )}
            </div>       
          </form>

          {success && <Alert severity='success'> Producto agregado exitosamente </Alert>} 
        </div>
      </div>
  );
}

export default NewProduct;