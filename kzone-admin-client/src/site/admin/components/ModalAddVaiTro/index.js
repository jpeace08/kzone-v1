import React, { useImperativeHandle, useState, forwardRef } from "react";
import { Main } from "./styled";
import { Button, Form, Input, Row, Col, Checkbox, Spin, Select } from "antd";
import { connect } from "react-redux";
const Option = Select.Option;

const ModalAddVaiTro = (props, ref) => {
  const { getFieldDecorator } = props.form;

  const [state, _setState] = useState({
    permissionIds: [],
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
        code: item?.code || "",
        name: item?.name || "",
        permissionIds: item?.permissionIds || [],
      });
      props.form.resetFields();
      props.quyenGetAll();
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
          if (!state.id)
            props
              .onCreate({
                role: {
                  name: state.name,
                  code: state.code,
                },
                permissions: state.permissionIds || [],
              })
              .then((s) => {
                setState({ show: false });
              });
          else
            props
              .onUpdate({
                id: state.id,
                department: {
                  name: state.name,
                },
                leaderId: 1,
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
      <Spin spinning={props.isLoadingCreate}>
        <div className="modal-des">
          <h4 className="title-des">
            {state.id ? "CH???NH S???A" : "TH??M M???I"} VAI TR??
          </h4>
          <div className="content-des">
            <Form onSubmit={handleSubmit}>
              <Form.Item label={"M?? vai tr??"}>
                {getFieldDecorator("code", {
                  rules: [
                    {
                      required: true,
                      message: "Vui l??ng nh???p m?? vai tr??!",
                    },
                    {
                      whitespace: true,
                      message: "Vui l??ng nh???p m?? vai tr??!",
                    },
                  ],
                  initialValue: state.code,
                })(
                  <Input
                    onChange={onChange("code")}
                    placeholder={"Nh???p m?? vai tr??"}
                  />
                )}
              </Form.Item>
              <Form.Item label={"T??n vai tr??"}>
                {getFieldDecorator("name", {
                  rules: [
                    {
                      required: true,
                      message: "Vui l??ng nh???p t??n vai tr??!",
                    },
                    {
                      whitespace: true,
                      message: "Vui l??ng nh???p t??n vai tr??!",
                    },
                  ],
                  initialValue: state.name,
                })(
                  <Input
                    onChange={onChange("name")}
                    placeholder={"Nh???p t??n vai tr??"}
                  />
                )}
              </Form.Item>
              <Form.Item label={"Quy???n"}>
                {getFieldDecorator("permission", {
                  rules: [
                    {
                      required: true,
                      message: "Vui l??ng ch???n quy???n!",
                    },
                  ],
                  initialValue: state.permissionIds,
                })(
                  <Select
                    onChange={onChange("permissionIds")}
                    placeholder={"Nh???p t??n vai tr??"}
                    mode="multiple"
                  >
                    {props.dsQuyen.map((item, index) => {
                      return (
                        <Option value={item.id} key={index}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Form>
          </div>
        </div>
        <div className="action-footer">
          {state.readOnly ? (
            <Button
              type="danger"
              style={{
                minWidth: 100,
              }}
              onClick={onOK(false)}
            >
              ????ng
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
                Hu???
              </Button>
              <Button
                type="primary"
                style={{
                  minWidth: 100,
                }}
                onClick={onOK(true)}
              >
                L??u
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
      isLoadingCreate: state.vaiTro.isLoadingCreate || false,
      dsQuyen: state.quyen.dsQuyen || [],
      // forms: state.form.forms || [],
    }),
    ({ vaiTro: { onCreate }, quyen: { getAll: quyenGetAll } }) => ({
      onCreate,
      quyenGetAll,
    }),
    null,
    { forwardRef: true }
  )(forwardRef(ModalAddVaiTro))
);
