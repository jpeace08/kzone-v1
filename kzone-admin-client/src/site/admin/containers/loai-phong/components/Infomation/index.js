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

const { Option } = Select;
const { TextArea } = Input;

function Infomation({
  currentItem,
  filterOption,
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

  useEffect(() => {
    const item = currentItem;
    const url = new URL(window.location.href);
    const mode = url.searchParams.get("mode");

    //TODO: set new state
    setState({
      isReadOnly: mode == "view" || false,
      name: item?.name || "",
      adultNumber: item?.adultNumber || "",
      childNumber: item?.childNumber || "",
      discountHoliday: item?.discountHoliday || "",
      discountGroup: item?.discountGroup || "",
      description: item?.description || "",
      shortTimePrice: item?.shortTimePrice || "",
      overNightPrice: item?.overNightPrice || "",
      surcharge: item?.surcharge || "",
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
            <Form.Item label={"Tên loại phòng"}>
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: "Vui lòng nhập tên loại phòng!",
                  },
                  {
                    whitespace: true,
                    message: "Vui lòng nhập tên loại phòng!",
                  },
                ],
                initialValue: state.name,
              })(
                <Input
                  disabled={state.isReadOnly}
                  placeholder="Tên loại phòng"
                  onChange={onChange("name")}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={"Số người lớn"}>
              {getFieldDecorator("adultNumber", {
                rules: [
                  {
                    required: true,
                  },
                ],
                initialValue: state.adultNumber,
              })(
                <InputNumber
                  disabled={state.isReadOnly}
                  onChange={onChange("adultNumber")}
                  placeholder="Số người lớn"
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={"Số trẻ em"}>
              {getFieldDecorator("childNumber", {
                rules: [
                  {
                    required: true,
                  },
                ],
                initialValue: state.childNumber,
              })(
                <InputNumber
                  disabled={state.isReadOnly}
                  onChange={onChange("childNumber")}
                  placeholder="Số trẻ em"
                />
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
          <Col span={24}>
            <Form.Item label={"Giảm giá khách đoàn"}>
              {getFieldDecorator("discountGroup", {
                rules: [
                  {
                    required: true,
                  },
                ],
                initialValue: state.discountGroup,
              })(
                <InputNumber
                  disabled={state.isReadOnly}
                  onChange={onChange("discountGroup")}
                  placeholder="Giảm giá khách đoàn"
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={"Mô tả"}>
              {getFieldDecorator("description", {
                rules: [
                  {
                    required: true,
                  },
                ],
                initialValue: state.description,
              })(
                <TextArea
                  disabled={state.isReadOnly}
                  onChange={onChange("description")}
                  placeholder="Mô tả"
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </fieldset>
      <fieldset>
        <legend>Giá phòng</legend>
        <Row gutter={[6, 6]}>
          <Col span={24}>
            <Form.Item label={"Giá theo giờ"}>
              {getFieldDecorator("shortTimePrice", {
                rules: [
                  {
                    required: true,
                  },
                ],
                initialValue: state.shortTimePrice,
              })(
                <InputNumber
                  disabled={state.isReadOnly}
                  onChange={onChange("shortTimePrice")}
                  placeholder="Giá theo giờ"
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={"Giá qua đêm"}>
              {getFieldDecorator("overNightPrice", {
                rules: [
                  {
                    required: true,
                  },
                ],
                initialValue: state.overNightPrice,
              })(
                <InputNumber
                  disabled={state.isReadOnly}
                  onChange={onChange("overNightPrice")}
                  placeholder="Giá qua đêm"
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={"Phụ thu"}>
              {getFieldDecorator("surcharge", {
                rules: [
                  {
                    required: true,
                  },
                ],
                initialValue: state.surcharge,
              })(
                <InputNumber
                  disabled={state.isReadOnly}
                  onChange={onChange("surcharge")}
                  placeholder="Phụ thu"
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </fieldset>
    </Main>
  );
}
export default connect(
  (state) => ({
    currentItem: state.roomType.currentItem,
  }),
  ({

  }) => {
    return {

    };
  }
)(Infomation);
