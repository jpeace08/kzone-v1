import { client } from 'client/request';
import {
  COMBO_DETAIL_CREATE,
  COMBO_DETAIL_DELETE,
  COMBO_DETAIL_UPDATE,
} from '../client/api';

export default {
  deleteMultiple: (payload) => {
    return new Promise((resolve, reject) => {
      client
        .delete(`${COMBO_DETAIL_DELETE}`, {
          data: payload,
        })
        .then(s => {
          if (s?.data?.code === 1 && s?.data?.data) {
            resolve(s);
          }
          else reject(s?.data);
        })
        .catch(e => {
          reject(e)
        });
    });
  },

  delete: ({ id, ...payload }) => {
    return new Promise((resolve, reject) => {
      client
        .delete(`${COMBO_DETAIL_DELETE}/${id}`)
        .then(s => {
          if (s?.data?.code === 1 && s?.data?.data) {
            resolve(s);
          }
          else reject(s?.data);
        })
        .catch(e => {
          reject(e)
        });
    });
  },
  create: (payload) => {
    return new Promise((resolve, reject) => {
      client.post(`${COMBO_DETAIL_CREATE}`, payload)
        .then(s => {
          if (s?.data?.code === 1 && s?.data?.data) {
            resolve(s?.data);
          }
          else reject(s?.data)
        })
        .catch(e => {
          reject(e);
        });
    });
  },

  update: ({ id, payload }) => {
    return new Promise((resolve, reject) => {
      client
        .put(`${COMBO_DETAIL_UPDATE}/${id}`, payload)
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

  // search: (param = {}) => {
  //   return new Promise((resolve, reject) => {
  //     client
  //       .get(combineUrlParams(`${COMBO_SEARCH}`, {
  //         page: 1,
  //         size: 999,
  //         ...param,
  //       }))
  //       .then(s => {
  //         if (s?.data?.code === 1 && s?.data?.data) {
  //           resolve(s?.data);
  //         } else reject(s?.data);
  //       })
  //       .catch(e => {
  //         reject(e);
  //       });
  //   });
  // },

  // getById: (id) => {
  //   return new Promise((resolve, reject) => {
  //     client
  //       .get(combineUrlParams(`${COMBO_GET_BY_ID}/${id}`, {}))
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
  // getInvoice: (id) => {
  //   return new Promise((resolve, reject) => {
  //     client
  //       .get(`${INWARD_GET_INVOICE}/${id}`)
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

  // getPaymentVoucher: (id) => {
  //   return new Promise((resolve, reject) => {
  //     client
  //       .get(`${INWARD_GET_PAYMENT_VOUCHER}/${id}`)
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