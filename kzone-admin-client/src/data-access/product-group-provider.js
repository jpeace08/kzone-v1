import { combineUrlParams } from 'utils';
import { client } from 'client/request';
import {
  NHOM_HANG_HOA_SEARCH,
  NHOM_HANG_HOA_DELETE,
  NHOM_HANG_HOA_CREATE,
  NHOM_HANG_HOA_GET_ALL,
  NHOM_HANG_HOA_UPDATE,
} from '../client/api';

export default {
  getAll: () => {
    return new Promise((resolve, reject) => {
      client
        .get(combineUrlParams(`${NHOM_HANG_HOA_GET_ALL}`, {
          page: 1,
          size: 10,
          type: -1,
        }))
        .then(s => {
          if (s?.data?.code === 1 && s?.data?.data) {
            resolve(s?.data);
          }
          else reject(s?.data);
        }).catch(e => {
          reject(e);
        });
    });
  },
  create(payload) {
    return new Promise((resolve, reject) => {
      client
        .post(`${NHOM_HANG_HOA_CREATE}`, payload)
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
  update: ({ id, body }) => {
    return new Promise((resolve, reject) => {
      client
        .put(`${NHOM_HANG_HOA_UPDATE}/${id}`, body)
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
  delete: (id) => {
    return new Promise((resolve, reject) => {
      client
        .delete(`${NHOM_HANG_HOA_DELETE}/${id}`)
        .then(s => {
          if (s?.data?.code === 1 && s?.data?.data) {
            resolve(s?.data);
          }
          else reject(s?.data);
        })
        .catch(e => {
          reject(e);
        });
    });
  }
}