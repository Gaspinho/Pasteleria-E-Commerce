import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Dropdown from "react-dropdown";
import Slider from "rc-slider";

import { Products } from "components/Product/Products/Products";
import { PagingList } from "components/shared/PagingList/PagingList";
import { usePagination } from "components/utils/Pagination/Pagination";
import { AsideItem } from "../shared/AsideItem/AsideItem";
import productData from "data/product/product";

// React Range
const Range = Slider.Range;

const sortOptions = [
  { value: "highToMin", label: "De más caro a más barato" },
  { value: "minToHigh", label: "De más barato a más caro" },
];

export const Shop = () => {
  // Normalizamos datos: precio numérico seguro
  const router = useRouter();
  const allProducts = useMemo(
    () =>
      [...productData].map((p) => ({
        ...p,
        // asegúrate de que price/oldPrice sean números para ordenar/filtrar
        _priceNum: Number(p.price) || 0,
        _oldPriceNum: Number(p.oldPrice) || Number(p.price) || 0,
      })),
    []
  );

  // ---- Aux: categorías dinámicas (por "category")
  const categories = useMemo(() => {
    const map = new Map();
    allProducts.forEach((p) => {
      const key = p.category || "Otros";
      map.set(key, (map.get(key) || 0) + 1);
    });
    // Devuelve [{name, count}]
    return [...map.entries()].map(([name, count]) => ({ name, count }));
  }, [allProducts]);

  // ---- Aux: rango de precios dinámico
  const priceBounds = useMemo(() => {
    const prices = allProducts.map((p) => p._priceNum);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { min, max };
  }, [allProducts]);

  // ---- UI State
  const [selectedCats, setSelectedCats] = useState(new Set()); // multiselección
  const [priceRange, setPriceRange] = useState([priceBounds.min, priceBounds.max]);
  const [sortBy, setSortBy] = useState(sortOptions[0].value);
  const [flags, setFlags] = useState({ isNew: false, isSale: false }); // por si quieres reactivar NEW/SALE

  // ---- Recently viewed y Top 3 del día (fallback como antes)
  const recentlyViewed = useMemo(() => {
    try {
      const raw = localStorage.getItem("recentlyViewed");
      if (raw) {
        const ids = JSON.parse(raw);
        const items = ids
          .map((id) => allProducts.find((p) => String(p.id) === String(id)))
          .filter(Boolean);
        if (items.length) return items.slice(0, 3);
      }
    } catch {}
    return allProducts.slice(0, 3);
  }, [allProducts]);

  const todaysTop = useMemo(() => {
    try {
      const rawCounts = localStorage.getItem("viewCounts");
      const counts = rawCounts ? JSON.parse(rawCounts) : {};
      // ordena por contador de vistas desc
      const sorted = [...allProducts].sort(
        (a, b) => (counts[b.id] || 0) - (counts[a.id] || 0)
      );
      // evita repetir items ya en recentlyViewed
      const top = sorted.filter((p) => !recentlyViewed.find((r) => r.id === p.id)).slice(0, 3);
      if (top.length) return top;
    } catch {}
    // fallback
    const offset = 3;
    return allProducts.slice(offset, offset + 3);
  }, [allProducts, recentlyViewed]);

  // ---- Filtro principal (precio, categoría, NEW/SALE)
  const filtered = useMemo(() => {
    const [minP, maxP] = priceRange;
    return allProducts.filter((p) => {
      const inPrice = p._priceNum >= minP && p._priceNum <= maxP;

      const inCat =
        selectedCats.size === 0 ? true : selectedCats.has(p.category || "Otros");

      const inFlags =
        (flags.isNew ? p.isNew === true : true) &&
        (flags.isSale ? p.isSale === true : true);

      return inPrice && inCat && inFlags;
    });
  }, [allProducts, priceRange, selectedCats, flags]);

  // ---- Ordenamiento (sobre el conjunto filtrado)
  const ordered = useMemo(() => {
    const arr = [...filtered];
    if (sortBy === "highToMin") {
      arr.sort((a, b) => b._priceNum - a._priceNum);
    } else if (sortBy === "minToHigh") {
      arr.sort((a, b) => a._priceNum - b._priceNum);
    }
    return arr;
  }, [filtered, sortBy]);

  // ---- Paginación
  const paginate = usePagination(ordered, 9);

  // ---- Handlers
  const handleSort = (value) => setSortBy(value);

  const toggleCategory = (cat) => {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const clearCategories = () => setSelectedCats(new Set());

  const onPriceAfterChange = (range) => {
    // range es [min, max]
    setPriceRange(range);
  };

  // Asegura que el rango inicial se ajuste si cambian bounds (primera carga)
  useEffect(() => {
    setPriceRange([priceBounds.min, priceBounds.max]);
  }, [priceBounds.min, priceBounds.max]);

  useEffect(() => {
    const cat = router.query.category;
    if (!cat) return;
    // permitir múltiples separadas por coma: ?category=A,B
    const cats = String(cat)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setSelectedCats(new Set(cats));
    // opcional: desplazar a la lista de productos
    // document.querySelector('.shop-main')?.scrollIntoView({ behavior: 'smooth' });
  }, [router.query.category]);

  return (
    <div>
      {/* <!-- BEGIN SHOP --> */}
      <div className="shop">
        <div className="wrapper">
          <div className="shop-content">
            {/* <!-- Shop Aside --> */}
            <div className="shop-aside">
              {/* Categorías dinámicas */}
              <div className="shop-aside__item">
                <span className="shop-aside__item-title">Categorias</span>
                <ul>
                  {categories.map((c) => {
                    const active = selectedCats.has(c.name);
                    return (
                      <li key={c.name}>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleCategory(c.name);
                          }}
                          className={active ? "active" : ""}
                          style={{
                            fontWeight: active ? 700 : 400,
                          }}
                        >
                          {c.name} <span>({c.count.toString().padStart(2, "0")})</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
                {selectedCats.size > 0 && (
                  <button
                    className="btn btn-sm"
                    style={{ marginTop: 8 }}
                    onClick={clearCategories}
                  >
                    Clear categories
                  </button>
                )}
              </div>

              {/* Filtro por precio */}
              <div className="shop-aside__item">
                <span className="shop-aside__item-title">Precio</span>
                <div className="range-slider">
                  <Range
                    min={priceBounds.min}
                    max={priceBounds.max}
                    value={priceRange}
                    onChange={(range) => setPriceRange(range)}
                    onAfterChange={onPriceAfterChange}
                    allowCross={false}
                  />

                  {/* cajas con los valores mínimo y máximo */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                    <div style={{
                      minWidth: 110,
                      padding: "6px 10px",
                      border: "1px solid #e0e0e0",
                      borderRadius: 6,
                      background: "#fff",
                      textAlign: "center",
                      fontWeight: 600
                    }}>
                      ${priceRange[0].toLocaleString("es-CL")}
                    </div>
                    <div style={{ color: "#888", fontSize: 18 }}>—</div>
                    <div style={{
                      minWidth: 110,
                      padding: "6px 10px",
                      border: "1px solid #e0e0e0",
                      borderRadius: 6,
                      background: "#fff",
                      textAlign: "center",
                      fontWeight: 600
                    }}>
                      ${priceRange[1].toLocaleString("es-CL")}
                    </div>
                  </div>
                </div>
              </div>

              {/* (Opcional) NEW/SALE si los quieres usar luego */}
              <div className="shop-aside__item" style={{ display: "none" }}>
                <span className="shop-aside__item-title">Flags</span>
                <label className="checkbox-box" style={{ display: "block" }}>
                  <input
                    checked={flags.isSale}
                    onChange={() => setFlags((f) => ({ ...f, isSale: !f.isSale }))}
                    type="checkbox"
                  />
                  <span className="checkmark"></span>
                  SALE
                </label>
                <label className="checkbox-box" style={{ display: "block" }}>
                  <input
                    checked={flags.isNew}
                    onChange={() => setFlags((f) => ({ ...f, isNew: !f.isNew }))}
                    type="checkbox"
                  />
                  <span className="checkmark"></span>
                  NEW
                </label>
              </div>

              {/* Recently viewed */}
              <div className="shop-aside__item">
                <span className="shop-aside__item-title">Has visto</span>
                {recentlyViewed.map((data) => (
                  <AsideItem key={data.id} aside={data} />
                ))}
              </div>

              {/* Top 3 for today */}
              <div className="shop-aside__item">
                <span className="shop-aside__item-title">Top 3 del día</span>
                {todaysTop.map((data) => (
                  <AsideItem key={data.id} aside={data} />
                ))}
              </div>
            </div>
            {/* <!-- Shop Main --> */}
            <div className="shop-main">
              <div className="shop-main__filter">
                {/* Ordenamiento */}
                <div className="shop-main__select">
                  <Dropdown
                    options={sortOptions}
                    className="react-dropdown"
                    onChange={(option) => handleSort(option.value)}
                    value={sortOptions.find((o) => o.value === sortBy) || sortOptions[0]}
                  />
                </div>
              </div>

              <div className="shop-main__items">
                <Products products={paginate?.currentData()} />
              </div>

              {/* <!-- PAGINATE LIST --> */}
              <PagingList paginate={paginate} />
            </div>
          </div>
        </div>

        <img
          className="promo-video__decor js-img"
          src="/assets/img/promo-video__decor.jpg"
          alt=""
        />
        <img
          className="shop-decor js-img"
          src="/assets/img/shop-decor.jpg"
          alt=""
        />
      </div>
      {/* <!-- SHOP EOF   --> */}
    </div>
  );
};
