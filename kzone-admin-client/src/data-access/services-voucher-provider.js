import { combineUrlParams } from 'utils';
import { client } from 'client/request';
import {
  SERVICES_VOUCHER_CREATE,
  SERVICES_VOUCHER_SEARCH,
  SERVICES_VOUCHER_SEARCH_V2,
  SERVICES_VOUCHER_GET_INVOICE,
  SERVICES_VOUCHER_GET_PAYMENTVOUCHER,
  SERVICES_VOUCHER_UPDATE_STATUS_PAY,
  SERVICES_VOUCHER_UPDATE,
  SERVICES_VOUCHER_GET_INWARDSLIP,
  SERVICES_VOUCHER_DELETE,
  SERVICES_VOUCHER_UNASSIGNED,
} from '../client/api';

export default {
  create: (payload) => {
    return new Promise((resolve, reject) => {
      client.post(`${SERVICES_VOUCHER_CREATE}`, payload)
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
  getInvoice: (id) => {
    return new Promise((resolve, reject) => {
      client
        .get(`${SERVICES_VOUCHER_GET_INVOICE}/${id}`)
        .then((s) => {
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
  getPaymentVoucher: (id) => {
    return new Promise((resolve, reject) => {
      client
        .get(`${SERVICES_VOUCHER_GET_PAYMENTVOUCHER}/${id}`)
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
  getInwardSlip: (id) => {
    return new Promise((resolve, reject) => {
      client
        .get(`${SERVICES_VOUCHER_GET_INWARDSLIP}/${id}`)
        .then(s => {
          if (s?.data?.code === 1) {
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
        .put(`${SERVICES_VOUCHER_UPDATE}/${id}`, payload)
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

  updateStatus: ({ id }) => {
    return new Promise((resolve, reject) => {
      client
        .put(`${SERVICES_VOUCHER_UPDATE_STATUS_PAY}/${id}`)
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
  delete: ({ id, ...payload }) => {
    return new Promise((resolve, reject) => {
      client
        .delete(`${SERVICES_VOUCHER_DELETE}/${id}`)
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
  deleteMul(payload) {
    return new Promise((resolve, reject) => {
      client
        .delete(`${SERVICES_VOUCHER_DELETE}`, { data: payload })
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
  searchV2: (param = {}) => {
    return new Promise((resolve, reject) => {
      client
        .get(combineUrlParams(`${SERVICES_VOUCHER_SEARCH_V2}`, {
          page: 1,
          size: 10,
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
  search: (param = {}) => {
    return new Promise((resolve, reject) => {
      client
        .get(combineUrlParams(`${SERVICES_VOUCHER_SEARCH}`, {
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

  getVoucherUnassigned: (param = {}) => {
    return new Promise((resolve, reject) => {
      client
        .get(combineUrlParams(`${SERVICES_VOUCHER_UNASSIGNED}`, {
          page: 1,
          size: 10,
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
  }
}