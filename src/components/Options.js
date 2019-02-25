import React, { Component } from "react";
import { connect } from "react-redux";
import { saveData } from "../actions/dataAction";
class Options extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nextLoadId: 0,
      dueNetDays: 0,
      unitNo: "",
      payslipNo: 0,
      invoiceNo: 0
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearAll = this.clearAll.bind(this);
  }
  componentDidMount = () => {
    if (this.props.data.usefullInfo) {
      this.setState({
        nextLoadId: this.props.data.usefullInfo.nextLoadId,
        dueNetDays: this.props.data.usefullInfo.dueNetDays,
        unitNo: this.props.data.usefullInfo.unitNo,
        payslipNo: this.props.data.usefullInfo.payslipNo,
        invoiceNo: this.props.data.usefullInfo.invoiceNo
      });
    }
  };

  componentWillReceiveProps = nextProps => {
    this.setState({
      nextLoadId: nextProps.data.usefullInfo.nextLoadId,
      dueNetDays: nextProps.data.usefullInfo.dueNetDays,
      unitNo: nextProps.data.usefullInfo.unitNo,
      payslipNo: nextProps.data.usefullInfo.payslipNo,
      invoiceNo: nextProps.data.usefullInfo.invoiceNo
    });
  };

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.saveData({ ...this.props.data, usefullInfo: this.state });
    this.props.history.push("/");
    window.tosNotification([
      { title: "Saved", text: "Options saved", className: "green" }
    ]);
  }
  clearAll() {
    if (window.confirm("Are you sure?")) {
      this.props.saveData(
        {
          customers: [],
          drivers: [],
          invoice: [],
          payslip: [],
          load: [],
          usefullInfo: {
            nextLoadId: 160001,
            dueNetDays: 30,
            unitNo: "UNIT 4593",
            payslipNo: 201910,
            invoiceNo: 1000
          }
        },
        () => {
          this.props.history.push("/");
          window.tosNotification([
            { title: "Cleared", text: "Data cleared", className: "red" }
          ]);
        }
      );
    }
  }
  render() {
    return (
      <form className="options" onSubmit={this.handleSubmit}>
        <div className="input">
          <label>Next load ID</label>
          <input
            type="number"
            value={this.state.nextLoadId}
            onChange={this.handleInputChange}
            name="nextLoadId"
          />
        </div>
        <div className="input">
          <label>Due net days</label>
          <input
            type="number"
            value={this.state.dueNetDays}
            onChange={this.handleInputChange}
            name="dueNetDays"
          />
        </div>
        <div className="input">
          <label>Unit number</label>
          <input
            type="text"
            value={this.state.unitNo}
            onChange={this.handleInputChange}
            name="unitNo"
          />
        </div>
        <div className="input">
          <label>Payslip NO</label>
          <input
            type="number"
            value={this.state.payslipNo}
            onChange={this.handleInputChange}
            name="payslipNo"
          />
        </div>
        <div className="input">
          <label>Invoice NO</label>
          <input
            type="number"
            value={this.state.invoiceNo}
            onChange={this.handleInputChange}
            name="invoiceNo"
          />
        </div>
        <div className="input">
          <input type="submit" value="Save" />
        </div>
        <div className="input">
          <button onClick={this.clearAll}>Clear all</button>
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
)(Options);
