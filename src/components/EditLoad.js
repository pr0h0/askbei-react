import React, { Component } from "react";
import { connect } from "react-redux";
import { saveData } from "../actions/dataAction";

class EditLoad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      loadName: 0,
      customer: 0,
      driver: 0,
      pickupdate: new Date(),
      pickuplocation: "",
      deliverydate: new Date(),
      deliverylocation: "",
      grossrate: 0,
      accounted: false,
      deliveryrate: 0,
      loadNumber: 0,
      customers: [],
      drivers: [],
      loads: [],
      load: [],
      allLoads: [],
      searchQuery: ""
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.generateSelects = this.generateSelects.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleCustomerChange = this.handleCustomerChange.bind(this);
    this.handleDriverChange = this.handleDriverChange.bind(this);
    this.handleLoadChange = this.handleLoadChange.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }
  componentDidMount = () => {
    if (this.props.data.load && !this.props.data.load.length) {
      alert("No loads found");
      this.props.history.push("/");
      return;
    }
    if (this.props.data.load && this.props.data.load.length) {
      let load = this.props.data.load[0];
      this.setState(
        {
          ...load,
          load: this.props.data.load,
          allLoads: this.props.data.load
        },
        this.generateSelects
      );
    }
  };

  componentWillReceiveProps = nextProps => {
    if (!nextProps.data.load.length) {
      alert("No loads found");
      this.props.history.push("/");
      return;
    }

    let load = nextProps.data.load[0];
    this.setState(
      { ...load, load: nextProps.data.load, allLoads: nextProps.data.load },
      this.generateSelects
    );
  };
  generateSelects = () => {
    let drivers = this.props.data.drivers.map(d => {
      return (
        <option key={d.id} value={d.id} selected={d.id === this.state.driver}>
          {d.man.name}
        </option>
      );
    });
    let customers = this.props.data.customers.map(d => (
      <option key={d.id} value={d.id} selected={d.id === this.state.customer}>
        {d.name}
      </option>
    ));
    let loads = this.state.load.map(d => (
      <option key={d.id} value={d.id} selected={d.id === this.state.id}>
        {d.loadName}
      </option>
    ));
    this.refs["deliverydate"].valueAsDate = new Date(this.state.deliverydate);
    this.refs["pickupdate"].valueAsDate = new Date(this.state.pickupdate);
    this.setState({
      drivers,
      customers,
      loads
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
    state["driver"] = state.driver || state.drivers;
    delete state["drivers"];
    delete state["customers"];
    delete state["loads"];
    delete state['load'];
    delete state["searchQuery"];
    let load = this.props.data.load;
    load[load.findIndex(l => l.id === state.id)] = state;
    this.props.saveData({ ...this.props.data, load: load });
    this.props.history.push("/");
    window.tosNotification([
      { title: "Edited", text: "Load edited", className: "green" }
    ]);
  }
  handleCustomerChange = e => {
    e.persist();
    this.setState({
      customer: e.target.value
    });
  };
  handleDriverChange = e => {
    e.persist();
    this.setState({
      driver: e.target.value
    });
  };
  handleLoadChange = e => {
    e.persist();
    let id = e.target.value;
    let load = this.state.load.filter(l => l.id === id);
    if (load.length) {
      load = load[0];
      load = { ...load, drivers: this.state.drivers };
      delete load["drivers"];
      this.setState(load, this.generateSelects);
    } else {
      alert("Load not found?");
      this.props.history.push("/");
    }
  };
  handleCheckBoxChange(e) {
    e.persist();
    this.setState({
      accounted: !this.state.accounted
    });
  }
  handleSearch(e) {
    if (this.state.searchQuery === "") {
      this.setState(
        {
          load: this.state.allLoads
        },
        () => {
          this.generateSelects();
          this.handleLoadChange({
            target: { value: this.state.load[0].id },
            persist: () => {}
          });
        }
      );
    } else {
      let load = this.state.allLoads.filter(
        l =>
          l.loadNumber
            .toLowerCase()
            .indexOf(this.state.searchQuery.toLowerCase()) !== -1
      );
      this.setState({ load }, () => {
        this.generateSelects();
        if (this.state.load.length) {
          this.handleLoadChange({
            target: { value: this.state.load[0].id },
            persist: () => {}
          });
        } else {
          document
            .querySelectorAll(".editload input:not([type=submit]")
            .forEach(x => (x.value = ""));
        }
      });
    }
  }
  render() {
    return (
      <form className="newload" onSubmit={this.handleSubmit}>
        <div className="input">
          <input
            type="text"
            value={this.state.searchQuery}
            name="searchQuery"
            onChange={this.handleInputChange}
            placeholder="Search by load number"
          />
          <button type="button" onClick={this.handleSearch}>
            Search
          </button>
        </div>
        <div className="input">
          <label>Loads</label>
          <select onChange={this.handleLoadChange}>{this.state.loads}</select>
        </div>
        <div className="input">
          <label>Load ID</label>
          <input
            type="number"
            value={this.state.loadName}
            onChange={this.handleInputChange}
            name="loadName"
          />
        </div>
        <div className="input">
          <label>Accounted</label>
          <input
            type="checkbox"
            onChange={this.handleCheckBoxChange}
            name="accounted"
            checked={this.state.accounted === true}
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
            name="loadName"
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
)(EditLoad);
