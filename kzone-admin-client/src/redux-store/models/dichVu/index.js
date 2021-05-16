import cacheUtils from "utils/cache-utils";
import { message } from "antd";
import servicesProvider from "data-access/services-provider";
export default {
  state: {
    dsDichVu: [],
  },
  reducers: {
    updateData(state, payload = {}) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch) => ({
    onSearch: ({ page = 1, ...payload }, state) => {
      const dataSearch = {
        ...(state.dichVu.dataSearch || {}),
        ...(payload.dataSearch || {}),
      };

      let newState = { isLoading: true, page, dataSearch };
      dispatch.dichVu.updateData(newState);
      let size = payload.size || state.dichVu.size || 10;
      servicesProvider
        .search({
          page,
          size,
          ...dataSearch,
        })
        .then((s) => {
          dispatch.dichVu.updateData({
            dsDichVu: (s?.data?.content || []).map((item, index) => {
              item.index = (page - 1) * size + index + 1;
              return item;
            }),
            isLoading: false,
            totalElements: s?.data?.totalElements || 0,
            size,
            page,
          });
        })
        .catch((e) => {
          message.error(e?.message || "Xảy ra lỗi, vui lòng thử lại sau");
          dispatch.dichVu.updateData({
            dsDichVu: [],
            isLoading: false,
          });
        });
    },
    clearDichVu: () => {
      dispatch.dichVu.updateData({
        dsDichVu: [],
        totalElements: 0,
      })
    },
    onCreate: (payload) => {
      return new Promise((resolve, reject) => {
        dispatch.dichVu.updateData({
          isLoadingCreate: true,
        });

        servicesProvider
          .create(payload)
          .then((s) => {
            dispatch.dichVu.updateData({
              isLoadingCreate: false,
            });
            dispatch.dichVu.onSearch({});
            message.success("Thêm mới thành công!");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Tạo mới không thành công!");
            dispatch.dichVu.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    onUpdate: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.dichVu.updateData({
          isLoadingCreate: true,
        });

        servicesProvider
          .update({ id, ...payload })
          .then((s) => {
            let dsDichVu = (state.dichVu.dsDichVu || []).map((item) => {
              if (item.id != id) return item;
              s.data.index = item.index;
              return s.data;
            });
            dispatch.dichVu.updateData({
              isLoadingCreate: false,
              dsDichVu: [...dsDichVu],
            });
            message.success("Chỉnh sửa thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Chỉnh sửa không thành công");
            dispatch.dichVu.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    onSearchId: (id) => {
      dispatch.dichVu.updateData({
        isLoading: true,
      });
      if (!id) dispatch.dichVu.onSearch({});
      else {
        servicesProvider
          .searchById(id)
          .then((s) => {
            dispatch.dichVu.updateData({
              dsDichVu: !s?.data
                ? []
                : [s?.data].map((item, index) => {
                  item.index = 1;
                  return item;
                }),
              isLoading: false,
              totalElements: 1 || 0,
              page: 1,
            });
          })
          .catch((e) => {
            message.error(e?.message || "Xảy ra lỗi, vui lòng thử lại sau");
            dispatch.dichVu.updateData({
              dsDichVu: [],
              isLoading: false,
            });
          });
      }
    },
    onChangeInputSearch: ({ ...payload }, state) => {
      const dataSearch = {
        ...(state.dichVu.dataSearch || {}),
        ...payload,
      };
      dispatch.dichVu.updateData({
        page: 1,
        dataSearch,
      });
      dispatch.dichVu.onSearch({
        page: 1,
        dataSearch,
      });
    },
    onDelete: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.dichVu.updateData({
          isLoading: true,
        });

        servicesProvider
          .delete({ id, ...payload })
          .then((s) => {
            const { page = 1, size = 10 } = state.dichVu;
            let dsDichVu = (state.dichVu.dsDichVu || [])
              .filter((item) => item.id != id)
              .map((item, index) => {
                item.index = (page - 1) * size + index + 1;
                return item;
              });
            dispatch.dichVu.updateData({
              dsDichVu: [...dsDichVu],
              totalElements: state.dichVu.totalElements - 1,
              isLoading: false,
            });
            message.success("Xoá thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Xoá không thành công");
            dispatch.dichVu.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },
    onDeleteMul: (payload, state) => {
      return new Promise((resolve, reject) => {
        dispatch.dichVu.updateData({
          isLoading: true,
        });
        servicesProvider
          .deleteMul(payload)
          .then((s) => {
            dispatch.dichVu.onSearch({});
            dispatch.dichVu.updateData({
              isLoading: false,
            });
            message.success("Xoá thành công!");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Xoá không thành công!");
            dispatch.dichVu.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },

  }),
};
