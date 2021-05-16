import { combineUrlParams } from "utils";
import { client } from "client/request";
import { AUTH_LOGIN, AUTH_LOGOUT } from "client/api";

export default {
  login({ username, password, ...payload }) {
    return new Promise((resolve, reject) => {
      client
        .post(`${AUTH_LOGIN}`, {
          username,
          password,
          ...payload,
        })
        .then((s) => {
          if (s?.data?.code === 1 && s?.data?.data) {
            resolve(s?.data);
          } else reject(s?.data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  logout() {
    return new Promise((resolve, reject) => {
      client
        .get(`${AUTH_LOGOUT}`)
        .then((s) => {
          if (s?.data?.code === 1 && s?.data?.data) {
            resolve(s?.data);
          } else reject(s?.data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
};
