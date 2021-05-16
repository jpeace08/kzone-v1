import React, { useImperativeHandle, useState, forwardRef, useMemo, useEffect, useRef } from "react";
import { Main } from "./styled";
import { Table, Pagination } from "site/admin/components/common";
import { Button, Form, Input, Checkbox, Spin, message } from "antd";
import { connect } from "react-redux";


const ModalAddServiceToInwardSlip = (props, ref) => {
  const refTimeOut = useRef(null);
  const phieuDichVuIds = useMemo(() => props.dsPhieuMuaDichVu?.map(item => item?.id), [props.dsPhieuMuaDichVu]);
  // const { getFieldDecorator } = props.form;
  const [state, _setState] = useState({
    selectedItemId: [],
    selectedItem: [],
    amount: 0
  });

  const setState = (data = {}) => {
    _setState((state) => {
      return { ...state, ...data };
    });
  };
  useImperativeHandle(ref, () => ({
    show: (item = {}) => {
      setState({
        show: true,
        id: item?.id,
        selectedItemId: [],
        selectedItem: [],
        amount: 0
      });
      props.form.resetFields();
    },
  }));
  const handleSubmit = () => { };


  const onSave = (ok) => () => {
    if (ok) {
      if (state.selectedItemId.length != 0) {
        if (state.id !== undefined)
          props
            .onAddServiceToInwardSlip({
              id: state.id,
              idService: [...state.selectedItemId],
            })
            .then((s) => {
              setState({ show: false });
            });
        // setState({ show: false });
      }
      else {
        message.error("Chọn ít nhất 1 chứng từ mua dịch vụ");
        return;
      }
    } else setState({ show: false });
  };

  const onChangeSearch = (e) => {
    if (refTimeOut.current) {
      clearTimeout(refTimeOut.current);
      refTimeOut.current = null;
    }
    refTimeOut.current = setTimeout(
      (value) => {
        props.getServiceVoucherUnAssigned({
          serviceNumber: value,
        });
      },
      300,
      e.target.value
    );
  };


  const onChangePage = (page) => {
    props.getServiceVoucherUnAssigned({ page: page });
  }
  const onChangeSize = (size) => {
    props.getServiceVoucherUnAssigned({ size: size });
  }

  useEffect(() => {
    if (props.getServiceVoucherUnAssigned) {
      props.getServiceVoucherUnAssigned({ size: 10 });
    }
  }, [state.id]);


  const onChangeCheckBox = (value) => (e) => {

    const index = state.selectedItemId.indexOf(value.id);
    if (index != -1) {
      state.selectedItem.splice(index, 1);
      state.selectedItemId.splice(index, 1);
      setState({
        selectedItem: [...state.selectedItem],
        selectedItemId: [...state.selectedItemId],
        amount: state.amount - value.totalPayment
      });
    } else {
      setState({
        selectedItem: [...state.selectedItem, value],
        selectedItemId: [...state.selectedItemId, value.id],
        amount: state.amount + value.totalPayment
      });
    }
  };
  const onChangeCheckBoxAll = (e) => {
    if (!e.target.checked) {
      setState({
        selectedItemId: state.selectedItemId.filter(
          (item, index) => !phieuDichVuIds.includes(item)
        ),
      });
    } else {
      setState({
        selectedItemId: [...state.selectedItemId, ...phieuDichVuIds].filter(
          (item, i, self) => item && self.indexOf(item) === i
        ),
      });
    }
  };
  return (
    <Main
      visible={state.show}
      style={{ width: 1000 }}
      closable={false}
      centered
      onCancel={onSave(false)}
      footer={[null]}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <Spin spinning={props.isLoading}>
        <div className="modal-des">
          <h4 className="title-des">
            THÊM DỊCH VỤ CHO PHIẾU MUA SẢN PHẨM
          </h4>
          <div className="content-des">
            <Table
              // style={{ with: "660p" }}
              scroll={{ x: 50, y: 400 }}
              className="custom"
              dataSource={props.dsPhieuMuaDichVu}
              columns={[
                {
                  title: (
                    <div className="custome-header">
                      <div className="title-box">
                        Mã phiếu dịch vụ
                        </div>
                      <div className="addition-box">
                        <Input.Search
                          onChange={onChangeSearch}
                        />
                      </div>
                    </div>
                  ),
                  width: 250,
                  key: 'col1',
                  dataIndex: 'serviceNumber',
                  align: "center",
                },
                {
                  title: (
                    <div className="custome-header">
                      <div className="title-box">
                        Tổng tiền thanh toán
                        </div>
                      <div className="addition-box" style={{ color: "blue" }}>
                        {state.amount}
                      </div>
                    </div>
                  ),
                  width: 250,
                  key: 'col1',
                  dataIndex: 'totalPayment',
                  align: "center",
                },
                {
                  title: (
                    <div className="custome-header">
                      <div className="title-box">Lựa chọn</div>
                      <div className="addition-box">
                        <Checkbox
                          onChange={onChangeCheckBoxAll}
                          checked={
                            phieuDichVuIds.length
                            && phieuDichVuIds.every(item => state.selectedItemId?.includes(item))
                          }
                        />
                      </div>
                    </div>
                  ),
                  width: 150,
                  key: 'col2',
                  dataIndex: 'id',
                  align: "center",
                  fixed: "right",
                  render: (value, row, index) => {
                    return (
                      <Checkbox
                        onChange={onChangeCheckBox(row)}
                        checked={state.selectedItemId.includes(value)}
                      />
                    )
                  }
                }
              ]}
            />
            <div className="footer">
              {props.total > 0 && <Pagination
                onPageChange={onChangePage}
                onChangeSize={onChangeSize}
                page={props.page}
                size={props.size}
                total={props.total}
                style={{ flex: 1, justifyContent: "flex-end" }}
              />}
            </div>
          </div>
        </div>
        <div className="action-footer">
          <Button
            type="danger"
            style={{ minWidth: 100 }}
            onClick={onSave(false)}
          >
            Huỷ
          </Button>
          <Button
            type="primary"
            style={{ minWidth: 100 }}
            onClick={onSave(true)}
          >
            Lưu
          </Button>
        </div>
      </Spin>
    </Main>
  );
};

export default Form.create({})(
  connect(
    (state) => ({
      isLoadingCreate: state.phieuMuaHang.isLoadingCreate || false,
      isLoading: state.phieuMuaDichVu.isLoading || false,
      dsPhieuMuaDichVu: state.phieuMuaDichVu.dsPhieuMuaDichVu || [],
      page: state.phieuMuaDichVu.page || 1,
      size: state.phieuMuaDichVu.size || 2,
      total: state.phieuMuaDichVu.totalElements || 0,
    }),
    ({
      phieuMuaDichVu: {
        getServiceVoucherUnAssigned,
      },
      phieuMuaHang: {
        onAddServiceToInwardSlip,
      }
    }) => ({
      getServiceVoucherUnAssigned,
      onAddServiceToInwardSlip,
    }),
    null,
    { forwardRef: true }
  )(forwardRef(ModalAddServiceToInwardSlip))
);
