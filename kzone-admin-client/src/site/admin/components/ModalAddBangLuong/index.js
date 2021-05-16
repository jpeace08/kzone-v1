import React, { useImperativeHandle, useState, forwardRef, useEffect } from "react";
import { Main } from "./styled";
import {
  Button,
  Form,
  Spin,
  Select,
  InputNumber,
} from "antd";
import { connect } from "react-redux";

const ModalAddBangLuong = (props, ref) => {
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
        allowance: item?.allowance || "",
        idEmployee: item?.user?.id,
        salary: item?.salary != 0 ? item?.salary : 0,
        softSalary: item?.softSalary != 0 ? item?.softSalary : 0,
        isReadOnly: isReadOnly,
      });
      props.form.resetFields();
    },
  }));
  useEffect(() => {
    props.onSearchNhanVien({ dataSearch: { size: 9999 } });
  }, [])
  const handleSubmit = () => { };

  const onChange = (type) => (e) => {
    let value = e && e.target ? e.target.value : e
    setState({
      [type]: (value + "").trim(),
    });
  };
  const onSave = (ok) => () => {
    if (ok) {
      props.form.validateFields((errors, values) => {
        if (!errors) {
          let payload = {
            id: state.id,
            allowance: state.allowance,
            idEmployee: state.idEmployee,
            salary: state.salary,
            softSalary: state.softSalary,
          };
          if (!state.id)
            props.onCreateBangLuong(payload).then((s) => {
              setState({ show: false });
            });
          else
            props
              .onUpdateBangLuong({
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
  const filterOption = (input, option) => {
    return (
      (option.props.name || option.props.children)
        ?.toLowerCase()
        .createUniqueText()
        .indexOf(input.toLowerCase().createUniqueText()) >= 0
    );
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
            BẢNG LƯƠNG
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
                    disabled={state.isReadOnly || false}
                    optionFilterProp="name"
                    onSelect={onChange("idEmployee")}
                    filterOption={filterOption}
                    placeholder="Chọn nhân viên"
                  >
                    {props.dsNhanVien?.map((item, index) => (
                      <Select.Option
                        key={index}
                        value={item?.id}
                      >
                        {item?.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label={"Lương cơ bản"}>
                {getFieldDecorator("salary", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng nhập lương cơ bản!",
                    },
                  ],
                  initialValue: state.salary,
                })(
                  <InputNumber
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    maxLength={9}
                    disabled={state.isReadOnly}
                    onChange={onChange("salary")}
                    placeholder={"Nhập lương cơ bản"}
                  />
                )}
              </Form.Item>
              <Form.Item label={"Lương mềm"}>
                {getFieldDecorator("softSalary", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng nhập lương mềm!",
                    },
                  ],
                  initialValue: state.softSalary,
                })(
                  <InputNumber
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    maxLength={15}
                    min={0}
                    disabled={state.isReadOnly}
                    onChange={onChange("softSalary")}
                    placeholder={"Nhập lương mềm"}
                  />
                )}
              </Form.Item>
              <Form.Item label={"Tiền phụ cấp"}>
                {getFieldDecorator("allowance", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng nhập tiền phụ cấp!",
                    },
                  ],
                  initialValue: state.allowance,
                })(
                  <InputNumber
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    maxLength={9}
                    style={{ width: "100%" }}
                    min={1}
                    disabled={state.isReadOnly}
                    onChange={onChange("allowance")}
                    placeholder={"Nhập tiền phụ cấp"}
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
      isLoadingCreate: state.bangLuong.isLoadingCreate || false,
      dsNhanVien: state.nhanVien.dsNhanVien || [],
    }),
    ({ bangLuong: { onCreate: onCreateBangLuong, onUpdate: onUpdateBangLuong },
      nhanVien: { onSearch: onSearchNhanVien, },
    }) => ({
      onCreateBangLuong,
      onUpdateBangLuong,
      onSearchNhanVien,
    }),
    null,
    { forwardRef: true }
  )(forwardRef(ModalAddBangLuong))
);
