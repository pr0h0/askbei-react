import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Menu extends Component {
  render() {
    return (
      <div className="menu">
        <h1 className="title">Welcome to Askbei Dispatch</h1>
        <div className="menuitems">
          <Link to="/new_load">New load</Link>
          <Link to="/edit_load">Edit load</Link>
          <Link to="/accounting">Accounting</Link>
          <Link to="/customers">Customers</Link>
          <Link to="/new_driver">New Driver</Link>
          <Link to="/drivers_payments">Driver Payments</Link>
          <Link to="/stats">Stats</Link>
          <Link to="/options">Options</Link>
        </div>
      </div>
    );
  }
}
