import React, { Component } from "react";

import { connect } from "react-redux";

class Stats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      drivers: [],
      grossTotal: 0,
      driversTotal: 0,
      difference: 0,
      customerGrossTotal: 0,
      driverGrossTotal: 0,
      curentCustomer: null,
      curentDriver: null
    };
    this.calculate = this.calculate.bind(this);
    this.handleCustomerChange = this.handleCustomerChange.bind(this);
    this.handleDriverChange = this.handleDriverChange.bind(this);
  }
  calculate = () => {
    let data = this.props.data;
    if (data && !data.usefullInfo) {
      return;
    }
    let drivers = data.drivers.map(d => (
      <option key={d.id} value={d.id}>
        {d.man.name}
      </option>
    ));
    let customers = data.customers.map(c => (
      <option key={c.id} value={c.id}>
        {c.name}
      </option>
    ));
    let grossTotal = data.invoice.reduce((t, c) => {
      return (t +=
        parseInt(c.grossrate, 10).toString() !== NaN.toString()
          ? parseInt(c.grossrate, 10)
          : 0);
    }, 0);
    let driversTotal = data.invoice.reduce((t, c) => {
      return (t +=
        parseInt(c.deliveryrate, 10).toString() !== NaN.toString()
          ? parseInt(c.deliveryrate, 10)
          : 0);
    }, 0);
    let customerGrossTotal = this.state.customerGrossTotal || 0;
    if (data.customers.length) {
      let cc = (this.state.curentCustomer || data.customers[0].id) + "";
      customerGrossTotal = data.invoice.reduce((t, c) => {
        if (cc === c.customer) {
          return (t +=
            parseInt(c.grossrate, 10).toString() !== NaN.toString()
              ? parseInt(c.grossrate, 10)
              : 0);
        } else {
          return t;
        }
      }, 0);
    }
    let driverGrossTotal = this.state.driverGrossTotal || 0;
    if (data.drivers.length) {
      let cd = (this.state.curentDriver || data.drivers[0].id) + "";
      driverGrossTotal = data.invoice.reduce((t, c) => {
        if (cd === c.driver) {
          return (t +=
            parseInt(c.grossrate, 10).toString() !== NaN.toString()
              ? parseInt(c.grossrate, 10)
              : 0);
        } else {
          return t;
        }
      }, 0);
    }
    this.setState({
      drivers,
      customers,
      grossTotal,
      driversTotal,
      difference: grossTotal - driversTotal,
      driverGrossTotal,
      customerGrossTotal
    });
  };
  componentDidMount = () => {
    this.setState({}, this.calculate);
  };

  componentWillReceiveProps = nextProps => {
    this.setState({}, this.calculate);
  };
  handleCustomerChange = e => {
    e.persist();
    this.setState(
      { curentCustomer: parseInt(e.target.value, 10) },
      this.calculate
    );
  };
  handleDriverChange = e => {
    e.persist();
    this.setState(
      { curentDriver: parseInt(e.target.value, 10) },
      this.calculate
    );
  };
  render() {
    return (
      <div className="stats">
        {/* <div className="container"> */}
        <div className="box">
          <h3>Difference</h3>
          <table>
            <tbody>
              <tr>
                <th>Gross total</th>
                <th>Drivers total</th>
                <th>Difference</th>
              </tr>
              <tr>
                <td>{this.state.grossTotal}</td>
                <td>{this.state.driversTotal}</td>
                <td>{this.state.difference}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="box">
          <h3>This yer total gross by customer</h3>
          <select onChange={this.handleCustomerChange}>
            {this.state.customers}
          </select>
          <p>Gross total: {this.state.customerGrossTotal}$</p>
        </div>
        <div className="box">
          <h3>This yer total gross by driver</h3>
          <select onChange={this.handleDriverChange}>
            {this.state.drivers}
          </select>
          <p>Gross total: {this.state.driverGrossTotal}$</p>
        </div>
        {/* </div> */}
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
  {}
)(Stats);
