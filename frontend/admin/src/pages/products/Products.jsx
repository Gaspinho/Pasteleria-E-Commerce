import React from "react";
import "./products.css";
import { useNavigate } from "react-router-dom";
import { useGetAllProductQuery } from "../../services/productApi";


function Products() {
  const navigate = useNavigate();
  const response = useGetAllProductQuery();

  if (response.isLoading) return <div>Loading....</div>;
  if (response.isError) return <h1>An error occured {response.error.error}</h1>;
  
  let arr = (response.data).slice().reverse();
 
  const handleEdit = props => {
    navigate(`/admin/product/edit/${props}`);
  };

  const handleNew = () => {
    navigate(`/admin/product/new`);
  };


  const getImgUrl = (img) => {
    if (!img) return '/assets/img/placeholder.png';
    if (img.startsWith('http')) return img;
    return `http://127.0.0.1:8000${img}`;
  };

  return (
    <div>
      <div className="titlediv">
        <h1 style={{ marginBottom: "3rem" }}> Lista de Productos </h1>
        <button className="newBtn" onClick={() => handleNew()}> Nuevo Producto </button>
      </div>
      <div className="productGrid">
        {arr.map((data, index) => (
          <section key={index} className="product">
            <div className="product__photo">
              <div className="photo-container">
                <div className="photo-main">
                  <img
                    src={getImgUrl(data.imageGallery?.image1)}
                    alt="mainPhoto"
                  />
                </div>
                <div className="photo-album">
                  <ul>
                    <li>
                      <img src={getImgUrl(data.imageGallery?.image2)} alt="img2" />
                    </li>
                    <li>
                      <img src={getImgUrl(data.imageGallery?.image3)} alt="img3" />
                    </li>
                    <li>
                      <img src={getImgUrl(data.imageGallery?.image4)} alt="img4" />
                    </li>
                    <li>
                      <img src={getImgUrl(data.imageGallery?.image1)} alt="img1-rep" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="product__info">
              <div className="title">
                <h1>{data.product_Name}</h1>
                <span>ID: {data.product_Id}</span>
              </div>
              <div className="dataProduct ">
                <h3>En Venta:</h3>
                <span> {data.product_Is_Sale === 'Yes' || data.product_Is_Sale === true ? 'Sí' : 'No'} </span>
              </div>
              <div className="dataProduct ">
                <h3> Precio:</h3>
                <span> {data.product_Price} CLP</span>
              </div>
              <div className="dataProduct">
                <h3>Stock:</h3>
                <span> {data.product_Stock} </span>
              </div>
              <div className="dataProduct ">
                <h3> Categoría:</h3>
                <span> {data.product_category?.category_Name || data.category_name} </span>
              </div>
              <div className="description">
                <h3>Descripción:</h3>
                <p>{data.product_Description}</p>
              </div>
              <button
                className="buy--btn"
                onClick={() => handleEdit(data.product_Id)}
              >
                Editar Producto
              </button>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default Products;