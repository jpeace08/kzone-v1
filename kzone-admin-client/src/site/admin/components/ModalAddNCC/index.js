import React, { useImperativeHandle, useState, forwardRef } from "react";
import { Main } from "./styled";
import { Button, Form, Input, Row, Col, Checkbox, Spin, Select, message } from "antd";
import { connect } from "react-redux";

const ModalAddNCC = (props, ref) => {
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
        name: item?.name || "",
        email: item?.email || "",
        address: item?.address || "",
        phone: item?.phone || "",
        taxCode: item?.taxCode || "",
        isReadOnly: isReadOnly,
      });
      props.form.resetFields();
    },
  }));

  const handleSubmit = () => { };

  const onChange = (type) => (e) => {
    setState({
      [type]: e.target.value,
    });
  };
  const onChangeTaxCode = (type) => (e) => {
    setState({
      [type]: parseInt(e.target.value),
    });
  };

  const validatePhoneNumber = (rule, value, callback) => {
    if (value && !value?.isPhoneNumber()) {
      callback("Vui lòng nhập đúng số điện thoại!");
    } else {
      callback();
    }
  };

  const onSave = (ok) => () => {
    if (ok) {
      props.form.validateFields((errors, values) => {
        if (!errors) {
          let index = props.dsNCC.findIndex(item => item.taxCode == state.taxCode);
          if (index != -1) {
            message.error("Mã số thuế đã tồn tại. Vui lòng nhập lại!");
            return;
          } else {
            let payload = {
              email: state.email,
              address: state.address,
              name: state.name,
              phone: state.phone,
              taxCode: state.taxCode,
            };
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
            NHÀ CUNG CẤP
          </h4>
          <div className="content-des">
            <Form onSubmit={handleSubmit}>
              <Form.Item label={"Tên nhà cung cấp"}>
                {getFieldDecorator("name", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng nhập tên nhà cung cấp!",
                    },
                    {
                      whitespace: true,
                      message: "Vui lòng nhập tên nhà cung cấp!",
                    },
                  ],
                  initialValue: state.name,
                })(
                  <Input
                    disabled={state.isReadOnly}
                    onChange={onChange("name")}
                    placeholder={"Nhập tên nhà cung cấp"}
                  />
                )}
              </Form.Item>
              <Form.Item label={"Địa chỉ"}>
                {getFieldDecorator("address", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng nhập địa chỉ!",
                    },
                    {
                      whitespace: true,
                      message: "Vui lòng nhập địa chỉ!",
                    },
                  ],
                  initialValue: state.address,
                })(
                  <Input
                    disabled={state.isReadOnly}
                    onChange={onChange("address")}
                    placeholder={"Nhập địa chỉ"}
                  />
                )}
              </Form.Item>
              <Form.Item label={"Số điện thoại"}>
                {getFieldDecorator("phone", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng nhập số điện thoại!",
                    },
                    {
                      validator: validatePhoneNumber,
                    },
                    {
                      max: 10,
                      message: "Vui lòng nhập đúng định dạng số điện thoại 10 chữ số"
                    },
                    {
                      min: 10,
                      message:
                        "Vui lòng nhập đúng định dạng số điện thoại 10 chữ số",
                    },
                  ],
                  initialValue: state.phone,
                })(
                  <Input
                    disabled={state.isReadOnly}
                    onChange={onChange("phone")}
                    placeholder={"Nhập số điện thoại"}
                  />
                )}
              </Form.Item>
              <Form.Item label={"Email"}>
                {getFieldDecorator("email", {
                  rules: [
                    {
                      required: true,
                      type: "email",
                      message: "Vui lòng nhập đúng định dạng email!",
                    },
                  ],
                  initialValue: state.email,
                })(
                  <Input
                    disabled={state.isReadOnly}
                    onChange={onChange("email")}
                    placeholder={"Nhập email"}
                  />
                )}
              </Form.Item>
              <Form.Item label={"Mã số thuế"}>
                {getFieldDecorator("taxCode", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng nhập mã số thuế!",
                    },
                  ],
                  initialValue: state.taxCode,
                })(
                  <Input
                    disabled={state.isReadOnly}
                    onChange={onChangeTaxCode("taxCode")}
                    placeholder={"Nhập mã số thuế"}
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
      isLoadingCreate: state.nhaCungCap.isLoadingCreate || false,
      dsNCC: state.nhaCungCap.dsNCC || []
      // forms: state.form.forms || [],
    }),
    ({ nhaCungCap: { onCreate, onUpdate } }) => ({
      onCreate,
      onUpdate,
      // getAllForm,
    }),
    null,
    { forwardRef: true }
  )(forwardRef(ModalAddNCC))
);
