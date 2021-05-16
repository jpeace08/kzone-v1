import React, {
  useImperativeHandle,
  useState,
  forwardRef,
  useMemo,
  useEffect,
} from "react";
import { Button, Form, Input, Spin } from "antd";
import { connect } from "react-redux";
import { Main } from "./styled";

const ModalUpdatePhieuChi = (props, ref) => {
  const {
    form: { getFieldDecorator },
  } = props;

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
        productId: item?.id || "",
        receiver: "",
        reason: "",
      });
      props.form.resetFields();
    },
  }));

  const handleSubmit = () => { };

  const onChange = (type) => (e) => {
    setState({
      [type]: e && e.target ? e.target.value : e,
    });
  };

  const onOK = (ok) => () => {
    if (ok) {
      props.form.validateFields((errors, values) => {
        if (!errors) {
          if (state.id)
            props
              .onUpdate({
                id: state.id,
                body: {
                  receiver: state.receiver,
                  reason: state.reason,
                },
              })
              .then((s) => {
                setState({ show: false });
              })
              .catch((e) => {
                setState({ show: false });
              });
        }
      });
    } else setState({ show: false });
  };

  useEffect(() => {
    if (state.productId !== undefined && state.productId != "") {
      props.getPaymentVoucher({ id: state.productId });
    }
  }, [state.productId]);

  useEffect(() => {
    const item = props.currentItem || null;
    setState({
      id: item?.id || "",
      receiver: item?.receiver || "",
      reason: item?.reason || "",
    });
  }, [props.currentItem]);

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
            {state.id ? "CHỈNH SỬA" : "THÊM MỚI"} TRẠNG THÁI THANH TOÁN
          </h4>
          <div className="content-des">
            <Form onSubmit={handleSubmit}>
              <Form.Item label={"Tên người nhận"}>
                {getFieldDecorator("receiver", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng nhập tên người nhận!",
                    },
                    {
                      whitespace: true,
                      message: "Vui lòng nhập tên người nhận!",
                    },
                  ],
                  initialValue: state.receiver,
                })(
                  <Input
                    onChange={onChange("receiver")}
                    placeholder={"Tên người nhận"}
                  />
                )}
              </Form.Item>
              <Form.Item label={"Lý do chi"}>
                {getFieldDecorator("reason", {
                  rules: [],
                  initialValue: state.reason,
                })(
                  <Input
                    onChange={onChange("reason")}
                    placeholder={"Lý do chi"}
                  />
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
};

export default Form.create({})(
  connect(
    (state) => ({
      isLoadingCreate: state.phieuChi.isLoadingCreate || false,
      currentItem: state.phieuChi.currentItem,
    }),
    ({ phieuMuaHang: { }, phieuChi: { getPaymentVoucher, onUpdate } }) => ({
      onUpdate,
      getPaymentVoucher,
    }),
    null,
    { forwardRef: true }
  )(forwardRef(ModalUpdatePhieuChi))
);
