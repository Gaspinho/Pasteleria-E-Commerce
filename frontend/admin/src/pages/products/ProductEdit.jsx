import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUpdateProductMutation, useDetailedProductQuery, useGetCategoriesQuery } from "../../services/productApi";
import { CircularProgress, Alert } from "@mui/material";
import "./productEdit.css"; 
// Nota: Reutilizamos productEdit.css, pero asegúrate de que los estilos de 'url-input-group' 
// que usaste en NewProduct existan. Si no, puedes copiarlos a productEdit.css

function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [server_error, setServerError] = useState({});
  const [success, setSuccess] = useState(false);

  // Queries y Mutations
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const productRes = useDetailedProductQuery(id);
  const { data: categoriesData } = useGetCategoriesQuery();

  // Estado inicial
  const [data, setData] = useState({
    product_Name: '',
    product_Description: '',
    product_Price: '',
    product_Stock: '',
    product_Is_Sale: 'Yes',
    category_Name: '',
    image1: '',
    image2: '',
    image3: '',
    image4: ''
  });

  // Cargar datos cuando llegan del servidor
  useEffect(() => {
    if (productRes.isSuccess && productRes.data) {
      const p = productRes.data;
      const gallery = p.imageGallery || {};

      // Lógica para recuperar la imagen principal (Galería o Legacy)
      let mainImg = gallery.image1;
      if (!mainImg && p.image_path) {
          mainImg = p.image_path; // Si no hay galería, usar la imagen legacy
      }

      setData({
        product_Name: p.product_Name || '',
        product_Description: p.product_Description || '',
        product_Price: p.product_Price || 0,
        product_Stock: p.product_Stock || 0,
        product_Is_Sale: p.product_Is_Sale || 'Yes',
        category_Name: p.category_Name || p.product_category?.category_Name || 'Chocolate',
        
        // Asignar URLs
        image1: mainImg || '',
        image2: gallery.image2 || '',
        image3: gallery.image3 || '',
        image4: gallery.image4 || ''
      });
    }
  }, [productRes.isSuccess, productRes.data]);

  const handleChange = event => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      product_name: data.product_Name,
      product_description: data.product_Description,
      product_price: parseFloat(data.product_Price),
      product_stock: parseInt(data.product_Stock),
      product_is_sale: data.product_Is_Sale === 'Yes' || data.product_Is_Sale === true || data.product_Is_Sale === "true" ? 'Yes' : 'No',
      category_name: data.category_Name,
      // Enviamos las URLs como texto dentro de image_gallery
      image_gallery: {
        image1: data.image1 || null,
        image2: data.image2 || null,
        image3: data.image3 || null,
        image4: data.image4 || null,
      }
    };

    const res = await updateProduct({ productData, id });

    if (res.error) {
      setServerError(res.error.data?.errors || {});
      if (!res.error.data) alert("Error de conexión con el servidor.");
    }

    if (res.data) {
      setSuccess(true);
      setTimeout(() => { navigate('/admin/products') }, 2000);
    }
  }

  // Helper para renderizar input de imagen (Igual que en NewProduct)
  const renderImageInput = (num) => {
    const key = `image${num}`;
    return (
      <div className="url-input-group" style={{ marginBottom: '15px' }}>
        <label style={{display: 'block', fontWeight: 'bold', fontSize: '14px', marginBottom: '5px'}}>
           URL Imagen {num}
        </label>
        <input 
          type="text" 
          name={key} 
          placeholder={`https://...`}
          value={data[key]} 
          onChange={handleChange} 
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        {data[key] && (
          <div style={{ marginTop: '5px', border: '1px dashed #ccc', padding: '5px', width: 'fit-content' }}>
            <img 
              src={data[key]} 
              alt={`Vista previa ${num}`} 
              style={{ width: '100px', height: '100px', objectFit: 'cover', display: 'block' }}
              onError={(e) => {e.target.style.display='none'}}
            />
          </div>
        )}
      </div>
    );
  };

  if (productRes.isLoading) return <div style={{padding:'2rem'}}>Cargando producto...</div>;
  if (productRes.isError) return <div style={{padding:'2rem'}}>Error al cargar el producto</div>;

  return (
    <div className="container1">
      {/* SECCIÓN IZQUIERDA: IMÁGENES (URLs) */}
      <div className="photoContainer" style={{display:'flex', flexDirection:'column'}}>
        <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #DA627D', paddingBottom: '0.5rem' }}>
            Editar Imágenes
        </h3>
        {renderImageInput(1)}
        {renderImageInput(2)}
        {renderImageInput(3)}
        {renderImageInput(4)}
      </div>

      {/* SECCIÓN DERECHA: DATOS */}
      <div className="dataContainer">
        <div className="info_data">
          <div className="name"><h1>Editar: {data.product_Name}</h1></div>
          <span style={{color: '#666'}}>ID: {id}</span>
        </div>
        
        <form className="editProductForm" onSubmit={handleSubmit}>
          
          <div className="newproductItem">
            <label>Nombre</label>
            <input type="text" name="product_Name" value={data.product_Name} onChange={handleChange} />
          </div>

          <div className="newproductItem">
             <label>Descripción</label>
             <input type="text" name="product_Description" value={data.product_Description} onChange={handleChange} />
          </div>

          <div className="newproductItem">
             <label>Precio</label>
             <input type="number" name="product_Price" value={data.product_Price} onChange={handleChange} />
          </div>

          <div className="newproductItem">
             <label>Stock</label>
             <input type="number" name="product_Stock" value={data.product_Stock} onChange={handleChange} />
          </div>

          <div className="newproductItem">
            <label>En Oferta</label>
            <select className="newProductSelect" name="product_Is_Sale" value={data.product_Is_Sale} onChange={handleChange}>
              <option value="Yes">Sí</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="newproductItem">
            <label>Categoría</label>
            <select className="newProductSelect" name="category_Name" value={data.category_Name} onChange={handleChange}>
              {categoriesData?.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
              {!categoriesData && <option value="Chocolate">Cargando categorías...</option>}
            </select>
          </div>

          <div className="btn_con">
            {isUpdating ? <CircularProgress /> : <button type="submit" className="btn1">Actualizar Producto</button>}
          </div>       
        </form>

        {success && <Alert severity='success' sx={{marginTop: 2}}>Producto actualizado correctamente</Alert>}      
      </div>
    </div>
  );
}

export default ProductEdit;