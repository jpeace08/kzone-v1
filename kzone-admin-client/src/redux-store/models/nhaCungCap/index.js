import cacheUtils from "utils/cache-utils";
import { message } from "antd";
import vendorProvider from "data-access/vendors-provider";
export default {
  state: {
    dsNCC: [],
    isLoading: false,
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
        let dsAllNhaCungCap = await cacheUtils.read(
          userId,
          "DATA_VENDOR",
          [],
          false
        );
        dispatch.nhaCungCap.updateData({
          dsAllNhaCungCap,
        });

        vendorProvider
          .search({ page: 1, size: 9999 })
          .then((s) => {
            let dsAllNhaCungCap = (s?.data?.content || []).map((item) => ({
              id: item.id,
              name: item.name,
            }));
            dispatch.nhaCungCap.updateData({
              dsAllNhaCungCap,
            });
            cacheUtils.save(userId, "DATA_VENDOR", dsAllNhaCungCap, false);
          })
          .catch((e) => { });
      });
    },
    onCreate: (vendor) => {
      return new Promise((resolve, reject) => {
        dispatch.nhaCungCap.updateData({
          isLoadingCreate: true,
        });

        vendorProvider
          .create(vendor)
          .then((s) => {
            dispatch.nhaCungCap.updateData({
              isLoadingCreate: false,
            });
            dispatch.nhaCungCap.onSearch({});
            message.success("Thêm mới thành công!");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Tạo mới không thành công!");
            dispatch.nhaCungCap.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    onUpdate: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.nhaCungCap.updateData({
          isLoadingCreate: true,
        });

        vendorProvider
          .update({ id, ...payload })
          .then((s) => {
            let dsNCC = (state.nhaCungCap.dsNCC || []).map((item) => {
              if (item.id != id) return item;
              s.data.index = item.index;
              return s.data;
            });
            dispatch.nhaCungCap.updateData({
              isLoadingCreate: false,
              dsNCC: [...dsNCC],
            });
            message.success("Chỉnh sửa thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Chỉnh sửa không thành công");
            dispatch.nhaCungCap.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },

    onSizeChange: ({ size, ...rest }, state) => {
      dispatch.nhaCungCap.updateData({
        size,
        page: 1,
        ...rest,
      });
      dispatch.nhaCungCap.onSearch({ page: 1, size, ...rest });
    },

    onSearch: ({ page = 1, ...payload }, state) => {
      const dataSearch = {
        ...(state.nhaCungCap.dataSearch || {}),
        ...(payload.dataSearch || {}),
      };

      let newState = { isLoading: true, page, dataSearch };
      dispatch.nhaCungCap.updateData(newState);
      let size = payload.size || state.nhaCungCap.size || 10;
      vendorProvider
        .search({
          page,
          size,
          ...dataSearch,
        })
        .then((s) => {
          dispatch.nhaCungCap.updateData({
            dsNCC: (s?.data?.content || []).map((item, index) => {
              item.index = (page - 1) * size + index + 1;
              return item;
            }),
            isLoading: false,
            totalElements: s?.data?.totalElements || 0,
            page,
            size,
          });
        })
        .catch((e) => {
          message.error(e?.message || "Xảy ra lỗi, vui lòng thử lại sau");
          dispatch.nhaCungCap.updateData({
            dsNCC: [],
            isLoading: false,
          });
        });
    },
    onSearchId: (id, state) => {
      dispatch.nhaCungCap.updateData({
        isLoading: true,
      });
      let size = state.nhaCungCap.size || 10;
      if (!id) dispatch.nhaCungCap.onSearch({});
      else {
        vendorProvider
          .searchById(id)
          .then((s) => {
            dispatch.nhaCungCap.updateData({
              dsNCC: s?.data
                ? [s?.data]
                : [].map((item, index) => {
                  item.index = index + 1;
                  return item;
                }),
              isLoading: false,
              totalElements: 1 || 0,
              page: 1,
            });
          })
          .catch((e) => {
            message.error(e?.message || "Xảy ra lỗi, vui lòng thử lại sau");
            dispatch.nhaCungCap.updateData({
              dsNCC: [],
              isLoading: false,
            });
          });
      }
    },
    onChangeInputSearch: ({ ...payload }, state) => {
      const dataSearch = {
        ...(state.nhaCungCap.dataSearch || {}),
        ...payload,
      };
      dispatch.nhaCungCap.updateData({
        page: 1,
        dataSearch,
      });
      dispatch.nhaCungCap.onSearch({
        page: 1,
        dataSearch,
      });
    },
    onDelete: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.nhaCungCap.updateData({
          isLoading: true,
        });

        vendorProvider
          .delete({ id, ...payload })
          .then((s) => {
            const { page = 1, size = 10 } = state.nhaCungCap;
            let dsNCC = (state.nhaCungCap.dsNCC || [])
              .filter((item) => item.id != id)
              .map((item, index) => {
                item.index = (page - 1) * size + index + 1;
                return item;
              });

            dispatch.nhaCungCap.updateData({
              isLoading: false,
              dsNCC: [...dsNCC],
              totalElements: state.nhaCungCap.totalElements - 1,
            });
            message.success("Xoá nhà cung cấp thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Xoá nhà cung cấp không thành công");
            dispatch.nhaCungCap.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },
    onDeleteMul: (payload, state) => {
      return new Promise((resolve, reject) => {
        dispatch.nhaCungCap.updateData({
          isLoading: true,
        });

        vendorProvider
          .deleteMul(payload)
          .then((s) => {
            const { page = 1, size = 10 } = state.nhaCungCap;
            let dsNCC = (state.nhaCungCap.dsNCC || [])
              .filter((item) => !payload.includes(item.id))
              .map((item, index) => {
                item.index = (page - 1) * size + index + 1;
                return item;
              });

            dispatch.nhaCungCap.updateData({
              dsNCC: [...dsNCC],
              totalElements: state.nhaCungCap.totalElements - payload.length,
              isLoading: false,
            });
            message.success("Xoá thành công!");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Xoá không thành công!");
            dispatch.nhaCungCap.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },
  }),
};
