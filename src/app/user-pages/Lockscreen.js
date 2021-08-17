import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

const LockScreen = () => {

  const [user, setUser] = useState({});

  const password = useRef();

  useEffect(() => {

    if (localStorage.getItem("Online-Shopping Authorization") !== null) {
      axios.get(
        "/user/me",
        {
          headers: {
            Authorization: localStorage.getItem("Online-Shopping Authorization")
          }
        }
      ).then(response => {
        setUser({
          username: response.data.username,
          image: response.data.user_image
        });
        localStorage.removeItem('Online-Shopping User-Role');
        localStorage.removeItem('Online-Shopping Authorization');
      }).catch(err => {
        window.location.href = "/"
      });
    } else {
      window.location.href = "/"
    }

  }, []);


  const signIn = (e) => {
    e.preventDefault();

    axios.post(
      "/login",
      {
        username: user.username,
        password: password.current.value
      }
    ).then(response => {

      localStorage.setItem("Online-Shopping Authorization", response.headers.authorization);
      if (response.headers.user_role === "ROLE_ADMIN") {
        localStorage.setItem("Online-Shopping User-Role", response.headers.user_role);
      }
      window.location.href = "/";
    }).catch(err => {
      toast.error("Invalid password",
        { position: toast.POSITION.TOP_RIGHT });

      password.current.value = "";
    });
  }

  return (
    <div>
      <div className="content-wrapper d-flex align-items-center auth lock-full-bg h-100">
        <div className="row w-100 align-items-center">
          <div className="col-lg-4 mx-auto">
            <div className="auth-form-transparent text-left p-5 text-center">
              <img src={user.image} className="lock-profile-img" alt="img" />
              <form className="pt-5">
                <div className="form-group">
                  <label>Password to unlock</label>
                  <input type="password" className="form-control text-center" id="examplePassword1" ref={password} placeholder="Password" />
                </div>
                <div className="mt-5">
                  <button className="btn btn-block btn-success btn-lg font-weight-medium" onClick={signIn}>Unlock</button>
                </div>
                <div className="mt-3 text-center">
                  <Link to="/login" className="auth-link text-white">Sign in using a different account</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}

export default LockScreen
