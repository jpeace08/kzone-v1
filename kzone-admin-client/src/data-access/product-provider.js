import { combineUrlParams } from "utils";
import { client } from "client/request";
import Axios from "axios";
import {
  HANG_HOA_GET_ALL,
  HANG_HOA_CREATE,
  HANG_HOA_SEARCH,
  HANG_HOA_DELETE,
  HANG_HOA_UPDATE,
  HANG_HOA_GET_BY_ID,
  HANG_HOA_DELETE_MULTIPLE,
  HANG_HOA_GET_BY_WAREHOUSE,
  HANG_HOA_GET_PRODUCT_INWARD_SLIP,
} from "../client/api";

export default {

  deleteMultiple: (payload) => {
    return new Promise((resolve, reject) => {
      client
        .delete(`${HANG_HOA_DELETE_MULTIPLE}`, {
          data: payload,
        })
        .then((s) => {
          if (s?.data?.code === 1 && s?.data?.data) {
            resolve(s);
          } else reject(s?.data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },

  delete: ({ id, ...payload }) => {
    return new Promise((resolve, reject) => {
      client
        .delete(`${HANG_HOA_DELETE}/${id}`)
        .then((s) => {
          if (s?.data?.code === 1 && s?.data?.data) {
            resolve(s);
          } else reject(s?.data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  create: (payload) => {
    return new Promise((resolve, reject) => {
      client
        .post(`${HANG_HOA_CREATE}`, payload)
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

  update: ({ id, ...payload }) => {
    return new Promise((resolve, reject) => {
      client
        .put(`${HANG_HOA_UPDATE}/${id}`, payload)
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
  // getAll: () => {
  //   return new Promise((resolve, reject) => {
  //     client
  //       .get(combineUrlParams(`${HANG_HOA_GET_ALL}`, {
  //         page: 1,
  //         size: 10,
  //         type: -1,
  //       }))
  //       .then(s => {
  //         if (s?.data?.code === 1 && s?.data?.data) {
  //           resolve(s?.data);
  //         }
  //       })
  //       .catch(e => { reject(e) });
  //   });
  // },
  search: (param = {}) => {
    return new Promise((resolve, reject) => {
      client
        .get(
          combineUrlParams(`${HANG_HOA_SEARCH}`, {
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
  searchByWarehouse: (param = {}) => {
    return new Promise((resolve, reject) => {
      client
        .get(
          combineUrlParams(`${HANG_HOA_GET_BY_WAREHOUSE}`, {
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

  searchForInwardSlip: (param = {}) => {
    return new Promise((resolve, reject) => {
      client
        .get(
          combineUrlParams(`${HANG_HOA_GET_PRODUCT_INWARD_SLIP}`, {
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

  getById: (id) => {
    return new Promise((resolve, reject) => {
      client
        .get(combineUrlParams(`${HANG_HOA_GET_BY_ID}/${id}`, {}))
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
