import React, { useImperativeHandle, useState, forwardRef } from "react";
import { Main } from "./styled";
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  Checkbox,
  Spin,
  Select,
  message,
  InputNumber,
} from "antd";
import { connect } from "react-redux";

const ModalAddKho = (props, ref) => {
  const { getFieldDecorator } = props.form;
  const [state, _setState] = useState({});
  const setState = (data = {}) => {
    _setState((state) => {
      return { ...state, ...data };
    });
  };
  useImperativeHandle(ref, () => ({
    show: (item = {}, isReadOnly) => {
      setState({
        show: true,
        id: item?.id || "",
        warehouseName: item?.warehouseName || "",
        warehouseLocation: item?.warehouseLocation || "",
        capacity: item?.capacity || "",
        isReadOnly: isReadOnly,
      });
      props.form.resetFields();
    },
  }));

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave(true)
  };

  const onChange = (type) => (e) => {
    setState({
      [type]: e && e.target ? e.target.value : e,
    });
  };
  const onSave = (ok) => () => {
    if (ok) {
      props.form.validateFields((errors, values) => {
        if (!errors) {
          let payload = {
            warehouseName: state.warehouseName || "",
            warehouseLocation: state.warehouseLocation || "",
            capacity: state.capacity || "",
          };
          if (payload.capacity <= 0) {
            message.success("Vui lòng nhập sức chứa kho hợp lệ!");
            return;
          }
          if (!state.id)
            props.onCreate(payload).then((s) => {
              setState({ show: false });
            });
          else
            props
              .onUpdate({
                id: state.id,
                ...payload,
              })
              .then((s) => {
                setState({ show: false });
              });
        }
      });
    } else setState({ show: false });
  };
  return (
    <Main
      visible={state.show}
      style={{ maxWidth: 520 }}
      closable={false}
      centered
      onCancel={onSave(false)}
      footer={[null]}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <Spin spinning={props.isLoadingCreate}>
        <div className="modal-des">
          <h4 className="title-des">
            {state.id
              ? state.isReadOnly
                ? "XEM THÔNG TIN"
                : "CHỈNH SỬA"
              : "THÊM MỚI"}{" "}
            KHO
          </h4>
          <div className="content-des">
            <Form onSubmit={handleSubmit}>
              <Form.Item label={"Tên kho"}>
                {getFieldDecorator("warehouseName", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng nhập tên kho!",
                    },
                    {
                      whitespace: true,
                      message: "Vui lòng nhập tên kho!",
                    },
                  ],
                  initialValue: state.warehouseName,
                })(
                  <Input
                    disabled={state.isReadOnly}
                    onChange={onChange("warehouseName")}
                    placeholder={"Nhập tên kho"}
                  />
                )}
              </Form.Item>
              <Form.Item label={"Vị trí kho"}>
                {getFieldDecorator("warehouseLocation", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng nhập vị trí kho!",
                    },
                    {
                      whitespace: true,
                      message: "Vui lòng nhập vị trí kho!",
                    },
                  ],
                  initialValue: state.warehouseLocation,
                })(
                  <Input
                    disabled={state.isReadOnly}
                    onChange={onChange("warehouseLocation")}
                    placeholder={"Nhập vị trí kho"}
                  />
                )}
              </Form.Item>
              <Form.Item label={"Sức chứa"}>
                {getFieldDecorator("capacity", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng nhập sức chứa!",
                    },
                  ],
                  initialValue: state.capacity,
                })(
                  <InputNumber
                    style={{ width: "100%" }}
                    min={1}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    maxLength={9}
                    disabled={state.isReadOnly}
                    onChange={onChange("capacity")}
                    placeholder={"Nhập sức chứa"}
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
              onClick={onSave(false)}
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
                onClick={onSave(false)}
              >
                Huỷ
              </Button>
              <Button
                type="primary"
                style={{
                  minWidth: 100,
                }}
                onClick={onSave(true)}
              >
                Lưu
              </Button>
            </>
          )}
        </div>
      </Spin>
    </Main>
  );
};

export default Form.create({})(
  connect(
    (state) => ({
      isLoadingCreate: state.kiemKho.isLoadingCreate || false,
    }),
    ({ kiemKho: { onCreate, onUpdate } }) => ({
      onCreate,
      onUpdate,
    }),
    null,
    { forwardRef: true }
  )(forwardRef(ModalAddKho))
);
