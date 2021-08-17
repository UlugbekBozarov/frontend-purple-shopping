import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

const Login = () => {

  const username = useRef();
  const password = useRef();

  const [wasValidated, setWasValidated] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    if (username.current.value !== '' && password.current.value !== '') {

      axios.post(
        '/login',
        {
          username: username.current.value,
          password: password.current.value
        }
      ).then(response => {
          localStorage.setItem("Online-Shopping Authorization", response.headers.authorization);
          if (response.headers.user_role === "ROLE_ADMIN") {
            localStorage.setItem("Online-Shopping User-Role", response.headers.user_role);
          }
          window.location.href = "/";
      }).catch(err => {
        errorAlert("Invalid username or password");
        username.current.value = "";
        password.current.value = "";
      });
      setWasValidated('')
    } else {
      setWasValidated('was-validated')
    }
  }

  const errorAlert = (message) => {
    toast.error(message,
      { position: toast.POSITION.TOP_RIGHT })
  }

  return (
    <div>
      <div className="d-flex align-items-center auth px-0">
        <div className="row w-100 mx-0">
          <div className="col-lg-4 mx-auto">
            <div className="auth-form-light text-left py-5 px-4 px-sm-5">
              <div className="brand-logo">
                <Link to="/home">
                  <img src={require("../../assets/images/logo.svg")} alt="logo" />
                </Link>
              </div>
              <h4>Hello! let's get started</h4>
              <h6 className="font-weight-light">Sign in to continue.</h6>
              <Form className="pt-3">
                <Form.Group className={wasValidated + " d-flex search-field"}>
                  <Form.Control id="your-name" type="username" ref={username} placeholder="Username" size="lg" className="h-auto" required />
                </Form.Group>
                <Form.Group className={wasValidated + " d-flex search-field"}>
                  <Form.Control id="your-password" type="password" ref={password} placeholder="Password" size="lg" className="h-auto" required />
                </Form.Group>
                <div className="mt-3">
                  <button className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" onClick={handleLogin} >SIGN IN</button>
                </div>
                <div className="text-center mt-4 font-weight-light">
                  Already have an account? <Link to="/user-pages/sign-up" className="text-primary" > Sign Up</Link>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
