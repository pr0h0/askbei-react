import React, { Component } from "react";

import { connect } from "react-redux";
import { saveData, generatePayslip } from "../actions/dataAction";

class DriversPayments extends Component {
  constructor() {
    super();
    this.state = {
      modalClass: "hide",
      driversData: [],
      curentDrives: [],
      dateFrom: new Date(Date.now() - 7 * 24 * 3600 * 1000),
      dateTo: new Date(),
      pdf: {
        fileName: "",
        folder: "",
        name: "",
        unitNo: "",
        payslipNo: "",
        payPeriodFrom: new Date(),
        payPeriodTo: new Date(),
        payDate: new Date(),
        earnings: [],
        misc: [],
        variable: [],
        fixed: [],
        gross: 0,
        nett: 0,
        loads: []
      },
      objects: {
        earnings: {},
        misc: {},
        variable: {},
        fixed: {},
        drivers: [],
        weeklist: []
      },
      usefullInfo: {}
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleDriverChange = this.handleDriverChange.bind(this);
    this.generateSelects = this.generateSelects.bind(this);
    this.MhandleInputChange = this.MhandleInputChange.bind(this);
    this.sumUp = this.sumUp.bind(this);
    this.EaddMore = this.EaddMore.bind(this);
    this.addMore = this.addMore.bind(this);
    this.generatePDF = this.generatePDF.bind(this);
    this.removeRow = this.removeRow.bind(this);
    this.shortDate = this.shortDate.bind(this);
    this.sumUpData = this.sumUpData.bind(this);
    this.loadListForTheWeek = this.loadListForTheWeek.bind(this);
  }

  componentDidMount() {
    if (this.props.data.drivers && this.props.data.drivers.length) {
      this.setState(
        {
          driversData: this.props.data.drivers,
          usefullInfo: this.props.data.usefullInfo
        },
        () => {
          this.generateSelects();
          this.loadListForTheWeek();
        }
      );
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data.drivers && nextProps.data.drivers.length) {
      this.setState(
        {
          driversData: nextProps.data.drivers,
          usefullInfo: nextProps.data.usefullInfo
        },
        () => {
          this.generateSelects();
          this.loadListForTheWeek();
        }
      );
    }
  }
  toggleModal() {
    this.setState(
      {
        modalClass: this.state.modalClass === "show" ? "hide" : "show"
      },
      () => {
        if (this.state.modalClass === "show") {
          this.setState(
            {
              pdf: {
                ...this.state.pdf,
                name: this.state.driversData.filter(
                  d => d.id === this.refs.driverSelect.value
                )[0].man.name,
                unitNo: this.state.driversData.filter(
                  d => d.id === this.refs.driverSelect.value
                )[0].tractor.un,
                payslipNo: this.state.usefullInfo.payslipNo
              }
            },
            () => {
              this.refs.MdateFrom.valueAsDate = new Date(
                this.refs.dateFrom.value
              );
              this.refs.MdateTo.valueAsDate = new Date(this.refs.dateTo.value);
              this.refs.MpayDate.valueAsDate = new Date();
              this.handleDriverChange({
                persist: () => {},
                target: this.refs.driverSelect
              });
            }
          );
        }
      }
    );
  }
  handleDateChange(e) {
    this.setState({ [e.target.name]: new Date(e.target.value) });
  }
  handleDriverChange(e) {
    e.persist();
    let id = e.target.value;
    let drives = this.props.data.invoice.filter(
      i =>
        i.driver === id &&
        new Date(
          this.props.data.load.filter(l => l.id === i.load)[0].pickupdate
        ) <= new Date(this.state.dateTo) &&
        new Date(
          this.props.data.load.filter(l => l.id === i.load)[0].pickupdate
        ) >= new Date(this.state.dateFrom)
    );
    let loads = drives.map(
      d => this.props.data.load.filter(l => l.id === d.load)[0]
    );
    let erIds = [];
    let loadsObj = {};
    drives.forEach(d => {
      let id = parseInt(d.invoiceNumber * Math.random() * Date.now(), 10);
      erIds.push(id);
      let cl = loads.filter(l => l.id === d.load)[0];
      loadsObj[id] = (
        <div className="item" key={id}>
          <div className="input">
            <input type="text" name="name" defaultValue={d.invoiceNumber} />
          </div>
          <div className="input">
            <input
              type="text"
              name="desc"
              defaultValue={cl.pickuplocation + " to " + cl.deliverylocation}
            />
          </div>
          <div className="input">
            <input type="text" name="amount" defaultValue={cl.grossrate} />
          </div>
          <div className="input">
            <input type="number" name="percent" defaultValue={8} />
          </div>
          <div className="input">
            <input
              type="submit"
              value="Remove"
              onClick={e => this.removeRow("earnings", id)}
            />
          </div>
        </div>
      );
    });
    let fid = parseInt(Date.now() * Math.random(), 10);
    let fixedObj = (
      <div className="item" key={fid}>
        <div className="input">
          <input type="text" name="name" defaultValue="Insurance" />
        </div>
        <div className="input">
          <input type="text" name="desc" defaultValue="" />
        </div>
        <div className="input">
          <input type="text" name="amount" defaultValue="180" />
        </div>
        <div className="input">
          <input
            type="submit"
            value="Remove"
            onClick={e => this.removeRow("fixed", fid)}
          />
        </div>
      </div>
    );
    this.setState(
      {
        pdf: {
          ...this.state.pdf,
          unitNo: this.state.driversData.filter(d => d.id === e.target.value)[0]
            .tractor.un,
          earnings: erIds,
          fixed: [...this.state.pdf.fixed, fid]
        },
        objects: {
          ...this.state.objects,
          earnings: loadsObj,
          fixed: { [fid]: fixedObj }
        }
      },
      this.sumUp
    );
  }
  generateSelects() {
    let drivers = this.state.driversData;
    drivers = drivers.map(d => (
      <option key={d.id} value={d.id}>
        {d.man.name}
      </option>
    ));
    this.refs["dateFrom"].valueAsDate = new Date(this.state.dateFrom);
    this.refs["dateTo"].valueAsDate = new Date(this.state.dateTo);
    this.setState({ objects: { ...this.state.objects, drivers } });
  }
  MhandleInputChange(e) {
    this.setState({
      pdf: { ...this.state.pdf, [e.target.name]: e.target.value }
    });
  }
  addMore(e) {
    let unit = e.target.getAttribute("unit");
    let id = Date.now();
    let item = (
      <div className="item" key={id}>
        <div className="input">
          <input type="text" name="name" />
        </div>
        <div className="input">
          <input type="text" name="desc" />
        </div>
        <div className="input">
          <input type="text" name="amount" />
        </div>
        <div className="input">
          <input
            type="submit"
            value="Remove"
            onClick={e => this.removeRow(unit, id)}
          />
        </div>
      </div>
    );
    this.setState({
      pdf: { ...this.state.pdf, [unit]: [...this.state.pdf[unit], id] },
      objects: {
        ...this.state.objects,
        [unit]: {
          ...this.state.objects[unit],
          [id]: item
        }
      }
    });
  }
  EaddMore(e) {
    let id = Date.now();
    let item = (
      <div className="item" key={id}>
        <div className="input">
          <input type="text" name="name" />
        </div>
        <div className="input">
          <input type="text" name="desc" />
        </div>
        <div className="input">
          <input type="text" name="amount" />
        </div>
        <div className="input">
          <input type="number" name="percent" />
        </div>
        <div className="input">
          <input
            type="submit"
            value="Remove"
            onClick={e => this.removeRow("earnings", id)}
          />
        </div>
      </div>
    );
    this.setState({
      pdf: { ...this.state.pdf, earnings: [...this.state.pdf.earnings, id] },
      objects: {
        ...this.state.objects,
        earnings: {
          ...this.state.objects.earnings,
          [id]: item
        }
      }
    });
  }
  sumUp(e) {
    let earings = document.querySelectorAll(".modal .list.o1 .items .item");
    let misc = document.querySelectorAll(".modal .list.o2 .items .item");
    let variable = document.querySelectorAll(".modal .list.o3 .items .item");
    let fixed = document.querySelectorAll(".modal .list.o4 .items .item");
    let er = [...earings].reduce(
      (t, c) =>
        (t +=
          parseInt(
            c.querySelector("input[name=amount]").value,
            10
          ).toString() !== NaN.toString()
            ? parseInt(c.querySelector("input[name=amount]").value, 10)
            : 0),
      0
    );
    let ms = [...misc].reduce(
      (t, c) =>
        (t +=
          parseInt(
            c.querySelector("input[name=amount]").value,
            10
          ).toString() !== NaN.toString()
            ? parseInt(c.querySelector("input[name=amount]").value, 10)
            : 0),
      0
    );
    let vr = [...variable].reduce(
      (t, c) =>
        (t +=
          parseInt(
            c.querySelector("input[name=amount]").value,
            10
          ).toString() !== NaN.toString()
            ? parseInt(c.querySelector("input[name=amount]").value, 10)
            : 0),
      0
    );
    let fx = [...fixed].reduce(
      (t, c) =>
        (t +=
          parseInt(
            c.querySelector("input[name=amount]").value,
            10
          ).toString() !== NaN.toString()
            ? parseInt(c.querySelector("input[name=amount]").value, 10)
            : 0),
      0
    );
    let dispatch = [...earings].reduce(
      (t, c) =>
        (t +=
          ((parseInt(
            c.querySelector("input[name=percent]").value,
            10
          ).toString() !== NaN.toString()
            ? parseInt(c.querySelector("input[name=percent]").value, 10)
            : 0) *
            (parseInt(
              c.querySelector("input[name=amount]").value,
              10
            ).toString() !== NaN.toString()
              ? parseInt(c.querySelector("input[name=amount]").value, 10)
              : 0)) /
          100),
      0
    );
    let gross = er + ms;
    let nett = gross - vr - fx;
    let id = "dispatch";
    let pdf = this.state.pdf;
    if (pdf.variable.filter(m => m === id).length === 0) {
      pdf = { ...this.state.pdf, variable: [...this.state.pdf.variable, id] };
    }
    this.setState(
      {
        pdf: { ...pdf, nett, gross },
        objects: {
          ...this.state.objects,
          variable: {
            ...this.state.objects.variable,
            [id]: (
              <div className="item" key={Date.now()}>
                <div className="input">
                  <input type="text" name="name" defaultValue="Dispatch" />
                </div>
                <div className="input">
                  <input type="text" name="desc" defaultValue="" />
                </div>
                <div className="input">
                  <input type="text" name="amount" defaultValue={dispatch} />
                </div>
                <div className="input">
                  <input
                    type="submit"
                    value="Remove"
                    onClick={e => this.removeRow("misc", id)}
                  />
                </div>
              </div>
            )
          }
        }
      },
      () => {
        if (vr === 0 && dispatch !== 0) {
          this.sumUp();
        }
      }
    );
  }
  sumUpData(e) {
    let earings = [
      ...document.querySelectorAll(".modal .list.o1 .items .item")
    ].map(el => {
      return {
        name: el.querySelector("input[name=name]").value,
        description: el.querySelector("input[name=desc]").value,
        amount: el.querySelector("input[name=amount]").value,
        percent: el.querySelector("input[name=percent]").value
      };
    });
    let misc = [
      ...document.querySelectorAll(".modal .list.o2 .items .item")
    ].map(el => {
      return {
        name: el.querySelector("input[name=name]").value,
        description: el.querySelector("input[name=desc]").value,
        amount: el.querySelector("input[name=amount]").value
      };
    });
    let variable = [
      ...document.querySelectorAll(".modal .list.o3 .items .item")
    ].map(el => {
      return {
        name: el.querySelector("input[name=name]").value,
        description: el.querySelector("input[name=desc]").value,
        amount: el.querySelector("input[name=amount]").value
      };
    });
    let fixed = [
      ...document.querySelectorAll(".modal .list.o4 .items .item")
    ].map(el => {
      return {
        name: el.querySelector("input[name=name]").value,
        description: el.querySelector("input[name=desc]").value,
        amount: el.querySelector("input[name=amount]").value
      };
    });
    let er = [...earings].reduce(
      (t, c) =>
        (t +=
          parseInt(c.amount, 10).toString() !== NaN.toString()
            ? parseInt(c.amount, 10)
            : 0),
      0
    );
    let ms = [...misc].reduce(
      (t, c) =>
        (t +=
          parseInt(c.amount, 10).toString() !== NaN.toString()
            ? parseInt(c.amount, 10)
            : 0),
      0
    );
    let vr = [...variable].reduce(
      (t, c) =>
        (t +=
          parseInt(c.amount, 10).toString() !== NaN.toString()
            ? parseInt(c.amount, 10)
            : 0),
      0
    );

    let fx = [...fixed].reduce(
      (t, c) =>
        (t +=
          parseInt(c.amount, 10).toString() !== NaN.toString()
            ? parseInt(c.amount, 10)
            : 0),
      0
    );
    let gross = er + ms;
    let nett = gross - vr - fx;
    return {
      gross,
      nett,
      earningsTotal: er,
      miscTotal: ms,
      variableTotal: vr,
      fixedTotal: fx,
      earings,
      misc,
      variable,
      fixed
    };
  }
  generatePDF(e) {
    let pdf = this.state.pdf;
    if (!pdf.folder) {
      window.tosNotification([
        { title: "Failed", text: "Enter folder", className: "red" }
      ]);
      return;
    } else {
      let data = this.sumUpData();
      let mypdf = {
        fileName: pdf.fileName,
        folder: pdf.folder,
        name: pdf.name,
        unit: pdf.unitNo,
        payslipNo: pdf.payslipNo,
        payPeriodFrom: this.shortDate(this.refs.MdateFrom.value),
        payPeriodTo: this.shortDate(this.refs.MdateTo.value),
        payDate: this.shortDate(this.refs.MpayDate.value),
        earnings: data.earings,
        earningsTotal: data.earningsTotal,
        misc: data.misc,
        miscTotal: data.miscTotal,
        variable: data.variable,
        variableTotal: data.variableTotal,
        fixed: data.fixed,
        fixedTotal: data.fixedTotal,
        gross: data.gross,
        nett: data.nett
      };
      let allData = this.props.data;
      let payslipss = allData.payslip;
      payslipss.push(mypdf);
      allData.payslip = payslipss;
      this.props.generatePayslip(allData, mypdf);
      this.props.history.push("/");
      window.tosNotification([
        { title: "Successfull", text: "Generated payslip", className: "green" }
      ]);
    }
  }
  removeRow(unit, id) {
    let pdf = this.state.pdf;
    let objects = this.state.objects[unit];
    let arr = pdf[unit].filter(i => i !== id);
    let tempObj = {};
    arr.forEach(k => {
      tempObj[k] = objects[k];
    });
    this.setState({
      pdf: { ...this.state.pdf, [unit]: arr },
      objects: { ...this.state.objects, [unit]: tempObj }
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
  loadListForTheWeek() {
    let from = new Date(this.shortDate(this.refs.dateFrom.value));
    let to = new Date(this.shortDate(this.refs.dateTo.value));
    let loads = this.props.data.invoice.map(l => {
      let load = this.props.data.load.filter(i => i.id === l.load)[0];
      if (
        new Date(this.shortDate(load.pickupdate)) <= to &&
        new Date(this.shortDate(load.pickupdate)) >= from
      ) {
        return (
          <div className="tr" key={l.invoiceNumber}>
            <div className="td">{load.loadName}</div>
            <div className="td">{l.invoiceNumber}</div>
            <div className="td">
              {
                this.props.data.customers.filter(c => c.id === l.customer)[0]
                  .name
              }
            </div>
            <div className="td">
              {l.grossrate}\{l.deliveryrate}
            </div>
            <div className="td">{this.shortDate(load.pickupdate)}</div>
            <div className="td">{load.pickuplocation}</div>
            <div className="td">{this.shortDate(load.deliverydate)}</div>
            <div className="td">{load.deliverylocation}</div>
          </div>
        );
      } else {
        return "";
      }
    });
    this.setState(
      { objects: { ...this.state.objects, weeklist: loads } },
      this.generateSelects
    );
  }
  render() {
    return (
      <div className="driverspayments">
        <div className="wrap">
          <div className="input">
            <select onChange={this.handleDriverChange} ref="driverSelect">
              {this.state.objects.drivers}
            </select>
          </div>
          <div className="input">
            <label>Date from</label>
            <input
              type="date"
              onChange={this.handleDateChange}
              ref="dateFrom"
              name="dateFrom"
            />
          </div>
          <div className="input">
            <label>Date to</label>
            <input
              type="date"
              onChange={this.handleDateChange}
              ref="dateTo"
              name="dateTo"
            />
          </div>
          <div className="input">
            <input
              type="submit"
              value="Generate payslip"
              onClick={this.toggleModal}
            />
          </div>
          <div className="input">
            <input
              type="submit"
              value="Load list for the week"
              onClick={this.loadListForTheWeek}
            />
          </div>
          <div className="table">
            <div className="tbody">
              <div className="tr">
                <div className="th">Load name</div>
                <div className="th">Invoice number</div>
                <div className="th">Customer</div>
                <div className="th">Gross\Driver</div>
                <div className="th">Pick up date</div>
                <div className="th">Pick up location</div>
                <div className="th">Delivery date</div>
                <div className="th">Delivery location</div>
              </div>
              {this.state.objects.weeklist}
            </div>
          </div>
        </div>
        <div className={"modal " + this.state.modalClass}>
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
                value={this.state.pdf.fileName}
                onChange={this.MhandleInputChange}
                name="fileName"
              />
            </div>
            <div className="input">
              <label>Folder</label>
              <input
                type="file"
                webkitdirectory="true"
                onChange={e =>
                  this.setState({
                    pdf: { ...this.state.pdf, folder: e.target.files[0].path }
                  })
                }
              />
            </div>
            <hr style={{ border: "1px solid #000", margin: "2.5px 0" }} />
            <div className="input">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={this.state.pdf.name}
                onChange={this.MhandleInputChange}
              />
            </div>
            <div className="input">
              <label>UNIT NO.</label>
              <input
                type="text"
                name="unitNo"
                value={this.state.pdf.unitNo}
                onChange={this.MhandleInputChange}
              />
            </div>
            <div className="input">
              <label>Payslip NO.</label>
              <input
                type="text"
                name="payslipNo"
                value={this.state.pdf.payslipNo}
                onChange={this.MhandleInputChange}
              />
            </div>
            <div className="input">
              <label>Pay period from</label>
              <input
                type="date"
                onChange={e => {
                  this.setState({
                    pdf: {
                      ...this.state.pdf,
                      payPeriodFrom: new Date(e.target.value)
                    }
                  });
                }}
                ref="MdateFrom"
              />
            </div>
            <div className="input">
              <label>Pay period to</label>
              <input
                type="date"
                onChange={e => {
                  this.setState({
                    pdf: {
                      ...this.state.pdf,
                      payPeriodTo: new Date(e.target.value)
                    }
                  });
                }}
                ref="MdateTo"
              />
            </div>
            <div className="input">
              <label>Pay date</label>
              <input
                type="date"
                onChange={e => {
                  this.setState({
                    pdf: {
                      ...this.state.pdf,
                      payDate: new Date(e.target.value)
                    }
                  });
                }}
                ref="MpayDate"
              />
            </div>
            <div className="list o1">
              <h3>Earnings</h3>
              <div className="input">
                <input
                  type="submit"
                  unit="earnings"
                  value="Add more"
                  onClick={this.EaddMore}
                />
              </div>
              <div className="items">
                {Object.values(this.state.objects.earnings)}
              </div>
            </div>
            <div className="list o2">
              <h3>Misc earnings</h3>
              <div className="input">
                <input
                  type="submit"
                  unit="misc"
                  value="Add more"
                  onClick={this.addMore}
                />
              </div>
              <div className="items">
                {Object.values(this.state.objects.misc)}
              </div>
            </div>
            <div className="list o3">
              <h3>Variable deductions</h3>
              <div className="input">
                <input
                  type="submit"
                  unit="variable"
                  value="Add more"
                  onClick={this.addMore}
                />
              </div>
              <div className="items">
                {Object.values(this.state.objects.variable)}
              </div>
            </div>
            <div className="list o4">
              <h3>Fixed deductions</h3>
              <div className="input">
                <input
                  type="submit"
                  unit="fixed"
                  value="Add more"
                  onClick={this.addMore}
                />
              </div>
              <div className="items">
                {Object.values(this.state.objects.fixed)}
              </div>
            </div>
            <div className="input">
              <input type="submit" value="Sum up" onClick={this.sumUp} />
            </div>
            <div className="input">
              <label>Gross earning</label>
              <input
                type="number"
                value={this.state.pdf.gross}
                onChange={this.MhandleInputChange}
                name="gross"
              />
            </div>
            <div className="input">
              <label>Nett pay</label>
              <input
                type="number"
                value={this.state.pdf.nett}
                onChange={this.MhandleInputChange}
                name="nett"
              />
            </div>
            <div className="input">
              <input
                type="submit"
                value="Generate PDF"
                onClick={this.generatePDF}
                style={{
                  backgroundColor: "#08f",
                  color: "#fff",
                  cursor: "pointer"
                }}
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
  { saveData, generatePayslip }
)(DriversPayments);
