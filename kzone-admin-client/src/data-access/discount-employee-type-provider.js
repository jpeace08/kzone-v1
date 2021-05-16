import { combineUrlParams } from "utils";
import { client } from "client/request";
import {
  DISCOUNT_EMPLOYEE_TYPE_CREATE,
  DISCOUNT_EMPLOYEE_TYPE_UPDATE,
  DISCOUNT_EMPLOYEE_TYPE_DELETE,
  DISCOUNT_EMPLOYEE_TYPE_GET_ALL,
  DISCOUNT_EMPLOYEE_TYPE_GET_BY_ID,
} from '../client/api';
import { VENDOR_GET_BY_ID } from "../client/api";

export default {
  getAll(param = {}) {
    return new Promise((resolve, reject) => {
      client
        .get(
          combineUrlParams(`${DISCOUNT_EMPLOYEE_TYPE_GET_ALL}`, {
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
        .post(`${DISCOUNT_EMPLOYEE_TYPE_CREATE}`, payload)
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
        .put(`${DISCOUNT_EMPLOYEE_TYPE_UPDATE}/${id}`, { ...payload })
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
        .delete(`${DISCOUNT_EMPLOYEE_TYPE_DELETE}/${id}`)
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
        .delete(`${DISCOUNT_EMPLOYEE_TYPE_DELETE}`, { data: payload })
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
        .get(`${DISCOUNT_EMPLOYEE_TYPE_GET_BY_ID}/${id}`)
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