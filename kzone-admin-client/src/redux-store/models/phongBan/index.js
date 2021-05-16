import cacheUtils from "utils/cache-utils";
import { message } from "antd";
import departmentProvider from "data-access/department-provider";
export default {
  state: {
    dsPhongBan: [],
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
        let dsPhongBan = await cacheUtils.read(
          userId,
          "DATA_PHONG_BAN",
          [],
          false
        );
        dispatch.phongBan.updateData({
          dsPhongBan,
        });

        departmentProvider
          .getAll()
          .then((s) => {
            let dsPhongBan = (s?.data?.content || []).map((item) => ({
              id: item.id,
              name: item.name,
            }));
            dispatch.phongBan.updateData({
              dsPhongBan,
            });
            cacheUtils.save(userId, "DATA_PHONG_BAN", dsPhongBan, false);
          })
          .catch((e) => { });
      });
    },
    onCreate: ({ department = {}, leaderId }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.phongBan.updateData({
          isLoadingCreate: true,
        });

        departmentProvider
          .create({ department, leaderId })
          .then((s) => {
            dispatch.phongBan.updateData({
              isLoadingCreate: false,
            });
            dispatch.phongBan.onSearch({});
            message.success("Thêm mới thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Tạo mới không thành công");
            dispatch.phongBan.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    onSearch: ({ page = 1, ...payload }, state) => {
      const dataSearch = {
        ...(state.phongBan.dataSearch || {}),
        ...(payload.dataSearch || {}),
      };
      const dataSort = {
        ...(state.phongBan.dataSort || {}),
        ...(payload.dataSort || {}),
      };

      let newState = { isLoading: true, page, dataSearch };
      dispatch.phongBan.updateData(newState);
      let size = payload.size || state.phongBan.size || 10;
      departmentProvider
        .search({
          page,
          size,
          ...dataSearch,
          ...dataSort,
        })
        .then((s) => {
          dispatch.phongBan.updateData({
            dsPhongBan: (s?.data?.content || []).map((item, index) => {
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
          dispatch.phongBan.updateData({
            dsPhongBan: [],
            isLoading: false,
          });
        });
    },
    onUpdate: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.phongBan.updateData({
          isLoadingCreate: true,
        });

        departmentProvider
          .update({ id, ...payload })
          .then((s) => {
            let dsPhongBan = (state.phongBan.dsPhongBan || []).map((item) => {
              if (item.id != id) return item;
              s.data.index = item.index;
              return s.data;
            });
            dispatch.phongBan.updateData({
              isLoadingCreate: false,
              dsPhongBan: [...dsPhongBan],
            });
            dispatch.phongBan.onSearch({});
            message.success("Chỉnh sửa thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Chỉnh sửa không thành công");
            dispatch.phongBan.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    onSearchId: (id) => {
      dispatch.phongBan.updateData({
        isLoading: true,
      });
      if (!id) dispatch.phongBan.onSearch({});
      else {
        departmentProvider
          .searchById(id)
          .then((s) => {
            dispatch.phongBan.updateData({
              dsPhongBan: !s?.data
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
            dispatch.phongBan.updateData({
              dsPhongBan: [],
              isLoading: false,
            });
          });
      }
    },
    onChangeInputSearch: ({ ...payload }, state) => {
      const dataSearch = {
        ...(state.phongBan.dataSearch || {}),
        ...payload,
      };
      dispatch.phongBan.updateData({
        page: 1,
        dataSearch,
      });
      dispatch.phongBan.onSearch({
        page: 1,
        dataSearch,
      });
    },
    onChangeSort: ({ ...payload }, state) => {
      const dataSort = state.phongBan.dataSort || {};
      dataSort.type = payload.type;
      dispatch.phongBan.updateData({
        page: 1,
        dataSort,
      });
      dispatch.phongBan.onSearch({
        page: 1,
        dataSort,
      });
    },
    onDelete: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.phongBan.updateData({
          isLoading: true,
        });

        departmentProvider
          .delete({ id, ...payload })
          .then((s) => {
            const { page = 1, size = 10 } = state.phongBan;
            let dsPhongBan = (state.phongBan.dsPhongBan || [])
              .filter((item) => item.id != id)
              .map((item, index) => {
                item.index = (page - 1) * size + index + 1;
                return item;
              });
            dispatch.phongBan.updateData({
              dsPhongBan: [...dsPhongBan],
              totalElements: state.phongBan.totalElements - 1,
              isLoading: false,
            });
            message.success("Xoá thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Xoá không thành công");
            dispatch.phongBan.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },
    onDeleteMul: (payload, state) => {
      return new Promise((resolve, reject) => {
        dispatch.phongBan.updateData({
          isLoading: true,
        });
        departmentProvider
          .deleteMul(payload)
          .then((s) => {
            dispatch.phongBan.onSearch({});
            dispatch.phongBan.updateData({
              isLoading: false,
            });
            message.success("Xoá thành công!");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Xoá không thành công!");
            dispatch.phongBan.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },
  }),
};
