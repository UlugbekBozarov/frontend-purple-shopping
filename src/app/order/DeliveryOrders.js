import React, { useEffect, useState } from 'react';
import { Collapse } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const DeliveryOrders = () => {

    const [ordersCollapse, setOrdersCollapse] = useState([]);
    const [oldCollapseIndes, setOldCollapseIndes] = useState(-1);
    const [orders, setorders] = useState([]);

    useEffect(() => {
        axios.get(
            "/order/delivery",
            {
                headers: {
                    Authorization: localStorage.getItem("Online-Shopping Authorization")
                }
            }
        ).then(response => {
            setorders(response.data);
            let bool = [];
            for (let i = 0; i < response.data.length; i++) {
                bool.push(false);
            }
            setOrdersCollapse(bool);
        }).catch(err => {
            errorAlert(err.response.data.message);
        });
    }, []);


    const updateCollapse = (index) => () => {
        let bool = [...ordersCollapse];

        if (oldCollapseIndes !== -1) {
            bool[oldCollapseIndes] = false;
        }

        if (bool[index] === false) {
            setOldCollapseIndes(index);
        }

        bool[index] = !ordersCollapse[index];
        setOrdersCollapse(bool);
    }


    const getDateFormat = (date) => {
        let a = new Date(date) + " ";
        let b = a.substring(0, 16);
        return b;
    }

    const getTimeFormat = (date) => {
        let a = new Date(date) + " ";
        let b = a.substring(16, 25);
        return b;
    }


    const errorAlert = (message) => {
        toast.error(message,
            { position: toast.POSITION.TOP_RIGHT })
    }


    const renderDeliveryOrders = () => {
        let index = 0;
        return orders.map(order => {
            index++;
            return (
                <li onClick={updateCollapse(index - 1)}>
                    <div className={ordersCollapse[index - 1] ? 'li-order menu-expanded' : 'li-order'}>
                        <div style={{ width: "100px" }}>
                            <img className="w-100 h-100 rounded-circle" src={order.user.user_image} alt="user-image" />
                        </div>
                        <div className="h-100 d-flex justify-content-center text-primary pl-3" style={{ minWidth: "200px" }}>
                            <div>
                                <h4>{order.user.fullname !== null ? (order.user.fullname) : (order.user.username)}</h4>
                                {renderUserPhone(order.user.contacts)}
                            </div>
                        </div>
                        <div className="pl-3" style={{ width: "400px" }}>
                            <h4 className="text-primary">{order.schedule.type}</h4>
                            <p className="m-0">{order.schedule.schedule_time}</p>
                            <p className="m-0">
                                <i className="mdi mdi-map-marker text-danger"></i>
                                <span className="font-weight-bold text-primary">{order.address.title + ': '}</span>
                                {order.address.address}
                            </p>
                        </div>
                        <div className="d-flex justify-content-center pl-3" style={{ minWidth: "200px" }}>
                            <div>
                                <h4 className="text-primary">Main phone: </h4>
                                <h5 className="">
                                    <i className="mdi mdi-phone text-primary"></i>
                                    <a href="!#" className="text-muted pl-2" onClick={(e) => e.preventDefault()}>{order.contact.contact}</a>
                                </h5>
                            </div>
                        </div>
                        <div className="pl-3" style={{ width: "160px" }}>
                            <h4 className="text-primary">Ordered time: </h4>
                            <p className="m-0">
                                {getDateFormat(order.time_of_ordening)}
                            </p>
                            <p className="m-0">
                                <i className="mdi mdi-alarm text-primary pr-2"></i>
                                {getTimeFormat(order.time_of_ordening)}
                            </p>
                        </div>
                        <div className="pl-3" style={{ width: "150px" }}>
                            <h4 className="text-primary">Left time: </h4>
                            <h5>
                                <i className="mdi mdi-alarm text-primary pr-2"></i>
                                {getTimeFormat(order.time_of_ordening)}
                            </h5>
                        </div>
                        <div className="h-100 d-flex align-items-center" style={{ height: "100px" }}>
                            <div className="menu-arrow">
                                <i className="mdi mdi-chevron-left p-4"></i>
                            </div>
                        </div>
                    </div>
                    <Collapse className="w-100 mx-3 px-3 mb-3" in={ordersCollapse[index - 1]}>
                        <div className="border border-primary border-top-0">
                            <div className="d-flex justify-content-between text-muted">
                                <div>
                                    <i className="mdi mdi-arrow-right pr-4"></i>
                                    <span>{order.orderItems.length} Items</span>
                                </div>
                                <div>
                                    <span>Order Id: </span>
                                    <span className="text-primary">{order.order_id}</span>
                                </div>
                            </div>
                            <div>
                                <table className="table table-striped mb-3">
                                    <thead>
                                        <tr>
                                            <th>№</th>
                                            <th>Product Id</th>
                                            <th>Product name</th>
                                            <th>Count</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderItemsTable(order.orderItems)}
                                        <tr>
                                            <td colspan="2">
                                                <h4 className="py-2">
                                                    Total Price:
                                                </h4>
                                            </td>
                                            <td className="text-primary" colspan="3">
                                                <h4 className="py-2">
                                                    {order.grant_total}
                                                    <small className="text-muted">(so'm)</small>
                                                </h4>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            {/* <div className="nav-item"> <Link className={'nav-link active'} >Categoryyyyy</Link></div> */}
                        </div>
                    </Collapse>
                </li>
            )
        })
    }


    const renderUserPhone = (contacts) => {
        return contacts.map(contact => {
            return (
                <p className="m-0">
                    <i className="mdi mdi-phone text-primary"></i>
                    <a href="!#" className="pl-2" onClick={(e) => e.preventDefault()} style={{ color: "#9e9da0" }}>{contact.contact}</a>
                </p>
            )
        })

    }


    const renderItemsTable = (items) => {
        let i = 0;
        return items.map(item => {
            i++;
            return (
                <tr>
                    <td>{i}</td>
                    <td>{item.products.product_id}</td>
                    <td>{item.products.product_name}</td>
                    <td>{item.count}</td>
                    <td>{item.total_price} <small className="">(so'm)</small></td>
                </tr>
            )
        })
    }


    return (
        <div>
            <div className="page-header">
                <h3 className="page-title">
                    <span className="page-title-icon bg-gradient-primary text-white mr-2">
                        <i className="mdi mdi mdi-cart"></i>
                    </span>
                    Orders
                </h3>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Orders</a></li>
                        <li className="breadcrumb-item active" aria-current="page">New Order</li>
                    </ol>
                </nav>
            </div>

            <div className="bg-white box-shadow p-2 p-md-3">

                <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                        <div className="bg-primary d-flex align-items-center justify-content-center mr-2" style={{ minWidth: "30px", minHeight: "30px", borderRadius: "15px" }}>2</div>
                        <h5 className="m-0">Delivery Orders</h5>
                    </div>
                    {/* <div>
                        <Link className="nav-link text-primary">
                            <small><i className="mdi mdi-plus"></i> Add Category</small>
                        </Link>
                    </div> */}
                </div>

                {
                    orders.length > 0 ? (
                        <div className="mt-4 scroll" >
                            <ul className="p-2" style={{ minWidth: "1200px" }}>
                                {renderDeliveryOrders()}
                            </ul>
                        </div>
                    ) : (
                        <div className="w-100 d-flex justify-content-center py-5">
                            <img className="w-75" src={require("../../assets/images/sorry.svg")} alt="logo" />
                        </div>
                    )
                }



            </div>
        </div>
    )
}

export default DeliveryOrders