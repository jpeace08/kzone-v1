import { message } from "antd";
import cacheUtils from "utils/cache-utils";
import productDetailProvider from "data-access/product-detail-provider";

export default {
  state: {
    dsHangHoaChiTiet: [],
  },
  reducers: {
    updateData(state, payload = {}) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch) => ({
    onUpdate: ({ idParentProduct, id, ...payload }, state) => {
      return new Promise((resolve, reject) => {
        dispatch.hangHoaChiTiet.updateData({
          isLoadingCreate: true,
        });

        productDetailProvider
          .update({ id, ...payload })
          .then((s) => {

            // let dsHangHoaChiTiet = (
            //   state.hangHoaChiTiet.dsHangHoaChiTiet || []
            // ).map((item) => {
            //   if (item.id !== id) return item;
            //   s.data.key = item.key;
            //   return s.data;
            // });
            // dispatch.hangHoaChiTiet.updateData({
            //   isLoadingCreate: false,
            //   dsHangHoaChiTiet: [...dsHangHoaChiTiet],
            // });
            let dsHangHoa = state.hangHoa.dsHangHoa.map((item, index) => {
              if (item?.id == idParentProduct) {
                let productDetailsReturnDTOList = item?.productDetailsReturnDTOList?.map((p, i) => {
                  if (p?.id != id) return i;
                  s.data.key = item?.key;
                  return s.data;
                });
                item.productDetailsReturnDTOList = productDetailsReturnDTOList;
                return item;
              }
              else return item;
            })
            dispatch.hangHoaChiTiet.updateData({
              isLoadingCreate: false,
            });
            dispatch.hangHoa.updateData({
              dsHangHoa: dsHangHoa.filter(item => item != undefined),
            })
            message.success("Chỉnh sửa thành công");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "Chỉnh sửa không thành công");
            dispatch.hangHoaChiTiet.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },

    onSizeChange: ({ size, ...rest }, state) => {
      dispatch.hangHoaChiTiet.updateData({
        size,
        page: 1,
        ...rest,
      });
      dispatch.hangHoaChiTiet.onSearch({ page: 1, size, ...rest });
    },
    onSearch: ({ page = 1, ...payload }, state) => {
      const dataSearch = {
        ...(state.hangHoaChiTiet.dataSearch || {}),
        ...(payload.dataSearch || {}),
      };

      let newState = { isLoading: true, page, dataSearch };
      dispatch.hangHoaChiTiet.updateData(newState);
      let size = payload.size || state.hangHoaChiTiet.size || 10;
      productDetailProvider
        .search({
          page,
          size,
          ...dataSearch,
        })
        .then((s) => {
          let dsHangHoaChiTiet = (s?.data?.content || []).map((item, index) => {
            return {
              id: item.id,
              key: (page - 1) * size + index + 1,
              product: {
                id: item.product?.id,
                image: item.product?.image,
                max: item.product?.max,
                min: item.product?.min,
                name: item.product?.name,
                price: item?.product?.price,
                totalQuantity: item.product?.totalQuantity,
                productGroupId: item.product?.productGroup?.id,
              },
              totalTaxAmount: item.totalTaxAmount,
              barcode: item.barcode,
              price: item.price,
              amountAllocationCostIncurred: item.amountAllocationCostIncurred,
              amountAllocationServices: item.amountAllocationServices,
              quantity: item.quantity,
              quantityImport: item.quantityImport,
              status: item.status,
              fromDate: item.fromDate,
              toDate: item.toDate,
            };
          });
          dispatch.hangHoaChiTiet.updateData({
            dsHangHoaChiTiet: [...dsHangHoaChiTiet],
            isLoading: false,
            totalElements: s?.data?.totalElements || 0,
            page,
            size,
          });
        })
        .catch((e) => {
          message.error(e?.message || "Xảy ra lỗi, vui lòng thử lại sau");
          dispatch.hangHoaChiTiet.updateData({
            dsHangHoaChiTiet: [],
            isLoading: false,
          });
        });
    },
    onChangeInputSearch: ({ ...payload }, state) => {
      const dataSearch = {
        ...(state.hangHoaChiTiet.dataSearch || {}),
        ...payload,
      };
      dispatch.hangHoaChiTiet.updateData({
        page: 1,
        dataSearch,
      });
      dispatch.hangHoaChiTiet.onSearch({
        page: 1,
        dataSearch,
      });
    },
  }),
};
