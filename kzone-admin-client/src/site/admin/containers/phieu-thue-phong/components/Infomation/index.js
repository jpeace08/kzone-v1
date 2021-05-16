import React, { useEffect, useState, useRef, useMemo } from "react";
import { connect } from "react-redux";
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  DatePicker,
  InputNumber,
} from "antd";
import { Main } from "./styled";
import moment from "moment";
import { TYPE_OF_BOOKING, TYPE_OF_CUSTOMER } from "constant";

const { Option } = Select;
const { TextArea } = Input;

function Infomation({
  currentItem,
  typeOfBooking,
  filterOption,
  updateState,
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
    let newState = {
      [type]: e?.hasOwnProperty("target")
        ? e.target.value
        : e?.hasOwnProperty("_d")
          ? moment(e._d).format("YYYY-MM-DD HH:mm:ss")
          : e,
    };
    setState(newState);
  };

  const disabledDate = (current) => {
    return current && current < moment().endOf('day');
  }

  useEffect(() => {
    const item = currentItem;
    const url = new URL(window.location.href);
    const mode = url.searchParams.get("mode");

    //TODO: set new state
    setState({
      isReadOnly: mode == "view" || false,

    })
  }, [currentItem]);

  useEffect(() => {

  }, []);

  const { getFieldDecorator } = form;

  return (
    <Main>
      <fieldset>
        <legend>Thông tin chung</legend>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Form.Item label={"Loại thuê phòng"}>
              {getFieldDecorator("typeOfBooking", {
                rules: [
                  {
                    required: true,
                    message: "Vui lòng chọn loại hình thuê phòng!",
                  },
                ],
                initialValue: typeOfBooking,
              })(
                <Select
                  placeholder="Loại hình thuê phòng"
                  onChange={e => {
                    let value = e?.hasOwnProperty("target")
                      ? e.target.value
                      : e?.hasOwnProperty("_d")
                        ? moment(e._d).format("YYYY-MM-DD HH:mm:ss")
                        : e;
                    updateState({ typeOfBooking: value });
                  }}
                >
                  {TYPE_OF_BOOKING?.map((type, index) => (
                    <Option key={`col${index}`} value={type?.value}>
                      {type?.title}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={"Loại khách hàng"}>
              {getFieldDecorator("typeOfCustomer", {
                rules: [
                  {
                    required: true,
                    message: "Vui lòng chọn loại khách hàng!",
                  },
                ],
                initialValue: state.typeOfCustomer,
              })(
                <Select
                  placeholder="Loại khách hàng"
                >
                  {TYPE_OF_CUSTOMER?.map((type, index) => (
                    <Option key={`col${index}`} value={type?.value}>
                      {type?.title}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={"Ngày nhận phòng"}>
              {getFieldDecorator("checkinDate", {
                rules: [
                  {
                    required: true,
                    message: "Vui lòng chọn ngày nhận phòng!",
                  },
                  {
                    whitespace: true,
                    message: "Vui lòng nhập ngày trả phòng!",
                  },
                ],
                initialValue: state.checkinDate,
              })(
                <DatePicker
                  disabled={state.isReadOnly}
                  disabledDate={disabledDate}
                  onChange={onChange("checkinDate")}
                  format="DD/ MM/ YYYY"
                  placeholder="Chọn ngày nhận phòng"
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={"Ngày trả phòng"}>
              {getFieldDecorator("checkoutDate", {
                rules: [
                  {
                    required: true,
                    message: "Vui lòng chọn ngày trả phòng!",
                  },
                  {
                    whitespace: true,
                    message: "Vui lòng nhập ngày trả phòng!",
                  },
                ],
                initialValue: state.checkoutDate,
              })(
                <DatePicker
                  disabled={state.isReadOnly}
                  // disabledDate={disabledDate}
                  onChange={onChange("checkoutDate")}
                  format="DD/ MM/ YYYY"
                  placeholder="Chọn ngày trả phòng"
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={"Nhân viên"}>
              {getFieldDecorator("employeeId", {
                rules: [
                  {
                    required: true,
                  },
                ],
                initialValue: state.employeeId,
              })(
                <Select
                  placeholder="Nhân viên"
                >

                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={"Giảm giá ngày lễ "}>
              {getFieldDecorator("discountHoliday", {
                rules: [
                  {
                    required: true,
                  },
                ],
                initialValue: state.discountHoliday,
              })(
                <InputNumber
                  disabled={state.isReadOnly}
                  onChange={onChange("discountHoliday")}
                  placeholder="Giảm giá ngày lễ "
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </fieldset>
      <fieldset>
        <legend>Tiền tệ</legend>
        <Row gutter={[6, 6]}>
          <Col span={24}>
            <Form.Item label={"Trả trước"}>
              {getFieldDecorator("prepay", {
                rules: [
                  {
                    required: true,
                  },
                ],
                initialValue: state.prepay,
              })(
                <InputNumber
                  disabled={state.isReadOnly}
                  onChange={onChange("prepay")}
                  placeholder="Trả trước"
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={"Hoàn lại"}>
              {getFieldDecorator("refund", {
                rules: [
                  {
                    required: true,
                  },
                ],
                initialValue: state.refund,
              })(
                <InputNumber
                  disabled={state.isReadOnly}
                  onChange={onChange("refund")}
                  placeholder="Hoàn lại"
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={"Ghi chú"}>
              {getFieldDecorator("note", {
                rules: [
                  {
                    required: true,
                  },
                ],
                initialValue: state.note,
              })(
                <TextArea
                  disabled={state.isReadOnly}
                  onChange={onChange("note")}
                  placeholder="Ghi chú"
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </fieldset>
    </Main >
  );
}
export default connect(
  (state) => ({
    currentItem: state.roomType.currentItem,
  }),
  ({
    booking: { updateState },
  }) => {
    return {
      updateState,
    };
  }
)(Infomation);
