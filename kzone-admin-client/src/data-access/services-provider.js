import { combineUrlParams } from "utils";
import { client } from "client/request";
import {
  SERVICE_CREATE,
  SERVICE_SEARCH,
  SERVICE_UPDATE,
  SERVICE_DELETE,
  SERVICE_GET_BY_ID
} from 'client/api';
export default {
  search(param = {}) {
    return new Promise((resolve, reject) => {
      client
        .get(
          combineUrlParams(`${SERVICE_SEARCH}`, {
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
        .post(`${SERVICE_CREATE}`, payload)
        .then((s) => {
          if (s?.data?.code === 1 && s?.data?.data) {
            resolve(s?.data);
          }
          else {
            reject(s?.data);
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
        .put(`${SERVICE_UPDATE}/${id}`, payload)
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
        .get(`${SERVICE_GET_BY_ID}/${id}`)
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
        .delete(`${SERVICE_DELETE}`, { data: payload })
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
  delete({ id }) {
    return new Promise((resolve, reject) => {
      client
        .delete(`${SERVICE_DELETE}/${id}`)
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
