import { message } from "antd";
import roomTypeProvider from "data-access/room-type-provider";
import cacheUtils from "utils/cache-utils";
export default {
  state: {
    listTypeOfRooms: [],
    listPricePerDays: [],
    isLoading: false,
  },
  reducers: {
    updateData(state, payload = {}) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch) => ({
    clearOldData: () => {
      dispatch.roomType.updateData({
        dataSearch: "",
        listPricePerDays: [],
        currentItem: {},
      });
    },
    onCreate: ({ ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.roomType.updateData({
          isLoadingCreate: true,
        });

        roomTypeProvider
          .create({ ...payload })
          .then((s) => {
            dispatch.roomType.updateData({
              isLoadingCreate: false,
            });
            dispatch.roomType.onSearch({});
            message.success("Thêm mới thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Tạo mới không thành công");
            dispatch.roomType.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    onUpdate: ({ id, payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.roomType.updateData({
          isLoadingCreate: true,
        });

        roomTypeProvider
          .update({ id, payload })
          .then((s) => {
            let listTypeOfRooms = (state.roomType.listTypeOfRooms || []).map((item) => {
              if (item.id != id) return item;
              s.data.index = item.index;
              return s.data;
            });

            dispatch.roomType.updateData({
              isLoadingCreate: false,
              listTypeOfRooms,
            });
            message.success("Chỉnh sửa thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Chỉnh sửa không thành công");
            dispatch.roomType.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    onDelete: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.roomType.updateData({
          isLoading: true,
        });

        roomTypeProvider
          .delete({ id, ...payload })
          .then((s) => {
            dispatch.roomType.updateData({
              isLoading: false,
            });
            dispatch.roomType.onSearch({});
            message.success("Xoá loại phòng thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Xoá loại phòng không thành công");
            dispatch.roomType.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },
    onSizeChange: ({ size, ...rest }, state) => {
      dispatch.roomType.updateData({
        size,
        page: 1,
        ...rest,
      });
      dispatch.roomType.onSearch({ page: 1, size, ...rest });
    },

    onSearch: ({ page = 0, ...payload }, state) => {
      const dataSearch = {
        ...(state.roomType.dataSearch || {}),
        ...(payload.dataSearch || {}),
      };
      const dataSort = {
        ...(state.roomType.dataSort || {}),
        ...(payload.dataSort || {}),
      };

      let newState = { isLoading: true, page, dataSearch };
      dispatch.roomType.updateData(newState);
      let size = payload.size || state.roomType.size || 10;
      roomTypeProvider
        .search({
          page,
          size,
          ...dataSearch,
          ...dataSort,
        })
        .then((s) => {
          dispatch.roomType.updateData({
            listTypeOfRooms: (s?.data?.contents || []).map((item, index) => {
              item.index = (page - 1) * size + index + 1;
              return item;
            }),
            isLoading: false,
            totalElements: s?.data?.totalElement || 0,
            page,
            size
          });
        })
        .catch((e) => {
          message.error(e?.message || "Xảy ra lỗi, vui lòng thử lại sau");
          dispatch.roomType.updateData({
            dsroomType: [],
            isLoading: false,
          });
        });
    },
    onChangeInputSearch: ({ ...payload }, state) => {
      const dataSearch = {
        ...(state.roomType.dataSearch || {}),
        ...payload,
      };
      dispatch.roomType.updateData({
        page: 1,
        dataSearch,
      });
      dispatch.roomType.onSearch({
        page: 1,
        dataSearch,
      });
    },
    onChangeSort: ({ ...payload }, state) => {
      const dataSort = state.roomType.dataSort || {};
      dataSort.type = payload.type;

      dispatch.roomType.updateData({
        page: 1,
        dataSort,
      });
      dispatch.roomType.onSearch({
        page: 1,
        dataSort,
      });
    },
    //others
    addOrRemovePrice: ({ key, ...payload }, state) => {
      if (key == undefined) {
        dispatch.roomType.updateData({
          listPricePerDays: [
            ...state.roomType?.listPricePerDays,
            {
              key: state.roomType?.listPricePerDays?.length,
              price: 0,
              numberOfPerson: 1,
              numberOfBed: 1,
            }
          ]
        });
        return;
      }
      if (key !== undefined && key !== null && key !== "") {
        let listPricePerDays = [...state.roomType.listPricePerDays?.filter(price => price?.key != key)];
        listPricePerDays = listPricePerDays?.map((price, index) => ({
          ...price,
          key: index,
        }))
        dispatch.roomType.updateData({
          listPricePerDays: [...state.roomType.listPricePerDays?.filter(price => price?.key != key)],
        });
      }
    },
    updateState: (payload, state) => {
      dispatch.roomType.updateData({
        ...payload,
      })
    },
    searchById: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.roomType.updateData({
          isLoading: true,
        });
        roomTypeProvider
          .searchById({ id, ...payload })
          .then(s => {
            let roomType = s?.data?.contents[0];
            let currentItem = {
              ...roomType,
              images: roomType?.images?.map(img => ({
                id: img?.id,
                path: img?.path,
              })),
            };
            dispatch.roomType.updateData({
              isLoading: false,
              currentItem,
              listPricePerDays: currentItem?.pricePerDays?.map((price, index) => ({
                key: index,
                ...price,
              })),
            });
          })
          .catch(e => {
            dispatch.roomType.updateData({
              isLoading: false,
            });
          })
      });
    },
  }),
};
