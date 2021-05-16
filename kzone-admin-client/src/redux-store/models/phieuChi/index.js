import { message } from "antd";
import inwardSlipProvider from "data-access/inward-slip-provider";
import paymentVoucherProvider from "data-access/payment-voucher-provider";
import servicesVoucherProvider from "data-access/services-voucher-provider";
import cacheUtils from "utils/cache-utils";


export default {
  state: {
    currentItem: [],
  },
  reducers: {
    updateData(state, payload = {}) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch) => ({
    getPaymentVoucher: (payload, state) => {
      return new Promise(async (resolve, reject) => {
        dispatch.phieuChi.updateData({
          isLoadingCreate: true,
        });
        inwardSlipProvider
          .getPaymentVoucher(payload?.id)
          .then((s) => {
            if (s?.code === 1) {
              const updatedItem = s?.data;
              let dsPhieuMuaHang = (state.phieuMuaHang.dsPhieuMuaHang || []).map((item, index) => {
                if (item.id !== updatedItem.id) return item;
                updatedItem.key = item.key;
                return updatedItem;
              })
              dispatch.phieuMuaHang.updateData({
                dsPhieuMuaHang,
              });
              dispatch.phieuChi.updateData({
                currentItem: { ...s?.data },
                isLoadingCreate: false,
              });
              resolve(s?.data);
              return;
            }
            reject(s);
          })
          .catch((e) => {
            message.error(e?.message || "Vui lòng thử lại sau")
            dispatch.phieuChi.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    getPaymentVoucherServices: ({ id, ...payload }) => {
      return new Promise(async (resolve, reject) => {
        dispatch.phieuChi.updateData({
          isLoadingCreate: true,
        });
        paymentVoucherProvider
          .getPaymentVoucherServices({ id: id })
          .then((s) => {
            const idPaymentVoucher = s?.data.id
            paymentVoucherProvider
              .update2({ idPaymentVoucher, ...payload })
              .then((s) => {
                return servicesVoucherProvider.updateStatus({ id: id })
                  .then((s) => {
                    if (s?.code == 1) {
                      message.success("Update thành công!");
                      dispatch.phieuMuaDichVu.onSearch({})
                    }
                    dispatch.phieuChi.updateData({
                      isLoadingCreate: false,
                    });
                    resolve(s);
                  })
              })
              .catch(e => {
                message.error(e?.message || "Chỉnh sửa không thành công");
                dispatch.phieuChi.updateData({
                  isLoadingCreate: false,
                });
                reject(e);
              });
          })
      })
    },
    onUpdate: ({ id, body }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.phieuChi.updateData({
          isLoadingCreate: true,
        });
        paymentVoucherProvider
          .update({ id, body })
          .then(s => {
            const item = s?.data?.inwardSlip;
            return inwardSlipProvider
              .updateStatus({
                id: item?.id,
                type: "statusPay",
              })
          })
          .then((s) => {
            if (s?.code == 1) {
              message.success("Update thành công!");
              dispatch.phieuMuaHang.onSearch({});
            }
            dispatch.phieuChi.updateData({
              isLoadingCreate: false,
              currentItem: {},
            });
            resolve(s);
          })
          .catch(e => {
            message.error(e?.message || "Chỉnh sửa không thành công");
            dispatch.phieuChi.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    //==========content payment voucher========== 
    onCreateContent: (payload) => {
      return new Promise((resolve, reject) => {
        dispatch.phieuChi.updateData({
          isLoadingCreate: true,
        });
        paymentVoucherProvider
          .createContent(payload)
          .then((s) => {
            dispatch.phieuChi.updateData({
              isLoadingCreate: false,
            });
            dispatch.phieuChi.onSearchContent({});
            message.success("Thêm mới thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Tạo mới không thành công");
            dispatch.phieuChi.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    setDsContentPhieuChi: (payload) => {
      dispatch.phieuChi.updateData({
        dsContentPhieuChi: [...payload],
      })
    },
    getAllContent: (payload, state) => {
      return new Promise(async (resolve, reject) => {
        let userId = state.auth.auth?.id;
        let dsContentPhieuChi = await cacheUtils.read(
          userId,
          "DATA_PHIEUCHI_CONTENT",
          [],
          false
        );
        dispatch.phieuChi.updateData({
          dsContentPhieuChi,
        });

        paymentVoucherProvider
          .getAllContent()
          .then((s) => {
            let dsContentPhieuChi = (s?.data?.content || []);
            dispatch.phieuChi.updateData({
              dsContentPhieuChi
            });
            cacheUtils.save(userId, "DATA_PHIEUCHI_CONTENT", dsContentPhieuChi, false);
          })
          .catch((e) => { });
      });
    },
    onSearchGroupContent: ({ page = 1, ...payload }, state) => {
      const dataSearch = {
        ...(state.phieuChi.dataSearch || {}),
        ...(payload.dataSearch || {}),
      };
      let newState = { isLoading: true, page, dataSearch };
      dispatch.phieuChi.updateData(newState);
      let size = payload.size || state.phieuChi.size || 10;

      paymentVoucherProvider
        .searchGroupContent({
          page,
          size,
          ...dataSearch,
        })
        .then((s) => {
          dispatch.phieuChi.updateData({
            dsNhomNDPhieuChi: (s?.data?.content || []),
            isLoading: false,
          });
        })
        .catch((e) => {
          message.error(e?.message || "Xảy ra lỗi, vui lòng thử lại sau");
          dispatch.phieuChi.updateData({
            dsNhomNDPhieuChi: [],
            isLoading: false,
          });
        });
    },
    onSearchContent: ({ page = 1, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        const dataSearch = {
          ...(state.phieuChi.dataSearch || {}),
          ...(payload.dataSearch || {}),
        };
        let newState = { isLoading: true, page, dataSearch };
        dispatch.phieuChi.updateData(newState);
        let size = payload.size || state.phieuChi.size || 10;

        paymentVoucherProvider
          .searchContent({
            page,
            size,
            ...dataSearch,
          })
          .then((s) => {
            const dsContentPhieuChi = [
              ...s?.data?.content.map((item) => ({
                id: item?.id,
                description: item?.description,
              }))
            ] || [];
            dispatch.phieuChi.updateData({
              dsContentPhieuChi,
              isLoading: false,
            });
            resolve(dsContentPhieuChi);
          })
          .catch((e) => {
            message.error(e?.message || "Xảy ra lỗi, vui lòng thử lại sau");
            dispatch.phieuChi.updateData({
              dsContentPhieuChi: [],
              isLoading: false,
            });
          });
      })
    },
    onCreateGroupContent: (payload) => {
      return new Promise((resolve, reject) => {
        dispatch.phieuChi.updateData({
          isLoadingCreate: true,
        });

        paymentVoucherProvider
          .createGroupContent(payload)
          .then((s) => {
            dispatch.phieuChi.updateData({
              isLoadingCreate: false,
            });
            dispatch.phieuChi.onSearchGroupContent({});
            message.success("Thêm mới thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Tạo mới không thành công");
            dispatch.phieuChi.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    //========================================
    getListByUserID: (id) => {
      dispatch.phieuChi.updateData({
        isLoading: true,
      })
      paymentVoucherProvider
        .getListByUserID(id)
        .then((s) => {
          dispatch.phieuChi.updateData({
            dsPhieuChi: s?.data?.content || [],
            // dsPhieuChi: (s?.data?.content || []).map((item, index) => {
            //   item.key = (page - 1) * size + index + 1;
            //   return item;
            // }),
            isLoading: false,
          });
        })
        .catch((e) => {
          message.error(e?.message || "Lỗi tải danh sách dữ liệu! Vui lòng thử lại!");
          dispatch.phieuChi.updateData({
            dsChiTietContent: [],
            isLoading: false,
          });
        })
    },
    onGetChiTietPhieuChiById: (id, state) => {
      return new Promise((resolve, reject) => {
        dispatch.phieuChi.updateData({
          isLoading: true,
        })

        paymentVoucherProvider
          .getDetailPaymentVoucherById(id)
          .then((s) => {
            const dsChiTietContent = [
              ...s?.data.map((item, index) => ({
                amount: item?.amount,
                contentId: item?.paymentVoucherContent?.id,
                key: index,
              }))
            ] || [];
            dispatch.phieuChi.updateData({
              dsChiTietContent,
              isLoading: false,
            })
            resolve(dsChiTietContent);
          })
          .catch((e) => {
            message.error(e?.message || "Lỗi tải danh sách dữ liệu! Vui lòng thử lại!");
            dispatch.phieuChi.updateData({
              dsChiTietContent: [],
              isLoadingCreate: false,
            });
            reject(e);
          });
      })
    },
    onCreatePhieuChiNV: ({ userId, detail }) => {
      return new Promise((resolve, reject) => {
        dispatch.phieuChi.updateData({
          isLoadingCreate: true,
        });

        paymentVoucherProvider
          .createPhieuChiNV({ userId, detail })
          .then((s) => {
            dispatch.phieuChi.updateData({
              isLoadingCreate: false,
            });
            dispatch.phieuChi.onSearch({});
            message.success("Thêm mới thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Tạo mới không thành công");
            dispatch.phieuChi.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    onUpdatePhieuChiNV: ({ id, payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.phieuChi.updateData({
          isLoadingCreate: true,
        });
        paymentVoucherProvider
          .updatePhieuChiNV({ id, payload })
          .then((s) => {
            // let dsPhieuChi = (state.phieuChi.dsPhieuChi || []).map((item) => {
            //   if (item.id != id) return item;
            //   s.data.index = item.index;
            //   return s.data;
            // });
            dispatch.phieuChi.onSearch({});
            dispatch.phieuChi.updateData({
              isLoadingCreate: false,
              // dsPhieuChi: [...dsPhieuChi],
            });
            message.success("Chỉnh sửa thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Chỉnh sửa không thành công");
            dispatch.phieuChi.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    onUpdateStatus: (id, state) => {
      return new Promise((resolve, reject) => {
        dispatch.phieuChi.updateData({
          isLoading: true,
        });
        paymentVoucherProvider
          .updateStatus(id)
          .then((s) => {
            dispatch.phieuChi.updateData({
              isLoading: false,
            });
            dispatch.phieuChi.onSearch({});
            message.success("Đổi trạng thái thành công!");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Đổi trạng thái không thành công!");
            dispatch.phieuChi.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },
    onSearch: ({ page = 1, ...payload }, state) => {
      const dataSearch = {
        ...(state.phieuChi.dataSearch || {}),
        ...(payload.dataSearch || {}),
      };
      let newState = { isLoading: true, page, dataSearch };
      dispatch.phieuChi.updateData(newState);
      let size = payload.size || state.phieuChi.size || 10;

      paymentVoucherProvider
        .search({
          page,
          size,
          ...dataSearch,
        })
        .then((s) => {
          dispatch.phieuChi.updateData({
            dsPhieuChi: (s?.data?.content || []).map((item, index) => {
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
          dispatch.phieuChi.updateData({
            dsPhieuChi: [],
            isLoading: false,
          });
        });
    },
    onDelete: ({ id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.phieuChi.updateData({
          isLoading: true,
        });
        paymentVoucherProvider
          .delete({ id, ...payload })
          .then((s) => {
            const { page = 1, size = 10 } = state.phieuChi;
            let dsPhieuChi = (state.phieuChi.dsPhieuChi || [])
              .filter((item) => item.id != id)
              .map((item, index) => {
                item.index = (page - 1) * size + index + 1;
                return item;
              });
            dispatch.phieuChi.updateData({
              dsPhieuChi: [...dsPhieuChi],
              totalElements: state.phieuChi.totalElements - 1,
              isLoading: false,
            });
            message.success("Xoá thành công!");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Xoá không thành công!");
            dispatch.phieuChi.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },
    onDeleteMul: (payload, state) => {
      return new Promise((resolve, reject) => {
        dispatch.phieuChi.updateData({
          isLoading: true,
        });
        paymentVoucherProvider
          .deleteMul(payload)
          .then((s) => {
            dispatch.phieuChi.onSearch({});
            dispatch.phieuChi.updateData({
              isLoading: false,
            });
            message.success("Xoá thành công!");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Xoá không thành công!");
            dispatch.phieuChi.updateData({
              isLoading: false,
            });
            reject(e);
          });
      });
    },
  }),
};
