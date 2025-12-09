import React from "react";
import "./products.css";
import { useNavigate } from "react-router-dom";
import { useGetAllProductQuery } from "../../services/productApi";
import cake1 from "../../images/cake1.jpg";
import cake2 from "../../images/cake2.jpg";
import cake3 from "../../images/cake3.jpg";
import cake4 from "../../images/cake4.jpg";
import cake5 from "../../images/cake5.jpg";
import cake6 from "../../images/cake6.jpg";
import cake7 from "../../images/cake7.jpg";
import cake8 from "../../images/cake8.jpg";
import cake9 from "../../images/cake9.jpg";
import cake10 from "../../images/cake10.jpg";

function Products() {
  const navigate = useNavigate();
  const response = useGetAllProductQuery();
  
  // Array de imágenes de pasteles
  const cakeImages = [cake1, cake2, cake3, cake4, cake5, cake6, cake7, cake8, cake9, cake10];
  
  // Función para obtener imagen basada en el índice
  const getCakeImage = (index, imageNumber) => {
    const imageIndex = (index + imageNumber) % cakeImages.length;
    return cakeImages[imageIndex];
  };
 
  console.log("Response Information: ", response);
  console.log("Data: ", response.data);
  console.log("Success: ", response.isSuccess);

  if (response.isLoading) return <div>Loading....</div>;
  if (response.isError) return <h1>An error occured {response.error.error}</h1>;
  let arr = (response.data).slice().reverse();
 
  const handleEdit = props => {
    console.log(props)
    navigate(`/admin/product/edit/${props}`);
  };

  const handleNew = () => {
    navigate(`/admin/product/new`);
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
                    src={getCakeImage(index, 0)}
                    alt="mainePhoto"
                  />
                </div>
                <div className="photo-album">
                  <ul>
                    <li>
                      <img
                        src={getCakeImage(index, 1)}
                        alt="image1"
                      />
                    </li>
                    <li>
                      <img
                        src={getCakeImage(index, 2)}
                        alt="image2"
                      />
                    </li>
                    <li>
                      <img
                        src={getCakeImage(index, 3)}
                        alt="image3"
                      />
                    </li>
                    <li>
                      <img
                        src={getCakeImage(index, 4)}
                        alt="image4"
                      />
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
                <span> {data.product_Is_Sale === 'Yes' || data.product_Is_Sale === 'true' || data.product_Is_Sale === true ? 'Sí' : 'No'} </span>
              </div>
              <div className="dataProduct ">
                <h3> Precio:</h3>
                <span>${data.product_Price}</span>
              </div>
              <div className="dataProduct">
                <h3>Stock:</h3>
                <span> {data.product_Stock} </span>
              </div>
              <div className="dataProduct ">
                <h3> Categoría:</h3>
                <span> {data.product_category.category_Name} </span>
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
