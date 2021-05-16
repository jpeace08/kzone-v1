import { combineUrlParams } from "utils";
import { client } from "client/request";
import {
  VENDOR_CREATE,
  VENDOR_SEARCH,
  VENDOR_UPDATE,
  VENDOR_DELETE,
  VENDOR_GET_ALL,
} from 'client/api';
import { VENDOR_GET_BY_ID } from "../client/api";

export default {
  search(param = {}) {
    return new Promise((resolve, reject) => {
      client
        .get(
          combineUrlParams(`${VENDOR_SEARCH}`, {
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
  create(payload) {
    return new Promise((resolve, reject) => {
      client
        .post(`${VENDOR_CREATE}`, payload)
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
  update({ id, ...payload }) {
    return new Promise((resolve, reject) => {
      client
        .put(`${VENDOR_UPDATE}/${id}`, payload)
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
  delete({ id, ...payload }) {
    return new Promise((resolve, reject) => {
      client
        .delete(`${VENDOR_DELETE}/${id}`)
        .then((s) => {
          if (s?.data?.code === 1 && s?.data?.data) {
            resolve(s?.data);
          } else reject(s?.data);
        })
        .catch((e) => {
          reject(e);
        })
    });
  },
  deleteMul(payload) {
    return new Promise((resolve, reject) => {
      client
        .delete(`${VENDOR_DELETE}`, { data: payload })
        .then((s) => {
          if (s?.data?.code === 1 && s?.data?.data) {
            resolve(s?.data);
          } else reject(s?.data);
        })
        .catch((e) => {
          reject(e);
        })
    });
  },
  searchById(id) {
    return new Promise((resolve, reject) => {
      client
        .get(`${VENDOR_GET_BY_ID}/${id}`)
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
}