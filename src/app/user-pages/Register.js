import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Register = () => {

  const username = useRef();
  const email = useRef();
  const password = useRef();
  const confirmPassword = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username.current.value !== '' && email.current.value !== '' && password.current.value !== '' && confirmPassword.current.value !== '') {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let b = re.test(String(email.current.value).toLowerCase());
      if (password.current.value === confirmPassword.current.value && b) {
        axios.post(
          "/user/sign-up",
          {
            username: username.current.value,
            email: email.current.value,
            password: password.current.value
          }
        ).then(response => {
          window.location = "/user-pages/sign-in";
        }).catch(error => {
          errorAlert(error.response.data.message);
          document.getElementById('sign-up-form').classList.add('was-validated')
          if (error.response.data.message === "Invalid username") {
            username.current.value = '';
          } else if (error.response.data.message === "Invalid email") {
            email.current.value = '';
          } else {
            username.current.value = '';
            email.current.value = '';
            password.current.value = '';
            confirmPassword.current.value = '';
          }
        });
      } else {
        if (!b) {
          errorAlert("Email noto'g'ri kiritilgan");
          email.current.value = '';
          document.getElementById('sign-up-form').classList.add('was-validated');
        } else {
          errorAlert("Parolni qaytadan kiriting");
          confirmPassword.current.value = '';
          document.getElementById('sign-up-form').classList.add('was-validated');
        }
      }
    } else {
      document.getElementById('sign-up-form').classList.add('was-validated');
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
              <h4>New here?</h4>
              <h6 className="font-weight-light">Signing up is easy. It only takes a few steps</h6>
              <form id="sign-up-form" className="pt-3">
                <div className="form-group">
                  <input type="text" className="form-control form-control-lg" ref={username} id="username" placeholder="Username" required />
                </div>
                <div className="form-group">
                  <input type="email" className="form-control form-control-lg" ref={email} id="email" placeholder="Email" required />
                </div>
                <div className="form-group">
                  <input type="password" className="form-control form-control-lg" ref={password} id="password" placeholder="Password" required />
                </div>
                <div className="form-group">
                  <input type="password" className="form-control form-control-lg" ref={confirmPassword} id="confirim-password" placeholder="Confirm Password" required />
                </div>
                <div className="mt-3">
                  <button className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" onClick={handleSubmit} >SIGN UP</button>
                </div>
                <div className="text-center mt-4 font-weight-light">
                  Already have an account? <Link to="/user-pages/sign-in" className="text-primary">Sign In</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}

export default Register
