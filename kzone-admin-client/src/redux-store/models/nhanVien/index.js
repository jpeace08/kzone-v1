import { message } from "antd";
import userProvider from "data-access/user-provider";
import authProvider from "data-access/auth-provider";
import cacheUtils from "utils/cache-utils";
export default {
  state: {
    dsNhanVien: [],
    isLoading: false,
  },
  reducers: {
    updateData(state, payload = {}) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch) => ({
    clearOldData: () => {
      dispatch.nhanVien.updateData({
        dataSearch: "",
      });
    },
    getAll: (payload, state) => {
      return new Promise(async (resolve, reject) => {
        let userId = state.auth.auth?.id;
        let dsNhanVien = await cacheUtils.read(
          userId,
          "DATA_NHAN_VIEN",
          [],
          false
        );
        dispatch.nhanVien.updateData({
          dsNhanVien,
        }); 
        userProvider
          .search({ page: 1, size: 9999 })
          .then((s) => {
            let dsNhanVien = (s?.data?.content || []).map((item) => ({
              id: item.id,
              name: item.name,
              username: item.username,
              permissions: [
                ...item.roles.map((i) => {
                  return i.id;
                }),
              ],
              ...item,
            }));
            dispatch.nhanVien.updateData({
              dsNhanVien,
            });
            cacheUtils.save(userId, "DATA_NHAN_VIEN", dsNhanVien, false);
          })
          .catch((e) => { });
      });
    },
    onCreate: ({ roleId = [], ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.nhanVien.updateData({
          isLoadingCreate: true,
        });

        userProvider
          .create({ roleId, ...payload })
          .then((s) => {
            dispatch.nhanVien.updateData({
              isLoadingCreate: false,
            });
            dispatch.nhanVien.onSearch({});
            message.success("Thêm mới thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Tạo mới không thành công");
            dispatch.nhanVien.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    onUpdate: ({ id, roleId = [], ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.nhanVien.updateData({
          isLoadingCreate: true,
        });

        userProvider
          .update({ id, roleId, ...payload })
          .then((s) => {
            let dsNhanVien = (state.nhanVien.dsNhanVien || []).map((item) => {
              if (item.id != id) return item;
              s.data.index = item.index;
              return s.data;
            });

            dispatch.nhanVien.updateData({
              isLoadingCreate: false,
              dsNhanVien: [...dsNhanVien],
            });
            // dispatch.nhanVien.onSearch({});
            message.success("Chỉnh sửa thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Chỉnh sửa không thành công");
            dispatch.nhanVien.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    onUpdatePermission: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.nhanVien.updateData({
          isLoadingCreate: true,
        });
        userProvider
          .updatePermission({ id, ...payload })
          .then((s) => {
            let dsNhanVien = (state.nhanVien.dsNhanVien || []).map((item) => {
              if (item.id != id) return item;
              s.data.index = item.index;
              return s.data;
            });

            dispatch.nhanVien.updateData({
              isLoadingCreate: false,
              dsNhanVien: [...dsNhanVien],
            });
            // dispatch.nhanVien.onSearch({});
            message.success("Phân quyền thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Phân quyền không thành công");
            dispatch.nhanVien.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    onDelete: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.nhanVien.updateData({
          isLoading: true,
        });

        userProvider
          .delete({ id, ...payload })
          .then((s) => {
            const { page = 1, size = 10 } = state.nhanVien;
            let dsNhanVien = (state.nhanVien.dsNhanVien || [])
              .filter((item) => item.id != id)
              .map((item, index) => {
                item.index = (page - 1) * size + index;
                return item;
              });

            dispatch.nhanVien.updateData({
              isLoading: false,
              dsNhanVien: [...dsNhanVien],
            });
            // dispatch.nhanVien.onSearch({});
            message.success("Xoá nhân viên thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Xoá nhân viên không thành công");
            dispatch.nhanVien.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },
    onSizeChange: ({ size, ...rest }, state) => {
      dispatch.nhanVien.updateData({
        size,
        page: 1,
        ...rest,
      });
      dispatch.nhanVien.onSearch({ page: 1, size, ...rest });
    },

    onSearch: ({ page = 1, ...payload }, state) => {
      const dataSearch = {
        ...(state.nhanVien.dataSearch || {}),
        ...(payload.dataSearch || {}),
      };
      const dataSort = {
        ...(state.nhanVien.dataSort || {}),
        ...(payload.dataSort || {}),
      };

      let newState = { isLoading: true, page, dataSearch };
      dispatch.nhanVien.updateData(newState);
      let size = payload.size || state.nhanVien.size || 10;
      userProvider
        .search({
          page,
          size,
          ...dataSearch,
          ...dataSort,
        })
        .then((s) => {
          dispatch.nhanVien.updateData({
            dsNhanVien: (s?.data?.content || []).map((item, index) => {
              item.index = (page - 1) * size + index + 1;
              return item;
            }),
            isLoading: false,
            totalElements: s?.data?.totalElements || 0,
            page,
            size
          });
        })
        .catch((e) => {
          message.error(e?.message || "Xảy ra lỗi, vui lòng thử lại sau");
          dispatch.nhanVien.updateData({
            dsNhanVien: [],
            isLoading: false,
          });
        });
    },
    onChangeInputSearch: ({ ...payload }, state) => {
      const dataSearch = {
        ...(state.nhanVien.dataSearch || {}),
        ...payload,
      };
      dispatch.nhanVien.updateData({
        page: 1,
        dataSearch,
      });
      dispatch.nhanVien.onSearch({
        page: 1,
        dataSearch,
      });
    },
    onChangeSort: ({ ...payload }, state) => {
      const dataSort = state.nhanVien.dataSort || {};
      dataSort.type = payload.type;

      dispatch.nhanVien.updateData({
        page: 1,
        dataSort,
      });
      dispatch.nhanVien.onSearch({
        page: 1,
        dataSort,
      });
    },
    onUpdatePassword: ({ id, payload }) => {
      return new Promise((resolve, reject) => {
        dispatch.nhanVien.updateData({
          isLoading: true,
        });
        userProvider
          .updatePassword({ id, payload })
          .then((s) => {
            dispatch.nhanVien.updateData({
              isLoading: false,
            });
            message.success(
              "Đổi mật khẩu nhân viên thành công! Đăng nhập lại!"
            );
            resolve(s?.data);
            dispatch.auth.onLogout();
          })
          .catch((e) => {
            message.error(
              e?.message || "Đổi mật khẩu nhân viên không thành công"
            );
            dispatch.nhanVien.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },
    // onResetPassword: ({ id, ...payload }, state) => {
    //   return new Promise((resolve, reject) => {
    //     dispatch.nhanVien.updateData({
    //       isLoading: true,
    //     });

    //     userProvider
    //       .resetPassword({ id, ,...payload })
    //       .then((s) => {
    //         dispatch.nhanVien.updateData({
    //           isLoading: false,
    //         });
    //         // dispatch.nhanVien.onSearch({});
    //         message.success(
    //           "Reset mật khẩu nhân viên thành công. Mật khẩu mới: 123456"
    //         );
    //         resolve(s?.data);
    //       })
    //       .catch((e) => {
    //         message.error(
    //           e?.message || "Reset mật khẩu nhân viên không thành công"
    //         );
    //         dispatch.nhanVien.updateData({
    //           isLoading: false,
    //         });
    //         reject(e);
    //       });
    //   });
    // },
  }),
};
