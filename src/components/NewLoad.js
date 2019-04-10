import React, { Component } from "react";
import { connect } from "react-redux";
import { saveData } from "../actions/dataAction";

class NewLoad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nextLoadId: 0,
      customer: 0,
      driver: 0,
      pickupdate: new Date(),
      pickuplocation: "",
      deliverydate: new Date(),
      deliverylocation: "",
      grossrate: 0,
      deliveryrate: 0,
      loadNumber: "",
      customers: [],
      drivers: []
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.generateSelects = this.generateSelects.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleCustomerChange = this.handleCustomerChange.bind(this);
    this.handleDriverChange = this.handleDriverChange.bind(this);
    this.handleLoadChange = this.handleLoadChange.bind(this);
  }
  componentDidMount = () => {
    if (this.props.data.usefullInfo) {
      this.setState(
        {
          nextLoadId: this.props.data.usefullInfo.nextLoadId
        },
        this.generateSelects
      );
    }
  };

  componentWillReceiveProps = nextProps => {
    this.setState(
      {
        nextLoadId: nextProps.data.usefullInfo.nextLoadId
      },
      this.generateSelects
    );
  };
  generateSelects = () => {
    let drivers = this.props.data.drivers.map(d => (
      <option key={d.id} value={d.id} selected={this.state.driver === d.id}>
        {d.man.name}
      </option>
    ));
    let customers = this.props.data.customers.map(d => (
      <option key={d.id} value={d.id} selected={this.state.customer === d.id}>
        {d.name}
      </option>
    ));
    let loads = this.props.data.load.map(l => (
      <option key={l.id} value={l.id}>
        {l.loadName}
      </option>
    ));
    this.refs["deliverydate"].valueAsDate = new Date();
    this.refs["pickupdate"].valueAsDate = new Date();
    let driver = !this.state.driver
      ? this.props.data.drivers.length && this.props.data.drivers[0].id
      : this.state.driver;
    let customer = !this.state.customer
      ? this.props.data.customers.length && this.props.data.customers[0].id
      : this.state.customer;
    this.setState({
      loads,
      drivers,
      customers,
      driver,
      customer
    });
  };
  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleDateChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleSubmit(e) {
    e.preventDefault();
    let state = { ...this.state };
    state.loadName = state.nextLoadId + "";
    state.id = Date.now() + "";
    state.accounted = false;
    // state.driver = d
    delete state["nextLoadId"];
    delete state["drivers"];
    delete state["customers"];
    delete state["loads"];
    let load = this.props.data.load;
    load.push(state);
    let usefullInfo = this.props.data.usefullInfo;
    usefullInfo.nextLoadId++;
    this.props.saveData({ ...this.props.data, load, usefullInfo });
    this.props.history.push("/");
    window.tosNotification([
      { title: "Added", text: "Load added", className: "green" }
    ]);
  }
  handleCustomerChange = e => {
    e.persist();
    this.setState(
      {
        customer: e.target.value
      },
      this.generateSelects
    );
  };
  handleDriverChange = e => {
    e.persist();
    this.setState(
      {
        driver: e.target.value
      },
      this.generateSelects
    );
  };
  handleLoadChange(e) {
    e.persist();
    let id = e.target.value;
    let load = this.props.data.load.filter(l => l.id === id);
    this.setState(
      {
        ...this.state,
        ...load[0]
      },
      this.generateSelects
    );
  }
  render() {
    return (
      <form className="newload" onSubmit={this.handleSubmit}>
        <div className="input">
          <label>Duplicate load</label>
          <select onChange={this.handleLoadChange} name="duplicateLoad">
            {this.state.loads}
          </select>
        </div>
        <div className="input">
          <label>Load ID</label>
          <input
            type="number"
            value={this.state.nextLoadId}
            onChange={this.handleInputChange}
            name="nextLoadId"
          />
        </div>
        <div className="input">
          <label>Customer</label>
          <select onChange={this.handleCustomerChange}>
            {this.state.customers}
          </select>
        </div>
        <div className="input">
          <label>Load number</label>
          <input
            type="text"
            value={this.state.loadNumber}
            onChange={this.handleInputChange}
            name="loadNumber"
          />
        </div>
        <div className="input">
          <label>Pick up date</label>
          <input
            type="date"
            ref="pickupdate"
            onChange={this.handleDateChange}
            name="pickupdate"
          />
        </div>
        <div className="input">
          <label>Pick up location</label>
          <input
            type="text"
            value={this.state.pickuplocation}
            onChange={this.handleInputChange}
            name="pickuplocation"
          />
        </div>
        <div className="input">
          <label>Delivery date</label>
          <input
            type="date"
            ref="deliverydate"
            onChange={this.handleDateChange}
            name="deliverydate"
          />
        </div>
        <div className="input">
          <label>Delivery location</label>
          <input
            type="text"
            value={this.state.deliverylocation}
            onChange={this.handleInputChange}
            name="deliverylocation"
          />
        </div>
        <div className="input">
          <label>Gross rate</label>
          <input
            type="number"
            value={this.state.grossrate}
            onChange={this.handleInputChange}
            name="grossrate"
          />
        </div>
        <div className="input">
          <label>Driver rate</label>
          <input
            type="number"
            value={this.state.deliveryrate}
            onChange={this.handleInputChange}
            name="deliveryrate"
          />
        </div>
        <div className="input">
          <label>Assign to driver</label>
          <select onChange={this.handleDriverChange}>
            {this.state.drivers}
          </select>
        </div>
        <div className="input">
          <input type="submit" value="Save" />
        </div>
      </form>
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
)(NewLoad);
