import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { Collapse } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = ({ authentification, role, about, rightSidebarBool }) => {

  const [ordersTimeOut, setOrdersTimeOut] = useState([]);

  const updateTimeOut = () => {
    let bool = false;
    console.log("Hello!: " + ordersTimeOut.length);

    for (let i = 0; i < ordersTimeOut.length; i++) {
      console.log("Time Left_" + i + ": " + ordersTimeOut[i]);
    }

    let timeOut = [];
    for (let i = 0; i < ordersTimeOut.length; i++) {
      bool = true;
      if (ordersTimeOut[i] > 0) {
        timeOut.push(ordersTimeOut[i] - 1);
      } else {
        timeOut.push(0);
      }
    }

    setTimeout(() => {
      if (bool) {
        setOrdersTimeOut(timeOut);
      }
      // setName(text);
    }, 1000);
  }

  useEffect(() => {
    updateTimeOut();
  }, [ordersTimeOut])






  const [orders, setOrders] = useState([]);
  const [ordersCollapse, setOrdersCollapse] = useState([]);
  const [oldCollapseIndes, setOldCollapseIndes] = useState(-1);


  const authorization = localStorage.getItem("Online-Shopping Authorization") !== null;


  useEffect(() => {
    if (authorization) {
      axios.get(
        "/order/accepted",
        {
          headers: {
            Authorization: localStorage.getItem("Online-Shopping Authorization")
          }
        }
      ).then(response => {
        setOrders(response.data);
        let bool = [];
        let timeOut = [];

        for (let i = 0; i < response.data.length; i++) {
          bool.push(false);
          if (Math.floor((new Date().getTime() - new Date(response.data[i].time_of_ordening).getTime()) / 1000) < 5400) {
            timeOut.push(5400 - Math.floor((new Date().getTime() - new Date(response.data[i].time_of_ordening).getTime()) / 1000));
          } else {
            timeOut.push(0);
          }

        }
        setOrdersCollapse(bool);
        setOrdersTimeOut(timeOut);
      }).catch(err => {
        errorAlert(err.message);
      })
    }


  }, []);


  const updateCollapse = (index) => () => {
    let bool = [...ordersCollapse];
    // alert("Bool: " + ordersCollapse[0]);

    if (oldCollapseIndes !== -1) {
      bool[oldCollapseIndes] = false;
    }

    if (bool[index] === false) {
      setOldCollapseIndes(index);
    }

    bool[index] = !ordersCollapse[index];
    setOrdersCollapse(bool);
  }


  const handleReceive = (id) => (e) => {
    e.preventDefault();

    axios.get(
      "/order/status/receive/" + id,
      {
        headers: {
          Authorization: localStorage.getItem("Online-Shopping Authorization")
        }
      }
    ).then(response => {
      setOrders(response.data);
      let bool = [];
      for (let i = 0; i < response.data.length; i++) {
        bool.push(false);
      }
      setOrdersCollapse(bool);
      successfulAlert("Xaridingiz uchun rahmat!");
    }).catch(err => {
      errorAlert(err.message);
    });
  }

  const getTimeFormat = (time) => {
    if (time < 10) {
      return('0' + time);
    } else {
      return time;
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

  const toggleOffcanvas = () => {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  }

  const toggleRightSidebar = () => {
    document.querySelector('.right-sidebar').classList.toggle('open');
  }

  const handleLockscreen = (e) => {
    e.preventDefault();

    window.location.href = "/user-pages/lockscreen";
  }

  const handleLogOut = (e) => {
    e.preventDefault();
    localStorage.removeItem("Online-Shopping Authorization");
    localStorage.removeItem("Online-Shopping User-Role");
    window.location.href = "/";
  }

  const getDateFormat = (date) => {
    let a = new Date(date) + " ";
    let b = a.substring(0, 25);
    return b;
  }

  const renderMe = () => {

    return (
      <li className="nav-item nav-profile">
        <Dropdown alignRight>
          <Dropdown.Toggle className="nav-link">
            <div className="nav-profile-img">
              <img src={about.user_image} alt="user" />
              <span className="availability-status online"></span>
            </div>
            <div className="nav-profile-text">
              <p className="mb-1 text-black">{about.fullname !== '' ? (about.fullname) : (about.username)}</p>
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu className="navbar-dropdown">
            <Dropdown.Item href="!#" onClick={handleLockscreen}>
              <i className="mdi mdi-cached mr-2 text-success"></i>
              <Trans>Log Screen</Trans>
            </Dropdown.Item>
            <Dropdown.Item href="!#" onClick={handleLogOut}>
              <i className="mdi mdi-logout mr-2 text-primary"></i>
              <Trans>Log Out</Trans>
            </Dropdown.Item>
            <div className="d-block d-md-none">
              <Link className="dropdown-item" to="/user-pages/settings">
                <i className="mdi mdi-settings mr-2 text-danger"></i>
                <Trans>Settings</Trans>
              </Link>
            </div>
          </Dropdown.Menu>
        </Dropdown>
      </li>
    )
  }

  const renderderDropdownMessages = () => {

    return (
      <li className="nav-item">
        <Dropdown alignRight>
          <Dropdown.Toggle className="nav-link count-indicator">
            <i className="mdi mdi-email-outline"></i>
            <span className="count-symbol bg-warning"></span>
          </Dropdown.Toggle>

          <Dropdown.Menu className="preview-list navbar-dropdown">
            <h6 className="p-3 mb-0"><Trans>Messages</Trans></h6>
            <div className="dropdown-divider"></div>
            <Dropdown.Item className="dropdown-item preview-item" onClick={evt => evt.preventDefault()}>
              <div className="preview-thumbnail">
                <img src={require("../../assets/images/faces/face4.jpg")} alt="user" className="profile-pic" />
              </div>
              <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                <h6 className="preview-subject ellipsis mb-1 font-weight-normal"><Trans>Mark send you a message</Trans></h6>
                <p className="text-gray mb-0">
                  1 <Trans>Minutes ago</Trans>
                </p>
              </div>
            </Dropdown.Item>
            <div className="dropdown-divider"></div>
            <Dropdown.Item className="dropdown-item preview-item" onClick={evt => evt.preventDefault()}>
              <div className="preview-thumbnail">
                <img src={require("../../assets/images/faces/face2.jpg")} alt="user" className="profile-pic" />
              </div>
              <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                <h6 className="preview-subject ellipsis mb-1 font-weight-normal"><Trans>Cregh send you a message</Trans></h6>
                <p className="text-gray mb-0">
                  15 <Trans>Minutes ago</Trans>
                </p>
              </div>
            </Dropdown.Item>
            <div className="dropdown-divider"></div>
            <Dropdown.Item className="dropdown-item preview-item" onClick={evt => evt.preventDefault()}>
              <div className="preview-thumbnail">
                <img src={require("../../assets/images/faces/face3.jpg")} alt="user" className="profile-pic" />
              </div>
              <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                <h6 className="preview-subject ellipsis mb-1 font-weight-normal"><Trans>Profile picture updated</Trans></h6>
                <p className="text-gray mb-0">
                  18 <Trans>Minutes ago</Trans>
                </p>
              </div>
            </Dropdown.Item>
            <div className="dropdown-divider"></div>
            <h6 className="p-3 mb-0 text-center cursor-pointer">4 <Trans>new messages</Trans></h6>
          </Dropdown.Menu>
        </Dropdown>
      </li>
    )
  }

  const renderderDropdownNotification = () => {

    return (
      <li className="nav-item">
        <Dropdown alignRight>
          <Dropdown.Toggle className="nav-link count-indicator">
            <i className="mdi mdi-bell-outline"></i>
            <span className="count-symbol bg-danger"></span>
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu navbar-dropdown preview-list">
            <h6 className="p-3 mb-0"><Trans>Notifications</Trans></h6>
            <div className="dropdown-divider"></div>
            <Dropdown.Item className="dropdown-item preview-item" onClick={evt => evt.preventDefault()}>
              <div className="preview-thumbnail">
                <div className="preview-icon bg-success">
                  <i className="mdi mdi-calendar"></i>
                </div>
              </div>
              <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                <h6 className="preview-subject font-weight-normal mb-1"><Trans>Event today</Trans></h6>
                <p className="text-gray ellipsis mb-0">
                  <Trans>Just a reminder that you have an event today</Trans>
                </p>
              </div>
            </Dropdown.Item>
            <div className="dropdown-divider"></div>
            <Dropdown.Item className="dropdown-item preview-item" onClick={evt => evt.preventDefault()}>
              <div className="preview-thumbnail">
                <div className="preview-icon bg-warning">
                  <i className="mdi mdi-settings"></i>
                </div>
              </div>
              <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                <h6 className="preview-subject font-weight-normal mb-1"><Trans>Settings</Trans></h6>
                <p className="text-gray ellipsis mb-0">
                  <Trans>Update user</Trans>
                </p>
              </div>
            </Dropdown.Item>
            <div className="dropdown-divider"></div>
            <Dropdown.Item className="dropdown-item preview-item" onClick={evt => evt.preventDefault()}>
              <div className="preview-thumbnail">
                <div className="preview-icon bg-info">
                  <i className="mdi mdi-link-variant"></i>
                </div>
              </div>
              <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                <h6 className="preview-subject font-weight-normal mb-1"><Trans>Launch Admin</Trans></h6>
                <p className="text-gray ellipsis mb-0">
                  <Trans>New admin wow</Trans>!
                      </p>
              </div>
            </Dropdown.Item>
            <div className="dropdown-divider"></div>
            <h6 className="p-3 mb-0 text-center cursor-pointer"><Trans>See all notifications</Trans></h6>
          </Dropdown.Menu>
        </Dropdown>
      </li>
    )
  }

  const renderderLogOut = () => {

    return (
      <li className="nav-item nav-logout d-none">
        <a className="nav-link" href="!#" onClick={event => event.preventDefault()}>
          <i className="mdi mdi-power"></i>
        </a>
      </li>
    )
  }

  const renderderRightSidebar = () => {

    return (
      <li className="nav-item nav-settings d-none d-lg-block">
        <button type="button" className="nav-link border-0" onClick={toggleRightSidebar} >
          <i className="mdi mdi-format-line-spacing"></i>
        </button>
      </li>
    )
  }


  const renderderCart = () => {

    return (
      <li className="nav-item">
        <Dropdown alignRight>
          <Dropdown.Toggle className="nav-link count-indicator">
            <i className="mdi mdi-cart-outline"></i>
            <span className="count-symbol bg-danger"></span>
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu navbar-dropdown preview-list">
            <h6 className="p-3 mb-0 text-primary"><Trans>New Orders</Trans></h6>
            <div className="dropdown-divider"></div>
            {
              renderderCartDropdownItems()
            }
            <h6 className="p-3 mb-0 text-center cursor-pointer"><Trans>See all Orders</Trans></h6>
          </Dropdown.Menu>
        </Dropdown>
      </li>
    )
  }



  const renderderCartDropdownItems = () => {

    if (orders.length > 0) {
      let index = 0;
      return orders.map(order => {
        index++;
        return (
          <div>
            <div className="dropdown-item preview-item hover-transponent" onClick={updateCollapse(index - 1)} data-toggle="collapse" style={{ position: "relative" }}>
              <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "-100" }}>
                {
                  ordersTimeOut[index - 1] > 0 ? (
                    <div className="w-100 h-100 progress bg-white" >
                      <div className="progress-bar progress-bar-striped progress-bar-animated bg-primary" style={{ width: Math.floor(((5400 - ordersTimeOut[index - 1]) * 100) / 5400) + '%' }}></div>
                    </div>
                  ) : (
                    <div className="w-100 h-100 bg-danger"></div>
                  )
                }
              </div>
              <div className={ordersCollapse[index - 1] ? "w-100 d-flex justify-content-between align-items-center menu-expanded" : "w-100 d-flex justify-content-between align-items-center"}>
                <div className="d-flex">
                  <div className="preview-thumbnail">
                    <div className={order.status === "DELIVERY" ? ("preview-icon bg-success") : ("preview-icon bg-warning")}>
                      {
                        order.status === "DELIVERY" ? (<i className="mdi mdi-truck-delivery"></i>) : (<i className="mdi mdi-cart-plus"></i>)
                      }
                    </div>
                  </div>
                  <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                    <div className="w-100 d-flex justify-content-between">
                      <h6 className="preview-subject font-weight-normal text-dark mb-1">{order.schedule.type}</h6>
                      <span className="pl-2 text-danger">{getTimeFormat(Math.floor(ordersTimeOut[index - 1] / 3600)) + ':' + getTimeFormat(Math.floor((ordersTimeOut[index - 1] % 3600) / 60)) +  ':' + getTimeFormat((ordersTimeOut[index - 1] % 3600) % 60)}</span>
                    </div>

                    <p className="text-gray ellipsis mb-0">
                      {getDateFormat(order.time_of_ordening)}
                    </p>
                  </div>
                </div>
                {
                  order.status === "DELIVERY" ? (
                    !role ? (
                      <div className="menu-arrow text-muted left-0">
                        <i className="mdi mdi-chevron-left"></i>
                      </div>
                    ) : (
                      null
                    )
                  ) : (
                    null
                  )
                }
              </div>
            </div>
            {
              order.status === "DELIVERY" ? (
                <Collapse in={ordersCollapse[index - 1]}>
                  <div className="px-2 pb-2">
                    <div className="d-flex justify-content-between border border-top-0 border-primary px-2 py-3">
                      <p className="m-0">
                        <i className="mdi mdi-arrow-right text-muted pr-2"></i>
                        Zakazingizni qabul qildingizmi?
                      </p>
                      <div className="d-flex align-items-center">
                        <button className="btn btn-primary py-2 px-3" onClick={handleReceive(order.order_id)}>Receive</button>
                      </div>
                    </div>
                  </div>
                </Collapse>
              ) : (
                null
              )
            }

          </div>
        )
      }
      )
    } else {
      return (
        <>
          <Dropdown.Item className="d-flex justify-content-center align-items-center dropdown-item preview-item" onClick={evt => evt.preventDefault()}>
            <img className="text-center" src={require("../../assets/images/sorry.svg")} style={{ maxWidth: "200px", maxHeight: "180px" }} alt="logo" />
          </Dropdown.Item>
          <div className="dropdown-divider"></div>
        </>
      )
    }

  }

  const renderderSettings = () => {

    return (
      <li className="nav-item nav-settings d-none d-md-block">
        <Link to="/user-pages/settings" className="nav-link border-0">
          <i className="mdi mdi-settings"></i>
        </Link>
      </li>
    )
  }








  return (
    <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row" style={{ zIndex: "100" }}>
      <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
        <Link className="navbar-brand brand-logo" to="/"><img src={require('../../assets/images/logo.svg')} alt="logo" /></Link>
        <Link className="navbar-brand brand-logo-mini" to="/"><img src={require('../../assets/images/logo-mini.svg')} alt="logo" /></Link>
      </div>
      <div className="navbar-menu-wrapper d-flex align-items-stretch">
        <button className="navbar-toggler navbar-toggler align-self-center" type="button" onClick={() => document.body.classList.toggle('sidebar-icon-only')}>
          <span className="mdi mdi-menu"></span>
        </button>
        <div className="search-field d-none d-md-block">
          <form className="d-flex align-items-center h-100" action="#">
            <div className="input-group">
              <div className="input-group-prepend bg-transparent">
                <i className="input-group-text border-0 mdi mdi-magnify"></i>
              </div>
              <input type="text" className="form-control bg-transparent border-0" placeholder="Search projects" />
            </div>
          </form>
        </div>
        <ul className="navbar-nav navbar-nav-right">
          {
            authentification ? (renderMe()) : null
          }
          {
            authentification ? (role === "ROLE_ADMIN" ? renderderDropdownMessages() : null) : null
          }
          {
            authentification ? (role === "ROLE_ADMIN" ? renderderDropdownNotification() : null) : null
          }
          {
            authentification ? (renderderLogOut()) : null
          }
          {
            authentification ? (role === "ROLE_ADMIN" ? renderderRightSidebar() : null) : null
          }

          {
            authentification ? (renderderCart()) : null
          }

          {
            authentification ? (renderderDropdownNotification()) : null
          }

          {
            authentification ? (renderderSettings()) : null
          }

          {
            !authentification ? (
              <li className="nav-item nav-logout">
                <Link className="nav-link" to="/user-pages/sign-in" onClick={() => window.location.href = "/user-pages/sign-in"}>
                  Sign In
                </Link>
              </li>
            ) : null
          }


        </ul>
        {
          rightSidebarBool ? (
            <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" onClick={toggleOffcanvas}>
              <span className="mdi mdi-menu"></span>
            </button>
          ) : null
        }

      </div>
    </nav>
  );
}

export default Navbar;
