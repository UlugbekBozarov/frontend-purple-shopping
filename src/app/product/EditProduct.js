import React, { useEffect, useState, useRef } from 'react';
import { Collapse } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditProduct = () => {

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [productImage, setProductImage] = useState('');
    const [wasValidated, setWasValidated] = useState('');
    const [changeProductBool, setChangeProductBool] = useState(false);


    const category = useRef();
    const productIndex = useRef();

    const productName = useRef();
    const edit_category = useRef();
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


    const handleChangeCategory = () => {
        if (category.current.value !== '0') {
            axios.get(
                "/product/category/" + category.current.value
            ).then(response => {
                setProducts(response.data);
                if (response.data.length > 0) {
                    let product = response.data[0];

                    productName.current.value = product.product_name;
                    edit_category.current.value = product.category_id;
                    productStock.current.value = product.stock;
                    productPrice.current.value = product.price;
                    productDescription.current.value = product.description;
                    setProductImage(product.image_source);

                    setChangeProductBool(true);
                } else {
                    productName.current.value = '';
                    edit_category.current.value = '';
                    productStock.current.value = '';
                    productPrice.current.value = '';
                    productDescription.current.value = '';
                    setProductImage('');

                    setChangeProductBool(false);
                }
            }).catch((err) => {
                errorAlert(err.message);
            });
        } else {
            setProducts([]);
            setChangeProductBool(false);
        }
    }

    const handleChangeProduct = e => {
        e.preventDefault();

        let product = products[productIndex.current.value];

        productName.current.value = product.product_name;
        edit_category.current.value = product.category_id;
        productStock.current.value = product.stock;
        productPrice.current.value = product.price;
        productDescription.current.value = product.description;
        setProductImage(product.image_source);
    }


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




    const editProduct = e => {
        e.preventDefault();

        let p_name = productName.current.value;
        let p_category = edit_category.current.value;
        let p_stock = productStock.current.value;
        let p_price = productPrice.current.value;
        let p_description = productDescription.current.value;

        if (p_name !== '' && p_category !== '' && p_price !== '' && productImage !== '') {

            let product = products[productIndex.current.value];

            if (p_name !== product.product_name || parseInt(p_category) !== product.category_id || parseInt(p_stock) !== product.stock || parseInt(p_price) !== product.price || p_description !== product.description) {
                axios.put(
                    "/product/" + products[productIndex.current.value].product_id,
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
                    setProducts(response.data);
                    if (response.data.length > 0) {
                        let product = response.data[productIndex.current.value];
    
                        productName.current.value = product.product_name;
                        edit_category.current.value = product.category_id;
                        productStock.current.value = product.stock;
                        productPrice.current.value = product.price;
                        productDescription.current.value = product.description;
                        setProductImage(product.image_source);
    
                        setChangeProductBool(true);
                        successfulAlert('Edit Product!')
                    } else {
                        productName.current.value = '';
                        edit_category.current.value = '';
                        productStock.current.value = '';
                        productPrice.current.value = '';
                        productDescription.current.value = '';
                        setProductImage('');
    
                        setChangeProductBool(false);
                    }
                }).catch((err) => {
                    errorAlert(err.message);
                });
            } else {
                errorAlert("Hech qaysi ma'lumot o'zgartirilmadi!")
            }

        } else {
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

    const renderProductOption = () => {
        let index = 0;
        return products.map(product => {
            index++;
            return (
                <option value={index - 1}>{product.product_name}</option>
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
                        <li className="breadcrumb-item active" aria-current="page">Edit Product</li>
                    </ol>
                </nav>
            </div>

            <div className="bg-white box-shadow p-2 p-md-3">

                <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                        <div className="bg-primary d-flex align-items-center justify-content-center mr-2" style={{ minWidth: "30px", minHeight: "30px", borderRadius: "15px" }}>3</div>
                        <h5 className="m-0">Edit Product</h5>
                    </div>
                    {/* <div>
                        <Link className="nav-link text-primary">
                            <small><i className="mdi mdi-plus"></i> Add Category</small>
                        </Link>
                    </div> */}
                </div>

                <div className="pt-4">
                    <div className="row m-0 bg-primary px-3 pt-3 pb-1 text-white">
                        <div className="col-12 col-sm-12 col-md-6">
                            <div className="form-group">
                                <label for="category-select">Category</label>
                                <select className="form-control text-dark" ref={category} onChange={handleChangeCategory}>
                                    <option value='0' ></option>
                                    {renderCategoryOption()}
                                </select>
                            </div>
                        </div>
                        <div className="col-12 col-sm-12 col-md-6">
                            <div className="form-group">
                                <label for="category-select">Product Name</label>
                                <select className="form-control" ref={productIndex} onChange={handleChangeProduct}>
                                    {renderProductOption()}
                                </select>
                            </div>
                        </div>
                    </div>

                    <Collapse in={changeProductBool}>
                        <div>
                            <div className="row m-0 pt-4">
                                <div className="col-12 col-sm-12 col-md-6">
                                    <div className={wasValidated + " form-group"}>
                                        <label for="product-name" >Product Name</label>
                                        <input id="product-name" className="form-control" type="text" ref={productName} placeholder="Enter product name" required />
                                    </div>
                                    <div className={wasValidated + " form-group"}>
                                        <label for="catefory" >Category</label>
                                        <select id="category" className="form-control" ref={edit_category} placeholder="Choose Category" required >
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
                                        <input id="product-image" className="form-control" type="file" onChange={onChangePicture} placeholder="Enter Product Image" required={productImage === '' ? true : false} />
                                    </div>
                                </div>
                            </div>
                            <div className="row m-0 mb-3">
                                <div className="col-12">
                                    <button className="btn btn-block btn-primary" onClick={editProduct} >Edit Product</button>
                                </div>
                            </div>
                        </div>
                    </Collapse>

                </div>
            </div>
        </div>
    )
}

export default EditProduct;