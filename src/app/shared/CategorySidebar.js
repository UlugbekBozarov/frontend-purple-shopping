import React, { useState, useEffect } from 'react';
import { Link, withRouter, useLocation } from 'react-router-dom';
// import { Collapse } from 'react-bootstrap';
// import { Trans } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

const CategorySidebar = () => {

  const [categoryes, setCategories] = useState([]);
  const location = useLocation();


  useEffect(() => {
    axios.get(
      "/category/asc"
    ).then(json => {
      setCategories(json.data);
    }).catch((err) => {
      errorAlert(err.message)
    });
  }, []);


  const errorAlert = (message) => {
    toast.error(message,
      { position: toast.POSITION.TOP_RIGHT })
  }


  const renderCategory = () => {
    return categoryes.map(category => {
      return (
        <li className={location.pathname === "/home/" + category.id ? 'nav-item active' : 'nav-item'}>
          <Link className="nav-link" to={"/home/" + category.id}>
            <span className="menu-title">{
              category.type
            }</span>
            <i className={category.icon + " menu-icon"}></i>
          </Link>
        </li>
      )
    })
  }


  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        <li className="nav-item nav-profile">
          <a href="!#" className="nav-link" onClick={evt => evt.preventDefault()}>
            <h1>Welcome</h1>
            <i className="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
          </a>
        </li>
        {
          renderCategory()
        }
      </ul>
    </nav>
  );
}

export default withRouter(CategorySidebar);