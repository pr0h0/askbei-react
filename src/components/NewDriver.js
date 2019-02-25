import React, { Component } from "react";
import { connect } from "react-redux";
import { saveData } from "../actions/dataAction";
import { Link } from "react-router-dom";

class NewDriver extends Component {
  constructor() {
    super();
    this.state = {
      man: {
        name: "",
        driverid: "",
        address: "",
        phonenumber: "",
        email: "",
        ssn: "",
        dln: "",
        dlnex: new Date(),
        mcex: new Date()
      },
      tractor: {
        un: "",
        vin: "",
        my: "",
        model: "",
        dldot: new Date(),
        btipn: ""
      },
      trailer: {
        un: "",
        vin: "",
        my: "",
        model: "",
        dldot: new Date()
      },
      manClass: "show",
      tractorClass: "hide",
      trailerClass: "hide"
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleInputChange(e) {
    this.setState({
      [e.target.parentNode.parentNode.id]: {
        ...this.state[e.target.parentNode.parentNode.id],
        [e.target.name]: e.target.value
      }
    });
  }
  componentDidMount() {
    this.refs["mcex"].valueAsDate = new Date();
    this.refs["dlnex"].valueAsDate = new Date();
    this.refs["tdldot"].valueAsDate = new Date();
    this.refs["ydldot"].valueAsDate = new Date();
  }
  handleSubmit(e) {
    e.preventDefault();
    let data = this.props.data;
    let drivers = data.drivers;
    let state = this.state;
    state["id"] = Date.now() + "";
    delete state["manClass"];
    delete state["trailerClass"];
    delete state["tractorClass"];
    drivers.push(state);
    data.drivers = drivers;
    this.props.saveData(data);
    this.props.history.push("/");
    window.tosNotification([
      { title: "Added", text: "Driver added", className: "green" }
    ]);
  }
  render() {
    return (
      <div className="newdriver">
        <div className="switch">
          <Link to="/new_driver" className="active">
            New driver
          </Link>
          <Link to="/edit_driver">Edit driver</Link>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className={`box ${this.state.manClass}`} id="man">
            <div className="input">
              <input
                type="text"
                onChange={this.handleInputChange}
                value={this.state.man.name}
                placeholder="Name"
                name="name"
              />
            </div>
            <div className="input">
              <input
                type="number"
                onChange={this.handleInputChange}
                value={this.state.man.driverid}
                placeholder="Driver ID"
                name="driverid"
              />
            </div>
            <div className="input">
              <input
                type="text"
                onChange={this.handleInputChange}
                value={this.state.man.address}
                placeholder="Address"
                name="address"
              />
            </div>
            <div className="input">
              <input
                type="text"
                onChange={this.handleInputChange}
                value={this.state.man.phonenumber}
                placeholder="Phone number"
                name="phonenumber"
              />
            </div>
            <div className="input">
              <input
                type="text"
                onChange={this.handleInputChange}
                value={this.state.man.email}
                placeholder="Email"
                name="email"
              />
            </div>
            <div className="input">
              <input
                type="text"
                onChange={this.handleInputChange}
                value={this.state.man.ssn}
                placeholder="SSN"
                name="ssn"
              />
            </div>
            <div className="input">
              <input
                type="text"
                onChange={this.handleInputChange}
                value={this.state.man.dln}
                placeholder="Driving License Number"
                name="dln"
              />
            </div>
            <div className="input">
              <label>Driving License Exp. Date</label>
              <input
                type="date"
                onChange={this.handleInputChange}
                name="dlnex"
                ref="dlnex"
              />
            </div>
            <div className="input">
              <label>Medical Card Exp. Date</label>
              <input
                type="date"
                onChange={this.handleInputChange}
                name="mcex"
                ref="mcex"
              />
            </div>
          </div>
          <h3
            onClick={() =>
              this.setState({
                tractorClass:
                  this.state.tractorClass === "show" ? "hide" : "show"
              })
            }
          >
            Tractor Unit informations
          </h3>
          <div id="tractor" className={`box ${this.state.tractorClass}`}>
            <div className="input">
              <input
                type="text"
                onChange={this.handleInputChange}
                value={this.state.tractor.un}
                placeholder="Unit number"
                name="un"
              />
            </div>
            <div className="input">
              <input
                type="text"
                onChange={this.handleInputChange}
                value={this.state.tractor.vin}
                placeholder="VIN"
                name="vin"
              />
            </div>
            <div className="input">
              <input
                type="text"
                onChange={this.handleInputChange}
                value={this.state.tractor.my}
                placeholder="Make year"
                name="my"
              />
            </div>
            <div className="input">
              <input
                type="text"
                onChange={this.handleInputChange}
                value={this.state.tractor.model}
                placeholder="Model"
                name="model"
              />
            </div>
            <div className="input">
              <label>Date of last DOT inspection</label>
              <input
                type="date"
                onChange={this.handleInputChange}
                name="dldot"
                ref="tdldot"
              />
            </div>
            <div className="input">
              <input
                type="text"
                onChange={this.handleInputChange}
                value={this.state.tractor.btipn}
                placeholder="Bobtail Insurance Policy Number"
                name="btipn"
              />
            </div>
          </div>
          <h3
            onClick={() =>
              this.setState({
                trailerClass:
                  this.state.trailerClass === "show" ? "hide" : "show"
              })
            }
          >
            Trailer Unit informations
          </h3>
          <div id="trailer" className={`box ${this.state.trailerClass}`}>
            <div className="input">
              <input
                type="text"
                onChange={this.handleInputChange}
                value={this.state.trailer.un}
                placeholder="Unit number"
                name="un"
              />
            </div>
            <div className="input">
              <input
                type="text"
                onChange={this.handleInputChange}
                value={this.state.trailer.vin}
                placeholder="VIN"
                name="vin"
              />
            </div>
            <div className="input">
              <input
                type="text"
                onChange={this.handleInputChange}
                value={this.state.trailer.my}
                placeholder="Make year"
                name="my"
              />
            </div>
            <div className="input">
              <input
                type="text"
                onChange={this.handleInputChange}
                value={this.state.trailer.model}
                placeholder="Model"
                name="model"
              />
            </div>
            <div className="input">
              <label>Date of last DOT inspection</label>
              <input
                type="date"
                onChange={this.handleInputChange}
                name="dldot"
                ref="ydldot"
              />
            </div>
          </div>
          <div className="input">
            <input type="submit" value="Save driver" />
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state.data.data
  };
};
export default connect(
  mapStateToProps,
  { saveData }
)(NewDriver);
