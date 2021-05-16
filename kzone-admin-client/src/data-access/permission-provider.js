import { combineUrlParams } from "utils";
import { client } from "client/request";
import {
  PERMISSION_SEARCH,
  PERMISSION_CREATE,
  PERMISSION_DELETE,
  PERMISSION_GET_BY_USER,
} from "client/api";

export default {
  getAll() {
    return new Promise((resolve, reject) => {
      client
        .get(
          combineUrlParams(`${PERMISSION_SEARCH}`, {
            page: 1,
            size: 999,
          })
        )
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
  search(param = {}) {
    return new Promise((resolve, reject) => {
      client
        .get(
          combineUrlParams(`${PERMISSION_SEARCH}`, {
            page: 1,
            size: 999,
            stringQuery: '',
            ...param,
          })
        )
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
  getByUser(id) {
    return new Promise((resolve, reject) => {
      client
        .get(`${PERMISSION_GET_BY_USER}/${id}`)
        .then((s) => {
          if (s?.data?.code === 1) {
            resolve(s?.data);
          } else {
            reject(s?.data);
          }
        })
        .catch((e) => {

          reject(e);
        })
    })
  }
};
