import { message } from "antd";
import servicesVoucherProvider from "data-access/services-voucher-provider";
import { DS_ID_THUE } from "constant";
export default {
  state: {
    dsPhieuMuaDichVu: [],
    isLoading: false,
  },
  reducers: {
    updateData(state, payload = {}) {
      return { ...state, ...payload };
    },
  },

  effects: (dispatch) => ({
    clearOldData: () => {
      dispatch.phieuMuaDichVu.updateData({
        dsHangTien: [],
        selectedItem: [],
        tyGia: 1,
      });
    },
    removeItemHangTien: (payload, state) => {
      if (payload.servicesId) {
        dispatch.phieuMuaDichVu.updateData({
          dsHangTien: state.phieuMuaDichVu.dsHangTien?.filter(item => item?.servicesId != payload?.servicesId),
          selectedItem: state.phieuMuaDichVu.selectedItem?.filter(item => item?.id != payload?.servicesId),
        })
      }
    },
    loadPhieuMuaDichVuTheoId: (id, state) => {
      // goi api search phieu mua hang theo ID// dispatch vào biến currentItem
      dispatch.phieuMuaDichVu.updateData({
        isLoadingCreate: true,
      })
      servicesVoucherProvider
        .search({ Id: id })
        .then(async (s) => {
          const item = s?.data.content[0] || {};
          let selectedItem = [],
            invoiceDetail,
            paymentVoucher,
            inwardSlipDetail,
            dsHangTien =
              item?.serviceVoucherDetails.map((it) => {
                selectedItem.push(it.servicesInServiceVoucherDetail);
                return {
                  listTaxes: [
                    ...it.taxDetail?.map((i) => ({
                      id: i?.id,
                      taxId: i?.tax.id,
                      taxRate: i?.taxRate || 0,
                      taxAmount: (i?.taxAmount || 0) / item.exchangeRate,
                      taxAccountId: i?.taxAccount.id || state.account.dsTaiKhoan[0]?.id,
                    })),
                  ],
                  price: it.price || 0,
                  quantity: it.quantity || 0,
                  amount: it.price * it.quantity || 0,
                  servicesId: it.servicesInServiceVoucherDetail?.id || "",
                  serviceName:
                    it.servicesInServiceVoucherDetail?.serviceName || "",
                  costAccountId: it.costAccountsInServiceVoucherDetail.id,
                  debtAccountId: it.debtAccountsInServiceVoucherDetail.id,
                };
              }) || [];
          if (item.statusPay === 1) {
            paymentVoucher = await servicesVoucherProvider.getPaymentVoucher(
              item.id
            );
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
          if (item.statusBill === 1) {
            invoiceDetail = await servicesVoucherProvider.getInvoice(item.id);
            if (invoiceDetail?.code === 1) {
              item.invoiceDetail = {
                id: invoiceDetail?.data?.id,
                invoiceDate: invoiceDetail?.data?.invoiceDate,
                invoiceNumber: invoiceDetail?.data?.invoiceNumber,
              };
            } else {
              item.invoiceDetail = null;
            }
          }

          inwardSlipDetail = await servicesVoucherProvider.getInwardSlip(
            item.id
          );
          if (inwardSlipDetail && inwardSlipDetail?.code === 1) {
            item.inwardSlipId = inwardSlipDetail?.data?.id;
          } else item.inwardSlipId = null;

          dispatch.phieuMuaDichVu.updateData({
            dsHangTien,
            currentItem: item,
            selectedItem,
            tyGia: item.exchangeRate,
            isLoadingCreate: false,
          });
        })
        .catch((e) => {
          message.error(e?.message || "Xảy ra lỗi, vui lòng thử lại sau");
          dispatch.phieuMuaDichVu.updateData({
            dsHangTien: [],
            isLoadingCreate: false,
          });
        });
    },
    setCurrentItem: (payload) => {
      dispatch.phieuMuaDichVu.updateData({
        currentItem: payload,
      });
    },
    setTyGia: (value, state) => {
      dispatch.phieuMuaDichVu.updateData({
        tyGia: value,
        // dsHangTien: [...dsHangTien],
      });
    },
    onSelectDichVu: ({ item = {} }, state) => {
      const selectedItem = state.phieuMuaDichVu.selectedItem || [];
      let dsHangTien = state.phieuMuaDichVu.dsHangTien || [];
      const index = selectedItem.findIndex((i) => i.id === item.id);
      if (index != -1) {
        selectedItem.splice(index, 1);
        dsHangTien = dsHangTien.filter((it) => it.servicesId != item.id);
        dispatch.phieuMuaDichVu.updateData({
          selectedItem: [...selectedItem],
          dsHangTien,
        });
      } else {

        let payload = {
          price: item.price,
          amount: item.price,
          costAccountId: state.account.dsTaiKhoanChiPhi[0]?.id,
          debtAccountId: state.account.dsTaiKhoanCongNo.find(i => i.accountNumber == 331).id,
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
          servicesId: item.id,
          serviceName: item.serviceName,
          quantity: 1,
        };
        dispatch.phieuMuaDichVu.updateData({
          selectedItem: [...selectedItem, JSON.parse(JSON.stringify(item))],
          dsHangTien: [...dsHangTien, payload],
        });
      }
    },
    onCreate: (payload, state) => {
      return new Promise((resolve, reject) => {
        dispatch.phieuMuaDichVu.updateData({
          isLoadingCreate: true,
        });

        servicesVoucherProvider
          .create(payload)
          .then((s) => {
            dispatch.phieuMuaDichVu.updateData({
              isLoadingCreate: false,
            });

            dispatch.phieuMuaDichVu.onSearch({});
            message.success("Thêm mới thành công");
            resolve(s);
          })
          .catch((e) => {
            message.error(e?.message || "Tạo mới không thành công");
            dispatch.phieuMuaDichVu.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    onSizeChange: ({ size, ...rest }, state) => {
      dispatch.phieuMuaDichVu.updateData({
        size,
        page: 1,
        ...rest,
      });
      dispatch.phieuMuaDichVu.onSearch({ page: 1, size, ...rest });
    },
    onSearch: ({ page = 1, ...payload }, state) => {
      const dataSearch = {
        ...(state.phieuMuaDichVu.dataSearch || {}),
        ...(payload.dataSearch || {}),
      };
      let newState = { isLoading: true, page, dataSearch };
      dispatch.phieuMuaDichVu.updateData(newState);
      let size = payload.size || state.phieuMuaDichVu.size || 10;

      servicesVoucherProvider
        .searchV2({
          page,
          size,
          ...dataSearch,
        })
        .then((s) => {
          dispatch.phieuMuaDichVu.updateData({
            dsPhieuMuaDichVu: (s?.data?.content || []).map((item, index) => {
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
          dispatch.phieuMuaDichVu.updateData({
            dsPhieuMuaDichVu: [],
            isLoading: false,
          });
        });
    },
    setDsHangTien: (payload = [], state) => {
      dispatch.phieuMuaDichVu.updateData({
        dsHangTien: [...payload],
      });
    },
    onChangeInputSearch: ({ ...payload }, state) => {
      const dataSearch = {
        ...(state.phieuMuaDichVu.dataSearch || {}),
        ...payload,
      };
      dispatch.phieuMuaDichVu.updateData({
        page: 1,
        dataSearch,
      });
      dispatch.phieuMuaDichVu.onSearch({
        page: 1,
        dataSearch,
      });
    },

    onUpdate: ({ id, payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.phieuMuaDichVu.updateData({
          isLoadingCreate: true,
        });

        servicesVoucherProvider
          .update({ id, payload })
          .then((s) => {
            let dsPhieuMuaDichVu = (
              state.phieuMuaDichVu.dsPhieuMuaDichVu || []
            ).map((item) => {
              if (item.id !== id) return item;
              s.data.key = item.key;
              return s.data;
            });
            dispatch.phieuMuaDichVu.updateData({
              currentItem: s?.data,
              isLoadingCreate: false,
              dsPhieuMuaDichVu,
            });

            message.success("Chỉnh sửa thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Chỉnh sửa không thành công");
            dispatch.phieuMuaDichVu.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },

    onDelete: ({ id }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.phieuMuaDichVu.updateData({
          isLoading: true,
        });
        servicesVoucherProvider
          .delete({ id })
          .then((s) => {
            //TODO: remove item deleted on state
            const { page = 1, size = 10, totalElements } = state.phieuMuaDichVu;
            let dsPhieuMuaDichVu = (state.phieuMuaDichVu.dsPhieuMuaDichVu || [])
              .filter((item) => item.id !== id)
              .map((item, index) => {
                item.key = (page - 1) * size + index + 1;
                return item;
              });
            dispatch.phieuMuaDichVu.updateData({
              isLoading: false,
              dsPhieuMuaDichVu: [...dsPhieuMuaDichVu],
              page: page,
              totalElements: Math.max(totalElements - 1, 0),
            });

            message.success("Xóa thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Xóa không thành công");
            dispatch.phieuMuaDichVu.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },
    onDeleteMul: (payload) => {
      return new Promise((resolve, reject) => {
        dispatch.phieuMuaDichVu.updateData({
          isLoading: true,
        });
        servicesVoucherProvider
          .deleteMul(payload)
          .then((s) => {
            dispatch.phieuMuaDichVu.onSearch({});
            dispatch.phieuMuaDichVu.updateData({
              isLoading: false,
            });
            message.success("Xoá thành công!");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Xoá không thành công!");
            dispatch.phieuMuaDichVu.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },
    updateStatus: ({ id }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.phieuMuaDichVu.updateData({
          isLoadingCreate: true,
        });

        servicesVoucherProvider
          .updateStatus({ id })
          .then((s) => {
            let dsPhieuMuaDichVu = (
              state.phieuMuaDichVu.dsPhieuMuaDichVu || []
            ).map((item) => {
              if (item.id !== id) return item;
              s.data.key = item.key;
              return s.data;
            });
            dispatch.phieuMuaDichVu.updateData({
              isLoadingCreate: false,
              dsPhieuMuaDichVu,
            });

            // message.success("Chỉnh sửa thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Chỉnh sửa không thành công");
            dispatch.phieuMuaDichVu.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },

    getServiceVoucherUnAssigned: ({ page = 1, ...payload }, state) => {
      let newState = { isLoading: true, page };
      dispatch.phieuMuaDichVu.updateData(newState);
      let size = payload.size || state.phieuMuaDichVu.size || 2;

      servicesVoucherProvider
        .getVoucherUnassigned({
          page,
          size,
          type: -1,
          ...payload,
        })
        .then((s) => {
          dispatch.phieuMuaDichVu.updateData({
            dsPhieuMuaDichVu: (s?.data?.content || []).map((item, index) => {
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
          dispatch.phieuMuaDichVu.updateData({
            dsPhieuMuaDichVu: [],
            isLoading: false,
          });
        });
    },
  }),
};
