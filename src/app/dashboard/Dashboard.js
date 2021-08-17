import React, { Component } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { Bar, Doughnut } from 'react-chartjs-2';
import DatePicker from "react-datepicker";

const Dashboard = () => {


  const visitSaleOptions = {
    
  }


  const week = {
    
  }

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-home"></i>
          </span> Dashboard </h3>
        <nav aria-label="breadcrumb">
          <ul className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              <span></span>Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
            </li>
          </ul>
        </nav>
      </div>


      <div className="row">
        <div className="col-md-7 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="clearfix mb-4">
                <h4 className="card-title float-left">Visit And Sales Statistics</h4>
                <div id="visit-sale-chart-legend" className="rounded-legend legend-horizontal legend-top-right float-right">
                  <ul>
                    <li>
                      <span className="legend-dots bg-primary">
                      </span>CHN
                      </li>
                    <li>
                      <span className="legend-dots bg-danger">
                      </span>USA
                      </li>
                    <li>
                      <span className="legend-dots bg-info">
                      </span>UK
                      </li>
                  </ul>
                </div>
              </div>
              {/* <Bar ref='chart' className="chartLegendContainer" data={week} options={visitSaleOptions} id="visitSaleChart"/> */}
            </div>
          </div>
        </div>
        <div className="col-md-5 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Traffic Sources</h4>
              {/* <Doughnut data={this.state.trafficData} options={this.state.trafficOptions} /> */}
              <div id="traffic-chart-legend" className="rounded-legend legend-vertical legend-bottom-left pt-4">
                <ul>
                  <li>
                    <span className="legend-dots bg-info"></span>Search Engines
                      <span className="float-right">30%</span>
                  </li>
                  <li>
                    <span className="legend-dots bg-success"></span>Direct Click
                      <span className="float-right">30%</span>
                  </li>
                  <li>
                    <span className="legend-dots bg-danger"></span>Bookmarks Click
                      <span className="float-right">40%</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-5 grid-margin stretch-card">
          <div className="card">
            <div className="card-body p-0 d-flex">
              <div className="dashboard-custom-date-picker">
                {/* <DatePicker inline selected={this.state.startDate}  onChange={this.handleChange}/> */}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-7 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Recent Updates</h4>
              <div className="d-flex">
                <div className="d-flex align-items-center mr-4 text-muted font-weight-light">
                  <i className="mdi mdi-account-outline icon-sm mr-2"></i>
                  <span>jack Menqu</span>
                </div>
                <div className="d-flex align-items-center text-muted font-weight-light">
                  <i className="mdi mdi-clock icon-sm mr-2"></i>
                  <span>October 3rd, 2018</span>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-6 pr-1">
                  <img src={require("../../assets/images/dashboard/img_1.jpg")} className="mb-2 mw-100 w-100 rounded" alt="face" />
                  <img src={require("../../assets/images/dashboard/img_4.jpg")} className="mw-100 w-100 rounded" alt="face" />
                </div>
                <div className="col-6 pl-1">
                  <img src={require("../../assets/images/dashboard/img_2.jpg")} className="mb-2 mw-100 w-100 rounded" alt="face" />
                  <img src={require("../../assets/images/dashboard/img_3.jpg")} className="mw-100 w-100 rounded" alt="face " />
                </div>
              </div>
              <div className="d-flex mt-5 align-items-start">
                <img src={require("../../assets/images/faces/face3.jpg")} className="img-sm rounded-circle mr-3" alt="face" />
                <div className="mb-0 flex-grow">
                  <h5 className="mr-2 mb-2">School Website - Authentication Module.</h5>
                  <p className="mb-0 font-weight-light">It is a long established fact that a reader will be distracted by the readable content of a page.</p>
                </div>
                <div className="ml-auto">
                  <i className="mdi mdi-heart-outline text-muted"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

const ListItem = (props) => {

  return (
    <li className={(props.isCompleted ? 'completed' : null)}>
      <div className="form-check">
        <label htmlFor="" className="form-check-label">
          <input className="checkbox" type="checkbox"
            checked={props.isCompleted}
            onChange={props.changed}
          /> {props.children} <i className="input-helper"></i>
        </label>
      </div>
      <i className="remove mdi mdi-close-circle-outline" onClick={props.remove}></i>
    </li>
  )
};

export default Dashboard;