import { combineUrlParams } from "utils";
import { client } from "client/request";
import {
  SALARIES_CREATE,
  SALARIES_SEARCH,
  SALARIES_UPDATE,
  SALARIES_DELETE,
  SALARIES_GET_ALL,
  SALARIES_GET_BY_ID,
  SALARIES_GET_BY_USER,
} from 'client/api';

export default {
  getAll(param = {}) {

    return new Promise((resolve, reject) => {
      client
        .get(
          combineUrlParams(`${SALARIES_GET_ALL}`, {
            page: 1,
            size: 10,
            ...param
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
        .post(`${SALARIES_CREATE}`, payload)
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
        .put(`${SALARIES_UPDATE}/${id}`, payload)
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
        .delete(`${SALARIES_DELETE}/${id}`)
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
        .delete(`${SALARIES_DELETE}`, { data: payload })
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
  searchByUserId(id) {

    return new Promise((resolve, reject) => {
      client
        .get(`${SALARIES_GET_BY_USER}/${id}`)
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
  // search(param = {}) {
  //   return new Promise((resolve, reject) => {
  //     client
  //       .get(
  //         combineUrlParams(`${SALARIES_SEARCH}`, {
  //           page: 1,
  //           size: 999,
  //           stringQuery: '',
  //           ...param,
  //         })
  //       )
  //       .then((s) => {
  //         if (s?.data?.code === 1 && s?.data?.data) {
  //           resolve(s?.data);
  //         } else reject(s?.data);
  //       })
  //       .catch((e) => {
  //         reject(e);
  //       });
  //   });
  // },
}