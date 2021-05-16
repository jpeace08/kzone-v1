import React, { useEffect, useState, useRef, useMemo } from "react";
import { connect } from "react-redux";
import { Main } from "./styled";
import { Form, Row, Col, Select, Input, DatePicker } from "antd";
import moment from "moment";

const { Option } = Select;

function Customer({
  currentItem,
  form,
  ...props
}) {
  const [state, _setState] = useState({});

  const setState = (_state) => {
    _setState((state) => ({
      ...state,
      ...(_state || {}),
    }));
  };

  const onChange = (type) => (e) => {
    setState({
      [type]: e?.hasOwnProperty("target")
        ? e.target.value
        : e,
    });
  };

  const validateIdentifyNumber = (rule, value, callback) => {
    if (value && (value.length < 9 || value.length > 13)) {
      callback("Vui lòng nhập số căn cước hợp lệ (9 <= giá trị <=13)");
    } else {
      callback();
    }
  };

  const disabledDate = (current) => {
    return current && current > moment().endOf('day') - 1;
  }

  useEffect(() => {
    const item = currentItem;
    const url = new URL(window.location.href);
    const mode = url.searchParams.get("mode");
    //TODO: update state with current item
    setState({

    })
  }, [currentItem]);

  const { getFieldDecorator } = form;

  return (
    <Main>
      <fieldset>
        <legend>Thông tin cá nhân</legend>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Form.Item label={"Tên khách hàng"}>
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: "Vui lòng nhập tên khách hàng!",
                  },
                ],
                initialValue: state.name,
              })(
                <Input
                  placeholder="Tên khách hàng"
                  onChange={onChange("name")}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={"Số căn cước công dân"}>
              {getFieldDecorator("identifyNumber", {
                rules: [
                  {
                    required: true,
                    message: "Vui lòng nhập số căn cước công dân!",
                  },
                ],
                initialValue: state.identifyNumber,
              })(
                <Input
                  placeholder="Số căn cước công dân"
                  onChange={onChange("identifyNumber")}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={"Ngày sinh"}>
              {getFieldDecorator("dob", {
                rules: [
                  {
                    required: true,
                    message: "Vui lòng chọn ngày sinh!",
                  },
                  {
                    whitespace: true,
                    message: "Vui lòng nhập ngày sinh!",
                  },
                ],
                initialValue: state.dob,
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
            <Form.Item label={"Giới tính"}>
              {getFieldDecorator("gender", {
                rules: [
                  {
                    required: true,
                  },
                ],
                initialValue: state.gender,
              })(
                <Select
                  placeholder="Giới tính"
                  onChange={onChange("gender")}
                >
                  <Option key="colMale" value={0}>Nam</Option>
                  <Option key="colFemale" value={1}>Nữ</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={"Email"}>
              {getFieldDecorator("email", {
                rules: [
                  {
                    required: true,
                  },
                ],
                initialValue: state.email,
              })(
                <Input
                  disabled={state.isReadOnly}
                  onChange={onChange("email")}
                  placeholder="Email"
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={"Địa chỉ"}>
              {getFieldDecorator("address", {
                rules: [
                  {
                    required: true,
                  },
                ],
                initialValue: state.address,
              })(
                <Input
                  disabled={state.isReadOnly}
                  onChange={onChange("address")}
                  placeholder="Địa chỉ"
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={"Số điện thoại"}>
              {getFieldDecorator("phone", {
                rules: [
                  {
                    required: true,
                  },
                ],
                initialValue: state.phone,
              })(
                <Input
                  disabled={state.isReadOnly}
                  onChange={onChange("phone")}
                  placeholder="Số điện thoại"
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </fieldset>
      <fieldset>
        <legend>Thông tin đăng nhập</legend>
        <Row gutter={[6, 6]}>
          <Col span={24}>
            <Form.Item label={"Tên đăng nhập"}>
              {getFieldDecorator("username", {
                rules: [
                  {
                    required: true,
                  },
                ],
                initialValue: state.username,
              })(
                <Input
                  disabled={true}
                  onChange={onChange("username")}
                  placeholder="Tên đăng nhập"
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={"Mật khẩu"}>
              {getFieldDecorator("password", {
                rules: [
                  {
                    required: true,
                  },
                ],
                initialValue: state.password,
              })(
                <Input
                  type="password"
                  disabled={true}
                  onChange={onChange("refund")}
                  placeholder="Mật khẩu"
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </fieldset>
    </Main>
  );
}
export default Form.create({})(
  connect(
    (state) => ({
      currentItem: state.roomType.currentItem || {},
    }),
    ({

    }) => {
      return {

      };
    }
  )(Customer)
);
