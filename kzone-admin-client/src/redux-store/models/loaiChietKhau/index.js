import cacheUtils from "utils/cache-utils";
import { message } from "antd";
import discountEmployeeTypeProvider from "data-access/discount-employee-type-provider";
export default {
  state: {
    dsLoaiChietKhau: [],
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
        let dsLoaiChietKhau = await cacheUtils.read(
          userId,
          "DATA_DISCOUNT_EMPLOYEE",
          [],
          false
        );
        dispatch.loaiChietKhau.updateData({
          dsLoaiChietKhau,
        });

        discountEmployeeTypeProvider
          .getAll({ page: 1, size: 9999, type: -1 })
          .then((s) => {
            let dsLoaiChietKhau = (s?.data?.content || []).map((item) => ({
              id: item.id,
              name: item.name,
            }));
            dispatch.loaiChietKhau.updateData({
              dsLoaiChietKhau,
            });
            cacheUtils.save(userId, "DATA_DISCOUNT_EMPLOYEE", dsLoaiChietKhau, false);
          })
          .catch((e) => { });
      });
    },
    onCreate: (payload) => {
      return new Promise((resolve, reject) => {
        dispatch.loaiChietKhau.updateData({
          isLoadingCreate: true,
        });

        discountEmployeeTypeProvider
          .create(payload)
          .then((s) => {
            dispatch.loaiChietKhau.updateData({
              isLoadingCreate: false,
            });
            dispatch.loaiChietKhau.getAll();
            message.success("Thêm mới thành công!");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Tạo mới không thành công!");
            dispatch.loaiChietKhau.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    onUpdate: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.loaiChietKhau.updateData({
          isLoadingCreate: true,
        });

        discountEmployeeTypeProvider
          .update({ id, ...payload })
          .then((s) => {
            let dsLoaiChietKhau = (state.loaiChietKhau.dsLoaiChietKhau || []).map((item) => {
              if (item.id != id) return item;
              s.data.index = item.index;
              return s.data;
            });
            dispatch.loaiChietKhau.updateData({
              isLoadingCreate: false,
              dsLoaiChietKhau: [...dsLoaiChietKhau],
            });
            message.success("Chỉnh sửa thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Chỉnh sửa không thành công");
            dispatch.loaiChietKhau.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },

    onSizeChange: ({ size, ...rest }, state) => {
      dispatch.loaiChietKhau.updateData({
        size,
        page: 1,
        ...rest,
      });
      dispatch.loaiChietKhau.onSearch({ page: 1, size, ...rest });
    },

    onSearch: ({ page = 1, ...payload }, state) => {
      const dataSearch = {
        ...(state.loaiChietKhau.dataSearch || {}),
        ...(payload.dataSearch || {}),
      };

      let newState = { isLoading: true, page, dataSearch };
      dispatch.loaiChietKhau.updateData(newState);
      let size = payload.size || state.loaiChietKhau.size || 10;
      discountEmployeeTypeProvider
        .search({
          page,
          size,
          ...dataSearch,
        })
        .then((s) => {
          dispatch.loaiChietKhau.updateData({
            dsLoaiChietKhau: (s?.data?.content || []).map((item, index) => {
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
          dispatch.loaiChietKhau.updateData({
            dsLoaiChietKhau: [],
            isLoading: false,
          });
        });
    },
    onSearchId: (id, state) => {
      dispatch.loaiChietKhau.updateData({
        isLoading: true,
      });
      let size = state.loaiChietKhau.size || 10;
      if (!id) dispatch.loaiChietKhau.onSearch({});
      else {
        discountEmployeeTypeProvider
          .searchById(id)
          .then((s) => {
            dispatch.loaiChietKhau.updateData({
              dsLoaiChietKhau: s?.data
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
            dispatch.loaiChietKhau.updateData({
              dsLoaiChietKhau: [],
              isLoading: false,
            });
          });
      }
    },
    onChangeInputSearch: ({ ...payload }, state) => {
      const dataSearch = {
        ...(state.loaiChietKhau.dataSearch || {}),
        ...payload,
      };
      dispatch.loaiChietKhau.updateData({
        page: 1,
        dataSearch,
      });
      dispatch.loaiChietKhau.onSearch({
        page: 1,
        dataSearch,
      });
    },
    onDelete: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.loaiChietKhau.updateData({
          isLoading: true,
        });

        discountEmployeeTypeProvider
          .delete({ id, ...payload })
          .then((s) => {
            const { page = 1, size = 10 } = state.loaiChietKhau;
            let dsLoaiChietKhau = (state.loaiChietKhau.dsLoaiChietKhau || [])
              .filter((item) => item.id != id)
              .map((item, index) => {
                item.index = (page - 1) * size + index + 1;
                return item;
              });

            dispatch.loaiChietKhau.updateData({
              isLoading: false,
              dsLoaiChietKhau: [...dsLoaiChietKhau],
              totalElements: state.loaiChietKhau.totalElements - 1,
            });
            message.success("Xoá nhà cung cấp thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Xoá nhà cung cấp không thành công");
            dispatch.loaiChietKhau.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },
    onDeleteMul: (payload, state) => {
      return new Promise((resolve, reject) => {
        dispatch.loaiChietKhau.updateData({
          isLoading: true,
        });

        discountEmployeeTypeProvider
          .deleteMul(payload)
          .then((s) => {
            const { page = 1, size = 10 } = state.loaiChietKhau;
            let dsLoaiChietKhau = (state.loaiChietKhau.dsLoaiChietKhau || [])
              .filter((item) => !payload.includes(item.id))
              .map((item, index) => {
                item.index = (page - 1) * size + index + 1;
                return item;
              });

            dispatch.loaiChietKhau.updateData({
              dsLoaiChietKhau: [...dsLoaiChietKhau],
              totalElements: state.loaiChietKhau.totalElements - payload.length,
              isLoading: false,
            });
            message.success("Xoá thành công!");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Xoá không thành công!");
            dispatch.loaiChietKhau.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },
  }),
};
