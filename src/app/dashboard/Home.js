import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
// const proxy = require("http-proxy-middleware");
import axios from 'axios';
import { toast } from 'react-toastify';

const Home = ({ authentification }) => {

  

  // app.use(
  //   proxy(["/address/**", "/card/**", "/category/**", "/contact/**", "/order/**", "/product/**", "/schedule/**", "/user/**", "/vaucher/**"], { target: "https://online-shopping-bac.herokuapp.com/" })
  // );

  const [products, setProducts] = useState([]);
  const [boolPro, setBoolPro] = useState(false);

  const productTemp = (id, cat_id, name, stock, description, price, quantity, img) => {
    return (
      {
        "product_id": id,
        "category_id": cat_id,
        "product_name": name,
        "stock": stock,
        "description": description,
        "price": price,
        "quantity": quantity,
        "image_source": img
      }
    )
  };

  const location = useLocation();

  useEffect(() => {
    axios.get(
      "/product/category/" + location.pathname.substr(6)
    ).then(response => {
      setProducts(response.data);
      if (response.data.length === 0) {
        setBoolPro(true);
      } else {
        setBoolPro(false);
      }
    }).catch((err) => {
      errorAlert(err.message)
    });
  }, [location.pathname]);


  const convertPrice = (amount) => {
    let p = amount.toString();
    let l = amount.toString().length / 3;
    let a = '';
    for (let i = 0; i < l - 1; i++) {
      a = ' ' + p.substr(p.length - 3, p.length) + a;
      p = p.substr(0, p.length - 3);
    }
    a = p + a;
    return a;
  }


  const toggleUserItemsPanel = () => {
    document.getElementById('user-items-panel').classList.toggle('open');
  }


  const productPush = (product) => {
    let items = [];
    if (localStorage.getItem("Product-Item") !== null) {
      let json = localStorage.getItem("Product-Item")
      items = JSON.parse(json);
    }
    items.push(productTemp(product.product_id, product.category_id, product.product_name, product.stock, product.description, product.price, 1, product.image_source));
    localStorage.setItem("Product-Item", JSON.stringify(items));
  }


  const productPlus = (product) => {

    let items = [];

    let json = localStorage.getItem("Product-Item")
    items = JSON.parse(json);

    for (let i = 0; i < items.length; i++) {
      if (product.product_id === items[i].product_id) {
        items[i].quantity++;
        localStorage.setItem("Product-Item", JSON.stringify(items));
        return;
      }
    }
  }

  const productMinus = (product) => {
    let items = [];

    let json = localStorage.getItem("Product-Item")
    items = JSON.parse(json);

    for (let i = 0; i < items.length; i++) {
      if (product.product_id === items[i].product_id) {
        if (parseInt(items[i].quantity) > 1) {
          items[i].quantity--;
          localStorage.setItem("Product-Item", JSON.stringify(items));
          return;
        } else {
          itemDeleted(items[i]);
        }

      }
    }
  }

  const itemDeleted = (item) => {
    let items = [];
    let json = localStorage.getItem("Product-Item")
    items = JSON.parse(json);

    let newItems = [];

    while (items.length > 0) {
      let shiftItem = items.shift();
      if (shiftItem.product_id !== item.product_id) {
        newItems.push(shiftItem);
      }
    }
    localStorage.setItem("Product-Item", JSON.stringify(newItems));
  }


  const errorAlert = (message) => {

    toast.error(message,
      { position: toast.POSITION.TOP_RIGHT })
  }

  const renderProductById = () => {

    return products.map(product => {

      let index = -1;

      let items = [];
      if (localStorage.getItem("Product-Item") !== null) {
        let json = localStorage.getItem("Product-Item")
        items = JSON.parse(json);
      }

      for (let i = 0; i < items.length; i++) {
        if (product.product_id === items[i].product_id) {
          index = i;
        }
      }

      return (
        <div className="col-12 col-sm-6 col-md-3 col-lg-3 p-2">
          <div className="card h-100">
            <div className="w-100 d-flex justify-content-end pr-3">
              {(product.stock !== null && product.stock !== 0) && (
                <div className="bg-danger d-flex justify-content-center align-items-center text-white mt-4 py-1" style={{ width: "50px", borderRadius: "25px", position: "absolute", fontWeight: "bold" }} >-{product.stock}%</div>
              )}
            </div>
            <div className="card-body p-0 d-flex align-items-center">
              <img className="w-100 rounded-top" src={product.image_source} />
            </div>
            <div className="p-3">
              <div>
                <h3 className="font-weight-bold mb-0" style={{ fontFamily: 'Bahnschrift SemiCondensed' }}>
                  {product.product_name}
                </h3>
                <p className="text-muted ">{product.description}</p>
                <div className="d-flex align-items-center">
                  <div className="w-50">
                    {
                      (product.stock !== null && product.stock !== 0) ? (
                        <div className="text-warning font-weight-bold" style={{ fontFamily: 'Bahnschrift SemiCondensed' }}>
                          <del>
                            {convertPrice(product.price)}
                            <small className="text-muted">so'm</small>
                          </del>

                        </div>
                      ) : (<div style={{ marginTop: "27px" }}></div>)
                    }
                    <p className="text-primary font-weight-bold mb-0" style={{ fontFamily: 'Bahnschrift SemiCondensed' }}>
                      {
                        (product.stock !== null && product.stock !== 0) ?
                          convertPrice(parseInt(product.price) - (parseInt(product.price) * parseInt(product.stock) / 100)) :
                          (convertPrice(product.price))

                      }
                      <small className="text-muted">so'm</small>
                    </p>
                  </div>
                  <div className="w-50 d-flex justify-content-center">
                    {
                      authentification ? (
                        index >= 0 ? (
                          <div className="d-flex justify-content-center item-rounded" style={{ width: "90px", height: "36px", margin: "auto" }}>
                            <div className="d-flex align-items-center justify-content-center">
                              <Link className="item-pm" onClick={() => productMinus(product)} style={{ padding: "5px" }}><i className="mdi mdi-minus"></i></Link>
                            </div>
                            <div className="d-flex align-items-center justify-content-center" style={{ width: "26px" }}>
                              {items[index].quantity}
                            </div>
                            <div className="d-flex align-items-center justify-content-center">
                              <Link className="item-pm" onClick={() => productPlus(product)} style={{ padding: "5px" }}><i className="mdi mdi-plus"></i></Link>
                            </div>
                          </div>
                        ) : (
                          <Link className="btn btn-outline-primary btn-rounded" onClick={() => productPush(product)} style={{ width: "90px", padding: "10px" }}>
                            <i className="mdi mdi-basket pr-2"></i>
                            <span>Card</span>
                          </Link>
                        )
                      ) : null
                    }

                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )
    })
  }


  const counts = () => {

    let items = [];
    if (localStorage.getItem("Product-Item") !== null) {
      let json = localStorage.getItem("Product-Item");
      items = JSON.parse(json);
    }


    let totalPrice = 0;

    for (let i = 0; i < items.length; i++) {
      let price = 0;
      if (items[i].stock === null) {
        price = parseInt(items[i].price)
      } else {
        price = (parseInt(items[i].price) - (parseInt(items[i].price) * parseInt(items[i].stock) / 100)) * parseInt(items[i].quantity);
      }
      totalPrice = totalPrice + price;
    }


    return (
      <Link className="item-fixed nav-link" onClick={toggleUserItemsPanel} >
        <div className="w-100 h-100 p-1 items-border bg-primary text-white">
          <div className="w-100 h-item-price d-flex justify-content-center align-items-center">
            <i className="mdi mdi-basket-fill pr-1"></i> {items.length} items
          </div>
          <div className="w-100 h-item-price d-flex justify-content-center align-items-center">
            <div className="w-100 bg-white text-primary p-1 text-center price-radius" ><span>{convertPrice(totalPrice)}</span> <small className="text-muted">(so'm)</small></div>
          </div>
        </div>
      </Link>
    )
  }


  return (
    <div id="home">
      {
        authentification ? (counts()) : null
      }
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-home"></i>
          </span>
            Home
        </h3>
        <nav aria-label="breadcrumb">
          <ul className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              <span></span>Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
            </li>
          </ul>
        </nav>
      </div>
      <div>
        <div className="row p-3 p-sm-4 p-md-0">
          {
            renderProductById()
          }

          {boolPro ? (
            <div className="w-100 h-100">
              <div className="h-100 d-flex justify-content-center">
                <h3 className="text-center" style={{ fontWeight: "bold" }} >Kechirasiz, Hech qanday maxsulot topilmadi</h3>
              </div>
              <div className="h-100 d-flex justify-content-center pb-5">
                <img className="h-100" src={require("../../assets/images/sorry.svg")} alt="logo" />
              </div>
            </div>
          ) : null}

        </div>
      </div>
    </div>
  )

}

export default Home
