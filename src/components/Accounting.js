import React, { Component } from "react";

import { connect } from "react-redux";
import { saveData, generateInvoice } from "../actions/dataAction";
class Accounting extends Component {
  constructor() {
    super();
    this.state = {
      modalClass: "hide",
      fromDate: new Date(Date.now() - 7 * 24 * 3600 * 1000),
      toDate: new Date(Date.now()),
      curentLoads: [],
      allLoads: [],
      curentRemainingLoad: "",
      remainingLoads: [],
      pdf: {
        fileName: "",
        folder: "",
        invoceDate: new Date(),
        invoiceNumber: 0,
        loadNumber: 0,
        amountDue: 0,
        dueNetDays: 0,
        customer: "",
        driver: "",
        load: "",
        loadRowData: {
          pickupdate: new Date(),
          pickuplocation: "",
          deliverydate: new Date(),
          deliverylocation: ""
        }
      },
      ytd: {
        customers: [],
        loads: [],
        info: {
          payed: 0,
          should: 0,
          debt: 0
        }
      }
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.generateSelects = this.generateSelects.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.MhandleInputChange = this.MhandleInputChange.bind(this);
    this.updateModal = this.updateModal.bind(this);
    this.generatePDF = this.generatePDF.bind(this);
    this.handleCustomerChange = this.handleCustomerChange.bind(this);
    this.generateYTD = this.generateYTD.bind(this);
    this.handleYTDSave = this.handleYTDSave.bind(this);
  }
  componentDidMount() {
    if (this.props.data.load && this.props.data.load.length) {
      let customers = [];
      if (this.props.data.customers.length) {
        customers = this.props.data.customers.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ));
      }
      this.setState(
        {
          ytd: { ...this.state.ytd, customers: [customers] },
          allLoads: this.props.data.load,
          usefullInfo: this.props.data.usefullInfo
        },
        () => {
          this.generateSelects();
          this.handleCustomerChange({
            persist: () => {},
            target: this.refs["customerSelect"]
          });
        }
      );
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data.load && nextProps.data.load.length) {
      let customers = [];
      if (nextProps.data.customers.length) {
        customers = nextProps.data.customers.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ));
      }
      this.setState(
        {
          ytd: { ...this.state.ytd, customers: [customers] },
          allLoads: nextProps.data.load,
          usefullInfo: nextProps.data.usefullInfo
        },
        () => {
          this.generateSelects();
          this.handleCustomerChange({
            persist: () => {},
            target: this.refs["customerSelect"]
          });
        }
      );
    }
  }
  generateSelects() {
    let loads = this.state.allLoads;
    loads = loads.filter(
      l =>
        !l.accounted &&
        new Date(l.pickupdate) <= new Date(this.state.toDate) &&
        new Date(l.pickupdate) >= new Date(this.state.fromDate)
    );
    this.refs.fromDate.valueAsDate = new Date(this.state.fromDate);
    this.refs.toDate.valueAsDate = new Date(this.state.toDate);
    let remainingLoads = loads.map(l => (
      <option
        key={l.id}
        value={l.id}
        selected={l.id === this.state.curentRemainingLoad}
      >
        {l.loadName}
      </option>
    ));
    let curentRemainingLoad = this.state.curentRemainingLoad;
    if (!curentRemainingLoad && loads.length) {
      curentRemainingLoad = loads[0].id;
    }
    this.setState({
      curentLoads: loads,
      remainingLoads,
      modalClass: "hide",
      curentRemainingLoad
    });
  }
  handleDateChange(e) {
    this.setState(
      {
        [e.target.name]: new Date(e.target.value)
      },
      this.generateSelects
    );
  }
  handleInputChange(e) {
    this.setState(
      {
        [e.target.name]: e.target.value
      },
      this.generateSelects
    );
  }
  handleSelectChange(e) {
    e.persist();
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  toggleModal() {
    this.setState(
      {
        modalClass: this.state.modalClass === "show" ? "hide" : "show"
      },
      () => {
        if (this.state.modalClass === "show") {
          this.updateModal();
        }
      }
    );
  }
  MhandleInputChange(e) {
    this.setState({
      pdf: { ...this.state.pdf, [e.target.name]: e.target.value }
    });
  }
  updateModal() {
    let load = this.state.curentLoads.filter(
      l => l.id === this.state.curentRemainingLoad
    )[0];
    this.refs.invoiceDate.valueAsDate = new Date();
    let pdf = {
      loadName: load.loadName,
      fileName: ".pdf",
      invoiceDate: new Date(),
      invoiceNumber:
        "" +
        this.props.data.drivers.filter(d => d.id === load.driver)[0].man
          .driverid +
        this.state.usefullInfo.invoiceNo,
      loadNumber: "",
      amountDue: load.grossrate,
      dueNetDays: this.state.usefullInfo.dueNetDays,
      loadRowData: {
        pickupdate: this.shortDate(load.pickupdate),
        pickuplocation: load.pickuplocation,
        deliverydate: this.shortDate(load.deliverydate),
        deliverylocation: load.deliverylocation
      }
    };
    this.setState({
      pdf
    });
  }
  shortDate(d) {
    let day = new Date(d).getDate();
    let month = new Date(d).getMonth() + 1;
    let year = new Date(d).getFullYear();
    return [
      month.toString().length === 1 ? "0" + month : month,
      day.toString().length === 1 ? "0" + day : day,
      year
    ].join("-");
  }
  generatePDF() {
    let data = this.props.data;
    let state = this.state;
    let pdf = state.pdf;
    if (!pdf.folder) {
      window.tosNotification([
        { title: "Error", text: "Select folder", className: "red" }
      ]);
      return;
    }
    let load = state.allLoads.filter(
      l => l.id === state.curentRemainingLoad
    )[0];
    pdf = { ...pdf, invoiceDate: this.shortDate(pdf.invoiceDate) };
    let invoice = {
      load: load.id,
      customer: load.customer,
      driver: load.driver,
      grossrate: load.grossrate,
      deliveryrate: load.deliveryrate,
      pickupdate: this.shortDate(load.pickupdate),
      invoiceNumber: pdf.invoiceNumber,
      invoiceDate: this.shortDate(pdf.invoiceDate),
      datePayed: null
    };
    let tempInvoice = data.invoice;
    tempInvoice.push(invoice);
    data.invoice = tempInvoice;
    data.usefullInfo.invoiceNo++;
    data.load[data.load.findIndex(l => l.id === load.id)].accounted = true;
    this.props.generateInvoice(data, pdf);
    this.props.history.push("/");
    window.tosNotification([
      { title: "Done!", text: "PDF Generated", className: "green" }
    ]);
  }
  handleCustomerChange(e) {
    e.persist();
    let id = e.target.value;
    let invoices = this.props.data.invoice.filter(i => i.customer === id);
    this.setState(
      { ytd: { ...this.state.ytd, customer: id, loadsData: [...invoices] } },
      this.generateYTD
    );
  }
  generateYTD(e) {
    let payed = 0,
      should = 0,
      debt = 0;
    let loads = this.state.ytd.loadsData.map(l => {
      should +=
        parseInt(l.grossrate, 10).toString() !== NaN.toString()
          ? parseInt(l.grossrate, 10)
          : 0;
      if (l.datePayed) {
        payed +=
          parseInt(l.grossrate, 10).toString() !== NaN.toString()
            ? parseInt(l.grossrate, 10)
            : 0;
      } else {
        debt +=
          parseInt(l.grossrate, 10).toString() !== NaN.toString()
            ? parseInt(l.grossrate, 10)
            : 0;
      }
      return (
        <tr key={l.invoiceNumber}>
          <td>
            {this.props.data.customers.filter(c => c.id === l.customer)[0].name}
          </td>
          <td>{l.invoiceNumber}</td>
          <td>{this.shortDate(l.invoiceDate)}</td>
          <td>{l.grossrate}</td>
          <td>
            <input
              type="date"
              className={"date" + l.invoiceNumber}
              onChange={this.handleYTDDateChange}
            />
          </td>
          <td>
            <button id={l.invoiceNumber} onClick={this.handleYTDSave}>
              Save
            </button>
          </td>
        </tr>
      );
    });
    this.setState(
      {
        ytd: {
          ...this.state.ytd,
          loads,
          info: {
            should,
            payed,
            debt
          }
        }
      },
      () => {
        this.state.ytd.loadsData.forEach(l => {
          document.querySelector(".date" + l.invoiceNumber).valueAsDate =
            l.datePayed !== null ? new Date(this.shortDate(l.datePayed)) : null;
        });
      }
    );
  }
  handleYTDSave(e) {
    let id = e.target.id;
    let invoice = this.props.data.invoice;
    let cin = invoice.filter(i => i.invoiceNumber === id)[0];
    cin.datePayed =
      document.querySelector(".date" + id).value === ""
        ? null
        : this.shortDate(
            new Date(document.querySelector(".date" + id).value).getTime() +
              24 * 3600 * 1000
          );
    invoice = invoice.map(i => {
      if (i.invoiceNumber === id) {
        return cin;
      } else {
        return i;
      }
    });
    let data = this.props.data;
    data.invoice = invoice;
    window.tosNotification([
      { title: "Updated", text: " ", className: "green" }
    ]);
    this.props.saveData(data);
    this.generateYTD();
  }
  render() {
    return (
      <div className="accounting">
        <div className="wrap">
          <div className="input">
            <label>From date</label>
            <input
              type="date"
              onChange={this.handleDateChange}
              name="fromDate"
              ref="fromDate"
            />
          </div>
          <div className="input">
            <label>To date</label>
            <input
              type="date"
              onChange={this.handleDateChange}
              name="toDate"
              ref="toDate"
            />
          </div>
          <div className="input">
            <select
              onChange={this.handleSelectChange}
              name="curentRemainingLoad"
            >
              {this.state.remainingLoads}
            </select>
          </div>
          <div className="input">
            <input
              type="submit"
              value="Convert load to invoice"
              disabled={this.state.remainingLoads.length === 0}
              onClick={this.toggleModal}
            />
          </div>
          <div className="input">
            <select onChange={this.handleCustomerChange} ref="customerSelect">
              {this.state.ytd.customers}
            </select>
          </div>
          <div className="input">
            <input
              type="submit"
              value="Year to date information"
              disabled={!this.state.ytd.customers.length}
              onClick={this.generateYTD}
            />
          </div>
          <table>
            <tbody>
              <tr>
                <th>Customer</th>
                <th>Invoice number</th>
                <th>Date submited</th>
                <th>Amount</th>
                <th>Date payed</th>
                <th>Action</th>
              </tr>
              <tr>
                <td colSpan={6}>
                  <hr style={{ width: "100%", border: "1px solid #000" }} />
                </td>
              </tr>
              {this.state.ytd.loads}
              <tr>
                <td colSpan={6}>
                  <hr style={{ width: "100%", border: "1px solid #000" }} />
                </td>
              </tr>
              <tr>
                <th>Payed so far</th>
                <td>{this.state.ytd.info.payed}</td>
                <th>Should pay</th>
                <td>{this.state.ytd.info.should}</td>
                <th>In debt</th>
                <td>{this.state.ytd.info.debt}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={`modal ${this.state.modalClass}`}>
          <div className="wrap">
            <h3 style={{ position: "relative" }}>
              Invoice data
              <span
                style={{
                  position: "absolute",
                  right: "10px",
                  color: "#f33",
                  cursor: "pointer"
                }}
                onClick={this.toggleModal}
              >
                X
              </span>
            </h3>
            <div className="input">
              <label>File name</label>
              <input
                type="text"
                onChange={this.MhandleInputChange}
                value={this.state.pdf.fileName}
                name="fileName"
              />
            </div>
            <div className="input">
              <label>Folder</label>
              <input
                type="file"
                webkitdirectory="true"
                onChange={e => {
                  this.setState({
                    pdf: { ...this.state.pdf, folder: e.target.files[0].path }
                  });
                }}
                name="folder"
              />
            </div>
            <hr style={{ border: "1px solid #000", margin: "2.5px 0" }} />
            <div className="input">
              <label>Invoice date</label>
              <input
                type="date"
                onChange={e => {
                  this.setState({
                    pdf: {
                      ...this.state.pdf,
                      invoceDate: new Date(e.target.value)
                    }
                  });
                }}
                ref="invoiceDate"
              />
            </div>
            <div className="input">
              <label>Invoice number</label>
              <input
                type="text"
                name="invoiceNumber"
                value={this.state.pdf.invoiceNumber}
                onChange={this.MhandleInputChange}
              />
            </div>
            <div className="input">
              <label>Load number</label>
              <input
                type="text"
                name="loadNumber"
                value={this.state.pdf.loadNumber}
                onChange={this.MhandleInputChange}
              />
            </div>

            <div className="table">
              <div className="row">
                <div className="th">Load date</div>
                <div className="th">Load Location</div>
                <div className="th">Deliver Date</div>
                <div className="th">Deliver Location</div>
              </div>
              <div className="row">
                <div className="td">
                  {this.shortDate(this.state.pdf.loadRowData.pickupdate)}
                </div>
                <div className="td">
                  {this.state.pdf.loadRowData.pickuplocation}
                </div>
                <div className="td">
                  {this.shortDate(this.state.pdf.loadRowData.deliverydate)}
                </div>
                <div className="td">
                  {this.state.pdf.loadRowData.deliverylocation}
                </div>
              </div>
            </div>
            <div className="input">
              <label>Amount due</label>
              <input
                type="text"
                name="amountDue"
                value={this.state.pdf.amountDue}
                onChange={this.MhandleInputChange}
              />
            </div>
            <div className="input">
              <label>Due net days</label>
              <input
                type="text"
                name="dueNetDays"
                value={this.state.pdf.dueNetDays}
                onChange={this.MhandleInputChange}
              />
            </div>
            <div className="input">
              <input
                type="submit"
                style={{ backgroundColor: "#08f" }}
                value="Generate PDF"
                onClick={this.generatePDF}
              />
            </div>
          </div>
        </div>
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
  { saveData, generateInvoice }
)(Accounting);
