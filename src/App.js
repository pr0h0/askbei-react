import React, { Component } from "react";
import { Provider } from "react-redux";
import store from "./store";

import { BrowserRouter as Router, Route } from "react-router-dom";

import { fetchData } from "./actions/dataAction";

import Navbar from "./components/Navbar";
import Menu from "./components/Menu";
import NewLoad from "./components/NewLoad";
import EditLoad from "./components/EditLoad";
import Accouting from "./components/Accounting";
import Customers from "./components/Customers";
import NewDriver from "./components/NewDriver";
import EditDriver from "./components/EditDriver";
import DriversPayments from "./components/DriversPayments";
import Options from "./components/Options";
import Stats from "./components/Stats";
import Notifications from "./components/Notifications";
import "./components/All.css";

export default class App extends Component {
  componentDidMount = () => {
    fetchData();
  };

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Route path="/" component={Navbar} />
            <Route path="/" component={Notifications} />
            <Route path="/" exact component={Menu} />
            <Route path="/new_load" exact component={NewLoad} />
            <Route path="/edit_load" exact component={EditLoad} />
            <Route path="/accounting" exact component={Accouting} />
            <Route path="/customers" exact component={Customers} />
            <Route path="/new_driver" exact component={NewDriver} />
            <Route path="/edit_driver" exact component={EditDriver} />
            <Route path="/drivers_payments" exact component={DriversPayments} />
            <Route path="/stats" exact component={Stats} />
            <Route path="/options" exact component={Options} />
          </div>
        </Router>
      </Provider>
    );
  }
}

// const mapStateToProps = state => ({
//   data: state.data,
//   store: store
// });

// export default connect(mapStateToProps, { fetchData })(App);
