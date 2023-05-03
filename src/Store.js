import React, { useEffect, useState } from "react";
import { uc } from "./UserContext";
import { useContext } from "react";
import { BrandsService, CategoriesService, ProductsService } from "./Service";
import Product from "./Product";
const Store = () => {
  let ur = useContext(uc);
  const [brands, setbrands] = useState([]);
  const [products, setproducts] = useState([]);
  const [categories, setcategories] = useState([]);
const [productsToShow,setProductsToShow] =useState([])
const [search,setSearch] = useState("")
  console.log(products);

  useEffect(() => {
    (async () => {
      // get brands from db
      let brandsResponse = await BrandsService.fetchBrands();
      let brandsResponseBody = await brandsResponse.json();
      brandsResponseBody.forEach((brand) => {
        brand.isChecked = true;
      });
      setbrands(brandsResponseBody);
      // get categories from db
      let categoriesResponse = await CategoriesService.fetchCategories();
      let categoriesResponseBody = await categoriesResponse.json();
      categoriesResponseBody.forEach((category) => {
        category.isChecked = true;
      });
      setcategories(categoriesResponseBody);

      //get products from db

      let productsResponse = await fetch(
        `http://localhost:5500/products?productName_like=${search}`,
        { method: "GET" }
      );
      let productsResponseBody = await productsResponse.json();
      if (productsResponse.ok) {
        productsResponseBody.forEach((product) => {
          //set brand
          product.brand = BrandsService.getBrandByBrandId(
            brandsResponseBody,
            product.brandId
          );

          //set category
          product.category = CategoriesService.getCategoryByCategoryId(
            categoriesResponseBody,
            product.categoryId
          );
          product.isOrdered = false;
        });
        setproducts(productsResponseBody);
        setProductsToShow(productsResponseBody);
        
        document.title = "Store - eCommerce";
      }
    })();
  }, [search]);

  let updateBrandIsChecked = (id) => {
    let brandsData = brands.map((brd) => {
      if (brd.id === id) brd.isChecked = !brd.isChecked;
      return brd;
    });
    updateProductsToShow()
    setbrands(brandsData);
  };

  let updateCategoryIsChecked = (id) => {
    let categoryData = categories.map((cat) => {
      if (cat.id === id) cat.isChecked = !cat.isChecked;
      return cat;
    });

    setcategories(categoryData);
    updateProductsToShow()

  };

// update products to show

let updateProductsToShow = ()=>{
  setProductsToShow(
    products
    .filter((prod)=>{
      return (
        categories.filter((category)=> 
        category.id === prod.categoryId && category.isChecked===true).length > 0
      )
    })
    .filter((prod) => {
      return (
        brands.filter(
          (brand) => brand.id === prod.brandId && brand.isChecked
        ).length > 0
      );
    })
  )
}

// when user clicks on ADD TO CART BUTTON

let onAddToCartClick = (prod) => {
  (async () => {
    let newOrder = {
      userId: ur.user.currentUserId,
      productId: prod.id,
      quantity: 1,
      isPaymentCompleted: false,
    };

    let orderResponse = await fetch(`http://localhost:5500/orders`, {
      method: "POST",
      body: JSON.stringify(newOrder),
      headers: { "Content-Type": "application/json" },
    });

    if (orderResponse.ok) {
      //isOrdered = true
      let prods = products.map((p) => {
        if (p.id === prod.id) {
          p.isOrdered = true;
        return p;
        }
      });

   setproducts(products)
   updateProductsToShow()
    } else {
      console.log(orderResponse);
    }
  })();
};

  return (
    <div> 
    <div className="row py-3 header"> 
      <div className="col-lg-3"> 
        <h4> 
          <i className="fa fa-shopping-bag"></i> Store{" "} 
          <span className="badge badge-secondary"> 
            {productsToShow.length} 
          </span> 
        </h4> 
      </div> 

      <div className="col-lg-9"> 
        <input 
          type="search" 
          value={search} 
          placeholder="Search" 
          className="form-control" 
          autoFocus="autofucs" 
          onChange={(event) => { 
            setSearch(event.target.value); 
          }} 
        /> 
      </div> 
    </div> 

    <div className="row"> 
      <div className="col-lg-3 py-2"> 
        <div className="my-2"> 
          <h5>Brands</h5> 
          <ul className="list-group list-group-flush"> 
            {brands.map((brand) => ( 
              <li className="list-group-item" key={brand.id}> 
                <div className="form-check"> 
                  <input 
                    type="checkbox" 
                    className="form-check-input" 
                    value="true" 
                    checked={brand.isChecked} 
                    onChange={() => { 
                      updateBrandIsChecked(brand.id); 
                    }} 
                    id={`brand${brand.id}`} 
                  /> 
                  <label 
                    className="form-check-label" 
                    htmlFor={`brand${brand.id}`} 
                  > 
                    {brand.brandName} 
                  </label> 
                </div> 
              </li> 
            ))} 
          </ul> 
        </div> 

        <div className="my-2"> 
          <h5>Categories</h5> 
          <ul className="list-group list-group-flush"> 
            {categories.map((category) => ( 
              <li className="list-group-item" key={category.id}> 
                <div className="form-check"> 
                  <input 
                    type="checkbox" 
                    className="form-check-input" 
                    value="true" 
                    checked={category.isChecked} 
                    onChange={() => { 
                      updateCategoryIsChecked(category.id); 
                    }} 
                    id={`category${category.id}`} 
                  /> 
                  <label 
                    className="form-check-label" 
                    htmlFor={`category${category.id}`} 
                  > 
                    {category.categoryName} 
                  </label> 
                </div> 
              </li> 
            ))} 
          </ul> 
        </div> 
      </div> 
      <div className="col-lg-9 py-2"> 
        <div className="row"> 
          {productsToShow.map((prod) => ( 
            <Product 
              key={prod.id} 
              product={prod} 
              onAddToCartClick={onAddToCartClick} 
            /> 
          ))} 
        </div> 
      </div> 
    </div> 
  </div>
  );
};

export default Store;
