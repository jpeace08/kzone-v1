import React, { useImperativeHandle, useState, forwardRef } from "react";
import { Main } from "./styled";
import {
  Button,
  Form,
  Input,
  Spin,
  message,
} from "antd";
import { connect } from "react-redux";

const ModalAddLoaiChietKhau = (props, ref) => {
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
        id: item.id || "",
        name: item?.name || "",
      });
      props.form.resetFields();
    },
  }));

  const handleSubmit = () => { };

  const onChange = (type) => (e) => {
    setState({
      [type]: e?.hasOwnProperty("target")
        ? e.target.value
        : e?.hasOwnProperty("_d")
          ? e._d
          : e,
    });
  };
  const onSave = (ok) => () => {
    if (ok) {
      props.form.validateFields((errors, values) => {
        if (!errors) {
          if (state.name == "") {
            message.error("Vui lòng nhập tên chiết khấu!");
            return;
          }
          let payload = {
            name: state.name,
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
            CHIẾT KHẤU
          </h4>
          <div className="content-des">
            <Form onSubmit={handleSubmit}>
              <Form.Item label={"Tên chiết khấu"}>
                {getFieldDecorator("name", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng nhập tên chiết khấu!",
                    },
                    {
                      whitespace: true,
                      message: "Vui lòng nhập chiết khấu!",
                    },
                  ],
                  initialValue: state.name,
                })(
                  <Input
                    disabled={state.isReadOnly}
                    onChange={onChange("name")}
                    placeholder={"Nhập tên chiết khấu"}
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
      isLoadingCreate: state.loaiChietKhau.isLoadingCreate || false,
    }),
    ({
      loaiChietKhau: { onCreate, onUpdate }
    }) => ({
      onCreate,
      onUpdate,
    }),
    null,
    { forwardRef: true }
  )(forwardRef(ModalAddLoaiChietKhau))
);
