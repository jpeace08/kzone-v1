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
                ? "XEM TH??NG TIN"
                : "CH???NH S???A"
              : "TH??M M???I"}{" "}
            B???NG L????NG
          </h4>
          <div className="content-des">
            <Form onSubmit={handleSubmit}>
              <Form.Item label={"T??n nh??n vi??n"}>
                {getFieldDecorator("idEmployee", {
                  rules: [
                    {
                      required: true,
                      message: "Vui l??ng ch???n nh??n vi??n!",
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
                    placeholder="Ch???n nh??n vi??n"
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
              <Form.Item label={"L????ng c?? b???n"}>
                {getFieldDecorator("salary", {
                  rules: [
                    {
                      required: true,
                      message: "Vui l??ng nh???p l????ng c?? b???n!",
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
                    placeholder={"Nh???p l????ng c?? b???n"}
                  />
                )}
              </Form.Item>
              <Form.Item label={"L????ng m???m"}>
                {getFieldDecorator("softSalary", {
                  rules: [
                    {
                      required: true,
                      message: "Vui l??ng nh???p l????ng m???m!",
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
                    placeholder={"Nh???p l????ng m???m"}
                  />
                )}
              </Form.Item>
              <Form.Item label={"Ti???n ph??? c???p"}>
                {getFieldDecorator("allowance", {
                  rules: [
                    {
                      required: true,
                      message: "Vui l??ng nh???p ti???n ph??? c???p!",
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
                    placeholder={"Nh???p ti???n ph??? c???p"}
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
