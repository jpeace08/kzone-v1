import { message } from "antd";
import inwardSlipProvider from "data-access/inward-slip-provider";
import productProvider from "data-access/product-provider";
import { DS_ID_THUE, STATUS_PAY } from "constant/index";
import { STATUS_GOODS } from "../../../constant";
export default {
  state: {
    dsPhieuMuaHang: [],
    isLoading: false,
  },
  reducers: {
    updateData(state, payload = {}) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch) => ({
    updateState: (payload = {}, state) => {
      dispatch.phieuMuaHang.updateData({
        ...payload,
      })
    },

    clearOldData: () => {
      dispatch.phieuMuaHang.updateData({
        dsHangTien: [],
        selectedItem: [],
        dsChiPhi: [],
        tyGia: 1,
        currentItem: null,
        isLoading: false,
        isLoadingCreate: false,
      });
      dispatch.hangHoa.updateData({
        dsHangHoa: [],
        page: 1,
        size: 10,
      });
    },
    removeItemHangTien: (payload, state) => {
      if (payload.productId) {
        let dsHangTien = state.phieuMuaHang.dsHangTien?.filter(item => item?.productId != payload?.productId);
        let selectedItem = state.phieuMuaHang.selectedItem?.filter(item => item?.id != payload?.productId)
        dispatch.phieuMuaHang.updateData({
          dsHangTien,
          selectedItem,
        })
      }
    },

    updateChungTu: (payload, state) => {
      dispatch.phieuMuaHang.updateData({
        chungTu: {
          ...state.phieuMuaHang.chungTu,
          [payload.type]: payload?.value,
        }
      })
    },

    updateVendor: (id, state) => {
      dispatch.phieuMuaHang.updateData({
        vendorId: id,
      })
    },

    onAddServiceToInwardSlip: (payload, state) => {
      return new Promise((resolve, reject) => {
        dispatch.phieuMuaHang.updateData({
          isLoadingCreate: true,
        });
        inwardSlipProvider
          .addServiceVoucher(payload)
          .then((s) => {
            dispatch.phieuMuaHang.onSearchV2({});
            dispatch.phieuMuaHang.updateData({
              isLoadingCreate: false,
            });
            dispatch.phieuMuaDichVu.getServiceVoucherUnAssigned({ page: 1 });
            message.success("Thêm phiếu dịch vụ thành công");
            resolve(s);
          })
          .catch((e) => {
            message.error(e?.message || "Thêm phiếu dịch vụ không thành công!");
            dispatch.phieuMuaHang.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },

    loadPhieuMuaHangTheoId: (id, state) => {
      // goi api search phieu mua hang theo ID// dispatch vào biến currentItem
      dispatch.phieuMuaHang.updateData({
        isLoading: true,
      });
      inwardSlipProvider
        .search({ id })
        .then(async (s) => {

          const item = s?.data?.content[0] || {};
          item.chungTu = {
            inwardSlipNumber: item?.inwardSlipNumber,
            ref_date: item?.ref_date,
            posted_date: item?.posted_date,
          };
          let selectedItem = [],
            invoiceDetail,
            paymentVoucher;
          let dsHangTien =
            item?.inwardSlipDetails.map((it) => {

              selectedItem.push(it.productDetail?.product);
              return {
                listTaxes: [
                  ...it.taxDetails
                    ?.map((i) => ({
                      id: i?.id,
                      taxId: i?.tax?.id,
                      taxRate: i?.taxRate || 0,
                      taxAmount: (i?.taxAmount || 0) / item.exchangeRate,
                      taxAccountId: i?.taxAccount?.id,
                    }))
                    .filter((i) => i.taxId && true),
                ],
                productName: it.productDetail?.product?.name || "",
                amount: it.amount || 0,
                debtAccountId: it.debtAccount?.id || "",
                from_date: it.fromDate,
                id: it.id,
                price: it.price || 0,
                quantity: it.quantity || 0,
                to_date: it.toDate,
                unit: it.unit || "Cái",
                description: it?.description || "",
                stockAccountId: it.stockAccount?.id || "",
                productId: it.productDetail?.product?.id || "",
                amountAllocationCostIncurred:
                  it.productDetail?.amountAllocationCostIncurred || 0,
                amountAllocationServices:
                  it.productDetail?.amountAllocationServices || 0,
                amountAllocationInternationalShipping: it?.productDetail?.amountAllocationInternationalShipping,
              };
            }) || [];

          invoiceDetail = await inwardSlipProvider.getInvoice(item.id);
          if (item.statusPay === STATUS_PAY.daThanhToan) {
            paymentVoucher = await inwardSlipProvider.getPaymentVoucher(
              item.id
            );
          }

          if (invoiceDetail?.code === 1) {
            item.invoiceDetail = {
              id: invoiceDetail?.data?.id,
              invoiceDate: invoiceDetail?.data?.invoiceDate,
              invoiceNumber: invoiceDetail?.data?.invoiceNumber,
            };
          } else {
            item.invoiceDetail = null;
          }

          if (paymentVoucher?.code === 1) {
            item.paymentVoucher = {
              id: paymentVoucher?.data?.id,
              reason: paymentVoucher?.data?.reason,
              receiver: paymentVoucher?.data?.receiver,
              status: paymentVoucher?.data?.status,
            };
          } else {
            item.paymentVoucher = null;
          }

          dispatch.phieuMuaHang.updateData({
            dsHangTien,
            currentItem: item,
            chungTu: {
              inwardSlipNumber: item?.inwardSlipNumber,
              posted_date: item?.postedDate,
              ref_date: item?.refDate,
            },
            isLoading: false,
            selectedItem,
            vendorId: item?.vendor?.id,
            tyGia: item.exchangeRate,
            internationalShipping: item?.internationalShipping,
          });
        })
        .catch((e) => {
          console.log(e);
          message.error(e?.message || "Xảy ra lỗi, vui lòng thử lại sau");
          dispatch.phieuMuaHang.updateData({
            dsHangTien: [],
            isLoading: false,
          });
        });
    },

    setCurrentItem: (payload, state) => {
      dispatch.phieuMuaHang.updateData({
        currentItem: payload,
      });
    },

    setDsHangTien: (payload = [], state) => {
      dispatch.phieuMuaHang.updateData({
        dsHangTien: [...payload],
      });
    },

    getAllHangHoaTheoNhaCungCap: ({ nhaCungCapId }, state) => {
      return new Promise((resolve, reject) => {
        let newState = { isLoadingDsSanPham: true, dsHangHoa: [] };
        dispatch.phieuMuaHang.updateData(newState);
        productProvider
          .search({
            page: 1,
            size: 9999,
            vendor_id: nhaCungCapId,
          })
          .then((s) => {
            dispatch.phieuMuaHang.updateData({
              dsHangHoa: (s?.data?.content || []).map((item, index) => {
                item.key = index + 1;
                return item;
              }),
              isLoadingDsSanPham: false,
            });
          })
          .catch((e) => {
            message.error(e?.message || "Xảy ra lỗi, vui lòng thử lại sau");
            dispatch.phieuMuaHang.updateData({
              dsHangHoa: [],
              isLoadingDsSanPham: false,
            });
          });
      });
    },

    setTyGia: (value, state) => {
      dispatch.phieuMuaHang.updateData({
        tyGia: value,
      });
    },

    onDeleteItemHangTien: ({ item = {} }, state) => {
      const selectedItem = state.phieuMuaHang.selectedItem || [];
      let dsHangTien = state.phieuMuaHang.dsHangTien || [];
      const index = selectedItem.findIndex((i) => i.key === item.key);
      if (index != -1) {
        selectedItem.splice(index, 1);
        dsHangTien = dsHangTien.filter((it) => it.key != item.key);
        dispatch.phieuMuaHang.updateData({
          selectedItem: [...selectedItem],
          dsHangTien,
        });
      }
    },

    addNewItem: ({ id, row }, state) => {
      return new Promise((resolve, reject) => {
        // dispatch.phieuMuaHang.updateData({
        //   isLoading: true,
        // });

        let dsHangTien = state.phieuMuaHang.dsHangTien || [];

        const item = state.hangHoa.dsHangHoa?.find((item, index) => item.id_product == id);
        if (item) {
          const key = row?.key;
          const index = Math.max(row?.key - 1, 0);

          dsHangTien[index] = {
            key,
            initPrice: item.price,
            amount: item.price / (state.phieuMuaHang.tyGia || 1),
            amountAllocationServices: 0,
            amountAllocationCostIncurred: 0,
            debtAccountId: state.account.dsTaiKhoanCongNo.find(i => i.accountNumber == 331).id,
            stockAccountId: state.account.dsTaiKhoanKho.find(i => i.accountNumber == 1562).id,
            from_date: new Date(),
            listTaxes: [
              {
                taxAccountId: state.account.dsTaiKhoanThue.find(i => i.accountNumber == 1331)?.id,
                taxAmount: 0,
                taxId: DS_ID_THUE.thueNKId,
                taxRate: 0,
              },
              {
                taxAccountId: state.account.dsTaiKhoanThue.find(i => i.accountNumber == 1331)?.id,
                taxAmount: 0,
                taxId: DS_ID_THUE.thueGTGTId,
                taxRate: 0,
              },
            ],
            price: item.price / (state.phieuMuaHang.tyGia || 1),
            productId: item.id_product,
            productName: item.name,
            quantity: 1,
            to_date: new Date(),
            unit: "Cái",
            warehouseId: "",
          }

          dispatch.phieuMuaHang.updateData({
            selectedItem: [
              ...(state.phieuMuaHang.selectedItem || []),
              item,
            ],
            dsHangTien: [...dsHangTien],
            isLoading: false,
          });
          resolve();
        }
        else {
          dispatch.phieuMuaHang.updateData({
            isLoading: false,
          });
          reject();
        }
      });
    },

    updateAllocationType: (type, state) => {
      dispatch.phieuMuaHang.updateData({
        allocationType: type,
      })
    },

    updateTaxAccount: ({ listTaxes, row }, state) => {
      let dsHangTien = state.phieuMuaHang?.dsHangTien?.map((product, index) => {
        if (product?.productId == row?.productId) {
          product.listTaxes = [...listTaxes];
        }
        return product;
      });

      dispatch.phieuMuaHang.updateData({
        dsHangTien,
      });
    },

    updateInternalShipFee: (amount, state) => {
      dispatch.phieuMuaHang.updateData({
        internationalShipping: amount,
      })
    },

    onSelectHangHoa: ({ item = {} }, state) => {

      const selectedItem = state.phieuMuaHang.selectedItem || [];
      let dsHangTien = state.phieuMuaHang.dsHangTien || [];
      const index = selectedItem.findIndex((i) => i.id === parseInt(item.id));
      if (index != -1) {
        selectedItem.splice(index, 1);
        dsHangTien = dsHangTien.filter((it) => it.productId != parseInt(item.id));
        dispatch.phieuMuaHang.updateData({
          selectedItem: [...selectedItem],
          dsHangTien,
        });
      } else {
        let payload = {
          key: dsHangTien.length + 1,
          initPrice: item?.priceImportRecent || item.price,
          amount: item?.priceImportRecent || item.price,
          amountAllocationServices: 0,
          amountAllocationCostIncurred: 0,
          debtAccountId: state.account.dsTaiKhoanCongNo.find(i => i.accountNumber == 331).id,
          stockAccountId: state.account.dsTaiKhoanKho.find(i => i.accountNumber == 1562).id,
          from_date: new Date(),
          listTaxes: [
            {
              taxAccountId: state.account.dsTaiKhoanThue.find(i => i.accountNumber == 1331)?.id,
              taxAmount: 0,
              taxId: DS_ID_THUE.thueNKId,
              taxRate: 0,
            },
            {
              taxAccountId: state.account.dsTaiKhoanThue.find(i => i.accountNumber == 1331)?.id,
              taxAmount: 0,
              taxId: DS_ID_THUE.thueGTGTId,
              taxRate: 0,
            },
          ],
          price: item.priceImportRecent || item?.price,
          productId: item.id,
          productName: item.name,
          quantity: 1,
          to_date: new Date(),
          idWarehouse: state.kiemKho?.dsKiemKho[0]?.id,
          unit: "Cái",
        };
        const newItem = {
          key: payload.key,
          id: parseInt(payload.productId),
        }
        dispatch.phieuMuaHang.updateData({
          selectedItem: [...selectedItem, newItem],
          dsHangTien: [...dsHangTien, payload],
        });
      }
    },

    onCreate: (payload, state) => {
      return new Promise((resolve, reject) => {
        dispatch.phieuMuaHang.updateData({
          isLoadingCreate: true,
        });

        inwardSlipProvider
          .create(payload)
          .then((s) => {
            dispatch.phieuMuaHang.updateData({
              isLoadingCreate: false,
            });

            dispatch.phieuMuaHang.onSearch({});
            message.success("Thêm mới thành công");
            resolve(s);
          })
          .catch((e) => {
            message.error(e?.message || "Tạo mới không thành công");
            dispatch.phieuMuaHang.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },

    onUpdate: ({ id, payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.phieuMuaHang.updateData({
          isLoadingCreate: true,
        });
        inwardSlipProvider
          .update({ id, payload })
          .then((s) => {
            let dsPhieuMuaHang = (state.phieuMuaHang.dsPhieuMuaHang || []).map(
              (item) => {
                if (item.id !== id) return item;
                s.data.key = item.key;
                return s.data;
              }
            );
            dispatch.phieuMuaHang.updateData({
              currentItem: s?.data,
              isLoadingCreate: false,
              dsPhieuMuaHang,
            });

            message.success("Chỉnh sửa thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Chỉnh sửa không thành công");
            dispatch.phieuMuaHang.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },

    onDeleteMul: (payload) => {
      return new Promise((resolve, reject) => {
        dispatch.phieuMuaHang.updateData({
          isLoading: true,
        });
        inwardSlipProvider
          .deleteMul(payload)
          .then((s) => {
            dispatch.phieuMuaHang.onSearch({});
            dispatch.phieuMuaHang.updateData({
              isLoading: false,
            });
            message.success("Xoá thành công!");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Xoá không thành công!");
            dispatch.phieuMuaHang.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },

    onDelete: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.phieuMuaHang.updateData({
          isLoading: true,
        });

        inwardSlipProvider
          .delete({ id, ...payload })
          .then((s) => {
            //TODO: remove item deleted on state
            const { page = 1, size = 10, totalElements } = state.phieuMuaHang;
            let dsPhieuMuaHang = (state.phieuMuaHang.dsPhieuMuaHang || [])
              .filter((item) => item.id !== id)
              .map((item, index) => {
                item.key = (page - 1) * size + index + 1;
                return item;
              });
            dispatch.phieuMuaHang.updateData({
              isLoading: false,
              dsPhieuMuaHang: [...dsPhieuMuaHang],
              page: page,
              totalElements: Math.max(totalElements - 1, 0),
            });

            message.success("Xóa thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Xóa không thành công");
            dispatch.phieuMuaHang.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },

    onUpdateStatusConfirmedToComing: ({ id, payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.phieuMuaHang.updateData({
          isLoadingCreate: true,
        });

        inwardSlipProvider
          .updateStatusConfirmInComing({ id, payload })
          .then((s) => {
            let dsPhieuMuaHang = (state.phieuMuaHang.dsPhieuMuaHang || []).map(
              (item) => {
                if (item.id !== id) return item;
                item.statusGoods = STATUS_GOODS.hangDangVe;
                return item;
              }
            );
            dispatch.phieuMuaHang.updateData({
              isLoadingCreate: false,
              dsPhieuMuaHang,
            });

            message.success("Chỉnh sửa trạng thái hàng thành công!");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(
              e?.message || "Chỉnh sửa trạng thái hàng không thành công!"
            );
            dispatch.phieuMuaHang.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    onUpdateStatus: ({ type, id }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.phieuMuaHang.updateData({
          isLoadingCreate: true,
        });

        inwardSlipProvider
          .updateStatus({ id, type })
          .then((s) => {
            let dsPhieuMuaHang = (state.phieuMuaHang.dsPhieuMuaHang || []).map(
              (item) => {
                if (item.id !== id) return item;
                s.data.key = item.key;
                return s.data;
              }
            );
            dispatch.phieuMuaHang.updateData({
              isLoadingCreate: false,
              dsPhieuMuaHang,
            });

            message.success("Chỉnh sửa thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Chỉnh sửa không thành công");
            dispatch.phieuMuaHang.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },

    onSizeChange: ({ size, ...rest }, state) => {
      dispatch.phieuMuaHang.updateData({
        size,
        page: 1,
        ...rest,
      });
      dispatch.phieuMuaHang.onSearch({ page: 1, size, ...rest });
    },
    onSearchNumber: () => {
      inwardSlipProvider
        .searchNumber()
        .then((s) => {
          dispatch.phieuMuaHang.updateData({
            dsPhieuMuaHang: s?.data || [],
          });
        })
        .catch((e) => {
          message.error(e?.message || "Xảy ra lỗi, vui lòng thử lại sau");
          dispatch.phieuMuaHang.updateData({
            dsPhieuMuaHang: [],
          });
        });
    },

    getInwardNumberWithWarehouse: (id, state) => {
      return new Promise((resolve, reject) => {
        dispatch.phieuMuaHang.updateData({
          isLoading: true,
        });
        inwardSlipProvider
          .getWithWarehouse(id)
          .then((s) => {
            dispatch.phieuMuaHang.updateData({
              dsPhieuMuaHang: s?.data || [],
            });
          })
          .catch((e) => {
            message.error(
              e?.message || "Vui lòng chọn kho hàng!"
            );
            dispatch.phieuMuaHang.updateData({
              dsPhieuMuaHang: [],
            });
          });
      });
    },

    onSearch: ({ page = 1, ...payload }, state) => {
      const dataSearch = {
        ...(state.phieuMuaHang.dataSearch || {}),
        ...(payload.dataSearch || {}),
      };
      let newState = { isLoading: true, page, dataSearch };
      dispatch.phieuMuaHang.updateData(newState);
      let size = payload.size || state.phieuMuaHang.size || 10;

      inwardSlipProvider
        .search({
          page,
          size,
          ...dataSearch,
        })
        .then((s) => {
          dispatch.phieuMuaHang.updateData({
            dsPhieuMuaHang: (s?.data?.content || []).map((item, index) => {
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
          dispatch.phieuMuaHang.updateData({
            dsPhieuMuaHang: [],
            isLoading: false,
          });
        });
    },

    getNumbers: (type, state) => {
      return new Promise((resolve, reject) => {
        dispatch.phieuMuaHang.updateData({
          isLoadingCreate: true,
        });

        inwardSlipProvider
          .getNumbers(type)
          .then(s => {
            const data = s?.data;
            dispatch.phieuMuaHang.updateData({
              chungTu: {
                inwardSlipNumber: data?.inwardSlipNumber,
                ref_date: new Date(),
                posted_date: new Date(),
              }
            });
            resolve(s?.data);
          })
          .catch(e => {
            reject(e);
          })
          .finally(() => {
            dispatch.phieuMuaHang.updateData({
              isLoadingCreate: false,
            });
          });
      });
    },

    onSearchV2: ({ page = 1, ...payload }, state) => {
      const dataSearch = {
        ...(state.phieuMuaHang.dataSearch || {}),
        ...(payload.dataSearch || {}),
      };
      let newState = { isLoading: true, page, dataSearch };
      dispatch.phieuMuaHang.updateData(newState);
      let size = payload.size || state.phieuMuaHang.size || 10;

      inwardSlipProvider
        .search_v2({
          page,
          size,
          ...dataSearch,
          warehouseId: state.kiemKho.currentItem || -1,
        })
        .then((s) => {
          dispatch.phieuMuaHang.updateData({
            dsPhieuMuaHang: (s?.data?.content || []).map((item, index) => {
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
          dispatch.phieuMuaHang.updateData({
            dsPhieuMuaHang: [],
            isLoading: false,
          });
        });
    },

    onChangeInputSearch: ({ ...payload }, state) => {
      const dataSearch = {
        ...(state.phieuMuaHang.dataSearch || {}),
        ...payload,
      };
      dispatch.phieuMuaHang.updateData({
        page: 1,
        dataSearch,
      });
      dispatch.phieuMuaHang.onSearchV2({
        page: 1,
        dataSearch,
      });
    },

    getTotalAllocation: (id, state) => {
      return new Promise((resolve, reject) => {
        dispatch.phieuMuaHang.updateData({
          isLoading: true,
        });
        inwardSlipProvider
          .getTotalAllocation(id)
          .then((s) => {
            const dsChiPhi = [
              ...s?.data.map(i => ({
                costIncurredAmount: i?.totalAmountAllocationOfCostIncurred,
                costIncurredId: i?.costIncurred?.id,
                costIncurredName: i?.costIncurred?.costIncurredName,
              }))
            ] || [];
            var totalCostIncurred = 0;
            dsChiPhi.forEach(item => {
              totalCostIncurred += item.costIncurredAmount;
            })
            dispatch.phieuMuaHang.updateData({
              dsChiPhi,
              totalCostIncurred,
              isLoading: false,
            });
            resolve(totalCostIncurred);
          })
          .catch((e) => {
            message.error(e?.message || "Xảy ra lỗi! Vui lòng thử lại");
            dispatch.phieuMuaHang.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },
    setDsChiPhi: (payload = []) => {
      dispatch.phieuMuaHang.updateData({
        dsChiPhi: [...payload],
      });
    },
    onUpdateCostIncurred: ({ id, payload }) => {
      return new Promise((resolve, reject) => {
        dispatch.phieuMuaHang.updateData({
          isLoading: true,
        });
        inwardSlipProvider
          .updateCostIncurred({ id: id, costIncurredDTOList: payload })
          .then((s) => {
            dispatch.phieuMuaHang.updateData({
              isLoading: false,
            });
            message.success("Chỉnh sửa chi phí phát sinh thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(
              e?.message || "Chỉnh sửa chi phí phát sinh không thành công"
            );
            dispatch.phieuMuaHang.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },
  }),
};
