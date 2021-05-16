import { message } from "antd";
import cacheUtils from "utils/cache-utils";
import tyGiaProvider from "data-access/exchange-rate-provider";

export default {
  state: {
    dsTyGia: [],
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
        let dsTyGia = await cacheUtils.read(userId, "DATA_TY_GIA", [], false);
        dispatch.tyGia.updateData({
          dsTyGia,
        });

        tyGiaProvider
          .getAll()
          .then((s) => {
            let dsTyGia = (s?.data?.content || []).map((item) => ({
              id: item.id,
              currency: item.currency,
              exchangeRate: item.exchangeRage,
            }));
            dispatch.tyGia.updateData({
              dsTyGia,
            });
            // console.log(state.tyGia.dsTyGia);
            cacheUtils.save(userId, "DATA_TY_GIA", dsTyGia, false);
          })
          .catch((e) => { });
      });
    },

    // onDeleteMultiple: (payload = [], state) => {
    //   return new Promise((resolve, reject) => {
    //     dispatch.hangHoa.updateData({
    //       isLoading: true,
    //     });

    //     productProvider
    //       .deleteMultiple(payload)
    //       .then(s => {
    //         dispatch.hangHoa.updateData({
    //           isLoading: false,
    //         })
    //         dispatch.hangHoa.onSearch({});
    //         message.success("Xóa thành công");
    //         resolve(s?.data);
    //       })
    //       .catch(e => {
    //         message.error(e?.message || "Xóa không thành công");
    //         dispatch.hangHoa.updateData({
    //           isLoading: false,
    //         });
    //         reject(e);
    //       });
    //   });
    // },

    // onDelete: ({ id, ...payload }, state) => {
    //   return new Promise((resolve, reject) => {
    //     dispatch.hangHoa.updateData({
    //       isLoading: true,
    //     });

    //     productProvider
    //       .delete({ id, ...payload })
    //       .then(s => {
    //         //TODO: remove item deleted on state
    //         const { page = 1, size = 10, totalElements } = state.hangHoa;
    //         let dsHangHoa = (state.hangHoa.dsHangHoa || [])
    //           .filter(item => item.id !== id)
    //           .map((item, index) => {
    //             item.key = (page - 1) * size + index + 1;
    //             return item;
    //           });
    //         dispatch.hangHoa.updateData({
    //           isLoading: false,
    //           dsHangHoa: [...dsHangHoa],
    //           page: page,
    //           totalElements: Math.max((totalElements - 1), 0),
    //         });

    //         message.success("Xóa thành công");
    //         resolve(s?.data);
    //       })
    //       .catch(e => {
    //         console.log(e);
    //         message.error(e?.message || "Xóa không thành công");
    //         dispatch.hangHoa.updateData({
    //           isLoading: false,
    //         });
    //         reject(e);
    //       });
    //   });
    // },
    onCreate: (payload, state) => {
      return new Promise((resolve, reject) => {
        dispatch.hangHoa.updateData({
          isLoadingCreate: true,
        });

        tyGiaProvider
          .create(payload)
          .then((s) => {
            dispatch.tyGia.updateData({
              isLoadingCreate: false,
            });

            dispatch.tyGia.getAll({});
            message.success("Thêm mới thành công");
            resolve(s);
          })
          .catch((e) => {
            message.error(e?.message || "Tạo mới không thành công");
            dispatch.tyGia.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },

    onUpdate: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.tyGia.updateData({
          isLoadingCreate: true,
        });

        tyGiaProvider
          .update({ id, ...payload })
          .then((s) => {
            // let dsHangHoa = (state.tyGia.dsHangHoa || []).map(item => {
            //   if (item.id !== id) return item;
            //   s.data.key = item.key;
            //   return s.data;
            // });

            // dispatch.tyGia.updateData({
            //   isLoadingCreate: false,
            //   dsHangHoa: [...dsHangHoa],
            // });

            message.success("Chỉnh sửa thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Chỉnh sửa không thành công");
            dispatch.tyGia.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },

    //   onSizeChange: ({ size, ...rest }, state) => {
    //     dispatch.tyGia.updateData({
    //       size,
    //       page: 1,
    //       ...rest,
    //     });
    //     dispatch.tyGia.onSearch({ page: 1, size, ...rest });
    //   },
    //   onSearch: ({ page = 1, ...payload }, state) => {
    //     let newState = { isLoading: true, page };
    //     dispatch.tyGia.updateData(newState);
    //     let size = payload.size || state.tyGia.size || 10;
    //     const dataSearch = payload.dataSearch || state.tyGia.dataSearch || {};

    //     productProvider
    //       .search({
    //         page,
    //         size,
    //         ...dataSearch,
    //       })
    //       .then(s => {
    //         dispatch.tyGia.updateData({
    //           dsHangHoa: (s?.data?.content || []).map((item, index) => {
    //             item.key = (page - 1) * size + index + 1;
    //             return item;
    //           }),
    //           isLoading: false,
    //           totalElements: s?.data?.totalElements || 0,
    //           page,
    //           size
    //         });
    //       })
    //       .catch(e => {
    //         message.error(e?.message || "Xảy ra lỗi, vui lòng thử lại sau");
    //         dispatch.tyGia.updateData({
    //           dsHangHoa: [],
    //           isLoading: false,
    //         });
    //       });
    //   },
    //   onChangeInputSearch: ({ ...payload }, state) => {
    //     const dataSearch = {
    //       ...(state.tyGia.dataSearch || {}),
    //       ...payload,
    //     };
    //     dispatch.tyGia.updateData({
    //       page: 1,
    //       dataSearch,
    //     });
    //     dispatch.tyGia.onSearch({
    //       page: 1,
    //       dataSearch,
    //     });
    //   },
  }),
};
