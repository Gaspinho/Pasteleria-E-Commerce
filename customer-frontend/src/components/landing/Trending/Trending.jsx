import Link from "next/link";
import { ProductsCarousel } from "components/Product/Products/ProductsCarousel";
import { SectionTitle } from "components/shared/SectionTitle/SectionTitle";
import { useEffect, useState } from "react";
import productData from "data/product/product";

export const Trending = () => {
  const trendingProducts = [...productData];
  const [products, setProducts] = useState(trendingProducts);
  const [filterItem, setFilterItem] = useState("cupcakes");

  useEffect(() => {
    const newItems = trendingProducts.filter((pd) =>
      pd.filterItems.includes(filterItem)
    );
    setProducts(newItems);
  }, [filterItem]);

  const filterList = [
    {
      name: "Tortas Circulares",
      value: "Chocolate",
    },
    {
      name: "Tortas Cuadradas",
      value: "Aniversary",
    },
    {
      name: "Postres Individuales",
      value: "Cupcakes",
    },
    {
      name: "Productos Sin Gluten",
      value: "Birthday",
    },
  ];
  return (
    <>
      {/* <!-- BEGIN TRENDING --> */}
      <section className="trending">
        <div className="trending-content">
          <SectionTitle
            subTitle="Deliciosos Sabores"
            title="Revisa nuestras categorias"
            body="Si estás buscando algo único, pide el diseño de pastel que desees o personaliza uno propio. Veamos si podemos hacerlo realidad."
          />
          <div className="tab-wrap trending-tabs">
            <ul className="nav-tab-list tabs">
              {filterList.map((item) => (
                <li
                  key={item.value}
                  className={item.value === filterItem ? "active" : ""}
                >
                  <Link
                    href={{
                      pathname: "/shop",
                      query: { category: item.name },
                    }}
                  >
                    <a onClick={() => setFilterItem(item.value)}>{item.name}</a>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="products-items">
              <ProductsCarousel products={products} />
            </div>
          </div>
        </div>
      </section>
      {/* <!-- TRENDING EOF   --> */}
    </>
  );
};