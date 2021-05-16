import { combineUrlParams } from 'utils';
import { client } from 'client/request';
import {
  INWARD_SLIP_CREATE,
  INWARD_SLIP_SEARCH,
  INWARD_SLIP_UPDATE,
  INWARD_SLIP_DELETE,
  INWARD_SLIP_UPDATE_STATUS_GOODS,
  INWARD_SLIP_UPDATE_STATUS_PAY,
  INWARD_SLIP_UPDATE_ALLOCATION_TYPE,
  INWARD_GET_INVOICE,
  INWARD_GET_PAYMENT_VOUCHER,
  INWARD_UPDATE_COST_INCURRED,
  INWARD_GET_NUMBLE,
  INWARD_GET_ALLOCATION,
  INWARD_ADD_SERVICE_VOUCHER,
  INWARD_SLIP_SEARCH_V2,
  INWARD_UPDATE_CONFIRM_TO_COMING,
  INWARD_GET_WITH_WAREHOUSE,
  INWARD_GET_NUMBERS,
} from '../client/api';

export default {
  getWithWarehouse: (id) => {
    return new Promise((resolve, reject) => {
      client
        .get(`${INWARD_GET_WITH_WAREHOUSE}/${id}`)
        .then(s => {
          if (s?.data?.code === 1 && s?.data?.data) {
            resolve(s?.data);
          }
          else reject(s?.data);
        })
        .catch(e => {
          reject(e)
        });
    });
  },
  getNumbers: (type) => {
    return new Promise((resolve, reject) => {
      client
        .get(`${INWARD_GET_NUMBERS}/${type}`)
        .then(s => {
          if (s?.data?.code === 1 && s?.data?.data) {
            resolve(s?.data);
          }
          else reject(s?.data);
        })
        .catch(e => {
          reject(e)
        });
    });
  },
  deleteMul: (payload) => {
    return new Promise((resolve, reject) => {
      client
        .delete(`${INWARD_SLIP_DELETE}`, {
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
  searchNumber: () => {
    return new Promise((resolve, reject) => {
      client
        .get(combineUrlParams(`${INWARD_GET_NUMBLE}`))
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
  delete: ({ id, ...payload }) => {
    return new Promise((resolve, reject) => {
      client
        .delete(`${INWARD_SLIP_DELETE}/${id}`)
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
      client.post(`${INWARD_SLIP_CREATE}`, payload)
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

  addServiceVoucher: (payload) => {
    return new Promise((resolve, reject) => {
      client.put(`${INWARD_ADD_SERVICE_VOUCHER}/${payload.id}`, [...payload.idService])
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
        .put(`${INWARD_SLIP_UPDATE}/${id}`, payload)
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

  getTotalAllocation: (id) => {
    return new Promise((resolve, reject) => {
      client
        .get(`${INWARD_GET_ALLOCATION}/${id}`)
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

  updateCostIncurred: ({ id, ...payload }) => {
    return new Promise((resolve, reject) => {
      client
        .put(`${INWARD_UPDATE_COST_INCURRED}/${id}`, { ...payload })
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

  updateStatusConfirmInComing: ({ id, payload }) => {
    return new Promise((resolve, reject) => {
      client
        .put(`${INWARD_UPDATE_CONFIRM_TO_COMING}/${id}`, { ...payload })
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

  updateStatus: ({ id, type }) => {
    let baseURL = "";
    if (type === "statusGoods") baseURL = INWARD_SLIP_UPDATE_STATUS_GOODS;
    if (type === "statusPay") baseURL = INWARD_SLIP_UPDATE_STATUS_PAY;
    if (type === "allocationType") baseURL = INWARD_SLIP_UPDATE_ALLOCATION_TYPE;
    return new Promise((resolve, reject) => {
      client
        .put(`${baseURL}/${id}`)
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
  search: (param = {}) => {
    return new Promise((resolve, reject) => {
      client
        .get(combineUrlParams(`${INWARD_SLIP_SEARCH}`, {
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
  search_v2: (param = {}) => {
    return new Promise((resolve, reject) => {
      client
        .get(combineUrlParams(`${INWARD_SLIP_SEARCH_V2}`, {
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
  getInvoice: (id) => {
    return new Promise((resolve, reject) => {
      client
        .get(`${INWARD_GET_INVOICE}/${id}`)
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

  getPaymentVoucher: (id) => {
    return new Promise((resolve, reject) => {
      client
        .get(`${INWARD_GET_PAYMENT_VOUCHER}/${id}`)
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
}