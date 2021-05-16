import cacheUtils from "utils/cache-utils";
import { message } from "antd";
import permissionProvider from "data-access/permission-provider";
export default {
  state: {
    dsQuyen: [],
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
        let dsQuyen = await cacheUtils.read(userId, "DATA_QUYEN", [], false);
        dispatch.quyen.updateData({
          dsQuyen,
        });

        permissionProvider
          .getAll()
          .then((s) => {
            let dsQuyen = (s?.data || []).map((item) => ({
              id: item.id,
              name: item.name,
            }));
            dispatch.quyen.updateData({
              dsQuyen,
            });
            cacheUtils.save(userId, "DATA_QUYEN", dsQuyen, false);
          })
          .catch((e) => { });
      });
    },
    onSearch: ({ page = 1, ...payload }, state) => {
      const dataSearch = {
        ...(state.quyen.dataSearch || {}),
        ...(payload.dataSearch || {}),
      };
      let newState = { isLoading: true, page, dataSearch };
      dispatch.quyen.updateData(newState);
      let size = payload.size || state.quyen.size || 10;
      permissionProvider
        .search({
          page,
          size,
          ...dataSearch,
        })
        .then((s) => {
          dispatch.quyen.updateData({
            dsQuyen: (s?.data || []).map((item, index) => {
              item.index = (page - 1) * size + index + 1;
              return item;
            }),
            isLoading: false,
            totalElements: s?.data?.totalElements || 0,
            page,
          });
        })
        .catch((e) => {
          message.error(e?.message || "Xảy ra lỗi, vui lòng thử lại sau");
          dispatch.quyen.updateData({
            dsQuyen: [],
            isLoading: false,
          });
        });
    },
    clearOldData: () => {
      dispatch.quyen.updateData({
        selectedItem: []
      })
    },
    getByUser: (id, state) => {
      dispatch.quyen.updateData({
        isLoading: true,
      });
      if (!id) dispatch.quyen.onSearch({});
      else {
        permissionProvider
          .getByUser(id)
          .then(async (s) => {
            console.log("chay vao day")
            const selectedItem = s?.data || [];
            dispatch.quyen.updateData({
              selectedItem
            });
          })
          .catch((e) => {
            message.error(e?.message || "Xảy ra lỗi, vui lòng thử lại sau");
            dispatch.quyen.updateData({
              isLoading: false,
            });
          });
      }
    },
  }),
};
