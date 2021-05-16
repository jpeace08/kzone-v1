import axios from "axios";
import { getState } from "redux-store/stores";
const REACT_APP_URL = process.env.REACT_APP_URL;
const REACT_APP_URL_DOMAIN = process.env.REACT_APP_URL_DOMAIN;

export const originUrl = window.location.origin;

export const HOST = (() => {
  return window.location.host === REACT_APP_URL // test
    ? process.env.REACT_APP_BACKEND
    : window.location.host === REACT_APP_URL_DOMAIN //production
      ? process.env.REACT_APP_BACKEND_DOMAIN
      : process.env.REACT_APP_BACKEND;
})();

const client = axios.create({
  baseURL: `${HOST}`,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(async (config) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const accessToken = urlParams.get("accessToken");
  if (config.url?.indexOf("blob:") == 0) config.baseURL = "";
  try {
    let state = getState();
    let token = state.auth.auth?.token;

    if (accessToken !== undefined && accessToken !== null) {
      token = accessToken;
    }

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: "Bearer " + token,
      };
    }

    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});

client.interceptors.response.use(
  (response) => {
    if (response?.data?.code === 401 || response?.data?.code === 403) {
      window.location.href = "/logout";
      return Promise.reject();
    }
    return response;
  },
  (error) => {
    if (error?.response?.status === 401 || error?.response?.data?.code === 403) {
      window.location.href = "/logout";
    } else {
      try {
        if (error?.response?.data?.message)
          error.message = error.response.data.message;
      } catch (error) { }
    }
    return Promise.reject("");
  }
);

export { client };
