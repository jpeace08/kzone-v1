import { message } from "antd";
import comboProvider from "data-access/combo-provider";
export default {
  state: {
    dsCombo: [],
    isLoading: false,
  },
  reducers: {
    updateData(state, payload = {}) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch) => ({
    clearOldData: () => {
      dispatch.combo.updateData({
        dsHangTien: [],
        selectedItem: [],
        dsHangTangKem: [],
        selectedItemTangKem: [],
        vendorId: null,
      });
    },

    onDeleteMultiple: (payload = [], state) => {
      return new Promise((resolve, reject) => {
        dispatch.combo.updateData({
          isLoading: true,
        });

        comboProvider
          .deleteMultiple(payload)
          .then((s) => {
            dispatch.combo.updateData({
              isLoading: false,
            });
            dispatch.combo.onSearch({});
            message.success("Xóa thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Xóa không thành công");
            dispatch.combo.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },

    getComboById: (id, state) => {
      dispatch.combo.updateData({
        isLoadingCreate: true,
      });
      comboProvider
        .getById(id)
        .then(async (s) => {
          const item = s?.data || {};

          // let selectedItem = [];
          // let dsHangTien =
          //   item?.productDetailsInCombo.map((it) => {
          //     selectedItem.push(it.productDetailEntity[0]?.product);
          //     return {
          //       comboName: it?.name || "",
          //       id: it?.id,
          //       comboPrice: it?.price || 0,
          //       quantity: it?.quantityInCombo || 0,
          //       quantityAo: it?.quantityInCombo || 0,
          //       totalQuantity: it?.quantityInWarehouse || 0,
          //       totalQuantityAo: it?.quantityInWarehouse + it?.quantityInCombo * item?.quantity || 0, 
          //       productType: it?.typeProduct || 1,
          //     };
          //   }) || [];
          let dsHangTien = [], dsHangTangKem = [], selectedItem = [], selectedItemTangKem = [];

          item?.productDetailsInCombo.forEach(it => {
            let ob = {
              comboName: it?.name || "",
              id: it?.id,
              comboPrice: it?.price || 0,
              quantity: it?.quantityInCombo || 0,
              quantityAo: it?.quantityInCombo || 0,
              totalQuantity: it?.quantityInWarehouse || 0,
              totalQuantityAo: it?.quantityInWarehouse + it?.quantityInCombo * item?.quantity || 0,
              productType: it?.typeProduct,
            };
            if (it.typeProduct == 1) {
              selectedItem.push(it);
              dsHangTien.push(ob);
            } else {
              selectedItemTangKem.push(it);
              dsHangTangKem.push(ob);
            }
          });
          dispatch.combo.updateData({
            dsHangTien,
            dsHangTangKem,
            currentItem: item,
            selectedItem,
            selectedItemTangKem,
            isLoadingCreate: false,
          });
        })
        .catch((e) => {
          message.error(e?.message || "Xảy ra lỗi, vui lòng thử lại sau");
          dispatch.combo.updateData({
            dsHangTien: [],
            isLoadingCreate: false,
          });
        });
    },

    setCurrentItem: (payload, state) => {
      dispatch.combo.updateData({
        currentItem: payload,
      });
    },
    updateTotalQuantity: (payload, state) => {
      let ds = state.combo[payload.ds];
      ds[payload.index].totalQuantity = payload.totalQuantity
      dispatch.combo.updateData({
        [payload.ds]: ds,
      })

    },
    setDsHangTien: (payload = [], state) => {
      dispatch.combo.updateData({
        dsHangTien: [...payload],
      });
    },
    setDsHangTangKem: (payload = {}, state) => {
      dispatch.combo.updateData({
        dsHangTangKem: [...payload.dsHangTangKem] || state.combo.dsHangTangKem,
        selectedItemTangKem: payload.selectedItemTangKem ? [] : state.combo.selectedItemTangKem
      });
    },

    setQuantityCombo: (payload) => {
      dispatch.combo.updateData({
        quantityCombo: payload
      })
    },
    // setVendorId: ({ value, vendorName }) => {
    //   dispatch.combo.updateData({
    //     vendorId: value,
    //     vendorName: vendorName,
    //   })
    // },
    onChangeSort: ({ ...payload }, state) => {
      const dataSort = state.combo.dataSort || {};
      dataSort.type = payload.type;
      dispatch.combo.updateData({
        page: 1,
        dataSort,
      });
      dispatch.combo.onSearch({
        page: 1,
        dataSort,
      });
    },
    onSelectHangHoa: ({ item = {} }, state) => {
      const selectedItem = state.combo.selectedItem || [];
      let dsHangTien = state.combo.dsHangTien || [];
      const index = selectedItem.findIndex((i) => i.id === item.id);
      if (index != -1) {
        selectedItem.splice(index, 1);
        dsHangTien = dsHangTien.filter((it) => it.id != item.id);
        dispatch.combo.updateData({
          selectedItem: [...selectedItem],
          dsHangTien,
        });
      } else {
        let payload = {
          // vendorName: state.combo.vendorName,
          id: item?.id,
          comboName: item?.name,
          quantity: 0,
          quantityAo: 0,
          comboPrice: item?.price,
          totalQuantity: item?.quantityInWarehouse - state.combo.quantityCombo || item?.quantityInWarehouse,
          totalQuantityAo: item?.quantityInWarehouse,
          productType: 1,
          toDate: new Date(),
        };
        dispatch.combo.updateData({
          selectedItem: [...selectedItem, JSON.parse(JSON.stringify(item))],
          dsHangTien: [...dsHangTien, payload],
        });
      }
    },
    onSelectHangTangKem: ({ item = {} }, state) => {
      const selectedItemTangKem = state.combo.selectedItemTangKem || [];
      let dsHangTangKem = state.combo.dsHangTangKem || [];
      const index = selectedItemTangKem.findIndex((i) => i.id === item.id);
      if (index != -1) {
        selectedItemTangKem.splice(index, 1);
        dsHangTangKem = dsHangTangKem.filter((it) => it.id != item.id);
        dispatch.combo.updateData({
          selectedItemTangKem: [...selectedItemTangKem],
          dsHangTangKem,
        });
      } else {
        let payload = {
          // vendorName: state.combo.vendorName,
          id: item?.id,
          comboName: item?.name,
          quantity: 0,
          quantityAo: 0,
          comboPrice: item?.price,
          totalQuantity: item?.quantityInWarehouse - state.combo.quantityCombo || item?.quantityInWarehouse,
          totalQuantityAo: item?.quantityInWarehouse,
          productType: 2,
          toDate: new Date(),
        };
        dispatch.combo.updateData({
          selectedItemTangKem: [...selectedItemTangKem, JSON.parse(JSON.stringify(item))],
          dsHangTangKem: [...dsHangTangKem, payload],
        });
      }
    },
    onCreate: (payload, state) => {
      return new Promise((resolve, reject) => {
        dispatch.combo.updateData({
          isLoadingCreate: true,
        });
        comboProvider
          .create(payload)
          .then((s) => {
            dispatch.combo.updateData({
              isLoadingCreate: false,
            });

            dispatch.combo.onSearch({});
            message.success("Thêm mới thành công");
            resolve(s);
          })
          .catch((e) => {
            message.error(e?.message || "Tạo mới không thành công! Vui lòng kiểm tra các dữ liệu trống!");
            dispatch.combo.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },

    onUpdate: ({ id, payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.combo.updateData({
          isLoadingCreate: true,
        });
        comboProvider
          .update({ id, payload })
          .then((s) => {
            let dsCombo = (state.combo.dsCombo || []).map(
              (item) => {
                if (item.id !== id) return item;
                s.data.key = item.key;
                return s.data;
              }
            );
            dispatch.combo.updateData({
              currentItem: null,
              isLoadingCreate: false,
              dsCombo,
            });

            message.success("Chỉnh sửa thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Chỉnh sửa không thành công. Vui lòng kiểm tra các dữ liệu trống!");
            dispatch.combo.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },

    onDelete: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.combo.updateData({
          isLoading: true,
        });

        comboProvider
          .delete({ id, ...payload })
          .then((s) => {
            //TODO: remove item deleted on state
            const { page = 1, size = 10, totalElements } = state.combo;
            let dsCombo = (state.combo.dsCombo || [])
              .filter((item) => item.id !== id)
              .map((item, index) => {
                item.key = (page - 1) * size + index + 1;
                return item;
              });
            dispatch.combo.updateData({
              isLoading: false,
              dsCombo: [...dsCombo],
              page: page,
              totalElements: Math.max(totalElements - 1, 0),
            });

            message.success("Xóa thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Xóa không thành công");
            dispatch.combo.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },
    removeItemHangTien: (payload, state) => {
      if (payload.id) {
        dispatch.combo.updateData({
          dsHangTien: state.combo.dsHangTien?.filter(item => item?.id != payload?.id),
          selectedItem: state.combo.selectedItem?.filter(item => item?.id != payload?.id),
        })
      }
    },
    removeItemHangTangKem: (payload, state) => {
      if (payload.id) {
        dispatch.combo.updateData({
          dsHangTangKem: state.combo.dsHangTangKem?.filter(item => item?.id != payload?.id),
          selectedItemTangKem: state.combo.selectedItemTangKem?.filter(item => item?.id != payload?.id),
        })
      }
    },
    onSizeChange: ({ size, ...rest }, state) => {
      dispatch.combo.updateData({
        size,
        page: 1,
        ...rest,
      });
      dispatch.combo.onSearch({ page: 1, size, ...rest });
    },

    onSearch: ({ page = 1, ...payload }, state) => {
      const dataSearch = {
        ...(state.combo.dataSearch || {}),
        ...(payload.dataSearch || {}),
      };
      const dataSort = {
        ...(state.combo.dataSort || {}),
        ...(payload.dataSort || {}),
      };
      let newState = { isLoading: true, page, dataSearch };
      dispatch.combo.updateData(newState);
      let size = payload.size || state.combo.size || 10;

      comboProvider
        .search({
          page,
          size,
          ...dataSearch,
          idWarehouse: state.kiemKho.currentItem || -1,
          ...dataSort
        })
        .then((s) => {
          dispatch.combo.updateData({
            dsCombo: (s?.data?.content || []).map((item, index) => {
              item.key = (page - 1) * size + index + 1;
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
          dispatch.combo.updateData({
            dsCombo: [],
            isLoading: false,
          });
        });
    },

    onChangeInputSearch: ({ ...payload }, state) => {
      const dataSearch = {
        ...(state.combo.dataSearch || {}),
        ...payload,
      };
      dispatch.combo.updateData({
        page: 1,
        dataSearch,
      });
      dispatch.combo.onSearch({
        page: 1,
        dataSearch,
      });
    },
  }),
};
