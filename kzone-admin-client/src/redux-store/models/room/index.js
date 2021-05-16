import { message } from "antd";
import roomProvider from "data-access/room-provider";
import cacheUtils from "utils/cache-utils";
export default {
  state: {
    listRooms: [],
    isLoading: false,
  },
  reducers: {
    updateData(state, payload = {}) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch) => ({
    onCreate: ({ ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.room.updateData({
          isLoadingCreate: true,
        });

        roomProvider
          .create({ ...payload })
          .then((s) => {
            dispatch.room.updateData({
              isLoadingCreate: false,
            });
            dispatch.room.onSearch({});
            message.success("Thêm mới thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Tạo mới không thành công");
            dispatch.room.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    onUpdate: ({ id, payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.room.updateData({
          isLoadingCreate: true,
        });

        roomProvider
          .update({ id, payload })
          .then((s) => {
            let listRooms = (state.room.listRooms || []).map((item) => {
              if (item.id != id) return item;
              s.data.index = item.index;
              return s.data;
            });

            dispatch.room.updateData({
              isLoadingCreate: false,
              listRooms,
            });
            message.success("Chỉnh sửa thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Chỉnh sửa không thành công");
            dispatch.room.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    onDelete: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.room.updateData({
          isLoading: true,
        });

        roomProvider
          .delete({ id, ...payload })
          .then((s) => {
            dispatch.room.updateData({
              isLoading: false,
            });
            dispatch.room.onSearch({});
            message.success("Xoá phòng thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Xoá phòng không thành công");
            dispatch.room.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },
    onSizeChange: ({ size, ...rest }, state) => {
      dispatch.room.updateData({
        size,
        page: 1,
        ...rest,
      });
      dispatch.room.onSearch({ page: 1, size, ...rest });
    },

    onSearch: ({ page = 0, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        const dataSearch = {
          ...(state.room.dataSearch || {}),
          ...(payload.dataSearch || {}),
        };
        const dataSort = {
          ...(state.room.dataSort || {}),
          ...(payload.dataSort || {}),
        };

        let newState = { isLoading: true, page, dataSearch };
        dispatch.room.updateData(newState);
        let size = payload.size || state.room.size || 10;
        roomProvider
          .search({
            page,
            size,
            ...dataSearch,
            ...dataSort,
          })
          .then((s) => {
            dispatch.room.updateData({
              listRooms: (s?.data?.contents || []).map((item, index) => {
                item.index = (page - 1) * size + index + 1;
                return item;
              }),
              isLoading: false,
              totalElements: s?.data?.totalElement || 0,
              page,
              size,
            });
            resolve(s);
          })
          .catch((e) => {
            message.error(e?.message || "Xảy ra lỗi, vui lòng thử lại sau");
            dispatch.room.updateData({
              listRooms: [],
              isLoading: false,
            });
            reject(e);
          });
      })
    },
    onChangeInputSearch: ({ ...payload }, state) => {
      const dataSearch = {
        ...(state.room.dataSearch || {}),
        ...payload,
      };
      dispatch.room.updateData({
        page: 0,
        dataSearch,
      });
      dispatch.room.onSearch({
        page: 0,
        dataSearch,
      });
    },
    onChangeSort: ({ ...payload }, state) => {
      const dataSort = state.room.dataSort || {};
      dataSort.type = payload.type;

      dispatch.room.updateData({
        page: 1,
        dataSort,
      });
      dispatch.room.onSearch({
        page: 1,
        dataSort,
      });
    },
    //others
    updateState: (payload, state) => {
      dispatch.room.updateData({
        ...payload,
      })
    },
    // searchById: ({ id, ...payload }, state) => {
    //   return new Promise((resolve, reject) => {
    //     dispatch.room.updateData({
    //       isLoading: true,
    //     });
    //     roomProvider
    //       .searchById({ id, ...payload })
    //       .then(s => {
    //         let room = s?.data?.contents[0];
    //         let currentItem = {
    //           ...room,
    //           images: room?.images?.map(img => ({
    //             id: img?.id,
    //             path: img?.path,
    //           })),
    //         };
    //         dispatch.room.updateData({
    //           isLoading: false,
    //           currentItem,
    //           listPricePerDays: currentItem?.pricePerDays?.map((price, index) => ({
    //             key: index,
    //             ...price,
    //           })),
    //         });
    //       })
    //       .catch(e => {
    //         dispatch.room.updateData({
    //           isLoading: false,
    //         });
    //       })
    //   });
    // },
  }),
};
