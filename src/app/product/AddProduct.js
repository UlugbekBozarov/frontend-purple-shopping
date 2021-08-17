import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddProduct = () => {

    const [categories, setCategories] = useState([]);
    const [productImage, setProductImage] = useState('');
    const [wasValidated, setWasValidated] = useState('');


    const productName = useRef();
    const category = useRef();
    const productStock = useRef();
    const productPrice = useRef();
    const productDescription = useRef();


    useEffect(() => {
        axios.get(
            "/category/asc"
        ).then(json => {
            setCategories(json.data);
        }).catch((err) => {
            errorAlert(err.message);
        });
    }, []);


    const onChangePicture = e => {

        if (e.target.files[0]) {
            let reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onloadend = function () {
                let base64data = reader.result;
                setProductImage(base64data);
            }
        } else {
            setProductImage('');
        }
    };


    const saveNewProduct = (e) => {
        e.preventDefault();

        let p_name = productName.current.value;
        let p_category = category.current.value;
        let p_stock = productStock.current.value;
        let p_price = productPrice.current.value;
        let p_description = productDescription.current.value;

        if (p_name !== '' && p_category !== '' && p_price !== '' && productImage !== '') {
            axios.post(
                "/product",
                {
                    product_name: p_name,
                    category_id: p_category,
                    stock: p_stock !== '' ? p_stock : 0,
                    price: p_price,
                    description: p_description,
                    image_source: productImage
                },
                {
                    headers: {
                        Authorization: localStorage.getItem("Online-Shopping Authorization")
                    }
                }
            ).then(response => {
                successfulAlert(response.data.message);
                setWasValidated('');

                productName.current.value = '';
                category.current.value = '';
                productStock.current.value = '';
                productPrice.current.value = '';
                productDescription.current.value = '';
                setProductImage('');
            }).catch((err) => {
                errorAlert(err.message);
            })
        } else {
            errorAlert("Ma'lumotlarni to'ldiring");
            setWasValidated('was-validated');
        }
    }


    const successfulAlert = (message) => {
        toast.success(message,
            { position: toast.POSITION.TOP_RIGHT })
    }


    const errorAlert = (message) => {

        toast.error(message,
            { position: toast.POSITION.TOP_RIGHT })
    }


    const renderCategoryOption = () => {

        return categories.map(category => {
            return (
                <option value={category.id}>{category.type}</option>
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
                    Products
                </h3>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Products</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Add Product</li>
                    </ol>
                </nav>
            </div>

            <div className="bg-white box-shadow p-2 p-md-3">

                <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                        <div className="bg-primary d-flex align-items-center justify-content-center mr-2" style={{ minWidth: "30px", minHeight: "30px", borderRadius: "15px" }}>2</div>
                        <h5 className="m-0">Add New Product</h5>
                    </div>
                    {/* <div>
                        <Link className="nav-link text-primary">
                            <small><i className="mdi mdi-plus"></i> Add Category</small>
                        </Link>
                    </div> */}
                </div>

                <div>
                    <form id="add-new-product" className="pt-5 pb-3">
                        <div className="row m-0">
                            <div className="col-12 col-sm-12 col-md-6">
                                <div className={wasValidated + " form-group"}>
                                    <label for="product-name" >Product Name</label>
                                    <input id="product-name" className="form-control" type="text" ref={productName} placeholder="Enter product name" required />
                                </div>
                                <div className={wasValidated + " form-group"}>
                                    <label for="catefory" >Category</label>
                                    <select id="category" className="form-control" type="text" ref={category} placeholder="Choose Category" required >
                                        {renderCategoryOption()}
                                    </select>
                                </div>
                                <div className={wasValidated + " form-group"}>
                                    <label for="stock" >Stock</label>
                                    <input id="stock" className="form-control" type="number" ref={productStock} placeholder="Enter product stock" />
                                </div>
                                <div className={wasValidated + " form-group"}>
                                    <label for="price" >Price</label>
                                    <input id="price" className="form-control" type="text" ref={productPrice} placeholder="Enter product price" required />
                                </div>
                                <div className={wasValidated + " form-group"}>
                                    <label for="description" >Description</label>
                                    <textarea id="description" className="form-control" ref={productDescription} style={{ height: "120px" }} placeholder="Enter description" />
                                </div>
                            </div>
                            <div className="col-12 col-sm-12 col-md-6">
                                <div className={wasValidated + " form-group"}>
                                    <label for="product-image">Product Image</label>
                                    <label for="product-image" className="d-flex justify-content-center align-items-center border p-1 mb-2" style={{ height: "432px" }}>
                                        <img className="" src={productImage} style={{ maxWidth: "100%", maxHeight: "100%" }} alt="product-image" />
                                    </label>
                                    <input id="product-image" className="form-control" type="file" onChange={onChangePicture} placeholder="Enter Product Image" required />
                                </div>
                            </div>
                        </div>
                        <div className="row m-0">
                            <div className="col-12">
                                <button className="btn btn-block btn-primary" onClick={saveNewProduct}>Save New Product</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddProduct;