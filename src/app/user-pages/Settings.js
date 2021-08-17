import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useModal from 'react-hooks-use-modal';

import axios from 'axios';
import { toast } from 'react-toastify';


const Settings = () => {

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

    const [contactNumberMass, setContactNumberMass] = useState([]);

    const [plasticCardMass, setPlasticCardMass] = useState([]);


    const [picture, setPicture] = useState("");
    const [imgData, setImgData] = useState(null);
    const productPicture = useRef();

    const [getAddress, setAddress] = useState('');
    const [getContactNumber, setContactNumber] = useState('');
    const [getCard, setCard] = useState('');

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




    const [about, setAbout] = useState({});

    const fullname = useRef();
    const birthday = useRef();
    const [gender, setGender] = useState('');



    const onChangePicture = e => {

        if (e.target.files[0]) {
            setImgData(e.target.files[0]);
            let reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onloadend = function () {
                let base64data = reader.result;
                setPicture(base64data);
            }

            reader.addEventListener("load", () => {
                setImgData(reader.result);
            });
        } else {
            setImgData(null);
        }
    };

    useEffect(() => {
        axios.get(
            "/user/me",
            {
                headers: {
                    Authorization: localStorage.getItem("Online-Shopping Authorization")
                }
            }
        ).then(response => {
            setAbout(response.data);
            setAddressMass(response.data.addresses);
            setContactNumberMass(response.data.contacts);
            setPlasticCardMass(response.data.cards);
            fullname.current.value = response.data.fullname;
            birthday.current.value = response.data.birthday;
            setGender(response.data.gender);
            setImgData(response.data.user_image);
            productPicture.current.value = response.data.user_image;

            if (response.data.addresses.length > 0) {
                setAddress(response.data.addresses[0].address_id);
            }
            if (response.data.contacts.length > 0) {
                setContactNumber(response.data.contacts[0].contact_id);
            }
            if (response.data.cards.length > 0) {
                setCard(response.data.cards[0].card_id);
            }





        }).catch(err => {
            if (err.status === 403) {
                localStorage.removeItem("Online-Shopping Authorization");
                localStorage.removeItem("Online-Shopping User-Role");
            }
        });

    }, []);


    // U p d a t e   U s e r
    const updateUser = (e) => {
        e.preventDefault();

        axios.put(
            "/user",
            {
                fullname: fullname.current.value,
                birthday: birthday.current.value,
                gender: gender,
                image: picture !== '' ? picture : imgData,
            },
            {
                headers: {
                    Authorization: localStorage.getItem("Online-Shopping Authorization")
                }
            }
        ).then(response => {

            setAbout(response.data);
            fullname.current.value = response.data.fullname;
            birthday.current.value = response.data.birthday;
            // successAlert("Update User" + response.data.gender);
            // setGender(response.data.gender);

            // setImgData(response.data.user_image);
            // productPicture.current.value = response.data.user_image;
            successAlert("Update User");

        }).catch(err => {
            errorAlert(err.response.data.message);
        });
    }


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

    const successAlert = (message) => {
        toast.success(message,
            { position: toast.POSITION.TOP_RIGHT })
    }


    const errorAlert = (message) => {
        toast.error(message,
            { position: toast.POSITION.TOP_RIGHT })
    }



    const renderAddAddressModal = () => {

        return (
            <AddAddressModal className="bg-dark">
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
                <div className="col-12 col-sm-6 col-md-4 col-lg-3 p-2">
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


    const renderContactNumber = () => {

        return contactNumberMass.map(c => {

            return (
                <div className="col-12 col-sm-6 col-md-4 col-lg-3 p-2">
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
                <div className="col-12 col-sm-6 col-md-4 col-lg-3 p-2">
                    <div className={getCard === p.card_id ? 'check-plastic-card plastic-card-active' : 'check-plastic-card'} onClick={() => setCard(p.card_id)}>
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


    return (
        <div className="container pt-5">
            <div className="page-header pb-3">
                <h3 className="page-title">
                    <span className="page-title-icon bg-gradient-primary text-white mr-2">
                        <i className="mdi mdi-settings"></i>
                    </span>
                    Settings
                </h3>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>User Pages</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Settings</li>
                    </ol>
                </nav>
            </div>

            <div className="row mb-5">
                <div className="col-12 col-md-12 col-lg-12 flex-bottom">
                    <div id="settings-delivery-address" className="my-3 m-md-4 bg-white p-3 box-shadow">
                        <div className="d-flex justify-content-between p-0 pl-md-3">
                            <div className="d-flex align-items-center">
                                <div className="bg-primary d-flex align-items-center justify-content-center mr-2" style={{ minWidth: "30px", minHeight: "30px", borderRadius: "15px" }}>1</div>
                                <h5 className="m-0">User</h5>
                            </div>
                        </div>
                        <div className="row m-0 mt-3">
                            <div className="col-12 col-md-6 col-xl-5">
                                <div className="card h-100 p-0">
                                    <form className="forms-sample h-100">
                                        <div className="card-body h-100 p-0">
                                            <div className="d-flex justify-content-center align-items-center p-3" style={{ border: "1px solid rgb(240, 240, 240", borderRadius: "5px", height: "calc(100% - 83.6px)" }}>
                                                <img src={imgData} style={{ maxWidth: "100%", maxHeight: "100%" }} alt={about.fullname} />
                                            </div>
                                            <div className="form-group m-0 pt-3">
                                                <input className="form-control" type="file" ref={productPicture} onChange={onChangePicture} />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-xl-7">
                                <div className="card">
                                    <div className="card-body p-0">

                                        <form id="update-user">
                                            <div className="form-group">
                                                <label htmlFor="fullname">Fullname </label>
                                                <input className="form-control" type="text" ref={fullname} id="fullname" placeholder="Enter Fullname" size="lg" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="username">Username</label>
                                                <input className="form-control" type="text" className="form-control" id="username" placeholder="Enter Username" value={about.username} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="phone">Email</label>
                                                <input className="form-control" type="text" className="form-control" id="email" placeholder="Enter Email" value={about.email} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="birthday">Birthday</label>
                                                <input className="form-control" type="date" ref={birthday} className="form-control" id="birthday" placeholder="Phone" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputPassword1">Gender</label>
                                                <div className="row">
                                                    <div className="col-6 col-md-4">
                                                        <div className="form-check">
                                                            <label className="form-check-label">
                                                                <input type="radio" className="form-check-input" name="gender" onClick={() => setGender('MALE')} checked={gender === 'MALE' ? true : false} value="MALE" /> Male
                                                                <i className="input-helper"></i>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-5">
                                                        <div className="form-check">
                                                            <label className="form-check-label">
                                                                <input type="radio" className="form-check-input" name="gender" onClick={() => setGender('FEMALE')} checked={gender === 'FEMALE' ? true : false} value="FEMALE" /> Female
                                                                <i className="input-helper"></i>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <button className="btn btn-gradient-primary mr-2 w-100" onClick={updateUser} >Save</button>
                                            </div>

                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div id="settings-delivery-address" className="my-3 m-md-4 bg-white p-3 box-shadow">
                        <div className="d-flex justify-content-between p-0 pl-md-3">
                            <div className="d-flex align-items-center">
                                <div className="bg-primary d-flex align-items-center justify-content-center mr-2" style={{ minWidth: "30px", minHeight: "30px", borderRadius: "15px" }}>2</div>
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

                    <div id="settings-delivery-contact" className="my-3 m-md-4 bg-white p-3 box-shadow">
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

                    <div id="settings-payment-option" className="my-3 m-md-4 bg-white p-3 mb-5 box-shadow">
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
                    </div>
                </div>

                {renderAddAddressModal()}
                {renderUpdateAddressModal()}
                {renderContactModal()}
                {renderUpdateContactModal()}
                {renderCardModal()}
            </div>
        </div>
    )

}

export default Settings
