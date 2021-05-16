import { combineUrlParams } from "utils";
import { client } from "client/request";
import {
  ROLES_SEARCH,
  ROLES_GET_ALL,
  ROLES_CREATE,
} from "client/api";

export default {
  getAll() {
    return new Promise((resolve, reject) => {
      client
        .get(
          combineUrlParams(`${ROLES_GET_ALL}`, {
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

  search({ page = 1, size = 10, ...payload }) {
    return new Promise((resolve, reject) => {
      client
        .get(
          combineUrlParams(`${ROLES_SEARCH}`, {
            page,
            size,
            ...payload,
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
  create(payload) {
    return new Promise((resolve, reject) => {
      client
        .post(`${ROLES_CREATE}`, payload)
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
