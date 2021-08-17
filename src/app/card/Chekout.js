import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import useModal from 'react-hooks-use-modal';
import axios from 'axios';
import { toast } from 'react-toastify';

const Chekout = () => {

    const [AddAddressModal, openAddAddress, closeAddAddress] = useModal('root', {
        preventScroll: true
    });
    const [UpdateAddressModal, openUpdateAddress, closeUpdateAddress] = useModal('root', {
        preventScroll: true
    });

    const [AddContactModal, openContact, closeContact] = useModal('root', {
        preventScroll: true
    });
    const [UpdateContactModal, openUpdateContact, closeUpdateContact] = useModal('root', {
        preventScroll: true
    });

    const [AddCardModal, openCard, closeCard] = useModal('root', {
        preventScroll: true
    });

    const [addressMass, setAddressMass] = useState([]);

    const [scheduleMass, setScheduleMass] = useState([]);

    const [contactNumberMass, setContactNumberMass] = useState([]);

    const [plasticCardMass, setPlasticCardMass] = useState([]);

    const [getAddress, setAddress] = useState('');
    const [getSchedule, setSchedule] = useState('');
    const [getContactNumber, setContactNumber] = useState('');
    const [getCard, setCard] = useState('');
    const [getVaucher, setVaucher] = useState(false);
    const [checkoutBool, setCheckoutBool] = useState(true);
    const [orderLengthBool, setOrderLengthBool] = useState(true);
    const [userOrders, setUserOrders] = useState({});
    const [userOrdersBool, setUserOrdersBool] = useState(true);
    const [vaucherVerify, setVaucherVerify] = useState(false);

    const [updateAddressValue, setUpdateAddressValue] = useState({
        id: 0,
        title: "",
        address: ""
    });

    const [updateContactValue, setUpdateContactValue] = useState({
        contact_id: 0,
        number: ""
    });

    const addAddresTitle = useRef();
    const addAddresText = useRef();

    const updateAddresTitle = useRef();
    const updateAddresText = useRef();

    const phonenumber = useRef();

    const cardNumber = useRef();
    const cardDate = useRef();

    const vaucherCode = useRef();


    useEffect(() => {

        let order = [];

        let OrderLengthBool = localStorage.getItem("Product-Item") !== null ? true : false;

        if (OrderLengthBool) {
            let json = localStorage.getItem("Product-Item");
            order = JSON.parse(json);
        }

        if (order.length > 0) {
            setOrderLengthBool(false);
        } else {
            setOrderLengthBool(true);
        }

        axios.get(
            "/user/me",
            {
                headers: {
                    Authorization: localStorage.getItem("Online-Shopping Authorization")
                }
            }
        ).then(response => {
            setAddress(response.data.addresses[0].address_id);
            setContactNumber(response.data.contacts[0].contact_id);
            setCard(response.data.cards[0].card_id);

            setAddressMass(response.data.addresses);
            setContactNumberMass(response.data.contacts);
            setPlasticCardMass(response.data.cards);
        }).catch(err => {
            if (err.status === 403) {
                localStorage.removeItem("Online-Shopping Authorization");
                localStorage.removeItem("Online-Shopping User-Role");
            }
        });

        axios.get(
            "/schedule",
            {
                headers: {
                    Authorization: localStorage.getItem("Online-Shopping Authorization")
                }
            }
        ).then(response => {
            setSchedule(response.data[0].schedule_id);
            setScheduleMass(response.data);
        }).catch(err => {
            errorAlert(err.message);
        });
    }, []);

    useEffect(() => {

        if (userOrders === null) {
            document.getElementById('delivery-address').classList.remove('border-danger');
        }

        if (getAddress !== '' && getSchedule !== '' && getContactNumber !== '') {
            if (getCard !== '' || vaucherVerify) {
                setCheckoutBool(false);
            } else {
                setCheckoutBool(true);
            }
        } else {
            setCheckoutBool(true);
        }
    }, [getAddress])

    useEffect(() => {

        if (userOrders === null) {
            document.getElementById('delivery-schedule').classList.remove('border-danger');
        }

        if (getAddress !== '' && getSchedule !== '' && getContactNumber !== '') {
            if (getCard !== '' || vaucherVerify) {
                setCheckoutBool(false);
            } else {
                setCheckoutBool(true);
            }
        } else {
            setCheckoutBool(true);
        }
    }, [getSchedule])

    useEffect(() => {

        if (userOrders === null) {
            document.getElementById('delivery-contact').classList.remove('border-danger');
        }

        if (getAddress !== '' && getSchedule !== '' && getContactNumber !== '') {
            if (getCard !== '' || vaucherVerify) {
                setCheckoutBool(false);
            } else {
                setCheckoutBool(true);
            }
        } else {
            setCheckoutBool(true);
        }
    }, [getContactNumber])

    useEffect(() => {

        if (userOrders === null) {
            document.getElementById('payment-option').classList.remove('border-danger');
        }

        if (getAddress !== '' && getSchedule !== '' && getContactNumber !== '' && getCard !== '') {
            setCheckoutBool(false);
        } else {
            setCheckoutBool(true);
        }
    }, [getCard])

    // S a v e   A d d r e s s
    const saveAddress = (e) => {
        e.preventDefault();

        if (addAddresTitle.current.value !== '' && addAddresText.current.value !== '') {
            let a = {
                title: addAddresTitle.current.value,
                address: addAddresText.current.value
            }

            axios.post(
                "/address",
                a,
                {
                    headers: {
                        Authorization: localStorage.getItem("Online-Shopping Authorization")
                    }
                }
            ).then(response => {
                setAddressMass(response.data.addresses);
                setContactNumberMass(response.data.contacts);
                setPlasticCardMass(response.data.cards);
                closeAddAddress();
            }).catch(err => {
                errorAlert(err.response.message);
            });

        } else {
            document.getElementById('add-address').classList.add('was-validated');
        }
    }

    // E d i t   A d d r e s s   O p e n   M o d a l
    const editAddressModalOpen = (a) => {
        let q = updateAddressValue;
        q.id = a.address_id;
        q.title = a.title;
        q.address = a.address;
        setUpdateAddressValue(q);
        openUpdateAddress();
    }

    // E d i t   A d d r e s s
    const editAddress = (e) => {
        e.preventDefault();

        if (updateAddresTitle.current.value !== '' && updateAddresText.current.value !== '') {
            let a = {
                title: updateAddresTitle.current.value,
                address: updateAddresText.current.value
            }

            axios.put(
                "/address/" + updateAddressValue.id,
                a,
                {
                    headers: {
                        Authorization: localStorage.getItem("Online-Shopping Authorization")
                    }
                }
            ).then(response => {
                setAddressMass(response.data.addresses);
                setContactNumberMass(response.data.contacts);
                setPlasticCardMass(response.data.cards);
                closeUpdateAddress();
            }).catch(err => {
                errorAlert(err.message);
            });
        } else {
            document.getElementById('edit-address').classList.add('was-validated');
        }
    }

    // D e l e t e   A d d r e s s
    const deleteAddress = (element) => {

        axios.delete(
            "/address/" + element.address_id,
            {
                headers: {
                    Authorization: localStorage.getItem("Online-Shopping Authorization")
                }
            }
        ).then(response => {
            setAddressMass(response.data.addresses);
            setContactNumberMass(response.data.contacts);
            setPlasticCardMass(response.data.cards);

            if (getAddress === element.address_id + '-' + element.address) {
                setAddress('');
            }

            closeUpdateAddress();
        }).catch(err => {
            errorAlert(err.message);
        });
    }




    // S a v e   C o n t a c t
    const saveContact = (e) => {
        e.preventDefault();

        if (phonenumber.current.value !== '') {
            let a = {
                contact: phonenumber.current.value
            }

            axios.post(
                "/contact",
                a,
                {
                    headers: {
                        Authorization: localStorage.getItem("Online-Shopping Authorization")
                    }
                }
            ).then(response => {
                setAddressMass(response.data.addresses);
                setContactNumberMass(response.data.contacts);
                setPlasticCardMass(response.data.cards);
                closeContact();
            }).catch(err => {
                errorAlert(err.response.message);
            });

        } else {
            document.getElementById('add-contact').classList.add('was-validated');
        }
    }

    // E d i t   C o n t a c t   O p e n   M o d a l
    const editContactModalOpen = (a) => {
        let contact = updateContactValue;
        contact.contact_id = a.contact_id;
        contact.number = a.contact;
        setUpdateContactValue(contact);
        openUpdateContact();
    }

    // E d i t   C o n t a c t
    const updateContact = (e) => {
        e.preventDefault();

        if (phonenumber.current.value !== '') {
            let a = {
                contact: phonenumber.current.value
            }

            axios.put(
                "/contact/" + updateContactValue.contact_id,
                a,
                {
                    headers: {
                        Authorization: localStorage.getItem("Online-Shopping Authorization")
                    }
                }
            ).then(response => {
                setAddressMass(response.data.addresses);
                setContactNumberMass(response.data.contacts);
                setPlasticCardMass(response.data.cards);
                closeUpdateContact();
            }).catch(err => {
                errorAlert(err.response.message);
            });

        } else {
            document.getElementById('update-contact').classList.add('was-validated');
        }
    }

    // D e l e t e   C o n t a c t
    const deleteContact = (element) => {

        axios.delete(
            "/contact/" + element.contact_id,
            {
                headers: {
                    Authorization: localStorage.getItem("Online-Shopping Authorization")
                }
            }
        ).then(response => {
            setAddressMass(response.data.addresses);
            setContactNumberMass(response.data.contacts);
            setPlasticCardMass(response.data.cards);

            if (getContactNumber === element.contact) {
                setContactNumber('');
            }

            closeUpdateAddress();
        }).catch(err => {
            errorAlert(err.message);
        });
    }


    // S a v e   C a r d
    const saveCard = (e) => {
        e.preventDefault();

        if (cardNumber.current.value !== '' && cardDate.current.value !== '') {
            let a = {
                card_number: cardNumber.current.value,
                card_date: cardDate.current.value
            }

            axios.post(
                "/card",
                a,
                {
                    headers: {
                        Authorization: localStorage.getItem("Online-Shopping Authorization")
                    }
                }
            ).then(response => {
                setAddressMass(response.data.addresses);
                setContactNumberMass(response.data.contacts);
                setPlasticCardMass(response.data.cards);
                closeCard();
            }).catch(err => {
                errorAlert(err.response.message);
            });

        } else {
            document.getElementById('add-address').classList.add('was-validated');
        }
    }

    // D e l e t e   C a r d
    const deleteCard = (element) => {

        axios.delete(
            "/card/" + element.card_id,
            {
                headers: {
                    Authorization: localStorage.getItem("Online-Shopping Authorization")
                }
            }
        ).then(response => {
            setAddressMass(response.data.addresses);
            setContactNumberMass(response.data.contacts);
            setPlasticCardMass(response.data.cards);

            if (getCard === element.card_id) {
                setCard('');
            }

            closeUpdateAddress();
        }).catch(err => {
            errorAlert(err.message);
        });
    }


    const getPrice = (order) => {

        if (order.stock === null) {
            return convertPrice(parseInt(order.price) * order.quantity);
        } else {
            return convertPrice((parseInt(order.price) - parseInt(order.price) * parseInt(order.stock) / 100) * order.quantity);
        }
    }

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



    const handleCheckout = (e) => {
        e.preventDefault();

        let bool = true;

        if (getAddress === null) {
            document.getElementById('delivery-address').classList.add('border-danger')
            bool = false;
        }

        if (getSchedule === '') {
            document.getElementById('delivery-schedule').classList.add('border-danger')
            bool = false;
        }

        if (getContactNumber === '') {
            document.getElementById('delivery-contact').classList.add('border-danger')
            bool = false;
        }

        if (getCard === '') {
            document.getElementById('payment-option').classList.add('border-danger')
            bool = false;
        }


        let order = [];

        let OrderLengthBool = localStorage.getItem("Product-Item") !== null ? true : false;

        if (OrderLengthBool) {
            let json = localStorage.getItem("Product-Item");
            order = JSON.parse(json);
        }

        if (order.length > 0) {

            let cartItems = [];
            for (let i = 0; i < order.length; i++) {
                cartItems.push({
                    product_id: order[i].product_id,
                    quantity: order[i].quantity
                })
            }

            if (bool) {
                axios.post(
                    "/order",
                    {
                        address_id: getAddress,
                        schedule: getSchedule,
                        contact_id: getContactNumber,
                        vaucher_code: getVaucher ? (vaucherCode.current.value) : null,
                        items: cartItems
                    },
                    {
                        headers: {
                            Authorization: localStorage.getItem("Online-Shopping Authorization")
                        }
                    }
                ).then(response => {
                    // alert("re: " + response.data)
                    setUserOrders(response.data);
                    setUserOrdersBool(false);
                    localStorage.removeItem('Product-Item')
                }).catch(err => {

                });
            }
        }
    }

    const handleSubmitVaucher = () => {
        setVaucher(true);
        setCard('');
    }

    const handleChangeVaucher = () => {
        if (vaucherCode.current.value.length === 10) {

            axios.post(
                "/vaucher/verify",
                {
                    vaucher_code: vaucherCode.current.value
                },
                {
                    headers: {
                        Authorization: localStorage.getItem("Online-Shopping Authorization")
                    }
                }
            ).then(response => {
                if (response.status === 200) {
                    setVaucherVerify(true);

                    if (getAddress !== '' && getSchedule !== '' && getContactNumber !== '') {
                        setCheckoutBool(false);
                    } else {
                        setCheckoutBool(true);
                    }
                }
            }).catch(err => {
                errorAlert(err.response.data.message);
            });
        } else {
            setVaucherVerify(false);
            setCheckoutBool(true);
        }
    }


    const errorAlert = (message) => {
        toast.error(message,
            { position: toast.POSITION.TOP_RIGHT })
    }


    const renderAddAddressModal = () => {

        return (
            <AddAddressModal>
                <div className="add-address-modal">
                    <div className="modal-header">
                        <h4 className="m-0">Add New Adress</h4>
                        <Link className="p-2" onClick={closeAddAddress}>
                            <span className="page-title-icon text-white">
                                <i className="mdi mdi-close"></i>
                            </span>
                        </Link>
                    </div>
                    <div className="modal-body">
                        <form id="add-address">
                            <div className="form-group mb-3">
                                <input id="address-title" className="form-control modal-input rounded" type="text" ref={addAddresTitle} required placeholder="Enter Title" />
                            </div>
                            <div className="form-group mb-3">
                                <textarea id="your-address" className="form-control rounded" ref={addAddresText} required style={{ height: "200px" }} placeholder="Enter Address" />
                            </div>
                            <div className="form-group mb-3">
                                <button className="btn btn-primary w-100" onClick={saveAddress}>Save Address</button>
                            </div>
                        </form>
                    </div>
                </div>
            </AddAddressModal>
        )
    }


    const renderUpdateAddressModal = () => {

        return (
            <UpdateAddressModal className="bg-dark">
                <div className="add-address-modal">
                    <div className="modal-header">
                        <h4 className="m-0">Edit Adress</h4>
                        <Link className="p-2" onClick={closeUpdateAddress}>
                            <span className="page-title-icon text-white">
                                <i className="mdi mdi-close"></i>
                            </span>
                        </Link>
                    </div>
                    <div className="modal-body">
                        <form id="edit-address">
                            <div className="form-group mb-3">
                                <input id="edit-address-title" className="form-control modal-input rounded" type="text" ref={updateAddresTitle} required placeholder={updateAddressValue.title} />
                            </div>
                            <div className="form-group mb-3">
                                <textarea id="edit-your-address" className="form-control rounded" type="text" ref={updateAddresText} required style={{ height: "200px" }} placeholder={updateAddressValue.address} />
                            </div>
                            <div className="form-group mb-3">
                                <button className="btn btn-primary w-100" onClick={editAddress}>Save Address</button>
                            </div>
                        </form>
                    </div>
                </div>
            </UpdateAddressModal>
        )
    }


    const renderContactModal = () => {

        return (
            <AddContactModal>
                <div className="add-address-modal">
                    <div className="modal-header">
                        <h4 className="m-0">Add New Contact</h4>
                        <Link className="p-2" onClick={closeContact}>
                            <span className="page-title-icon text-white">
                                <i className="mdi mdi-close"></i>
                            </span>
                        </Link>
                    </div>
                    <div className="modal-body">
                        <form id="add-contact">
                            <div className="form-group mb-3">
                                <input id="contact" className="form-control modal-input rounded" type="text" ref={phonenumber} required placeholder="Enter a phone number" />
                            </div>
                            <div className="form-group mb-3">
                                <button className="btn btn-primary w-100" onClick={saveContact}>Save Contact</button>
                            </div>
                        </form>
                    </div>
                </div>
            </AddContactModal>
        )
    }


    const renderUpdateContactModal = () => {

        return (
            <UpdateContactModal>
                <div className="add-address-modal">
                    <div className="modal-header">
                        <h4 className="m-0">Edit Contact</h4>
                        <Link className="p-2" onClick={closeUpdateContact}>
                            <span className="page-title-icon text-white">
                                <i className="mdi mdi-close"></i>
                            </span>
                        </Link>
                    </div>
                    <div className="modal-body">
                        <form id="add-contact">
                            <div className="form-group mb-3">
                                <input id="contact" className="form-control modal-input rounded" type="text" ref={phonenumber} required placeholder={updateContactValue.number} />
                            </div>
                            <div className="form-group mb-3">
                                <button className="btn btn-primary w-100" onClick={updateContact}>Save Contact</button>
                            </div>
                        </form>
                    </div>
                </div>
            </UpdateContactModal>
        )
    }


    const renderCardModal = () => {

        return (
            <AddCardModal className="bg-dark">
                <div className="add-address-modal">
                    <div className="modal-header">
                        <h4 className="m-0">Add New Card</h4>
                        <Link className="p-2" onClick={closeCard}>
                            <span className="page-title-icon text-white">
                                <i className="mdi mdi-close"></i>
                            </span>
                        </Link>
                    </div>
                    <div className="modal-body">
                        <form id="add-address">
                            <div className="form-group mb-3">
                                <input id="card_number" className="form-control modal-input rounded" type="text" ref={cardNumber} required placeholder="Enter Card Numbar" />
                            </div>
                            <div className="form-group mb-3">
                                <input id="card_date" className="form-control rounded" ref={cardDate} required placeholder="Enter Card Date" />
                            </div>
                            <div className="form-group mb-3">
                                <button className="btn btn-primary w-100" onClick={saveCard}>Save Card</button>
                            </div>
                        </form>
                    </div>
                </div>
            </AddCardModal>
        )
    }



    const renderAddress = () => {

        return addressMass.map(a => {

            return (
                <div className="col-12 col-sm-6 col-md-4 p-2">
                    <div className={getAddress === a.address_id ? 'check-card card-active' : 'check-card'} onClick={() => setAddress(a.address_id)}>
                        <span className="title">{a.title}</span>
                        <span className="text">{a.address}</span>
                        <span className="edit-delete">
                            <Link className="mr-1" onClick={() => editAddressModalOpen(a)}>
                                <span className="bg-primary text-white" style={{ borderRadius: "50%", fontSize: "12px", padding: "3px" }}>
                                    <i className="mdi mdi-pencil"></i>
                                </span>
                            </Link>
                            <Link onClick={() => deleteAddress(a)}>
                                <span className="bg-danger text-white" style={{ borderRadius: "50%", fontSize: "12px", padding: "3px" }} >
                                    <i className="mdi mdi-close"></i>
                                </span>
                            </Link>
                        </span>
                    </div>
                </div>
            )
        })
    }


    const renderSchedule = () => {

        return scheduleMass.map(s => {

            return (
                <div className="col-12 col-sm-6 col-md-4 p-2">
                    <div className={getSchedule === s.schedule_id ? 'check-card card-active' : 'check-card'} onClick={() => setSchedule(s.schedule_id)}>
                        <span className="title">{s.type}</span>
                        <span className="text">{s.schedule_time}</span>
                    </div>
                </div>
            )
        })
    }


    const renderContactNumber = () => {

        return contactNumberMass.map(c => {

            return (
                <div className="col-12 col-sm-6 col-md-4 p-2">
                    <div className={getContactNumber === c.contact_id ? 'check-card card-active' : 'check-card'} onClick={() => setContactNumber(c.contact_id)} >
                        <span className="title">
                            {getContactNumber === c.contact_id ? 'Primary' : 'Secondary'}
                        </span>
                        <span className="text">{c.contact}</span>
                        <span className="edit-delete">
                            <Link className="mr-1" onClick={() => editContactModalOpen(c)}>
                                <span className="bg-primary text-white" style={{ borderRadius: "50%", fontSize: "12px", padding: "3px" }}>
                                    <i className="mdi mdi-pencil"></i>
                                </span>
                            </Link>
                            <Link onClick={() => deleteContact(c)}>
                                <span className="bg-danger text-white" style={{ borderRadius: "50%", fontSize: "12px", padding: "3px" }} >
                                    <i className="mdi mdi-close"></i>
                                </span>
                            </Link>
                        </span>
                    </div>
                </div>
            )
        })
    }


    const renderPlasticCard = () => {

        return plasticCardMass.map(p => {

            return (
                <div className="col-12 col-sm-6 col-md-4 p-2">
                    <div className={getCard === p.card_id ? 'check-plastic-card plastic-card-active' : 'check-plastic-card'} onClick={() => { setCard(p.card_id); setVaucher(false) }}>
                        <span className="title text-primary">Default Bank</span>
                        <span className="card-number">Card Number</span>
                        <span className="number d-flex justify-content-between">
                            <span>****</span>
                            <span>****</span>
                            <span>****</span>
                            <span>{p.card_number_4}</span>
                        </span>
                        <span className="name">Default Name</span>
                        <span className="edit-delete">
                            <Link onClick={() => deleteCard(p)}>
                                <span className="bg-danger text-white" style={{ borderRadius: "50%", fontSize: "12px", padding: "3px" }} >
                                    <i className="mdi mdi-close"></i>
                                </span>
                            </Link>
                        </span>
                    </div>
                </div>
            )
        })
    }


    const renderOrder = () => {

        let order = [];

        let bool = localStorage.getItem("Product-Item") !== null ? true : false;
        let totalPrice = 0;

        if (bool) {
            let json = localStorage.getItem("Product-Item");
            order = JSON.parse(json);

            for (let i = 0; i < order.length; i++) {
                let price = 0;
                if (order[i].stock === null) {
                    price = parseInt(order[i].price)
                } else {
                    price = (parseInt(order[i].price) - (parseInt(order[i].price) * parseInt(order[i].stock) / 100)) * parseInt(order[i].quantity);
                }
                totalPrice = totalPrice + price;
            }
        }

        return (
            <div>
                {
                    bool ?
                        order.map(o => {
                            return (
                                <div className="d-flex my-2">
                                    <span className="font-weight-bold text-black">{o.quantity}</span>
                                    <span className="mx-3">x</span>
                                    <span className="mr-2">{o.product_name} {o.description !== "" ? (" | " + o.description) : null}</span>
                                    <span style={{ marginLeft: "auto" }}>{getPrice(o)} <small>(so'm)</small></span>
                                </div>
                            )
                        }) : null
                }
                <hr className="my-4" />
                <div className="d-flex justify-content-between">
                    <span>Sub Total</span>
                    <span>{convertPrice(totalPrice)} <small>(so'm)</small></span>
                </div>
            </div>
        )
    }



    return (
        <div className="container pt-5">

            {
                userOrdersBool ? (
                    <div>
                        <div className="page-header pb-3">
                            <h3 className="page-title">
                                <span className="page-title-icon bg-gradient-primary text-white mr-2">
                                    <i className="mdi mdi-cart"></i>
                                </span>
                                Chekout
                            </h3>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Card</a></li>
                                    <li className="breadcrumb-item active" aria-current="page">Chekout</li>
                                </ol>
                            </nav>
                        </div>
                        <div className="row">
                            <div className="col-12 col-md-12 col-lg-8 flex-bottom">
                                <div id="delivery-address" className="my-3 m-md-4 bg-white p-3 box-shadow">
                                    <div className="d-flex justify-content-between p-0 pl-md-3">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-primary d-flex align-items-center justify-content-center mr-2" style={{ minWidth: "30px", minHeight: "30px", borderRadius: "15px" }}>1</div>
                                            <h5 className="m-0">Delivery Address</h5>
                                        </div>
                                        <div>
                                            <Link className="nav-link text-primary" onClick={openAddAddress}>
                                                <small><i className="mdi mdi-plus"></i> Add Address</small>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="row m-0 mt-3 p-2">
                                        {renderAddress()}
                                    </div>
                                </div>

                                <div id="delivery-schedule" className="my-3 m-md-4 bg-white p-3 box-shadow">
                                    <div className="d-flex justify-content-start p-0 pl-md-3">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-primary d-flex align-items-center justify-content-center mr-2" style={{ minWidth: "30px", minHeight: "30px", borderRadius: "15px" }}>2</div>
                                            <h5 className="m-0">Delivery Schedule</h5>
                                        </div>
                                    </div>
                                    <div className="row m-0 mt-3 p-2">
                                        {renderSchedule()}
                                    </div>
                                </div>

                                <div id="delivery-contact" className="my-3 m-md-4 bg-white p-3 box-shadow">
                                    <div className="d-flex justify-content-between p-0 pl-md-3">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-primary d-flex align-items-center justify-content-center mr-2" style={{ minWidth: "30px", minHeight: "30px", borderRadius: "15px" }}>3</div>
                                            <h5 className="m-0">Contact Number</h5>
                                        </div>
                                        <div>
                                            <Link className="nav-link text-primary" onClick={openContact}>
                                                <small><i className="mdi mdi-plus"></i> Add Contact</small>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="row m-0 mt-3 p-2">
                                        {renderContactNumber()}
                                    </div>
                                </div>

                                <div id="payment-option" className="my-3 m-md-4 bg-white p-3 mb-5 box-shadow">
                                    <div className="d-flex justify-content-between p-0 pl-md-3">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-primary d-flex align-items-center justify-content-center mr-2" style={{ minWidth: "30px", minHeight: "30px", borderRadius: "15px" }}>4</div>
                                            <h5 className="m-0">Payment Option</h5>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between p-0 pl-md-3 pt-3">
                                        <div className="d-flex align-items-center">
                                            <small className="m-0 text-primary">Save Cards</small>
                                        </div>
                                        <div>
                                            <Link className="nav-link text-primary" onClick={openCard}>
                                                <small><i className="mdi mdi-plus"></i> Add Card</small>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="row m-0 mt-3 p-2">
                                        {renderPlasticCard()}
                                    </div>

                                    <div className="pt-4">
                                        {
                                            !getVaucher ? (
                                                <Link className="nav-link text-primary" onClick={() => handleSubmitVaucher()}>Do you have a voucher?</Link>
                                            ) : (
                                                <div className="row m-0">
                                                    <div className="col-8 col-md-8 pr-0 pl-3">
                                                        <input className="form-control" ref={vaucherCode} onChange={() => handleChangeVaucher()} name="vaucher" type="text" placeholder="Enter your vaucher code" />
                                                    </div>
                                                    <div className="col-4 col-md-4 pl-0 pl-sm-4">
                                                        <button className="btn btn-primary px-3 px-md-4 px-lg-5">Apply</button>
                                                    </div>

                                                </div>
                                            )
                                        }

                                    </div>
                                    <div className="w-100 p-3 mt-4">
                                        <small>
                                            By making this purchase you agree to our
                                        <span className="text-danger" style={{ cursor: "pointer" }}> terms and conditions.</span>
                                        </small>
                                    </div>
                                    <div className="w-100 p-3 pt-2">
                                        <button className="btn btn-primary w-100" disabled={checkoutBool || orderLengthBool} onClick={handleCheckout}>Proceed to Checkout</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-12 col-lg-4 flex-top">
                                <div className="my-3 m-md-4 p-3">
                                    <h4 className="font-weight-bold text-center mb-3">Your Order</h4>
                                    {renderOrder()}
                                </div>
                            </div>
                        </div>
                        {renderAddAddressModal()}
                        {renderUpdateAddressModal()}
                        {renderContactModal()}
                        {renderUpdateContactModal()}
                        {renderCardModal()}
                    </div>
                ) : (
                    <div className="bg-white p-3 box-shadow rounded mb-5">
                        <div className="d-flex justify-content-end">
                            <Link className="btn btn-outline-primary border-light p-2 p-md-3 px-md-4" to="/" >Back to home</Link>
                        </div>
                        <div className="p-0 p-lg-4 pt-1">
                            <div>
                                <h2>Order Received</h2>
                                <p>Thank you. Your order has been received</p>
                            </div>
                            <div className="row m-0">
                                <div className="col-12 col-md-4 p-0 border-md-right my-1">
                                    <p className="font-weight-bold mb-0">Order Number</p>
                                    <p className="m-0">{userOrders.order_id}</p>
                                </div>
                                <div className="col-12 col-md-4 p-0 pl-lg-3 border-md-right my-1">
                                    <p className="font-weight-bold mb-0">Date</p>
                                    <p className="m-0">{userOrders.order_date}</p>
                                </div>
                                <div className="col-12 col-md-4 p-0 pl-lg-3 my-1">
                                    <p className="font-weight-bold mb-0">Total</p>
                                    <p className="m-0">{convertPrice(userOrders.total)} <small className="text-muted">(so'm)</small></p>
                                </div>
                            </div>
                        </div>

                        <div className="p-0 pt-4 p-lg-4">
                            <div>
                                <h2>Order Details</h2>
                            </div>
                            <div>
                                <div className="d-flex">
                                    <div className="details">
                                        <p className="d-flex font-weight-bold after-two-points">
                                            Total Item
                                        </p>
                                    </div>
                                    <div className="pl-3 pl-lg-5">
                                        <p>{userOrders.items_length} Items</p>
                                    </div>
                                </div>
                                <div className="d-flex">
                                    <div className="details">
                                        <p className="d-flex font-weight-bold after-two-points">
                                            Order-time
                                        </p>
                                    </div>
                                    <div className="pl-3 pl-lg-5">
                                        <p>{userOrders.order_date
                                        }</p>
                                    </div>
                                </div>
                                <div className="d-flex">
                                    <div className="details">
                                        <p className="d-flex font-weight-bold after-two-points">
                                            Delivery Time
                                        </p>
                                    </div>
                                    <div className="pl-3 pl-lg-5">
                                        <p>{userOrders.delivery_time}</p>
                                    </div>
                                </div>
                                <div className="d-flex">
                                    <div className="details">
                                        <p className="d-flex font-weight-bold after-two-points">
                                            Delivery Location
                                        </p>
                                    </div>
                                    <div className="pl-3 pl-lg-5">
                                        <p>{userOrders.location}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-0 pt-4 p-lg-4">
                            <div>
                                <h2>Total Amount</h2>
                            </div>
                            {
                                userOrders.vaucher ? (
                                    <div><h2>Vaucher</h2></div>
                                ) : (
                                    <div>
                                        <div className="d-flex">
                                            <div className="details">
                                                <p className="d-flex font-weight-bold after-two-points">
                                                    Sub Total
                                        </p>
                                            </div>
                                            <div className="pl-3 pl-lg-5">
                                                <p>{convertPrice(userOrders.total)} <small className="text-muted">(so'm)</small></p>
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <div className="details">
                                                <p className="d-flex font-weight-bold after-two-points">
                                                    Payment Method
                                        </p>
                                            </div>
                                            <div className="pl-3 pl-lg-5">
                                                <p>Cash On Delivery</p>
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <div className="details">
                                                <p className="d-flex font-weight-bold after-two-points">
                                                    Cash on delivery
                                        </p>
                                            </div>
                                            <div className="pl-3 pl-lg-5">
                                                <p>10%</p>
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <div className="details">
                                                <p className="d-flex font-weight-bold after-two-points">
                                                    Total
                                        </p>
                                            </div>
                                            <div className="pl-3 pl-lg-5">
                                                <p>{convertPrice(userOrders.total / 10)} <small className="text-muted">(so'm)</small></p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                        </div>


                    </div>
                )
            }

        </div>
    )

}

export default Chekout