import React, { useImperativeHandle, useState, useEffect, forwardRef } from "react";
import { Main } from "./styled";
import { Button, Form, Input, Spin, Select } from "antd";
import { connect } from "react-redux";

const ModalAddPhongBan = (props, ref) => {
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
        name: item?.name,
        idUserLeader: item?.idUserLeader,
        isReadOnly: isReadOnly,
      });
      props.form.resetFields();
      props.onGetAllNhanVien({});
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
  const onOK = (ok) => () => {
    if (ok) {
      props.form.validateFields((errors, values) => {
        if (!errors) {
          if (!state.id)
            props
              .onCreate({
                department: {
                  name: state.name,
                },
                leaderId: state.idUserLeader,
              })
              .then((s) => {
                setState({ show: false });
                props.onSearchNV({ size: 10 })
              });
          else
            props
              .onUpdate({
                id: state.id,
                department: {
                  name: state.name,
                },
                leaderId: state.idUserLeader,
              })
              .then((s) => {
                setState({ show: false });
                props.onSearchNV({ size: 10 })
              });

          // setState({ show: false });
        }
      });
    } else {
      setState({ show: false });
      props.onSearchNV({ size: 10 })
    }
  };
  const filterOption = (input, option) => {
    return (
      (option.props.name || option.props.children)
        ?.toLowerCase()
        .createUniqueText()
        .indexOf(input.toLowerCase().createUniqueText()) >= 0
    );
  };

  // useEffect(() => {
  //   if (props.onGetAllNhanVien({})) {
  //     props.onGetAllNhanVien({});
  //   }
  // }, []);

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
            {state.isReadOnly ? "XEM" : state.id ? "CHỈNH SỬA" : "THÊM MỚI"} PHÒNG BAN
          </h4>
          <div className="content-des">
            <Form onSubmit={handleSubmit}>
              <Form.Item label={"Tên phòng ban"}>
                {getFieldDecorator("name", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng nhập tên phòng ban!",
                    },
                    {
                      whitespace: true,
                      message: "Vui lòng nhập tên phòng ban!",
                    },
                  ],
                  initialValue: state.name,
                })(
                  <Input
                    disabled={state.isReadOnly}
                    onChange={onChange("name")}
                    placeholder={"Nhập tên phòng ban"}
                  />
                )}
              </Form.Item>
              <Form.Item label={"Trưởng phòng"}>
                {getFieldDecorator("idUserLeader", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng chọn nhân viên!",
                    },
                  ],
                  initialValue: state.idUserLeader,
                })(
                  <Select
                    value={state?.idUserLeader}
                    disabled={state.isReadOnly}
                    placeholder={"Chọn nhân viên"}
                    onChange={onChange("idUserLeader")}
                    filterOption={filterOption}
                    showSearch
                  >
                    {props.dsNhanVien?.map((nv, index) => (
                      <Select.Option key={index} value={nv.id}>
                        {nv.name}
                      </Select.Option>
                    ))}
                  </Select>
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
      isLoadingCreate: state.phongBan.isLoadingCreate || false,
      dsNhanVien: state.nhanVien.dsNhanVien || [],
      // forms: state.form.forms || [],
    }),
    ({
      phongBan: { onCreate, onUpdate },
      nhanVien: { getAll: onGetAllNhanVien, onSearch: onSearchNV },
    }) => ({
      onCreate,
      onSearchNV,
      onUpdate,
      onGetAllNhanVien,
      // getAllForm,
    }),
    null,
    { forwardRef: true }
  )(forwardRef(ModalAddPhongBan))
);
