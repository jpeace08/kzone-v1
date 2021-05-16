import cacheUtils from "utils/cache-utils";
import { message } from "antd";
import costIncurredProvider from "data-access/cost-incurred-provider";
export default {
  state: {
    dsChiPhi: [],
  },
  reducers: {
    updateData(state, payload = {}) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch) => ({
    onCreate: ({ costIncurredName, currentId }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.chiPhiPhatSinh.updateData({
          isLoadingCreate: true,
        });

        costIncurredProvider
          .create({ costIncurredName })
          .then(async (s) => {
            return new Promise((resolve, reject) => {
              if (s?.code == 1) resolve(s?.data);
              else reject(s);
            })
              .then((data) => {
                dispatch.phieuMuaHang.updateData({
                  dsChiPhi: [
                    {
                      costIncurredName: data?.costIncurredName,
                      costIncurredId: data?.id,
                      costIncurredAmount: 0,
                    },
                    ...(state.phieuMuaHang.dsChiPhi || []),
                  ]
                })
              })
              .then((s) => {
                dispatch.chiPhiPhatSinh.updateData({
                  isLoadingCreate: false,
                })
                resolve(s);
              })
          })
          .catch((e) => {
            message.error(e?.message || "Thêm chi phí không thành công");
            dispatch.chiPhiPhatSinh.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },

    onSearch: ({ page = 1, ...payload }, state) => {
      const dataSearch = {
        ...(state.chiPhiPhatSinh.dataSearch || {}),
        ...(payload.dataSearch || {}),
      };
      let newState = { isLoading: true, page, dataSearch };
      dispatch.chiPhiPhatSinh.updateData(newState);
      let size = payload.size || state.chiPhiPhatSinh.size || 10;
      costIncurredProvider
        .search({
          page,
          size,
          ...dataSearch,
        })
        .then((s) => {
          // dispatch.chiPhiPhatSinh.updateData({
          //   dsChiPhi: (s?.data || []).map((item, index) => {
          //     item.index = (page - 1) * size + index + 1;
          //     return item;
          //   }),
          //   isLoading: false,
          //   totalElements: s?.data?.totalElements || 0,
          //   page,
          // });
        })
        .catch((e) => {
          message.error(e?.message || "Xảy ra lỗi, vui lòng thử lại sau");
          dispatch.chiPhiPhatSinh.updateData({
            dsChiPhi: [],
            isLoading: false,
          });
        });
    },
    onUpdate: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.chiPhiPhatSinh.updateData({
          isLoadingCreate: true,
        });

        costIncurredProvider
          .update({ id, ...payload })
          .then((s) => {
            let dsChiPhi = (state.chiPhiPhatSinh.dsChiPhi || []).map((item) => {
              if (item.id != id) return item;
              s.data.index = item.index;
              return s.data;
            });
            dispatch.chiPhiPhatSinh.updateData({
              isLoadingCreate: false,
              dsChiPhi: [...dsChiPhi],
            });
            message.success("Chỉnh sửa thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Chỉnh sửa không thành công");
            dispatch.chiPhiPhatSinh.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    onChangeInputSearch: ({ ...payload }, state) => {
      const dataSearch = {
        ...(state.chiPhiPhatSinh.dataSearch || {}),
        ...payload,
      };
      dispatch.chiPhiPhatSinh.updateData({
        page: 1,
        dataSearch,
      });
      dispatch.chiPhiPhatSinh.onSearch({
        page: 1,
        dataSearch,
      });
    },
    // onDelete: ({ id, ...payload }, state) => {
    //   return new Promise((resolve, reject) => {
    //     dispatch.chiPhiPhatSinh.updateData({
    //       isLoading: true,
    //     });

    //     costIncurredProvider
    //       .delete({ id, ...payload })
    //       .then((s) => {
    //         const { page = 1, size = 10 } = state.chiPhiPhatSinh;
    //         let dsChiPhi = (state.chiPhiPhatSinh.dsChiPhi || [])
    //           .filter((item) => item.id != id)
    //           .map((item, index) => {
    //             item.index = (page - 1) * size + index + 1;
    //             return item;
    //           });
    //         dispatch.chiPhiPhatSinh.updateData({
    //           dsChiPhi: [...dsChiPhi],
    //           totalElements: state.chiPhiPhatSinh.totalElements - 1,
    //           isLoading: false,
    //         });
    //         message.success("Xoá thành công");
    //         resolve(s?.data);
    //       })
    //       .catch((e) => {
    //         message.error(e?.message || "Xoá không thành công");
    //         dispatch.chiPhiPhatSinh.updateData({
    //           isLoading: false,
    //         });
    //         reject(e);
    //       });
    //   });
    // },
    onDeleteMul: (payload, state) => {
      return new Promise((resolve, reject) => {
        dispatch.chiPhiPhatSinh.updateData({
          isLoading: true,
        });
        costIncurredProvider
          .deleteMul(payload)
          .then((s) => {
            dispatch.chiPhiPhatSinh.onSearch({});
            dispatch.chiPhiPhatSinh.updateData({
              isLoading: false,
            });
            message.success("Xoá thành công!");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Xoá không thành công!");
            dispatch.chiPhiPhatSinh.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },
  }),
};
