import React, { Component } from "react";
import { connect } from "react-redux";
import { saveData } from "../actions/dataAction";

class Customers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addClass: "show",
      editClass: "hide",
      removeClass: "hide",
      customersData: [],
      customers: [],
      add: {
        name: "",
        mcnumber: "",
        billingadress: "",
        faxnumber: "",
        email: ""
      },
      edit: {
        name: "1",
        mcnumber: "2",
        billingadress: "3",
        faxnumber: "4",
        email: "5"
      },
      editID: 0,
      deleteID: 0
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.generateSelects = this.generateSelects.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleNew = this.handleNew.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }
  componentDidMount = () => {
    if (this.props.data && this.props.data.customers) {
      this.setState(
        { customersData: this.props.data.customers },
        this.generateSelects
      );
    }
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.data.customers.length) {
      this.setState(
        { customersData: nextProps.data.customers },
        this.generateSelects
      );
    }
  }
  handleInputChange(e) {
    this.setState({
      [e.target.parentNode.parentNode.id]: {
        ...this.state[e.target.parentNode.parentNode.id],
        [e.target.name]: e.target.value
      }
    });
  }
  handleSubmit(e) {
    e.preventDefault();
  }
  generateSelects = () => {
    if (this.state.customersData.length) {
      let customers = this.state.customersData.map(c => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ));
      let editID =
        this.state.editID ||
        (this.state.customersData.length && this.state.customersData[0].id);
      let deleteID =
        this.state.deleteID ||
        (this.state.customersData.length && this.state.customersData[0].id);
      let edit =
        this.state.customersData &&
        this.state.customersData[
          this.state.customersData.findIndex(
            c => c.id === (this.state.editID || editID)
          )
        ];
      this.setState({ customers, editID, deleteID, edit });
    }
  };
  handleSelectChange = e => {
    e.persist();
    this.setState(
      {
        [e.target.parentNode.parentNode.id === "remove"
          ? "deleteID"
          : "editID"]: e.target.value
      },
      this.generateSelects
    );
  };
  handleDelete() {
    let data = this.props.data;
    let state = this.state.deleteID;
    let customers = data.customers;
    customers = customers.filter(c => c.id !== state);
    data.customers = customers;
    this.props.saveData(data);
    this.props.history.push("/");
    window.tosNotification([
      { title: "Deleted", text: "Customer deleted", className: "red" }
    ]);
  }
  handleEdit() {
    let data = this.props.data;
    let state = this.state.editID;
    let customers = data.customers;
    customers[customers.findIndex(c => c.id === state)] = this.state.edit;
    data.customers = customers;
    this.props.saveData(data);
    this.props.history.push("/");
    window.tosNotification([
      { title: "Edited", text: "Customer edited", className: "green" }
    ]);
  }
  handleNew() {
    let data = this.props.data;
    let state = this.state.add;
    delete state["customers"];
    state.id = Date.now() + "";
    let customers = data.customers;
    customers.push(state);
    data.customers = customers;
    this.props.saveData(data);
    this.props.history.push("/");
    window.tosNotification([
      { title: "Added", text: "Customer added", className: "green" }
    ]);
  }
  render() {
    return (
      <form className="customers" onSubmit={this.handleSubmit}>
        <h3
          onClick={() => {
            this.setState({
              addClass: this.state.addClass === "show" ? "hide" : "show"
            });
          }}
        >
          Add customer
        </h3>
        <div className={`box ${this.state.addClass}`} id="add">
          <div className="input">
            <input
              type="text"
              placeholder="Name"
              value={this.state.add.name}
              name="name"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="input">
            <input
              type="text"
              placeholder="MC Number"
              value={this.state.add.mcnumber}
              name="mcnumber"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="input">
            <input
              type="text"
              placeholder="Billing address"
              value={this.state.add.billingadress}
              name="billingadress"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="input">
            <input
              type="text"
              placeholder="Fax number"
              value={this.state.add.faxnumber}
              name="faxnumber"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="input">
            <input
              type="text"
              placeholder="E-mail"
              value={this.state.add.email}
              name="email"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="input">
            <input
              type="submit"
              value="Add customer"
              onClick={this.handleNew}
            />
          </div>
        </div>
        <h3
          onClick={() => {
            this.setState({
              editClass: this.state.editClass === "show" ? "hide" : "show"
            });
          }}
        >
          Edit customer
        </h3>
        <div className={`box ${this.state.editClass}`} id="edit">
          <div className="input">
            <select onChange={this.handleSelectChange}>
              {this.state.customers}
            </select>
          </div>
          <div className="input">
            <input
              type="text"
              placeholder="Name"
              value={this.state.edit.name}
              name="name"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="input">
            <input
              type="text"
              placeholder="MC Number"
              value={this.state.edit.mcnumber}
              name="mcnumber"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="input">
            <input
              type="text"
              placeholder="Billing address"
              value={this.state.edit.billingadress}
              name="billingadress"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="input">
            <input
              type="text"
              placeholder="Fax number"
              value={this.state.edit.faxnumber}
              name="faxnumber"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="input">
            <input
              type="text"
              placeholder="E-mail"
              value={this.state.edit.email}
              name="email"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="input">
            <input
              type="submit"
              value="Edit customer"
              onClick={this.handleEdit}
            />
          </div>
        </div>
        <h3
          onClick={() => {
            this.setState({
              removeClass: this.state.removeClass === "show" ? "hide" : "show"
            });
          }}
        >
          Remove customer
        </h3>
        <div className={`box ${this.state.removeClass}`} id="remove">
          <div className="input">
            <select onChange={this.handleSelectChange}>
              {this.state.customers}
            </select>
          </div>
          <div className="input">
            <input
              type="submit"
              value="Remove customer"
              onClick={this.handleDelete}
            />
          </div>
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
)(Customers);
