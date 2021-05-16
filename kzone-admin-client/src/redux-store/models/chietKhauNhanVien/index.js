import cacheUtils from "utils/cache-utils";
import { message } from "antd";
import discountEmployeeProvider from "data-access/discount-employee-provider";
export default {
  state: {
    dsChietKhauNhanVien: [],
    isLoading: false,
  },
  reducers: {
    updateData(state, payload = {}) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch) => ({
    onCreate: (payload) => {
      return new Promise((resolve, reject) => {
        dispatch.chietKhauNhanVien.updateData({
          isLoadingCreate: true,
        });

        discountEmployeeProvider
          .create(payload)
          .then((s) => {
            dispatch.chietKhauNhanVien.updateData({
              isLoadingCreate: false,
            });
            dispatch.chietKhauNhanVien.onSearch({});
            message.success("Thêm mới thành công!");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Tạo mới không thành công!");
            dispatch.chietKhauNhanVien.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    updateActive: (id, state) => {
      return new Promise((resolve, reject) => {
        dispatch.chietKhauNhanVien.updateData({
          isLoadingCreate: true,
        });

        discountEmployeeProvider
          .updateActive({ id })
          .then((s) => {
            dispatch.chietKhauNhanVien.onSearch({});
            dispatch.chietKhauNhanVien.updateData({
              isLoadingCreate: false,
            });
            message.success("Chỉnh sửa thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Chỉnh sửa không thành công");
            dispatch.chietKhauNhanVien.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    onUpdate: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.chietKhauNhanVien.updateData({
          isLoadingCreate: true,
        });

        discountEmployeeProvider
          .update({ id, ...payload })
          .then((s) => {
            let dsChietKhauNhanVien = (state.chietKhauNhanVien.dsChietKhauNhanVien || []).map((item) => {
              if (item.id != id) return item;
              s.data.key = item.key;
              return s.data;
            });
            dispatch.chietKhauNhanVien.updateData({
              isLoadingCreate: false,
              dsChietKhauNhanVien: [...dsChietKhauNhanVien],
            });
            message.success("Chỉnh sửa thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Chỉnh sửa không thành công");
            dispatch.chietKhauNhanVien.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },

    onSizeChange: ({ size, ...rest }, state) => {
      dispatch.chietKhauNhanVien.updateData({
        size,
        page: 1,
        ...rest,
      });
      dispatch.chietKhauNhanVien.onSearch({ page: 1, size, ...rest });
    },

    onSearch: ({ page = 1, ...payload }, state) => {
      const dataSearch = {
        ...(state.chietKhauNhanVien.dataSearch || {}),
        ...(payload.dataSearch || {}),
      };
      const dataSort = {
        ...(state.kiemKho.dataSort || {}),
        ...(payload.dataSort || {}),
      };
      let newState = { isLoading: true, page, dataSearch };
      dispatch.chietKhauNhanVien.updateData(newState);
      let size = payload.size || state.chietKhauNhanVien.size || 10;
      discountEmployeeProvider
        .search({
          page,
          size,
          ...dataSearch,
          ...dataSort,
        })
        .then((s) => {
          dispatch.chietKhauNhanVien.updateData({
            dsChietKhauNhanVien: (s?.data?.content || []).map((item, index) => ({
              key: (page - 1) * size + index + 1,
              id: item?.id,
              discountRate: item?.discountRate,
              amountInvoiceDiscount: item?.amountInvoiceDiscount,
              discountEmployeeType: item?.discountEmployeeType,
              employee: item?.employee,
              active: item?.active,
            })),
            isLoading: false,
            totalElements: s?.data?.totalElements || 0,
            page,
            size,
          });
        })
        .catch((e) => {
          message.error(e?.message || "Xảy ra lỗi, vui lòng thử lại sau");
          dispatch.chietKhauNhanVien.updateData({
            dsChietKhauNhanVien: [],
            isLoading: false,
          });
        });
    },
    onChangeSort: ({ ...payload }, state) => {
      const dataSort = state.chietKhauNhanVien.dataSort || {};
      dataSort.type = payload.type;
      dispatch.chietKhauNhanVien.updateData({
        page: 1,
        dataSort,
      });
      dispatch.chietKhauNhanVien.onSearch({
        page: 1,
        dataSort,
      });
    },
    onSearchId: (id, state) => {
      dispatch.chietKhauNhanVien.updateData({
        isLoading: true,
      });
      let size = state.chietKhauNhanVien.size || 10;
      if (!id) dispatch.chietKhauNhanVien.onSearch({});
      else {
        discountEmployeeProvider
          .searchById(id)
          .then((s) => {
            dispatch.chietKhauNhanVien.updateData({
              dsChietKhauNhanVien: s?.data
                ? [s?.data]
                : [].map((item, index) => {
                  item.key = index + 1;
                  return item;
                }),
              isLoading: false,
              totalElements: 1 || 0,
              page: 1,
            });
          })
          .catch((e) => {
            message.error(e?.message || "Xảy ra lỗi, vui lòng thử lại sau");
            dispatch.chietKhauNhanVien.updateData({
              dsChietKhauNhanVien: [],
              isLoading: false,
            });
          });
      }
    },
    onChangeInputSearch: ({ ...payload }, state) => {
      const dataSearch = {
        ...(state.chietKhauNhanVien.dataSearch || {}),
        ...payload,
      };
      dispatch.chietKhauNhanVien.updateData({
        page: 1,
        dataSearch,
      });
      dispatch.chietKhauNhanVien.onSearch({
        page: 1,
        dataSearch,
      });
    },
    onDelete: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.chietKhauNhanVien.updateData({
          isLoading: true,
        });

        discountEmployeeProvider
          .delete({ id, ...payload })
          .then((s) => {
            const { page = 1, size = 10 } = state.chietKhauNhanVien;
            let dsChietKhauNhanVien = (state.chietKhauNhanVien.dsChietKhauNhanVien || [])
              .filter((item) => item.id != id)
              .map((item, index) => {
                item.key = (page - 1) * size + index + 1;
                return item;
              });

            dispatch.chietKhauNhanVien.updateData({
              isLoading: false,
              dsChietKhauNhanVien: [...dsChietKhauNhanVien],
              totalElements: state.chietKhauNhanVien.totalElements - 1,
            });
            message.success("Xoá nhà cung cấp thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Xoá nhà cung cấp không thành công");
            dispatch.chietKhauNhanVien.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },
    onDeleteMul: (payload, state) => {
      return new Promise((resolve, reject) => {
        dispatch.chietKhauNhanVien.updateData({
          isLoading: true,
        });

        discountEmployeeProvider
          .deleteMul(payload)
          .then((s) => {
            const { page = 1, size = 10 } = state.chietKhauNhanVien;
            let dsChietKhauNhanVien = (state.chietKhauNhanVien.dsChietKhauNhanVien || [])
              .filter((item) => !payload.includes(item.id))
              .map((item, index) => {
                item.key = (page - 1) * size + index + 1;
                return item;
              });

            dispatch.chietKhauNhanVien.updateData({
              dsChietKhauNhanVien: [...dsChietKhauNhanVien],
              totalElements: state.chietKhauNhanVien.totalElements - payload.length,
              isLoading: false,
            });
            message.success("Xoá thành công!");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Xoá không thành công!");
            dispatch.chietKhauNhanVien.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },
  }),
};
