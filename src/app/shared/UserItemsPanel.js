import React from 'react'
import { Link } from 'react-router-dom';

const UserItemsPanel = () => {

    const closeRightSidebar = () => {
        document.getElementById('user-items-panel').classList.remove('open');
    }



    const itemPlus = (item) => {

        let items = [];
        let json = localStorage.getItem("Product-Item")
        items = JSON.parse(json);

        for (let i = 0; i < items.length; i++) {
            if (item.product_id === items[i].product_id) {
                items[i].quantity++;
                localStorage.setItem("Product-Item", JSON.stringify(items));
            }
        }
    }

    const itemMinus = (item) => {

        let items = [];
        let json = localStorage.getItem("Product-Item")
        items = JSON.parse(json);

        if (parseInt(item.quantity) > 1) {
            for (let i = 0; i < items.length; i++) {
                if (item.product_id === items[i].product_id) {
                    items[i].quantity--;
                    localStorage.setItem("Product-Item", JSON.stringify(items));
                }
            }
        } else {
            itemDeleted(item);
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


    const corvertPrice = (amount) => {
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

    const renderTotalPrice = () => {
        let items = [];

        if (localStorage.getItem("Product-Item") !== null) {
            let json = localStorage.getItem("Product-Item")
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
        return totalPrice;
    }


    const renderProductItems = () => {

        let items = [];

        if (localStorage.getItem("Product-Item") !== null) {
            let json = localStorage.getItem("Product-Item")
            items = JSON.parse(json);
        }

        if (items.length > 0) {

            return items.map(item => {
                let price = 0;
                let totalPrice = 0;
                if (item.stock === null) {
                    price = parseInt(item.price);
                } else {
                    price = parseInt(item.price) - parseInt(item.price) * parseInt(item.stock) / 100;
                }

                totalPrice = price * parseInt(item.quantity);
                return (
                    <div className="item d-flex justify-content-between">
                        <div className="d-flex">
                            <div className="items-plus-minus">
                                <div className="d-flex text-center">
                                    <Link className="item-pm" onClick={() => itemPlus(item)} style={{ padding: "5px" }}>
                                        <i className="mdi mdi-plus"></i>
                                    </Link>
                                </div>
                                <div className="item-price">{item.quantity}</div>
                                <div className="d-flex text-center">
                                    <Link className="item-pm" onClick={() => itemMinus(item)} style={{ padding: "5px" }}>
                                        <i className="mdi mdi-minus"></i>
                                    </Link>
                                </div>
                            </div>
                            <div className="h-100 d-flex align-items-center pr-2 pr-md-3 pl-md-1">
                                <img className="item-image" src={item.image_source} alt="img" style={{ borderRadius: "50%" }}></img>
                            </div>
                            <div className="h-100 d-flex align-items-center pr-2">
                                <div>
                                    <h4>{item.product_name}</h4>
                                    <div>
                                        <h4 className="text-primary m-0" style={{ fontFamily: 'Bahnschrift SemiCondensed' }}>{price}</h4>
                                        <small className="text-muted">(so'm)</small>
                                    </div>
                                    <p className="m-0">
                                        {item.quantity + " x 1kg"}</p>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="mr-2 mr-lg-3">
                                <h4 className="m-0" style={{ fontFamily: 'Bahnschrift SemiCondensed' }}>{totalPrice}</h4>
                                <p className="">(so'm)</p>
                            </div>
                            <div className="mr-3">
                                <Link onClick={() => itemDeleted(item)}>
                                    <i className="mdi mdi-close icon-hover"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                )
            })
        } else {
            return (
                <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                    <img style={{maxWidth: "200px", maxHeight: "180px"}} src={require("../../assets/images/sorry.svg")} alt="logo" />
                </div>
            )
        }

        // return JSON.parse(localStorage.getItem("product-items")).map(item => {
        //     return (

        //     )
        // })
    }


    return (


        <div>
            {/* <div id="settings-trigger"><i className="mdi mdi-settings"></i></div> */}
            <div id="user-items-panel" className="settings-panel">
                <i className="settings-close mdi mdi-close" onClick={closeRightSidebar}></i>
                <div className="w-100 bg-primary text-white px-3 px-md-5 d-flex align-items-center" style={{ height: "50px" }}>
                    <div className="d-flex justify-content-center align-items-center bg-white rounded mr-3" style={{ width: "30px", height: "30px" }}>
                        <i className="mdi mdi-cart text-primary"></i>
                    </div>
                    <div>
                        {
                            localStorage.getItem("Product-Item") !== null ? (JSON.parse(localStorage.getItem("Product-Item")).length) : (0) + " "
                        } 
                        Items
                    </div>
                </div>
                <div className="items-body scroll">

                    {
                        renderProductItems()
                    }

                </div>
                <div className="items-footer">
                    <Link className="nav-link" to="/cart/chekout">
                        <div className="checkout bg-primary">
                            <div className="checkout-text text-white">
                                <h6 className="m-0">Checkout</h6>
                            </div>
                            <div className="checkout-price">
                                <h5 className="m-0 text-primary">
                                    {corvertPrice(renderTotalPrice())}
                                    <small className="text-muted">(so'm)</small>
                                </h5>
                            </div>
                        </div>
                    </Link>

                    <div className="comment">
                        <p>Press the checkout button to place an order</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserItemsPanel