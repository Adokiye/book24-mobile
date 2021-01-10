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
} from "./actionTypes";

export const setOrderData = (payload) => {
  console.log(payload);
  return {
    type: ORDER_DATA,
    payload,
  };
};

export const setOrderImage = (payload) => {
  console.log(payload);
  return {
    type: ORDER_IMAGE,
    payload,
  };
};

export const setOrderSubName = (payload) => {
  console.log(payload);
  return {
    type: ORDER_SUB_NAME,
    payload,
  };
};

export const setOrderCheckInDate = (payload) => {
  console.log(payload);
  return {
    type: ORDER_CHECK_IN_DATE,
    payload,
  };
};

export const setOrderName = (payload) => {
  console.log(payload);
  return {
    type: ORDER_NAME,
    payload,
  };
};

export const setOrderSubData = (payload) => {
  console.log(payload);
  return {
    type: ORDER_SUB_DATA,
    payload,
  };
};

export const setOrderCheckOutDate = (payload) => {
  console.log(payload);
  return {
    type: ORDER_CHECK_OUT_DATE,
    payload,
  };
};

export const setOrderPrice = (payload) => {
  console.log(payload);
  return {
    type: ORDER_PRICE,
    payload,
  };
};

export const setOrderUrl = (payload) => {
  console.log(payload);
  return {
    type: ORDER_URL,
    payload,
  };
};

// export default {
//   setOrderData,
//   setOrderUrl,
//   setOrderPrice,
// };
