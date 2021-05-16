import React, { useImperativeHandle, useState, forwardRef, useEffect } from "react";
import { Main } from "./styled";
import {
  Button,
  Form,
  InputNumber,
  Spin,
  Select,
  message,
} from "antd";
import { connect } from "react-redux";

const { Option } = Select;

const ModalAddChietKhauNhanVien = (props, ref) => {
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
        idEmployee: item?.employee?.id || "",
        discountRate: item?.discountRate || "",
        idDiscountEmployeeType: item?.discountEmployeeType?.id || "",
        amountInvoiceDiscount: item?.amountInvoiceDiscount || "",
        isReadOnly: isReadOnly,
      });
      props.form.resetFields();
    },
  }));

  const handleSubmit = () => { };

  const filterOption = (input, option) => {
    return (
      (option.props.name || option.props.children)
        ?.toLowerCase()
        .createUniqueText()
        .indexOf(input.toLowerCase().createUniqueText()) >= 0
    );
  };

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
            amountInvoiceDiscount: state.amountInvoiceDiscount,
            discountRate: state.discountRate,
            idDiscountEmployeeType: state.idDiscountEmployeeType,
            idEmployee: state.idEmployee,
          };
          if (state.id == "") {
            props.onCreate(payload).then((s) => {
              setState({ show: false });
            });
          }
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

  useEffect(() => {
    props.getAllLoaiChietKhau();
    props.onSearchNhanVien({ dataSearch: { size: 99999 } });
  }, []);

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
            CHIẾT KHẤU NHÂN VIÊN
          </h4>
          <div className="content-des">
            <Form onSubmit={handleSubmit}>
              <Form.Item label={"Tên nhân viên"}>
                {getFieldDecorator("idEmployee", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng chọn nhân viên!",
                    },
                  ],
                  initialValue: state.idEmployee,
                })(
                  <Select
                    showSearch
                    disabled={state.id != "" || state.isReadOnly || false}
                    optionFilterProp="name"
                    onSelect={onChange("idEmployee")}
                    filterOption={filterOption}
                    placeholder="Tìm kiếm nhân viên"
                  >
                    {props.dsNhanVien?.map((item, index) => (
                      <Option
                        key={index}
                        value={item?.id}
                      >
                        {item?.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label={"Loại chiết khấu"}>
                {getFieldDecorator("idDiscountEmployeeType", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng chọn loại chiết khấu!",
                    },
                  ],
                  initialValue: state.idDiscountEmployeeType,
                })(
                  <Select
                    onSelect={onChange("idDiscountEmployeeType")}
                    showSearch
                    disabled={state.id != "" || state.isReadOnly || false}
                    disabled={state.isReadOnly}
                    filterOption={filterOption}
                    optionFilterProp="name"
                    placeholder="Tìm kiếm loại chiết khấu"
                  >
                    {props.dsLoaiChietKhau?.map((item, index) => (
                      <Option
                        key={index}
                        value={item?.id}
                      >
                        {item?.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label={"Tỷ lệ chiết khấu"}>
                {getFieldDecorator("discountRate", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng nhập tỷ lệ chiết khấu!",
                    },
                  ],
                  initialValue: state.discountRate,
                })(
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    max={1}
                    disabled={state.isReadOnly}
                    step={0.01}
                    onChange={onChange("discountRate")}
                    disabled={state.id != "" || state.isReadOnly || false}
                    placeholder={"Tỷ lệ chiết khấu"}
                  />
                )}
              </Form.Item>
              <Form.Item label={"Tiền chiết khấu"}>
                {getFieldDecorator("amountInvoiceDiscount", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng nhập tiền chiết khấu!",
                    },
                  ],
                  initialValue: state.amountInvoiceDiscount,
                })(
                  <InputNumber
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    onChange={onChange("amountInvoiceDiscount")}
                    style={{ width: "100%" }}
                    min={0}
                    disabled={state.id != "" || state.isReadOnly || false}
                    maxLength={9}
                    disabled={state.isReadOnly}
                    placeholder={"Nhập tiền chiết khấu"}
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
      isLoadingCreate: state.chietKhauNhanVien.isLoadingCreate || false,
      dsLoaiChietKhau: state.loaiChietKhau.dsLoaiChietKhau || [],
      dsNhanVien: state.nhanVien.dsNhanVien || [],
    }),
    ({
      loaiChietKhau: {
        getAll: getAllLoaiChietKhau,
      },
      nhanVien: {
        onSearch: onSearchNhanVien,
      },
      chietKhauNhanVien: {
        onCreate,
        onUpdate,
      }
    }) => ({
      onCreate,
      onUpdate,
      getAllLoaiChietKhau,
      onSearchNhanVien,
    }),
    null,
    { forwardRef: true }
  )(forwardRef(ModalAddChietKhauNhanVien))
);
