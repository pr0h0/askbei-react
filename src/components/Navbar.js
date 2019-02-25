import React, { Component } from "react";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { fetchData } from "../actions/dataAction";

class Navbar extends Component {
  componentDidMount = () => {
    this.props.fetchData();
    if (window.location.href.endsWith(".html")) {
      this.props.history.push("/");
    }
  };
  render() {
    if (this.props.location.pathname === "/") {
      return "";
    }
    return (
      <div className="navbar">
        <Link to="/">Back</Link>
        <h1>{this.props.location.pathname.slice(1).replace("_", " ")}</h1>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.data.data
});

export default connect(
  mapStateToProps,
  { fetchData }
)(Navbar);
