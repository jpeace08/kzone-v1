import React, { useImperativeHandle, useState, forwardRef } from "react";
import { Main } from "./styled";
import { Button, Form, Spin, DatePicker } from "antd";
import { connect } from "react-redux";
import moment from "moment";

const ModalEditChiTietHangHoa = (props, ref) => {
  const {
    isLoadingCreate,
    updateHangHoaChiTiet,
    form: {
      getFieldDecorator,
    }
  } = props;

  const [state, _setState] = useState({});

  const setState = (data = {}) => {
    _setState((state) => ({
      ...state,
      ...data,
    }));
  }

  useImperativeHandle(ref, () => ({
    show: (item = {}, isReadOnly, idParentProduct) => {
      setState({
        show: true,
        id: item?.id,
        idParentProduct,
        barcode: item?.barcode || "",
        price: item?.price || "",
        fromDate: item?.fromDate || new Date(),
        toDate: item?.toDate || new Date(),
        quantity: item?.quantity || 0,
        status: item?.status || 0,
        productId: item?.product?.id,
        isReadOnly: isReadOnly || false,
      });
      props.form.resetFields();
    }
  }));

  const onChange = (type) => (e) => {
    setState({
      [type]: e?.hasOwnProperty("target")
        ? e.target.value
        : e?.hasOwnProperty("_d")
          ? moment(e._d).format("YYYY-MM-DD HH:mm:ss")
          : e
    });
  };

  const handleSubmit = e => {
    e.preventDefaults();
  }

  const onOK = (ok) => () => {
    if (ok) {
      props.form.validateFields((errors, values) => {
        if (!errors) {
          const payload = {
            barcode: state.barcode || 0,
            // price: state.price || 0,
            fromDate: moment(state.fromDate).format("YYYY-MM-DD HH:mm:ss"),
            toDate: moment(state.toDate).format("YYYY-MM-DD HH:mm:ss"),
            // quantity: state.quantity || 0,
            // status: state.status || 0,
            // productId: state.productId,
          };
          if (state.id == null || state.id == undefined)
            return;
          else
            //TODO: update product detail
            updateHangHoaChiTiet({ idParentProduct: state.idParentProduct, id: state.id, ...payload })
              .then((s) => {
                setState({ show: false });
              })
              .catch(e => {
                setState({ show: false, })
              });
        }
      });
    } else setState({ show: false });
  };

  return (
    <Main
      visible={state.show}
      style={{ maxWidth: 660 }}
      closable={false}
      centered
      onCancel={onOK(false)}
      footer={[null]}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <Spin spinning={isLoadingCreate}>
        <div className="modal-des">
          <h4 className="title-des">
            {state.id
              ? state.isReadOnly
                ? "THÔNG TIN"
                : "CHỈNH SỬA"
              : "THÊM MỚI"
            } HÀNG HÓA
          </h4>
          <div className="content-des">
            <Form onSubmit={handleSubmit}>
              {/* <Form.Item label={"Mã vạch"}>
                {getFieldDecorator("barcode", {
                  rules: [
                    {
                      required: true,
                    },
                  ],
                  initialValue: state.barcode,
                })(
                  <Input
                    disabled={state.isReadOnly}
                    onChange={onChange("barcode")}
                  />
                )}
              </Form.Item>
              <Form.Item label={"Price"}>
                {getFieldDecorator("price", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng giá sản phẩm!",
                    },
                  ],
                  initialValue: state.price,
                })(
                  <Input
                    disabled={state.isReadOnly}
                    onChange={onChange("price")}
                  />
                )}
              </Form.Item>
              <Form.Item label={"Số lượng"}>
                {getFieldDecorator("quantity", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng nhập số lượng!",
                    },
                  ],
                  initialValue: state.quantity,
                })(
                  <Input
                    disabled={state.isReadOnly}
                    onChange={onChange("quantity")}
                    placeholder={"Nhập số lượng"}
                  />
                )}
              </Form.Item>
              <Form.Item label={"Trạng thái"}>
                {getFieldDecorator("status", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng chọn trạng thái sản phẩm!",
                    },
                  ],
                  initialValue: state.status,
                })(
                  <Select
                    onChange={onChange("status")}
                  >
                    <Option key={1} value={STATUS_GOODS.hangDaVe}>Hàng đã về</Option>
                    <Option key={2} value={STATUS_GOODS.hangDangVe}>Hàng chưa về</Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item label={"Sản phẩm"}>
                {getFieldDecorator("productId", {
                  rules: [
                    {
                      required: true,
                    },
                  ],
                  initialValue: state.productId,
                })(
                  <Select
                    onChange={onChange("productId")}
                  >
                    {dsHangHoa?.map((item, index) => (
                      <Option key={index} value={item.id} >{item.name}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item> */}
              <Form.Item label={"Ngày sản xuất"}>
                {getFieldDecorator("fromDate", {
                  rules: [
                  ],
                  initialValue: moment(state.fromDate),
                })(
                  <DatePicker
                    format="DD /MM/ YYYY"
                    showTime
                    disabled={state.isReadOnly}
                    onChange={onChange("fromDate")}
                  />
                )}
              </Form.Item>
              <Form.Item label={"Hạn sử dụng"}>
                {getFieldDecorator("toDate", {
                  rules: [
                  ],
                  initialValue: moment(state.toDate),
                })(
                  <DatePicker
                    format="DD /MM/ YYYY"
                    showTime
                    disabled={state.isReadOnly}
                    onChange={onChange("toDate")}
                  />
                )}
              </Form.Item>
            </Form>
          </div>
        </div>
        <div className="action-footer">
          {state.isReadOnly ? (
            <Button
              type="danger"
              style={{
                minWidth: 100,
              }}
              onClick={onOK(false)}
            >
              Đóng
            </Button>
          ) : (
            <>
              <Button
                type="danger"
                style={{
                  minWidth: 100,
                }}
                onClick={onOK(false)}
              >
                Huỷ
              </Button>
              <Button
                type="primary"
                style={{
                  minWidth: 100,
                }}
                onClick={onOK(true)}
              >
                Lưu
              </Button>
            </>
          )}
        </div>
      </Spin>
    </Main>
  );
}

export default Form.create({})(
  connect((state) => ({
    dsHangHoa: state.hangHoa.dsHangHoa,
    isLoadingCreate: state.hangHoa.isLoadingCreate || false,
  }),
    ({
      hangHoaChiTiet: {
        onUpdate: updateHangHoaChiTiet,
      }
    }) => ({
      updateHangHoaChiTiet,
    }),
    null,
    { forwardRef: true }
  )(forwardRef(ModalEditChiTietHangHoa))
);