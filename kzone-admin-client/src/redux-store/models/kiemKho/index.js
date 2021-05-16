import cacheUtils from "utils/cache-utils";
import { message } from "antd";
import warehouseProvider from "data-access/warehouse-provider";
export default {
  state: {
    dsKiemKho: [],
    currentItem: -1,
  },
  reducers: {
    updateData(state, payload = {}) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch) => ({
    updateCurrentItem: async (payload, state) => {
      let userId = state.auth.auth?.id;
      let currentItem = null;
      if (!payload.currentItem) {
        currentItem = await cacheUtils.read(
          userId,
          "DATA_CURRENT_WAREHOUSE",
          [],
          false,
        );
        dispatch.kiemKho.updateData({ currentItem: currentItem || null });
        return;
      }
      currentItem = payload?.currentItem;
      cacheUtils.save(userId, "DATA_CURRENT_WAREHOUSE", currentItem, false);
      dispatch.kiemKho.updateData({ currentItem });
    },

    getAll: (payload, state) => {
      return new Promise(async (resolve, reject) => {
        let userId = state.auth.auth?.id;
        let dsKiemKho = await cacheUtils.read(
          userId,
          "DATA_KIEM_KHO",
          [],
          false
        );
        dispatch.kiemKho.updateData({
          dsKiemKho,
        });

        warehouseProvider
          .getAll()
          .then((s) => {
            let dsKiemKho = (s?.data?.content || []).map((item) => ({
              id: item.id,
              warehouseName: item.warehouseName,
            }));
            dispatch.kiemKho.updateData({
              dsKiemKho,
            });
            cacheUtils.save(userId, "DATA_KIEM_KHO", dsKiemKho, false);
          })
          .catch((e) => { });
      });
    },
    onSearch: ({ page = 1, ...payload }, state) => {
      const dataSearch = {
        ...(state.kiemKho.dataSearch || {}),
        ...(payload.dataSearch || {}),
      };
      const dataSort = {
        ...(state.kiemKho.dataSort || {}),
        ...(payload.dataSort || {}),
      };
      let newState = { isLoading: true, page, dataSearch };
      dispatch.kiemKho.updateData(newState);
      let size = payload.size || state.kiemKho.size || 10;
      warehouseProvider
        .search({
          page,
          size,
          ...dataSearch,
          ...dataSort,
        })
        .then((s) => {
          dispatch.kiemKho.updateData({
            dsKiemKho: (s?.data?.content || []).map((item, index) => {
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
          dispatch.kiemKho.updateData({
            dsKiemKho: [],
            isLoading: false,
          });
        });
    },
    onCreate: (payload) => {
      return new Promise((resolve, reject) => {
        dispatch.kiemKho.updateData({
          isLoadingCreate: true,
        });

        warehouseProvider
          .create(payload)
          .then((s) => {
            dispatch.kiemKho.updateData({
              isLoadingCreate: false,
            });
            dispatch.kiemKho.onSearch({});
            message.success("Thêm mới thành công!");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Tạo mới không thành công!");
            dispatch.kiemKho.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    onUpdate: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.kiemKho.updateData({
          isLoadingCreate: true,
        });

        warehouseProvider
          .update({ id, ...payload })
          .then((s) => {
            let dsKiemKho = (state.kiemKho.dsKiemKho || []).map((item) => {
              if (item.id != id) return item;
              s.data.index = item.index;
              return s.data;
            });
            dispatch.kiemKho.updateData({
              isLoadingCreate: false,
              dsKiemKho: [...dsKiemKho],
            });
            message.success("Chỉnh sửa thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Chỉnh sửa không thành công");
            dispatch.kiemKho.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    onSearchId: (id) => {
      dispatch.kiemKho.updateData({
        isLoading: true,
      });
      if (!id) dispatch.kiemKho.onSearch({});
      else {
        warehouseProvider
          .searchById(id)
          .then((s) => {
            dispatch.kiemKho.updateData({
              dsKiemKho: !s?.data
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
            dispatch.kiemKho.updateData({
              dsKiemKho: [],
              isLoading: false,
            });
          });
      }
    },
    onChangeSort: ({ ...payload }, state) => {
      const dataSort = state.kiemKho.dataSort || {};
      dataSort.type = payload.type;
      dispatch.kiemKho.updateData({
        page: 1,
        dataSort,
      });
      dispatch.kiemKho.onSearch({
        page: 1,
        dataSort,
      });
    },
    onChangeInputSearch: ({ ...payload }, state) => {
      const dataSearch = {
        ...(state.kiemKho.dataSearch || {}),
        ...payload,
      };
      dispatch.kiemKho.updateData({
        page: 1,
        dataSearch,
      });
      dispatch.kiemKho.onSearch({
        page: 1,
        dataSearch,
      });
    },
    onDelete: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.kiemKho.updateData({
          isLoading: true,
        });

        warehouseProvider
          .delete({ id, ...payload })
          .then((s) => {
            const { page = 1, size = 10 } = state.kiemKho;
            let dsKiemKho = (state.kiemKho.dsKiemKho || [])
              .filter((item) => item.id != id)
              .map((item, index) => {
                item.index = (page - 1) * size + index + 1;
                return item;
              });
            dispatch.kiemKho.updateData({
              dsKiemKho: [...dsKiemKho],
              totalElements: state.kiemKho.totalElements - 1,
              isLoading: false,
            });
            message.success("Xoá thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Xoá không thành công");
            dispatch.kiemKho.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },
    onDeleteMul: (payload, state) => {
      return new Promise((resolve, reject) => {
        dispatch.kiemKho.updateData({
          isLoading: true,
        });
        warehouseProvider
          .deleteMul(payload)
          .then((s) => {
            dispatch.kiemKho.onSearch({});
            dispatch.kiemKho.updateData({
              isLoading: false,
            });
            message.success("Xoá thành công!");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Xoá không thành công!");
            dispatch.kiemKho.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },
  }),
};
