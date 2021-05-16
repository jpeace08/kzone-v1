import { combineUrlParams } from "utils";
import { client } from "client/request";
import {
  TAX_CREATE,
  TAX_GET_ALL,
} from "../client/api";

export default {
  getAll() {
    return new Promise((resolve, reject) => {
      client
        .get(
          combineUrlParams(`${TAX_GET_ALL}`, {
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

  create(payload) {
    return new Promise((resolve, reject) => {
      client
        .post(`${TAX_CREATE}`, payload)
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
