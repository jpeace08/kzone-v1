import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Main } from "./styled";
import { Form, Input, Select, Row, Col, DatePicker } from "antd";
import { STATUS_PAY } from "constant/index";
import { validateInwardSlipNumber } from "utils/common";

const { Option } = Select;

function PhieuChi({ filterOption, ...props }) {
  const [state, _setState] = useState({});

  const setState = (_state) => {
    _setState((state) => ({
      ...state,
      ...(_state || {}),
    }));
  };
  const { getFieldDecorator } = props.form;

  const onChange = (type) => (e) => {
    setState({
      [type]: e?.hasOwnProperty("target")
        ? e.target.value
        : e?.hasOwnProperty("_d")
          ? moment(e._d).format("YYYY-MM-DD HH:mm:ss")
          : e,
    });
  };

  useEffect(() => {
    const item = props.currentItem;
    const url = new URL(window.location.href);
    const mode = url.searchParams.get("mode");

    // TODO: update state with current item
    setState({
      // receiver: item?.paymentVoucher?.receiver || "",
      // reason: item?.paymentVoucher?.reason || "",
      // isReadOnly:
      //   item?.statusPay == STATUS_PAY.daThanhToan || mode == "view" || false,
    });
  }, [props.currentItem]);

  return (
    <Main>

    </Main>
  );
}
export default Form.create({})(
  connect(
    (state) => ({

    }),
    ({

    }) => {
      return {

      };
    }
  )(PhieuChi)
);
