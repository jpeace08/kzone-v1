import { combineUrlParams } from "utils";
import { client } from "client/request";
import {
  HANG_HOA_CHI_TIET_UPDATE,
  HANG_HOA_CHI_TIET_SEARCH
} from "../client/api";

export default {
  update: ({ id, ...payload }) => {
    return new Promise((resolve, reject) => {
      client
        .put(`${HANG_HOA_CHI_TIET_UPDATE}/${id}`, payload)
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
  search: (param = {}) => {
    return new Promise((resolve, reject) => {
      client
        .get(
          combineUrlParams(`${HANG_HOA_CHI_TIET_SEARCH}`, {
            page: 1,
            size: 999,
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
};
