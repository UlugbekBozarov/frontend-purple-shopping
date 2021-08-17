import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import useModal from 'react-hooks-use-modal';
import { BsPencilSquare, BsTrash, BsX } from 'react-icons/bs';
import axios from 'axios';
import { toast } from 'react-toastify';

const Category = () => {


    const [AddCategoryModal, openAddCateory, closeAddCategory] = useModal('root', {
        preventScroll: true
    });

    const [DeleteCategoryModal, openDeleteCateory, closeDeleteCategory] = useModal('root', {
        preventScroll: true
    });


    const borderStyle = {
        boxShadow: '0px 0px 8px red'
    }

    const [categories, setCategories] = useState([]);

    const [isEdited, setIsEdited] = useState([]);
    const [borderStyles, setBorderStyles] = useState([]);
    const [isListEdited, setIsListEdited] = useState({ status: false, index: -1 });
    const [wasValidCategory, setWasValidCategory] = useState([]);

    const [deleteCategoryIndex, setDeleteCategoryIndex] = useState();
    const [deleteCategoryName, setDeleteCategoryName] = useState();

    const categoryTypeValue = useRef();
    const categoryIconValue = useRef();

    const saveCategoryType = useRef();
    const saveCategoryIcon = useRef();


    useEffect(() => {
        let b = [];
        let wasValid = []

        axios.get(
            "/category",
            {
                headers: {
                    Authorization: localStorage.getItem("Online-Shopping Authorization")
                }
            }
        ).then(json => {
            setCategories(json.data);
            for (var i = 0; i < json.data.length; i++) {
                b[i] = true;
                borderStyles[i] = null;
                wasValid[i] = "";
            }
            setIsEdited(b);
            setBorderStyles(borderStyles);
            setIsListEdited({ status: false, index: -1 })
            setWasValidCategory(wasValid);
        }).catch((err) => {
            errorAlert(err.message);
        });
    }, []);



    const saveCategory = (e) => {
        e.preventDefault();

        axios.post(
            '/category',
            {
                type: saveCategoryType.current.value,
                icon: saveCategoryIcon.current.value
            },
            {
                headers: {
                    Authorization: localStorage.getItem("Online-Shopping Authorization")
                }
            }
        ).then(response => {
            setCategories(response.data)
            closeAddCategory();
            successfulAlert("Save Category");
            let b = [];
            let wasValid = []
            for (var i = 0; i < response.data.length; i++) {
                b[i] = true;
                borderStyles[i] = null;
                wasValid[i] = "";
            }
            setBorderStyles(borderStyles);
            setIsListEdited({ status: false, index: -1 })
            setWasValidCategory(wasValid);
        }).catch((err) => {
            errorAlert(err.response.data.message);
        });
    }


    const updateCategory = (index) => () => {
        axios.put(
            '/category/' + categories[index].id,
            {
                type: categoryTypeValue.current.value !== "" ? categoryTypeValue.current.value : categories[index].type,
                icon: categoryIconValue.current.value !== "" ? categoryIconValue.current.value : categories[index].icon
            },
            {
                headers: {
                    Authorization: localStorage.getItem("Online-Shopping Authorization")
                }
            }
        ).then(response => {
            setCategories(response.data)
            let e = [...isEdited];
            e[index] = true;
            setIsEdited(e);
            successfulAlert("Edit category");
            setIsListEdited({ status: false, index: -1 })
        }).catch((err) => {
            errorAlert(err.response.data.message);
        });
    }



    const deleteCategoryOpenModal = (index) => () => {
        setDeleteCategoryName(categories[index].type);
        setDeleteCategoryIndex(index);
        openDeleteCateory();
    }

    const deleteCategory = () => {

        // axios.delete(
        //     '/category/' + categories[deleteCategoryIndex].id,
        //     {
        //         headers: {
        //             Authorization: localStorage.getItem("Online-Shopping Authorization")
        //         }
        //     }
        // ).then(response => {
        //     if (response.status = 200) {
        //         setCategories(response.data)
        //         closeDeleteCategory();
        //         successfulAlert("Delete category");
        //     }
        // }).catch((err) => {
        //     errorAlert(err.response.data.message);
        // });

        closeDeleteCategory();
        successfulAlert("Delete category");

    }



    const updateIsEdited = (index) => () => {

        let copyIsEdited = [...isEdited];

        if (!isListEdited.status) {
            copyIsEdited[index] = false;
            setIsListEdited({ status: true, index: index })
        } else {
            let copyBorderStyles = [...borderStyles];
            let copyWasValid = [...wasValidCategory];
            if (isListEdited.index === index) {
                copyIsEdited[index] = true;
                setIsListEdited({ status: false, index: -1 })
                copyBorderStyles[isListEdited.index] = null;
                copyWasValid[index] = null;
            } else {
                copyWasValid[isListEdited.index] = "was-validated";
                copyBorderStyles[isListEdited.index] = borderStyle;
            }
            setBorderStyles(copyBorderStyles);
            setWasValidCategory(copyWasValid);
        }

        setIsEdited(copyIsEdited);

    }


    const successfulAlert = (message) => {
        toast.success(message,
            { position: toast.POSITION.TOP_RIGHT })
    }


    const errorAlert = (message) => {
        toast.error(message,
            { position: toast.POSITION.TOP_RIGHT })
    }



    const renderAddCategoryModal = () => {

        return (
            <AddCategoryModal>
                <div className="add-address-modal">
                    <div className="modal-header">
                        <h4 className="m-0">Add New Category</h4>
                        <Link className="p-2" onClick={closeAddCategory}>
                            <span className="page-title-icon text-white">
                                <i className="mdi mdi-close"></i>
                            </span>
                        </Link>
                    </div>
                    <div className="modal-body">
                        <form id="add-address">
                            <div className="form-group mb-3">
                                <input id="address-title" className="form-control modal-input rounded" type="text" ref={saveCategoryIcon} required placeholder="Enter Category Icon Name" />
                            </div>
                            <div className="form-group mb-3">
                                <textarea id="your-address" className="form-control rounded" required style={{ height: "100px" }} ref={saveCategoryType} placeholder="Enter Category Name" />
                            </div>
                            <div className="form-group mb-3">
                                <button className="btn btn-primary w-100" onClick={saveCategory}>Save Category</button>
                            </div>
                        </form>
                    </div>
                </div>
            </AddCategoryModal>
        )
    }



    const renderDeleteCategoryModal = () => {

        return (
            <DeleteCategoryModal>
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
                                {deleteCategoryName}
                                <i className={"text-primary "} style={{ fontSize: "20px" }}></i>
                            </span>
                            nomli categoriyani o'chirmoqchimisiz?
                        </p>
                    </div>
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-danger mr-2" onClick={closeDeleteCategory}>No</button>
                        <button className="btn btn-primary" onClick={() => deleteCategory()}>Yes</button>
                    </div>
                </div>

            </DeleteCategoryModal>
        )
    }


    const renderCategory = () => {

        let i = 0;
        return categories.map(category => {

            i++;
            return (
                <tr style={borderStyles[i - 1]}>
                    <td className="text-center" style={{ width: "80px" }} >
                        <button className="btn p-0 py-2" type="submit" onClick={updateIsEdited(i - 1)} >
                            {
                                isEdited[i - 1] ? (<span><BsPencilSquare className="text-primary" style={{ fontSize: "25px" }} /></span>)
                                    :
                                    (<span><BsX className="text-danger" style={{ fontSize: "25px" }} /></span>)
                            }
                        </button>
                    </td>
                    <td style={{ width: "50px" }} >{i}</td>
                    <td style={isEdited[i - 1] ? ({ width: "40px" }) : ({ minWidth: "220px" })} >
                        {
                            isEdited[i - 1] ? (
                                <span className="btn text-primary p-0">
                                    <i className={category.icon} style={{ fontSize: "25px" }}></i>
                                </span>
                            ) : (
                                <input className="form-control" type="text" ref={categoryIconValue} placeholder="Enter Category icon..." required />
                            )
                        }
                    </td>
                    <td style={{ minWidth: "220px" }} >
                        {
                            isEdited[i - 1] ? (
                                <span>{category.type}</span>
                            ) : (
                                <input type="text" ref={categoryTypeValue} className="form-control" placeholder="Enter Category type..." required />
                            )
                        }
                    </td>

                    <td className="text-center pl-0" style={{ width: "140px" }} >
                        {
                            isEdited[i - 1] ? (
                                <button className="btn p-2" onClick={deleteCategoryOpenModal(i - 1)}>
                                    <span><BsTrash className="text-danger" style={{ fontSize: "25px" }} /></span>
                                </button>
                            ) : (
                                <button className="btn p-0" onClick={updateCategory(i - 1)}>
                                    <span className="btn btn-primary">Save</span>
                                </button>
                            )
                        }
                    </td>
                </tr>
            )
        })
    }




    return (
        <div>
            <div className="page-header">
                <h3 className="page-title">
                    <span className="page-title-icon bg-gradient-primary text-white mr-2">
                        <i className="mdi mdi-format-list-bulleted"></i>
                    </span>
                    Category
                </h3>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Categories</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Category</li>
                    </ol>
                </nav>
            </div>

            <div className="bg-white box-shadow p-2 p-md-3">

                <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                        <div className="bg-primary d-flex align-items-center justify-content-center mr-2" style={{ minWidth: "30px", minHeight: "30px", borderRadius: "15px" }}>1</div>
                        <h5 className="m-0">Categories</h5>
                    </div>
                    <div>
                        <Link className="nav-link text-primary" onClick={openAddCateory}>
                            <small><i className="mdi mdi-plus"></i> Add Category</small>
                        </Link>
                    </div>
                </div>

                <div className="scroll p-2" style={{ width: "100% " }} >
                    <div className="pr-2" style={{ minWidth: "730px" }}>
                        <table className="table table-striped" style={{ whiteSpace: "nowrap" }} >
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>№</th>
                                    <th>Icon</th>
                                    <th>Category name</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody className="m-2">
                                {renderCategory()}
                            </tbody>
                        </table>
                    </div>
                    {renderAddCategoryModal()}
                    {renderDeleteCategoryModal()}
                </div>
            </div>
        </div>
    )

}

export default Category