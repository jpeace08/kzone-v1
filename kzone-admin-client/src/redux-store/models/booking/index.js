import { message } from "antd";
import bookingProvider from "data-access/booking-provider";
import cacheUtils from "utils/cache-utils";
export default {
  state: {
    listBookings: [],
    listRoomsOfBooking: [],
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

        bookingProvider
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

        bookingProvider
          .update({ id, payload })
          .then((s) => {
            let listBookings = (state.room.listBookings || []).map((item) => {
              if (item.id != id) return item;
              s.data.index = item.index;
              return s.data;
            });

            dispatch.room.updateData({
              isLoadingCreate: false,
              listBookings,
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

        bookingProvider
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
      bookingProvider
        .search({
          page,
          size,
          ...dataSearch,
          ...dataSort,
        })
        .then((s) => {
          dispatch.room.updateData({
            listBookings: (s?.data?.contents || []).map((item, index) => {
              item.index = (page - 1) * size + index + 1;
              return item;
            }),
            isLoading: false,
            totalElements: s?.data?.totalElement || 0,
            page,
            size,
          });
        })
        .catch((e) => {
          message.error(e?.message || "Xảy ra lỗi, vui lòng thử lại sau");
          dispatch.room.updateData({
            listBookings: [],
            isLoading: false,
          });
        });
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
      dispatch.booking.updateData({
        ...payload,
      })
    },
    onChangeListRoomsOfBooking: ({ room, ...payload }, state) => {
      debugger;
      const index = state.booking.listRoomsOfBooking?.findIndex(i => i?.id == room?.id);
      if (index != -1) {
        //TODO: remove item
        let listRoomsOfBooking = state.booking.listRoomsOfBooking?.filter(i => i?.id != room?.id);
        dispatch.booking.updateData({ listRoomsOfBooking });
      }
      else {
        //TODO: add item
        const type = state.booking?.typeOfBooking;
        const newItem = {
          price: type == 0
            ? room?.roomType?.shortTimePrice
            : type == 1
              ? room?.roomType?.overNightPrice
              : room?.roomType?.pricePerDays?.find(i => i?.numberOfBed == room?.numberOfBed)?.price || 0,
          roomNumber: room?.roomNumber,
          adultNumber: 0,
          childNumber: 0,
          numberOfBed: room?.numberOfBed,
          discountGroup: room?.roomType?.discountGroup,
          discountHoliday: room?.roomType?.discountHoliday,
          id: room?.id,
          roomTypeId: room?.roomTypeId,
          surcharge: room?.roomType?.surcharge,
        };
        dispatch.booking.updateData({
          listRoomsOfBooking: [
            ...state.booking.listRoomsOfBooking,
            newItem,
          ],
        })
      }
    },
  }),
};
