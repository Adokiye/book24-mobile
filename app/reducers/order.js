import {
  ORDER_DATA,
  ORDER_PRICE,
  ORDER_URL,
  ORDER_IMAGE,
  ORDER_CHECK_IN_DATE,
  ORDER_CHECK_OUT_DATE,
  ORDER_NAME,
  ORDER_SUB_DATA,
  ORDER_SUB_NAME,
} from "../actions/actionTypes";

const initialstate = {
  url: null,
  data: null,
  price: null,
  image: null,
  sub_name: null,
  name: null,
  check_in_date: null,
  check_out_date: null,
  sub_data: null,
};

export default (state = initialstate, action) => {
  switch (action.type) {
    case ORDER_DATA:
      return Object.assign({}, state, {
        data: action.payload,
      });
    case ORDER_URL:
      console.log("ORDER_URL");
      console.log(action.payload);
      return Object.assign({}, state, {
        url: action.payload,
      });
    case ORDER_PRICE:
      return Object.assign({}, state, {
        price: action.payload,
      });
    case ORDER_IMAGE:
      return Object.assign({}, state, {
        image: action.payload,
      });
    case ORDER_NAME:
      return Object.assign({}, state, {
        name: action.payload,
      });
    case ORDER_SUB_NAME:
        return Object.assign({}, state, {
          sub_name: action.payload,
    });
    case ORDER_CHECK_IN_DATE:
      return Object.assign({}, state, {
        check_in_date: action.payload,
      });
    case ORDER_CHECK_OUT_DATE:
      return Object.assign({}, state, {
        check_out_date: action.payload,
      });
    case ORDER_SUB_DATA:
      return Object.assign({}, state, {
        sub_data: action.payload,
      });
    default:
      return state;
  }
};
