import {
  FETCH_DATA,
  SAVE_DATA,
  GENERATE_INVOICE,
  GENERATE_PAYSLIP
} from "../actions/types";

const initialState = {
  data: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_DATA:
      return {
        ...state,
        data: action.payload
      };
    case SAVE_DATA:
      return {
        ...state,
        data: action.payload
      };
    case GENERATE_INVOICE:
      return {
        ...state,
        data: action.payload
      };
    case GENERATE_PAYSLIP:
      return {
        ...state,
        data: action.payload
      };
    default:
      return state;
  }
}
