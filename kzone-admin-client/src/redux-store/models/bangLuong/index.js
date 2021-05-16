import cacheUtils from "utils/cache-utils";
import { message } from "antd";
import salariesProvider from "data-access/salaries-provider";
export default {
  state: {
    dsBangLuong: [],
    isLoading: false,
  },
  reducers: {
    updateData(state, payload = {}) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch) => ({
    getAll: (page = 1, state) => {
      return new Promise(async (resolve, reject) => {
        let userId = state.auth.auth?.id;
        let dsBangLuong = await cacheUtils.read(
          userId,
          "DATA_VENDOR",
          [],
          false
        );
        dispatch.bangLuong.updateData({
          dsBangLuong,
          isLoading: true,
        });
        salariesProvider
          .getAll({ page: page, size: 10 })
          .then((s) => {
            let dsBangLuong = (s?.data?.content || [])
            dispatch.bangLuong.updateData({
              dsBangLuong,
              totalElements: s?.data?.totalElements || 0,
              isLoading: false
            });
            cacheUtils.save(userId, "DATA_SALARIES", dsBangLuong, false);
          })
          .catch((e) => {
            dispatch.bangLuong.updateData({
              isLoading: false,
            })
          });
      });
    },
    onChangeSort: ({ ...payload }, state) => {
      const dataSort = state.bangLuong.dataSort || {};
      dataSort.type = payload.type;
      dispatch.bangLuong.updateData({
        page: 1,
        dataSort,
      });
      dispatch.bangLuong.onSearch({
        page: 1,
        dataSort,
      });
    },
    onCreate: (salaries) => {
      return new Promise((resolve, reject) => {
        dispatch.bangLuong.updateData({
          isLoadingCreate: true,
        });
        salariesProvider
          .create(salaries)
          .then((s) => {
            dispatch.bangLuong.updateData({
              isLoadingCreate: false,
            });
            dispatch.bangLuong.getAll();
            message.success("Thêm mới thành công!");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Tạo mới không thành công!");
            dispatch.bangLuong.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    onUpdate: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.bangLuong.updateData({
          isLoadingCreate: true,
        });

        salariesProvider
          .update({ id, ...payload })
          .then((s) => {
            let dsBangLuong = (state.bangLuong.dsBangLuong || []).map((item) => {
              if (item.id != id) return item;
              s.data.index = item.index;
              return s.data;
            });
            dispatch.bangLuong.updateData({
              isLoadingCreate: false,
              dsBangLuong: [...dsBangLuong],
            });
            message.success("Chỉnh sửa thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Chỉnh sửa không thành công");
            dispatch.bangLuong.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },

    onSizeChange: ({ size, ...rest }, state) => {
      dispatch.bangLuong.updateData({
        size,
        page: 1,
        ...rest,
      });
      dispatch.bangLuong.onSearch({ page: 1, size, ...rest });
    },
    onChangeSort: ({ ...payload }, state) => {
      const dataSort = state.bangLuong.dataSort || {};
      dataSort.type = payload.type;
      dispatch.bangLuong.updateData({
        page: 1,
        dataSort,
      });
      dispatch.bangLuong.onSearch({
        page: 1,
        dataSort,
      });
    },
    onSearch: ({ page = 1, ...payload }, state) => {
      const dataSearch = {
        ...(state.bangLuong.dataSearch || {}),
        ...(payload.dataSearch || {}),
      };
      const dataSort = {
        ...(state.bangLuong.dataSort || {}),
        ...(payload.dataSort || {}),
      };
      let newState = { isLoading: true, page, dataSearch };
      dispatch.bangLuong.updateData(newState);
      let size = payload.size || state.bangLuong.size || 10;
      salariesProvider
        .getAll({
          page,
          size,
          ...dataSearch,
          ...dataSort,
        })
        .then((s) => {
          dispatch.bangLuong.updateData({
            dsBangLuong: (s?.data?.content || []).map((item, index) => {
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
          dispatch.bangLuong.updateData({
            dsBangLuong: [],
            isLoading: false,
          });
        });
    },
    onSearchUserId: (id, state) => {
      dispatch.bangLuong.updateData({
        isLoading: true,
      });
      if (!id) {
        dispatch.bangLuong.updateData({
          isLoading: false,
        })
        dispatch.bangLuong.getAll({});
      }
      else {
        salariesProvider
          .searchByUserId(id)
          .then((s) => {

            dispatch.bangLuong.updateData({
              dsBangLuong: [s?.data] || [],
              isLoading: false,
              totalElements: 1 || 0,
              page: 1 || 0,
              size: 1 || 0,
            });
          })
          .catch((e) => {
            // message.error(e?.message || "Xảy ra lỗi, vui lòng thử lại sau");
            dispatch.bangLuong.updateData({
              dsBangLuong: [],
              isLoading: false,
            });
          });
      }
    },
    onChangeInputSearch: ({ ...payload }, state) => {
      const dataSearch = {
        ...(state.bangLuong.dataSearch || {}),
        ...payload,
      };
      dispatch.bangLuong.updateData({
        page: 1,
        dataSearch,
      });
      dispatch.bangLuong.onSearch({
        page: 1,
        dataSearch,
      });
    },
    onDelete: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.bangLuong.updateData({
          isLoading: true,
        });
        salariesProvider
          .delete({ id, ...payload })
          .then((s) => {
            const { page = 1, size = 10 } = state.bangLuong;
            let dsBangLuong = (state.bangLuong.dsBangLuong || [])
              .filter((item) => item.id != id)
              .map((item, index) => {
                item.index = (page - 1) * size + index + 1;
                return item;
              });

            dispatch.bangLuong.updateData({
              isLoading: false,
              dsBangLuong: [...dsBangLuong],
              totalElements: state.bangLuong.totalElements - 1,
            });
            message.success("Xoá thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Xoá không thành công");
            dispatch.bangLuong.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },
    onDeleteMul: (payload, state) => {
      return new Promise((resolve, reject) => {
        dispatch.bangLuong.updateData({
          isLoading: true,
        });

        salariesProvider
          .deleteMul(payload)
          .then((s) => {
            const { page = 1, size = 10 } = state.bangLuong;
            let dsBangLuong = (state.bangLuong.dsBangLuong || [])
              .filter((item) => !payload.includes(item.id))
              .map((item, index) => {
                item.index = (page - 1) * size + index + 1;
                return item;
              });

            dispatch.bangLuong.updateData({
              dsBangLuong: [...dsBangLuong],
              totalElements: state.bangLuong.totalElements - payload.length,
              isLoading: false,
            });
            message.success("Xoá thành công!");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Xoá không thành công!");
            dispatch.bangLuong.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },
  }),
};
