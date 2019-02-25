import {
  FETCH_DATA,
  SAVE_DATA,
  GENERATE_INVOICE,
  GENERATE_PAYSLIP
} from "./types";

const electron = window.require("electron");
const db = electron.remote.require("./db.js");
const generate = electron.remote.require("./generate.js");

export const fetchData = () => dispatch => {
  db.read().then(data => {
    dispatch({
      type: FETCH_DATA,
      payload: data
    });
  });
};

export const saveData = data => dispatch => {
  dispatch({
    type: SAVE_DATA,
    payload: data
  });
  db.write(data);
};

export const generateInvoice = (data, pdf) => dispatch => {
  dispatch({
    type: GENERATE_INVOICE,
    payload: data
  });
  generate.accounting(pdf);
  db.write(data);
};

export const generatePayslip = (data, pdf) => dispatch => {
  dispatch({
    type: GENERATE_PAYSLIP,
    payload: data
  });
  db.write(data);
  generate.payslip(pdf);
};
