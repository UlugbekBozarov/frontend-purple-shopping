import React, { useState, useEffect, useRef } from 'react';
import useModal from 'react-hooks-use-modal';
import { BsTrash } from 'react-icons/bs';
import axios from 'axios';
import { toast } from 'react-toastify';

const Products = () => {

    const [DeletProductModal, openDeleteProduct, closeDeleteProduct] = useModal('root', {
        preventScroll: true
    });

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);

    const [deleteProductId, setDeleteProductId] = useState();
    const [deleteProductName, setDeleteProductName] = useState();


    const get_category = useRef();


    useEffect(() => {
        axios.get(
            "/category/asc"
        ).then(json => {
            setCategories(json.data);
            updateCategory(json.data[0].id);
        }).catch((err) => {
            errorAlert(err.message);
        });
    }, []);


    const updateCategory = (id) => {
        axios.get(
            "/product/category/" + id
        ).then(json => {
            setProducts(json.data);
        }).catch((err) => {
            errorAlert(err.message + "qwe");
        });
    }


    const handleChangeCategory = e => {
        updateCategory(get_category.current.value);
    }


    const deleteProductOpenModal = (id, name) => () => {
        setDeleteProductName(name);
        setDeleteProductId(id);
        openDeleteProduct();
    }


    const deleteProduct = () => {

        // axios.delete(
        //     '/product/' + deleteProductId,
        //     {
        //         headers: {
        //             Authorization: localStorage.getItem("Online-Shopping Authorization")
        //         }
        //     }
        // ).then(response => {
        //     if (response.status = 200) {
        //         setProducts(response.data)
        //         closeDeleteProduct();
        //         successfulAlert("Delete category");
        //     }
        // }).catch((err) => {
        //     errorAlert(err.response.data.message);
        // });

        closeDeleteProduct();
        successfulAlert("Delete category");

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


    const renderProducts = () => {
        return products.map(product => {
            return (
                <tr className="display-4 font-weight-bold">
                    <td className="pl-3 p-1">
                        <img className="rounded-circle" style={{ width: "100px", height: "100px" }} src={product.image_source} alt={product.product_name} />
                    </td>
                    <td>{product.product_name}</td>
                    <td>{product.stock} %</td>
                    <td>{product.price} <small className="text-muted">(so'm)</small></td>
                    <td>{product.description}</td>
                    <td>
                        <button className="btn p-0" onClick={deleteProductOpenModal(product.product_id, product.product_name)}>
                            <BsTrash className="text-danger" style={{ fontSize: "30px" }}></BsTrash>
                        </button>
                    </td>
                </tr>
            )
        })
    }


    const renderDeleteProductModal = () => {

        return (
            <DeletProductModal>
                <div className="bg-white p-3 rounded">
                    <div className="pb-2">
                        <h3 className="text-primary font-weight-bold">
                            Delete Category
                        </h3>
                        <hr />
                    </div>
                    <div>
                        <p>Siz rostdan ham
                            <span className="bg-secondary py-2 px-1 mx-1 rounded">
                                {deleteProductName}
                                <i className={"text-primary "} style={{ fontSize: "20px" }}></i>
                            </span>
                            nomli productni o'chirmoqchimisiz?
                        </p>
                    </div>
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-danger mr-2" onClick={closeDeleteProduct}>No</button>
                        <button className="btn btn-primary" onClick={() => deleteProduct()}>Yes</button>
                    </div>
                </div>

            </DeletProductModal>
        )
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
                        <li className="breadcrumb-item active" aria-current="page">Get Products</li>
                    </ol>
                </nav>
            </div>

            <div className="bg-white box-shadow p-2 p-md-3">

                <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                        <div className="bg-primary d-flex align-items-center justify-content-center mr-2" style={{ minWidth: "30px", minHeight: "30px", borderRadius: "15px" }}>1</div>
                        <h5 className="m-0">Get Products</h5>
                    </div>
                    {/* <div>
                        <Link className="nav-link text-primary">
                            <small><i className="mdi mdi-plus"></i> Add Category</small>
                        </Link>
                    </div> */}
                </div>

                <div className="row m-3 m-md-4">
                    <div className="col-12">
                        <form>
                            <select id="category" className="form-control" ref={get_category} placeholder="Choose Category" onChange={handleChangeCategory} required >
                                {renderCategoryOption()}
                            </select>
                        </form>
                    </div>
                </div>
                <div>
                    <h4 className="text-primary font-weight-bold">Products</h4>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Stock</th>
                                <th>Price</th>
                                <th>Description</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderProducts()}
                        </tbody>
                    </table>
                </div>
            </div>
            {renderDeleteProductModal()}
        </div>
    )
}

export default Products;