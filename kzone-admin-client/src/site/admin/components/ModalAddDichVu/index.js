import React, {
  useImperativeHandle,
  useState,
  forwardRef,
  useEffect,
} from "react";
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
        description: item?.description || "",
        price: item?.price || "",
        serviceName: item?.serviceName || "",
        vendorId: item?.vendorForServices?.id,
        isReadOnly: isReadOnly,
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
          let payload = {
            description: state.description || "",
            price: state.price || "",
            serviceName: state.serviceName || "",
            vendorId: state.vendorId || "",
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
                ? "XEM TH??NG TIN"
                : "CH???NH S???A"
              : "TH??M M???I"}{" "}
            D???CH V???
          </h4>
          <div className="content-des">
            <Form onSubmit={handleSubmit}>
              <Row gutter={[6, 6]}>
                <Col span={12}>
                  <Form.Item label={"T??n d???ch v???"}>
                    {getFieldDecorator("serviceName", {
                      rules: [
                        {
                          required: true,
                          message: "Vui l??ng nh???p t??n d???ch v???!",
                        },
                        {
                          whitespace: true,
                          message: "Vui l??ng nh???p t??n d???ch v???!",
                        },
                      ],
                      initialValue: state.serviceName,
                    })(
                      <Input
                        disabled={state.isReadOnly}
                        onChange={onChange("serviceName")}
                        placeholder={"Nh???p t??n d???ch v???"}
                      />
                    )}
                  </Form.Item>
                </Col>{" "}
                <Col span={12}>
                  <Form.Item label={"Gi?? d???ch v???"}>
                    {getFieldDecorator("price", {
                      rules: [
                        {
                          required: true,
                          message: "Vui l??ng nh???p gi?? d???ch v???!!",
                        },
                      ],
                      initialValue: state.price,
                    })(
                      <InputNumber
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        min={0}
                        maxLength={12}
                        style={{ width: "100%" }}
                        disabled={state.isReadOnly}
                        onChange={onChange("price")}
                        placeholder={"Nh???p gi?? d???ch v???"}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[6, 6]}>
                <Col span={12}>
                  <Form.Item label={"M?? t???"}>
                    {getFieldDecorator("description", {
                      rules: [
                        {
                          required: true,
                          message: "Vui l??ng nh???p m?? t???!",
                        },
                        {
                          whitespace: true,
                          message: "Vui l??ng nh???p m?? t???!",
                        },
                      ],
                      initialValue: state.description,
                    })(
                      <Input
                        disabled={state.isReadOnly}
                        onChange={onChange("description")}
                        placeholder={"Nh???p m?? t???"}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={"Nh?? cung c???p"}>
                    {getFieldDecorator("vendorId", {
                      rules: [
                        {
                          required: true,
                          message: "Vui l??ng ch???n ch???n nh?? cung c???p!",
                        },
                      ],
                      initialValue: state.vendorId,
                    })(
                      <Select
                        disabled={state.isReadOnly}
                        placeholder="T??m ki???m nh?? cung c???p"
                        onChange={onChange("vendorId")}
                        showSearch
                        filterOption={props.filterOption}
                      >
                        {props.dsNCC?.map((ncc, index) => (
                          <Select.Option key={index} value={ncc.id}>
                            {ncc.name}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
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
              ????ng
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
                Hu???
              </Button>
              <Button
                type="primary"
                style={{
                  minWidth: 100,
                }}
                onClick={onSave(true)}
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
      isLoadingCreate: state.dichVu.isLoadingCreate || false,
      dsNCC: state.nhaCungCap.dsAllNhaCungCap || [],
    }),
    ({ dichVu: { onCreate, onUpdate } }) => ({
      onCreate,
      onUpdate,
    }),
    null,
    { forwardRef: true }
  )(forwardRef(ModalAddKho))
);
