import { message } from "antd";
import cacheUtils from "utils/cache-utils";
import productProvider from "data-access/product-provider";

export default {
  state: {
    dsHangHoa: [],
    barcodeInwardSlip: -1,
    dataSort: {
      type: 4,
    }
  },
  reducers: {
    updateData(state, payload = {}) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch) => ({
    onDeleteMultiple: (payload = [], state) => {
      return new Promise((resolve, reject) => {
        dispatch.hangHoa.updateData({
          isLoading: true,
        });

        productProvider
          .deleteMultiple(payload)
          .then((s) => {
            dispatch.hangHoa.updateData({
              isLoading: false,
            });
            dispatch.hangHoa.onSearch({});
            message.success("Xóa thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Xóa không thành công");
            dispatch.hangHoa.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },

    onDelete: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.hangHoa.updateData({
          isLoading: true,
        });

        productProvider
          .delete({ id, ...payload })
          .then((s) => {
            //TODO: remove item deleted on state
            const { page = 1, size = 10, totalElements } = state.hangHoa;
            let dsHangHoa = (state.hangHoa.dsHangHoa || [])
              .filter((item) => item.id !== id)
              .map((item, index) => {
                item.key = (page - 1) * size + index + 1;
                return item;
              });
            dispatch.hangHoa.updateData({
              isLoading: false,
              dsHangHoa: [...dsHangHoa],
              page: page,
              totalElements: Math.max(totalElements - 1, 0),
            });

            message.success("Xóa thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Xóa không thành công");
            dispatch.hangHoa.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },
    onCreate: (payload, state) => {
      return new Promise((resolve, reject) => {
        dispatch.hangHoa.updateData({
          isLoadingCreate: true,
        });

        productProvider
          .create(payload)
          .then((s) => {
            dispatch.hangHoa.updateData({
              isLoadingCreate: false,
            });

            dispatch.hangHoa.onSearch({});
            message.success("Thêm mới thành công");
            resolve(s);
          })
          .catch((e) => {
            const error =
              e?.response?.data?.data[0]?.message || "Tạo mới không thành công";
            message.error(error);
            dispatch.hangHoa.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    updateBarcodeInwardSlip: (barcode, state) => {
      dispatch.hangHoa.updateData({
        barcodeInwardSlip: barcode,
      });
    },

    updateDSHangHoa: (dsHangHoa, state) => {
      dispatch.hangHoa.updateData({
        dsHangHoa,
      });
    },

    onChangeSort: ({ ...payload }, state) => {
      const dataSort = state.hangHoa.dataSort || {};
      dataSort.type = payload.type;
      dispatch.hangHoa.updateData({
        page: 1,
        dataSort,
      });
      dispatch.hangHoa.onSearch({
        page: 1,
        dataSort,
      });
    },

    onUpdate: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.hangHoa.updateData({
          isLoadingCreate: true,
        });

        productProvider
          .update({ id, ...payload })
          .then((s) => {
            // let dsHangHoa = (state.hangHoa.dsHangHoa || []).map((item) => {
            //   if (item.id !== id) return item;
            //   s.data.key = item.key;
            //   s.data.productGroupId = s?.data?.productGroup?.id;
            //   s.data.vendorId = s?.data?.vendor?.id;
            //   s.data.vendorName = s?.data?.vendor?.name;
            //   s.data.quantity = s?.data?.totalQuantity;
            //   return s.data;
            // });

            dispatch.hangHoa.onSearch({});
            dispatch.hangHoa.updateData({
              isLoadingCreate: false,
              // dsHangHoa: [...dsHangHoa],
            });

            message.success("Chỉnh sửa thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Chỉnh sửa không thành công");
            dispatch.hangHoa.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },

    onSizeChange: ({ size, ...rest }, state) => {
      dispatch.hangHoa.updateData({
        size,
        page: 1,
        ...rest,
      });
      dispatch.hangHoa.onSearch({ page: 1, size, ...rest });
    },

    onSearchByWarehouse: ({ page = 1, ...payload }, state) => {
      const dataSearch = {
        ...(state.hangHoa.dataSearch || {}),
        ...(payload.dataSearch || {}),
      };

      let newState = { isLoading: true, page, dataSearch };
      dispatch.hangHoa.updateData(newState);
      let size = payload.size || state.hangHoa.size || 10;
      productProvider
        .searchByWarehouse({
          page,
          size,
          warehouse_id: state.kiemKho.currentItem || -1,
          ...dataSearch,
        })
        .then((s) => {
          // let dsHangHoa = (s?.data?.content || []).map((item, index) => {
          //   item.key = (page - 1) * size + index + 1;
          //   item.totalInComingWithInward = item?.totalProductComing || 0;
          //   return item;
          // });
          let dsHangHoa = s?.data?.content.filter(item => item.quantityInWarehouse > 0) || [];
          dispatch.hangHoa.updateData({
            dsHangHoa: [...dsHangHoa],
            isLoading: false,
            totalElements: dsHangHoa.length || 0,
            page,
            size,
          });
        })
        .catch((e) => {
          message.error(e?.message || "Xảy ra lỗi, vui lòng thử lại sau");
          dispatch.hangHoa.updateData({
            dsHangHoa: [],
            isLoading: false,
          });
        });
    },
    clearHangHoa: () => {
      dispatch.hangHoa.updateData({
        dsHangHoa: [],
        totalElements: 0,
      });
    },

    onChangeSort: ({ ...payload }, state) => {
      const dataSort = state.hangHoa.dataSort || {};
      dataSort.type = payload.type;

      dispatch.hangHoa.updateData({
        page: 1,
        dataSort,
      });
      dispatch.hangHoa.onSearch({
        page: 1,
        dataSort,
      });
    },

    onSearch: ({ page = 1, ...payload }, state) => {
      const dataSearch = {
        ...(state.hangHoa.dataSearch || {}),
        ...(payload.dataSearch || {}),
      };

      const dataSort = {
        ...(state.hangHoa.dataSort || {}),
        ...(payload.dataSort || {}),
      };

      let newState = { isLoading: true, page, dataSearch };
      dispatch.hangHoa.updateData(newState);
      let size = payload.size || state.hangHoa.size || 10;
      productProvider
        .search({
          page,
          size,
          ...dataSort,
          ...dataSearch,
          warehouseId: state.kiemKho.currentItem || -1,
        })
        .then((s) => {
          let dsHangHoa = (s?.data?.content || []).map((item, index) => {
            let newItem = {};
            item.key = (page - 1) * size + index + 1;
            return item;
          });

          dispatch.hangHoa.updateData({
            dsHangHoa: [...dsHangHoa],
            totalElements: s?.data?.totalElements || 0,
            page,
            size,
            isLoading: false,
          });
        })
        .catch((e) => {
          message.error(e?.message || "Xảy ra lỗi, vui lòng thử lại sau");
          dispatch.hangHoa.updateData({
            dsHangHoa: [],
            isLoading: false,
          });
        });
    },

    onSearchForInwardSlip: ({ page = 1, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        const dataSearch = {
          ...(state.hangHoa.dataSearch || {}),
          ...(payload.dataSearch || {}),
        };
        let newState = { isLoading: true, page, dataSearch };
        dispatch.hangHoa.updateData(newState);
        let size = payload.size || state.hangHoa.size || 10;
        productProvider
          .searchForInwardSlip({
            page,
            size,
            ...dataSearch,
            warehouseId: state.kiemKho.currentItem || -1,
          })
          .then((s) => {
            let dsHangHoa = (s?.data?.content || []).map((item, index) => {
              item.id = item.id_product;
              item.key = (page - 1) * size + index + 1;
              item.totalInComingWithInward = item?.totalProductComing || 0;
              return item;
            });

            dispatch.hangHoa.updateData({
              dsHangHoa: [...dsHangHoa],
              isLoading: false,
              totalElements: s?.data?.totalElements || 0,
              page,
              size,
            });
            resolve();
          })
          .catch((e) => {
            message.error(e?.message || "Xảy ra lỗi, vui lòng thử lại sau");
            dispatch.hangHoa.updateData({
              dsHangHoa: [],
              isLoading: false,
            });
            reject()
          });
      });
    },

    onChangeInputSearch: ({ ...payload }, state) => {
      if (state.hangHoa?.dataSearch?.name != undefined) {
        state.hangHoa.dataSearch.name = undefined;
      }
      else if (state.hangHoa?.dataSearch?.product_code != undefined) {
        state.hangHoa.dataSearch.product_code = undefined;
      }
      const dataSearch = {
        ...(state.hangHoa.dataSearch || {}),
        ...payload,
      };
      dispatch.hangHoa.updateData({
        page: 1,
        dataSearch,
      });
      dispatch.hangHoa.onSearch({
        page: 1,
        dataSearch,
      });
    },
    getByIds: (ids = [], state) => {
      return new Promise(async (resolve, reject) => {
        const promise = ids.map(async (id) => {
          let hangHoa = await cacheUtils.read(id, "DATA_HANG_HOA", null, false);
          if (!hangHoa) {
            productProvider
              .getById(id)
              .then((s) => {
                cacheUtils.save(id, "DATA_HANG_HOA", s.data?.data, false);
                resolve(s.data?.data);
              })
              .catch((s) => {
                resolve(null);
              });
          } else {
            productProvider.getById(id).then((s) => {
              cacheUtils.save(id, "DATA_HANG_HOA", s.data?.data, false);
            });
            resolve(hangHoa);
          }
        });
        Promise.all(promise)
          .then((values) => {
            resolve(values);
          })
          .catch((e) => {
            resolve(ids.map((item) => null));
          });
      });
    },
  }),
};
