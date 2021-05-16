import React, { useImperativeHandle, useState, forwardRef } from "react";
import { Main } from "./styled";
import { message } from "antd";
import { HOST } from "client/request";
import {
  Button,
  Form,
  Input,
  Radio,
  Row,
  Col,
  Spin,
  Select,
  DatePicker,
  Upload,
  Icon,
} from "antd";
import moment from "moment";
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
    show: (item = {}, isReadOnly = false) => {
      setState({
        show: true,
        id: item?.id || "",
        name: item?.name || "",
        email: item?.email || "",
        phone: item?.phone || "",
        gender: item?.gender || 1,
        roleId: (item?.roles || []).map((item) => item.id),
        address: item?.address || [],
        dob: item?.dob,
        avatar: item?.avatar,
        department: item?.department?.id || "",
        passport: item?.passport,
        dateRangePassPort: item?.dateRangePassPort,
        placePassPort: item?.placePassPort,
        isReadOnly: isReadOnly,
      });
      props.form.resetFields();
      props.vaiTroGetAll();
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

  const onChangeAvatar = (data) => {
    props.onImageUpload({ file: data.file.originFileObj }).then((s) => {
      setState({
        avatar: s,
      });
    });
  };

  const onOK = (ok) => () => {
    if (ok) {
      props.form.validateFields((errors, values) => {
        if (state.name.trim() == "" || !state.name.isFullName()) {
          message.error("Vui lòng nhập đúng định dạng tên nhân viên!");
        } else {
          if (!errors) {
            let index = props.dsNhanVien.findIndex(item => item.passport == state.passport);
            if (index != -1) {
              message.error("Số căn cước đã tồn tại. Vui lòng nhập lại!");
              return;
            } else {
              let payload = {
                roleId: state.roleId,
                user: {
                  name: state.name,
                  email: state.email,
                  gender: state.gender,
                  phone: state.phone,
                  address: state.address,
                  dob: state.dob,
                  avatar: state.avatar,
                  passport: state.passport,
                  dateRangePassPort: state.dateRangePassPort,
                  placePassPort: state.placePassPort,
                },
                departmentId: state.department,
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
          }
        }
      });
    } else setState({ show: false });
  };
  const uploadButton = (
    <div>
      {props.isUploadImage ? <Icon type="loading" /> : <Icon type="plus" />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const filterOption = (input, option) => {
    return (
      (option.props.name || option.props.children)
        ?.toLowerCase()
        .createUniqueText()
        .indexOf(input.toLowerCase().createUniqueText()) >= 0
    );
  };
  const validatePhoneNumber = (rule, value, callback) => {
    if (value && !value?.isPhoneNumber()) {
      callback("Vui lòng nhập đúng số điện thoại!");
    } else {
      callback();
    }
  };

  function disabledDate(current) {
    // Can not select days before today and today
    return current && current > moment().endOf('day') - 1;
  }
  const validateSoCanCuoc = (rule, value, callback) => {

    if (value && (value.length < 9 || value.length > 13)) {
      callback("Vui lòng nhập số căn cước hợp lệ (9 <= giá trị <=13)");
    } else {
      callback();
    }
  };
  return (
    <Main
      visible={state.show}
      style={{ maxWidth: 1000 }}
      closable={false}
      centered
      onCancel={onOK(false)}
      footer={[null]}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <Spin spinning={props.isLoadingCreate}>
        <div className="modal-des">
          <h4 className="title-des">
            {state.id
              ? state.isReadOnly
                ? "THÔNG TIN"
                : "CHỈNH SỬA"
              : "THÊM MỚI"}{" "}
            NHÂN VIÊN
          </h4>
          <div className="content-des">
            {/* <Form onSubmit={handleSubmit}>  
            </Form> */}
            <Row gutter={[8, 8]}>
              <Col span={24}>
                <fieldset>
                  <legend>Thông tin chung</legend>
                  <Col span={24}>
                    <Form.Item label={"Tên nhân viên"}>
                      {getFieldDecorator("name", {
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng nhập tên nhân viên!",
                          },
                          {
                            whitespace: true,
                            message: "Vui lòng nhập tên nhân viên!",
                          },
                        ],
                        initialValue: state.name,
                      })(
                        <Input
                          disabled={state.isReadOnly}
                          onChange={onChange("name")}
                          placeholder={"Nhập tên nhân viên"}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={"Ảnh đại diện"}>
                      {getFieldDecorator("avatar", {
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng chọn ảnh đại diện!",
                          },
                        ],
                        initialValue: state.avatar,
                      })(
                        <Upload
                          showUploadList={false}
                          disabled={state.isReadOnly}
                          onChange={onChangeAvatar}
                          listType="picture-card"
                          className="avatar-uploader"
                        >
                          {state.avatar ? (
                            <img
                              src={HOST + state.avatar}
                              alt="avatar"
                              style={{ width: "100%" }}
                            />
                          ) : (
                            uploadButton
                          )}
                        </Upload>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={"Giới tính"}>
                      {getFieldDecorator("gender", {
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng chọn giới tính!",
                          },
                        ],
                        initialValue: state.gender,
                      })(
                        <Radio.Group
                          onChange={onChange("gender")}
                          value={state.gender}
                        >
                          <Radio disabled={state.isReadOnly} value={1}>
                            Nam
                        </Radio>
                          <Radio disabled={state.isReadOnly} value={2}>
                            Nữ
                        </Radio>
                        </Radio.Group>
                      )}
                    </Form.Item>
                    <Form.Item label={"Ngày sinh"}>
                      {getFieldDecorator("dob", {
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng nhập ngày sinh!",
                          },
                        ],
                        initialValue: state.dob ? moment(state.dob) : null,
                      })(
                        <DatePicker
                          disabled={state.isReadOnly}
                          disabledDate={disabledDate}
                          onChange={onChange("dob")}
                          format="DD/ MM/ YYYY"
                          placeholder="Chọn ngày sinh"
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label={"Vai trò"}>
                      {getFieldDecorator("role", {
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng chọn vai trò!",
                          },
                        ],
                        initialValue: state.roleId,
                      })(
                        <Select
                          disabled={state.isReadOnly}
                          onChange={onChange("roleId")}
                          placeholder={"chọn vai trò"}
                          mode="multiple"
                        >
                          {props.dsVaiTro.map((item, index) => {
                            return (
                              <Option value={item.id} key={index}>
                                {item.name}
                              </Option>
                            );
                          })}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label={"Phòng ban"}>
                      {getFieldDecorator("department", {
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng chọn phòng ban!",
                          },
                        ],
                        initialValue: state.department,
                      })(
                        <Select
                          showSearch
                          disabled={state.isReadOnly}
                          onChange={onChange("department")}
                          placeholder={"Chọn phòng ban"}
                          filterOption={filterOption}
                        >
                          {props.dsPhongBan.map((item, index) => {
                            return (
                              <Option value={item.id} key={index}>
                                {item.name}
                              </Option>
                            );
                          })}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </fieldset>
              </Col>
            </Row>
            <Row gutter={[8, 8]}>
              <Col span={12}>
                <fieldset>
                  <legend>Căn cước công dân</legend>
                  <Form.Item label={"Số căn cước"}>
                    {getFieldDecorator("passport", {
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập số căn cước!",
                        },
                        {
                          validator: validateSoCanCuoc
                        }
                      ],
                      initialValue: state.passport,
                    })(
                      <Input
                        maxLength={15}
                        disabled={state.isReadOnly}
                        onChange={onChange("passport")}
                        placeholder={"Nhập số căn cước"}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={"Ngày cấp"}>
                    {getFieldDecorator("dateRangePassPort", {
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập Ngày cấp!",
                        },
                      ],
                      initialValue: state.dateRangePassPort ? moment(state.dateRangePassPort) : null,
                    })(
                      <DatePicker
                        disabled={state.isReadOnly}
                        onChange={onChange("dateRangePassPort")}
                        format="DD/ MM/ YYYY"
                        placeholder="Chọn ngày cấp CCCD"
                        disabledDate={disabledDate}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={"Nơi cấp"}>
                    {getFieldDecorator("placePassPort", {
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập nơi cấp!",
                        },
                      ],
                      initialValue: state.placePassPort,
                    })(
                      <Input
                        disabled={state.isReadOnly}
                        onChange={onChange("placePassPort")}
                        placeholder={"Nhập nơi cấp"}
                      />
                    )}
                  </Form.Item>
                </fieldset>
              </Col>
              <Col span={12}>
                <fieldset>
                  <legend>Liên lạc</legend>
                  <Form.Item label={"Email"}>
                    {getFieldDecorator("email", {
                      rules: [
                        {
                          required: true,
                          type: "email",
                          message: "Vui lòng nhập đúng định dạng email!",
                        },
                      ],
                      initialValue: state.email,
                    })(
                      <Input
                        disabled={state.isReadOnly}
                        onChange={onChange("email")}
                        placeholder={"Nhập email"}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={"Số điện thoại"}>
                    {getFieldDecorator("phone", {
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập số điện thoại!",
                        },
                        {
                          validator: validatePhoneNumber,
                        },
                        {
                          max: 12,
                          message:
                            "Vui lòng nhập đúng định dạng số điện thoại 10 chữ số ",
                        },
                        {
                          min: 10,
                          message:
                            "Vui lòng nhập đúng định dạng số điện thoại 10 chữ số",
                        },
                      ],
                      initialValue: state.phone,
                    })(
                      <Input
                        disabled={state.isReadOnly}
                        onChange={onChange("phone")}
                        placeholder={"Nhập số điện thoại"}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={"Địa chỉ"}>
                    {getFieldDecorator("address", {
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập địa chỉ!",
                        },
                        {
                          whitespace: true,
                          message: "Vui lòng nhập địa chỉ!",
                        },
                      ],
                      initialValue: state.address,
                    })(
                      <Input
                        disabled={state.isReadOnly}
                        onChange={onChange("address")}
                        placeholder={"Nhập địa chỉ"}
                      />
                    )}
                  </Form.Item>
                </fieldset>
              </Col>
            </Row>
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
                onClick={onOK(!state.isReadOnly)}
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
      isLoadingCreate: state.nhanVien.isLoadingCreate || false,
      dsVaiTro: state.vaiTro.dsVaiTro || [],
      dsPhongBan: state.phongBan.dsPhongBan || [],
      dsNhanVien: state.nhanVien.dsNhanVien || [],

      // forms: state.form.forms || [],
    }),
    ({
      vaiTro: { getAll: vaiTroGetAll },
      nhanVien: { onCreate, onUpdate },
      image: { onImageUpload },
    }) => ({
      vaiTroGetAll,
      onCreate,
      onUpdate,
      onImageUpload,
    }),
    null,
    { forwardRef: true }
  )(forwardRef(ModalAddVaiTro))
);
