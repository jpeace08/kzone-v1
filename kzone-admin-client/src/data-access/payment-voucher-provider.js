import { combineUrlParams } from "utils";
import { client } from "client/request";
import {
  PAYMENT_VOUCHER_GOODS_UPDATE,
  PAYMENT_VOUCHER_GET_SERVICES,
  PAYMENT_VOUCHER_CONTENT_CREATE,
  PAYMENT_VOUCHER_CONTENT_SEARCH,
  PAYMENT_VOUCHER_GROUP_CONTENT_SEARCH,
  PAYMENT_VOUCHER_GROUP_CONTENT_CREATE,
  PAYMENT_VOUCHER_CREATE,
  PAYMENT_VOUCHER_CONTENT_GET_ALL,
  PAYMENT_VOUCHER_GET_ALL,
  PAYMENT_VOUCHER_UPDATE_STATUS,
  PAYMENT_VOUCHER_DETAIL_GET_LISTCONTENT_BY_ID,
  PAYMENT_VOUCHER_SEARCH,
  PAYMENT_VOUCHER_DELETE,
  PAYMENT_VOUCHER_UPDATE,
  PAYMENT_VOUCHER_GET_BY_USER_ID,
} from "../client/api";

export default {
  // ============ phiếu chi phiếu mua hàng / dịch vụ 
  update: ({ id, body }) => {
    return new Promise((resolve, reject) => {
      client
        .put(`${PAYMENT_VOUCHER_GOODS_UPDATE}/${id}`, {
          ...body,
        })

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
  update2: ({ idPaymentVoucher, ...payload }) => {
    return new Promise((resolve, reject) => {
      client
        .put(`${PAYMENT_VOUCHER_GOODS_UPDATE}/${idPaymentVoucher}`, payload)
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
  getPaymentVoucherServices: ({ id }) => {
    return new Promise((resolve, reject) => {
      client
        .get(`${PAYMENT_VOUCHER_GET_SERVICES}/${id}`)
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
  // =========== phiếu chi nhân viên
  createContent(payload) {
    return new Promise((resolve, reject) => {
      client
        .post(`${PAYMENT_VOUCHER_CONTENT_CREATE}`, { contentGroupId: payload.contentGroupId, description: payload.description })
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
  getListByUserID: (id) => {
    return new Promise((resolve, reject) => {
      client
        .get(`${PAYMENT_VOUCHER_GET_BY_USER_ID}/${id}`)
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
  getAllContent() {
    return new Promise((resolve, reject) => {
      client
        .get(
          combineUrlParams(`${PAYMENT_VOUCHER_CONTENT_GET_ALL}`, {
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
  searchContent(param = {}) {
    return new Promise((resolve, reject) => {
      client
        .get(combineUrlParams(`${PAYMENT_VOUCHER_CONTENT_SEARCH}`, {
          page: 1,
          // size: 999,
          ...param,
          size: 999,
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
  searchGroupContent(param = {}) {
    return new Promise((resolve, reject) => {
      client
        .get(combineUrlParams(`${PAYMENT_VOUCHER_GROUP_CONTENT_SEARCH}`, {
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
  getAllPhieuChiNV() {
    return new Promise((resolve, reject) => {
      client
        .get(
          combineUrlParams(`${PAYMENT_VOUCHER_GET_ALL}`, {
            page: 1,
            size: 10,
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
  search: (param = {}) => {
    return new Promise((resolve, reject) => {
      client
        .get(combineUrlParams(`${PAYMENT_VOUCHER_SEARCH}`, {
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

  getDetailPaymentVoucherById(id) {
    return new Promise((resolve, reject) => {
      client
        .get(combineUrlParams(`${PAYMENT_VOUCHER_DETAIL_GET_LISTCONTENT_BY_ID}/${id}`, {}))
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
  createGroupContent(payload) {
    return new Promise((resolve, reject) => {
      client
        .post(`${PAYMENT_VOUCHER_GROUP_CONTENT_CREATE}`, { name: payload })
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
  createPhieuChiNV({ userId, detail }) {
    return new Promise((resolve, reject) => {
      client
        .post(`${PAYMENT_VOUCHER_CREATE}`, { userId, detail })
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
  updateStatus(id) {
    return new Promise((resolve, reject) => {
      client
        .put(`${PAYMENT_VOUCHER_UPDATE_STATUS}/${id}`, { paid: 1 })
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
  updatePhieuChiNV({ id, payload }) {
    return new Promise((resolve, reject) => {
      client
        .put(`${PAYMENT_VOUCHER_UPDATE}/${id}`, payload)
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
  deleteMul(payload) {
    return new Promise((resolve, reject) => {
      client
        .delete(`${PAYMENT_VOUCHER_DELETE}`, { data: payload })
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
        .delete(`${PAYMENT_VOUCHER_DELETE}/${id}`)
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
