import { combineUrlParams } from "utils";
import { client } from "client/request";
import {
  DISCOUNT_EMPLOYEE_CREATE,
  DISCOUNT_EMPLOYEE_DELETE,
  DISCOUNT_EMPLOYEE_UPDATE,
  DISCOUNT_EMPLOYEE_UPDATE_ACTIVE,
  DISCOUNT_EMPLOYEE_GET_BY_ID,
  DISCOUNT_EMPLOYEE_GET_LIST_BY_USER_ID,
  DISCOUNT_EMPLOYEE_SEARCH,
} from '../client/api';

export default {
  create(payload) {
    return new Promise((resolve, reject) => {
      client
        .post(`${DISCOUNT_EMPLOYEE_CREATE}`, payload)
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
        .put(`${DISCOUNT_EMPLOYEE_UPDATE}/${id}`, payload)
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
  updateActive({ id }) {
    return new Promise((resolve, reject) => {
      client
        .put(`${DISCOUNT_EMPLOYEE_UPDATE_ACTIVE}/${id?.id}`)
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
        .delete(`${DISCOUNT_EMPLOYEE_DELETE}/${id}`)
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
        .delete(`${DISCOUNT_EMPLOYEE_DELETE}`, { data: payload })
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
        .get(`${DISCOUNT_EMPLOYEE_GET_BY_ID}/${id}`)
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
  },
  searchByUserId(id) {
    return new Promise((resolve, reject) => {
      client
        .get(`${DISCOUNT_EMPLOYEE_GET_LIST_BY_USER_ID}/${id}`)
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
  },
  search: (param = {}) => {
    return new Promise((resolve, reject) => {
      client
        .get(combineUrlParams(`${DISCOUNT_EMPLOYEE_SEARCH}`, {
          page: 1,
          size: 999,
          ...param,
        }))
        .then(s => {
          if (s?.data?.code === 1 && s?.data?.data) {
            resolve(s?.data);
          } else reject(s?.data);
        })
        .catch(e => {
          reject(e);
        });
    });
  },
}