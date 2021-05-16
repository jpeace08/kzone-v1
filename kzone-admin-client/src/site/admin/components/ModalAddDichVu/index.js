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
                ? "XEM THÔNG TIN"
                : "CHỈNH SỬA"
              : "THÊM MỚI"}{" "}
            DỊCH VỤ
          </h4>
          <div className="content-des">
            <Form onSubmit={handleSubmit}>
              <Row gutter={[6, 6]}>
                <Col span={12}>
                  <Form.Item label={"Tên dịch vụ"}>
                    {getFieldDecorator("serviceName", {
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập tên dịch vụ!",
                        },
                        {
                          whitespace: true,
                          message: "Vui lòng nhập tên dịch vụ!",
                        },
                      ],
                      initialValue: state.serviceName,
                    })(
                      <Input
                        disabled={state.isReadOnly}
                        onChange={onChange("serviceName")}
                        placeholder={"Nhập tên dịch vụ"}
                      />
                    )}
                  </Form.Item>
                </Col>{" "}
                <Col span={12}>
                  <Form.Item label={"Giá dịch vụ"}>
                    {getFieldDecorator("price", {
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập giá dịch vụ!!",
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
                        placeholder={"Nhập giá dịch vụ"}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[6, 6]}>
                <Col span={12}>
                  <Form.Item label={"Mô tả"}>
                    {getFieldDecorator("description", {
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập mô tả!",
                        },
                        {
                          whitespace: true,
                          message: "Vui lòng nhập mô tả!",
                        },
                      ],
                      initialValue: state.description,
                    })(
                      <Input
                        disabled={state.isReadOnly}
                        onChange={onChange("description")}
                        placeholder={"Nhập mô tả"}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={"Nhà cung cấp"}>
                    {getFieldDecorator("vendorId", {
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng chọn chọn nhà cung cấp!",
                        },
                      ],
                      initialValue: state.vendorId,
                    })(
                      <Select
                        disabled={state.isReadOnly}
                        placeholder="Tìm kiếm nhà cung cấp"
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
