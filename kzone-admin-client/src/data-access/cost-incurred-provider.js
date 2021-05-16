import { combineUrlParams } from "utils";
import { client } from "client/request";
import { COST_INCURRED_SEARCH, COST_INCURRED_CREATE, COST_INCURRED_UPDATE, COST_INCURRED_DELETE } from "client/api";

export default {
  search(param = {}) {
    return new Promise((resolve, reject) => {
      client
        .get(
          combineUrlParams(`${COST_INCURRED_SEARCH}`, {
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

  create(payload) {
    return new Promise((resolve, reject) => {
      client
        .post(`${COST_INCURRED_CREATE}`, payload)
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
        .put(`${COST_INCURRED_UPDATE}/${id}`, payload)
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
        .delete(`${COST_INCURRED_DELETE}/${id}`)
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
