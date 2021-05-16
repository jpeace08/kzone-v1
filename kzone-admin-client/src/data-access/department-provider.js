import { combineUrlParams } from "utils";
import { client } from "client/request";
import {
  DEPARTMENT_SEARCH,
  DEPARTMENT_GET_ALL,
  DEPARTMENT_CREATE,
  DEPARTMENT_UPDATE,
  DEPARTMENT_GET_DETAIL,
  DEPARTMENT_DELETE,
} from "client/api";

export default {
  getAll() {
    return new Promise((resolve, reject) => {
      client
        .get(
          combineUrlParams(`${DEPARTMENT_GET_ALL}`, {
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
          combineUrlParams(`${DEPARTMENT_SEARCH}`, {
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
        .post(`${DEPARTMENT_CREATE}`, payload)
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
        .put(`${DEPARTMENT_UPDATE}/${id}`, payload)
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
  searchById(id) {
    return new Promise((resolve, reject) => {
      client
        .get(`${DEPARTMENT_GET_DETAIL}/${id}`)
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
  delete({ id }) {
    return new Promise((resolve, reject) => {
      client
        .delete(`${DEPARTMENT_DELETE}/${id}`)
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
        .delete(`${DEPARTMENT_DELETE}`, { data: payload })
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
};
