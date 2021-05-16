import React, { useImperativeHandle, useState, forwardRef } from "react";
import { Main } from "./styled";
import { Button, Form, Input, Spin, Select } from "antd";
import { connect } from "react-redux";

const ModalChangePassword = (props, ref) => {
  const { getFieldDecorator } = props.form;

  const [state, _setState] = useState({});
  const setState = (data = {}) => {
    _setState((state) => {
      return { ...state, ...data };
    });
  };
  useImperativeHandle(ref, () => ({
    show: (item = {}) => {
      setState({
        show: true,
        passwordNew: "",
        passwordOld: "",
      });
      props.form.resetFields();
    },
  }));

  const handleSubmit = () => { };

  const onChange = (type) => (e) => {
    setState({
      [type]: e?.hasOwnProperty("target") ? e.target.value : e,
    });
  };
  const onOK = (ok) => () => {
    if (ok) {
      props.form.validateFields((errors, values) => {
        if (!errors) {
          let payload = {
            passwordNew: state.passwordNew,
            passwordOld: state.passwordOld
          }
          props
            .onUpdatePassword({
              id: props.auth.id,
              payload
            })
            .then((s) => {
              setState({ show: false });
            });
          // setState({ show: false });
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
      onCancel={onOK(false)}
      footer={[null]}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <Spin spinning={props.isLoading}>
        <div className="modal-des">
          <h4 className="title-des">
            THAY ĐỔI MẬT KHẨU
          </h4>
          <div className="content-des">
            <Form onSubmit={handleSubmit}>
              <Form.Item label={"Mật khẩu hiện tại"}>
                {getFieldDecorator("passwordOld", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng nhập mật khẩu hiện tại!",
                    },
                    {
                      whitespace: true,
                      message: "Vui lòng nhập mật khẩu hiện tại!",
                    },
                  ],
                  initialValue: state.passwordOld,
                })(
                  <Input
                    type="password"

                    onChange={onChange("passwordOld")}
                    placeholder={"Nhập mật khẩu hiện tại"}
                  />
                )}
              </Form.Item>
              <Form.Item label={"Mật khẩu mới"}>
                {getFieldDecorator("passwordNew", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng nhập mật khẩu mới!",
                    },
                    {
                      whitespace: true,
                      message: "Vui lòng nhập mật khẩu mới!",
                    },
                  ],
                  initialValue: state.passwordNew,
                })(
                  <Input
                    type="password"
                    onChange={onChange("passwordNew")}
                    placeholder={"Nhập mật khẩu mới"}
                  />
                )}
              </Form.Item>
              <Form.Item label={"Nhập lại mật khẩu mới"}>
                {getFieldDecorator("passwordNewAgain", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng nhập lại mật khẩu mới!",
                    },
                    {
                      whitespace: true,
                      message: "Vui lòng nhập lại mật khẩu mới!",
                    },
                    {
                      validator: (rule, value, callback) => {
                        if (value && value !== state.passwordNew) {
                          callback("Mật khẩu nhập lại không khớp!");
                        } else {
                          callback();
                        }
                      }
                    }
                  ],
                })(
                  <Input
                    type="password"
                    onChange={onChange("passwordNewAgain")}
                    placeholder={"Nhập lại mật khẩu mới"}
                  />
                )}
              </Form.Item>
            </Form>
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
        </div>
      </Spin>
    </Main>
  );
};

export default Form.create({})(
  connect(
    (state) => ({
      isLoading: state.nhanVien.isLoading || false,
      auth: state.auth.auth,
      // forms: state.form.forms || [],
    }),
    ({ nhanVien: { onUpdatePassword } }) => ({
      onUpdatePassword,
    }),
    null,
    { forwardRef: true }
  )(forwardRef(ModalChangePassword))
);
