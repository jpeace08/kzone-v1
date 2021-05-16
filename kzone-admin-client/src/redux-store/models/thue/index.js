import { message } from "antd";
import cacheUtils from "utils/cache-utils";
import taxProvider from "data-access/tax-provider";

export default {
  state: {
    dsThue: [],
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
        let dsThue = await cacheUtils.read(userId, "DATA_THUE", [], false);
        dispatch.thue.updateData({
          dsThue,
        });

        taxProvider
          .getAll()
          .then((s) => {
            let dsThue = (s?.data?.content || []).map((item) => ({
              id: item.id,
              name: item.name,
              caption: item.caption,
            }));
            dispatch.thue.updateData({
              dsThue,
            });
            cacheUtils.save(userId, "DATA_THUE", dsThue, false);
          })
          .catch((e) => { });
      });
    },

    // onDeleteMultiple: (payload = [], state) => {
    //   return new Promise((resolve, reject) => {
    //     dispatch.thue.updateData({
    //       isLoading: true,
    //     });

    //     productProvider
    //       .deleteMultiple(payload)
    //       .then(s => {
    //         dispatch.thue.updateData({
    //           isLoading: false,
    //         })
    //         dispatch.thue.onSearch({});
    //         message.success("Xóa thành công");
    //         resolve(s?.data);
    //       })
    //       .catch(e => {
    //         message.error(e?.message || "Xóa không thành công");
    //         dispatch.thue.updateData({
    //           isLoading: false,
    //         });
    //         reject(e);
    //       });
    //   });
    // },

    // onDelete: ({ id, ...payload }, state) => {
    //   return new Promise((resolve, reject) => {
    //     dispatch.thue.updateData({
    //       isLoading: true,
    //     });

    //     productProvider
    //       .delete({ id, ...payload })
    //       .then(s => {
    //         //TODO: remove item deleted on state
    //         const { page = 1, size = 10, totalElements } = state.tax;
    //         let dsHangHoa = (state.tax.dsHangHoa || [])
    //           .filter(item => item.id !== id)
    //           .map((item, index) => {
    //             item.key = (page - 1) * size + index + 1;
    //             return item;
    //           });
    //         dispatch.thue.updateData({
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
    //         dispatch.thue.updateData({
    //           isLoading: false,
    //         });
    //         reject(e);
    //       });
    //   });
    // },
    onCreate: (payload, state) => {
      return new Promise((resolve, reject) => {
        dispatch.thue.updateData({
          isLoadingCreate: true,
        });

        taxProvider
          .create(payload)
          .then(s => {
            dispatch.thue.updateData({
              isLoadingCreate: false,
            });

            dispatch.thue.onGetAll({});
            message.success("Thêm mới thành công");
            resolve(s);
          })
          .catch(e => {
            message.error(e?.message || "Tạo mới không thành công");
            dispatch.thue.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },

    onUpdate: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.thue.updateData({
          isLoadingCreate: true,
        });

        taxProvider
          .update({ id, ...payload })
          .then(s => {
            // let dsHangHoa = (state.tax.dsHangHoa || []).map(item => {
            //   if (item.id !== id) return item;
            //   s.data.key = item.key;
            //   return s.data;
            // });

            // dispatch.thue.updateData({
            //   isLoadingCreate: false,
            //   dsHangHoa: [...dsHangHoa],
            // });

            message.success("Chỉnh sửa thành công");
            resolve(s?.data);
          })
          .catch(e => {
            message.error(e?.message || "Chỉnh sửa không thành công");
            dispatch.thue.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },


    //   onSizeChange: ({ size, ...rest }, state) => {
    //     dispatch.thue.updateData({
    //       size,
    //       page: 1,
    //       ...rest,
    //     });
    //     dispatch.thue.onSearch({ page: 1, size, ...rest });
    //   },
    //   onSearch: ({ page = 1, ...payload }, state) => {
    //     let newState = { isLoading: true, page };
    //     dispatch.thue.updateData(newState);
    //     let size = payload.size || state.tax.size || 10;
    //     const dataSearch = payload.dataSearch || state.tax.dataSearch || {};

    //     productProvider
    //       .search({
    //         page,
    //         size,
    //         ...dataSearch,
    //       })
    //       .then(s => {
    //         dispatch.thue.updateData({
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
    //         dispatch.thue.updateData({
    //           dsHangHoa: [],
    //           isLoading: false,
    //         });
    //       });
    //   },
    //   onChangeInputSearch: ({ ...payload }, state) => {
    //     const dataSearch = {
    //       ...(state.tax.dataSearch || {}),
    //       ...payload,
    //     };
    //     dispatch.thue.updateData({
    //       page: 1,
    //       dataSearch,
    //     });
    //     dispatch.thue.onSearch({
    //       page: 1,
    //       dataSearch,
    //     });
    //   },
  }),
};
