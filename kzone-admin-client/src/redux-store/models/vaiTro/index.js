import cacheUtils from "utils/cache-utils";
import { message } from "antd";
import rolesProvider from "data-access/roles-provider";
export default {
  state: {
    dsVaiTro: [],
  },
  reducers: {
    updateData(state, payload = {}) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch) => ({
    getAll: (payload, state) => {
      return new Promise(async (resolve, reject) => {
        let userId = state.auth.auth?.id;
        let dsVaiTro = await cacheUtils.read(userId, "DATA_VAI_TRO", [], false);
        dispatch.vaiTro.updateData({
          dsVaiTro,
        });

        rolesProvider
          .getAll()
          .then((s) => {
            let dsVaiTro = (s?.data || []).map((item) => ({
              id: item.id,
              name: item.name,
            }));
            dispatch.vaiTro.updateData({
              dsVaiTro,
            });
            cacheUtils.save(userId, "DATA_VAI_TRO", dsVaiTro, false);
          })
          .catch((e) => {});
      });
    },
    onCreate: ({ role = {}, permissions = [] }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.vaiTro.updateData({
          isLoadingCreate: true,
        });

        rolesProvider
          .create({ role, permissions })
          .then((s) => {
            dispatch.vaiTro.updateData({
              isLoadingCreate: false,
            });
            dispatch.vaiTro.getAll();
            message.success("Thêm mới thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Tạo mới không thành công");
            dispatch.vaiTro.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
  }),
};
