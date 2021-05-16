import React, {
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { Main } from "./styled";
import {
  Button,
  Spin,
  Upload,
  Form,
} from "antd";
import { connect } from "react-redux";
import { ALLOCATION_TYPE, DS_ID_THUE } from "constant/index";

const ModalLuaChonPhuongThucPhieuMuaHang = (props, ref) => {

  const [state, _setState] = useState({});

  const setState = (data = {}) => {
    _setState((state) => ({
      ...state,
      ...data,
    }));
  };

  useImperativeHandle(ref, () => ({
    show: () => {
      setState({
        show: true,
      });
    },
  }));

  const onOK = (ok) => () => {
    if (!ok) {
      setState({
        show: false,
      })
    }
  }

  const onUploadFile = (data = {}) => {
    props
      .onFileUpload({ file: data?.file?.originFileObj })
      .then((s) => {
        //call api get content file
        if (props.getFileData) {
          return props.getFileData({ fileName: s?.file })
        }
      })
      .then(data => {

        let newState = {
          selectedItem: data?.productImportDTOList?.map((item, index) => ({
            id: item?.productEntity?.id,
            key: index + 1,
          })),
          tyGia: data?.exchangeRate || 1,
          dsHangTien: data?.productImportDTOList?.map((item, index) => {
            let product = {};
            //amount
            if (item?.productEntity?.price == -1 || item?.productEntity?.totalQuantity == -1) {
              product = {
                ...product,
                amount: "",
                equivalentAmount: "",
              }
            }
            else {
              product = {
                ...product,
                amount: item?.productEntity?.price * item?.productEntity?.totalQuantity || 0,
                equivalentAmount: item?.productEntity?.price * item?.productEntity?.totalQuantity * data?.exchangeRate || 0,
              }
            }

            return ({
              ...product,
              key: index + 1,
              price: item?.productEntity?.price,
              quantity: item?.productEntity?.totalQuantity,
              listTaxes: [...item?.taxList?.map((i, index) => ({
                ...i,
                taxAccountId: props.dsTaiKhoanThue[0]?.id,
                taxAmount: 0,
              }))],
              description: item?.description || "",
              productName: item?.productEntity?.name || "",
              debtAccountId: item?.debtAccount?.id || props.dsTaiKhoanCongNo[0]?.id,
              from_date: item?.fromDate || new Date(),
              to_date: item?.toDate || new Date(),
              unit: item?.unit || "Cái",
              stockAccountId: item?.stockAccount?.id || props.dsTaiKhoanKho[0]?.id,
              productId: item?.productEntity?.id || "",
              amountAllocationCostIncurred:
                item?.amountAllocationCostIncurred || 0,
              amountAllocationServices:
                item?.amountAllocationServices || 0,
              errors: [...item?.errorDTOList],
            })
          }),
          currentItem: {
            invoiceDetail: {
              invoiceDate: data?.invoiceDate,
              invoiceNumber: data?.invoiceNumber,
            },
            refDate: data?.invoiceDate,
            exchangeRate: data?.exchangeRate || 1,
            currency: data?.currency || "VND",
            vendor: { ...(data?.vendorEntity || {}) }
          },
          internationalShipping: data?.internationalShipping,
          allocationType: ALLOCATION_TYPE.theoGia,
        };

        //phan bo chi phi
        let totalAmount = newState.dsHangTien?.reduce((acc, item, index) => {
          acc += item?.price;
          return acc;
        }, 0);
        newState.dsHangTien = newState.dsHangTien?.map(item => ({
          ...item,
          amountAllocationInternationalShipping: (item?.price / totalAmount) * newState.internationalShipping,
        }))

        //thue
        let dsHangTien = newState?.dsHangTien?.map((item, index) => {
          //tinh thue nhap khau = (amount + internalShipping) * taxRate;

          if (item.price < -1 || item.quantity < -1) {
            return {};
          }
          if (item?.price == -1 && item?.quantity == -1) {
            item.amount = -1;
            return item;
          }
          item.amount = item?.price * item?.quantity;
          const thueNKIndex = item.listTaxes?.findIndex(
            (item) => item.taxId === DS_ID_THUE.thueNKId
          );
          const thueGTGTIndex = item.listTaxes?.findIndex(
            (item) => item.taxId === DS_ID_THUE.thueGTGTId
          );
          const thueNK = item?.listTaxes[thueNKIndex] || {};
          const thueGTGT = item?.listTaxes[thueGTGTIndex] || {};

          thueNK.taxAmount = ((item?.amount + item?.amountAllocationInternationalShipping / (data?.exchangeRate || 1)) * (thueNK?.taxRate || 0)) / 100;
          thueGTGT.taxAmount =
            ((thueNK?.taxAmount + item?.amount) * (thueGTGT?.taxRate || 0)) / 100;
          item.listTaxes[thueGTGTIndex] = thueGTGT;
          item.listTaxes[thueNKIndex] = thueNK;
          return item;
        });
        newState.dsHangTien = dsHangTien || newState.dsHangTien;
        props.updateState(newState);
        setState({ show: false });
      })
      .catch((e) => {
        //TODO: notify mess
        setState({ show: false });
      })
  };

  return (
    <Main
      visible={state.show}
      style={{ maxWidth: 660 }}
      closable={false}
      centered
      onCancel={onOK(false)}
      footer={[null]}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <Spin spinning={props.isLoading}>
        <div className="modal-des">
          <h4 className="title-des">
            Import bằng file excel
          </h4>
          <div className="content-des">
            <div className="content">
              <Upload
                accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                style={{ display: "flex" }}
                multiple={false}
                onChange={onUploadFile}
              >
                <Button type="ghost" >
                  Upload file excel
              </Button>
              </Upload>
            </div>
          </div>
        </div>
        <div className="action-footer">
          <Button
            type="danger"
            style={{
              minWidth: 100,
            }}
            onClick={onOK(false)}
          >
            Đóng
            </Button>
        </div>
      </Spin>
    </Main>
  );
};

export default Form.create({})(
  connect((state) => ({
    isLoading: state.file.isLoading || false,
    dsHangTien: state.phieuMuaHang.dsHangTien || [],
    dsTaiKhoanThue: state.account.dsTaiKhoanThue || [],
    dsTaiKhoanKho: state.account.dsTaiKhoanKho || [],
    dsTaiKhoanCongNo: state.account.dsTaiKhoanCongNo || [],

  }),
    ({
      file: { onFileUpload },
      excelFile: { getFileData },
      phieuMuaHang: { updateState },
    }) => {
      return {
        onFileUpload,
        getFileData,
        updateState,
      };
    },
    null,
    { forwardRef: true }
  )(forwardRef(ModalLuaChonPhuongThucPhieuMuaHang))
);
