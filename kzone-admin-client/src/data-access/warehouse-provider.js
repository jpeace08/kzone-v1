import { combineUrlParams } from "utils";
import { client } from "client/request";
import {
  WAREHOUSE_CREATE,
  WAREHOUSE_SEARCH,
  WAREHOUSE_UPDATE,
  WAREHOUSE_DELETE,
  WAREHOUSE_GET_ALL,
  WAREHOUSE_GET_BY_ID
} from 'client/api';
export default {
  getAll() {
    return new Promise((resolve, reject) => {
      client
        .get(
          combineUrlParams(`${WAREHOUSE_GET_ALL}`, {
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
          combineUrlParams(`${WAREHOUSE_SEARCH}`, {
            page: 1,
            size: 10,
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
        .post(`${WAREHOUSE_CREATE}`, payload)
        .then((s) => {
          if (s?.data?.code === 1 && s?.data?.data) {
            resolve(s?.data);
          }
          else {
            reject(s?.data?.code == 3 ? "Tên kho bị trùng" : s?.data);
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  update({ id, ...payload }) {
    return new Promise((resolve, reject) => {
      client
        .put(`${WAREHOUSE_UPDATE}/${id}`, payload)
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
  delete({ id }) {
    return new Promise((resolve, reject) => {
      client
        .delete(`${WAREHOUSE_DELETE}/${id}`)
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
        .get(`${WAREHOUSE_GET_BY_ID}/${id}`)
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
  deleteMul(payload) {
    return new Promise((resolve, reject) => {
      client
        .delete(`${WAREHOUSE_DELETE}`, { data: payload })
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

}
