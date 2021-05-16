import { combineUrlParams } from "utils";
import { client } from "client/request";
import {
  ACCOUNT_GET_ALL
} from "../client/api";

export default {
  getAll() {
    return new Promise((resolve, reject) => {
      client
        .get(
          combineUrlParams(`${ACCOUNT_GET_ALL}`, {
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

};
