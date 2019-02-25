import React, { Component } from "react";
import { connect } from "react-redux";
import { saveData } from "../actions/dataAction";
import { Link } from "react-router-dom";

class EditDriver extends Component {
  constructor() {
    super();
    this.state = {
      drivers: [],
      curentDriver: null,
      man: {
        name: "",
        driverid: "",
        address: "",
        phonenumber: "",
        email: "",
        ssn: "",
        dln: "",
        dlnex: "",
        mcex: ""
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
    this.generateSelects = this.generateSelects.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }
  handleInputChange(e) {
    this.setState({
      [e.target.parentNode.parentNode.id]: {
        ...this.state[e.target.parentNode.parentNode.id],
        [e.target.name]: e.target.value
      }
    });
  }
  handleSelectChange(e) {
    e.persist();
    let id = e.target.value;
    let driver = this.props.data.drivers.filter(d => d.id === id)[0];
    this.setState({ ...this.state, ...driver }, this.generateSelects);
  }
  componentDidMount() {
    if (
      this.props.data.drivers &&
      this.props.data.drivers.length &&
      !this.state.curentDriver
    ) {
      this.setState(
        {
          ...this.props.data.drivers[0],
          curentDriver: this.props.data.drivers[0].id
        },
        this.generateSelects
      );
    }
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.data.drivers &&
      nextProps.data.drivers.length &&
      !this.state.curentDriver
    ) {
      this.setState(
        {
          ...nextProps.data.drivers[0],
          curentDriver: nextProps.data.drivers[0].id
        },
        this.generateSelects
      );
    } else if (!nextProps.data.drivers.length) {
      alert("No drivers found");
      this.props.history.goBack();
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    let data = this.props.data;
    let drivers = data.drivers;
    let state = this.state;
    let id = drivers.findIndex(d => d.id === state.id);
    delete state["drivers"];
    delete state["manClass"];
    delete state["trailerClass"];
    delete state["tractorClass"];
    delete state["curentDriver"];
    drivers[id] = state;
    data.drivers = drivers;
    this.props.saveData(data);
    this.props.history.push("/");
    window.tosNotification([
      { title: "Edited", text: "Driver edited", className: "green" }
    ]);
  }
  generateSelects() {
    let drivers = this.props.data.drivers.map(d => (
      <option
        key={d.id}
        value={d.id}
        selected={this.state.curentDriver === d.id}
      >
        {d.man.name}
      </option>
    ));

    this.refs["mcex"].valueAsDate = new Date(this.state.man.mcex);
    this.refs["dlnex"].valueAsDate = new Date(this.state.man.dlnex);
    this.refs["tdldot"].valueAsDate = new Date(this.state.tractor.dldot);
    this.refs["ydldot"].valueAsDate = new Date(this.state.trailer.dldot);

    this.setState({
      drivers
    });
  }
  render() {
    return (
      <div className="newdriver">
        <div className="switch">
          <Link to="/new_driver">New driver</Link>
          <Link to="/edit_driver" className="active">
            Edit driver
          </Link>
        </div>
        <form onSubmit={this.handleSubmit}>
          <select onChange={this.handleSelectChange}>
            {this.state.drivers}
          </select>
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
                value={this.state.trailer.phonenumber}
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
)(EditDriver);
