import React, { useState, useRef, useMemo } from "react";
import { connect } from "react-redux";
import { isValidValue } from "utils/common";
import { Modal, Icon } from "antd";
import { Main, CustomButton } from "./styled";
import ModalAddDichVu from "site/admin/components/ModalAddDichVu";

const { confirm } = Modal;

function ThongTinDichVu({ children, item, ...props }) {
  console.log(item);
  const refAddDichVu = useRef(null);
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
        : e?.hasOwnProperty("_d")
          ? e._d
          : e,
    });
  };

  function showConfirm(item) {
    confirm({
      title: "Xác nhận",
      icon: <Icon type="delete" />,
      content: `Bạn có muốn xóa dich van ${item.serviceName}`,
      okText: "Đồng ý",
      cancelText: "Hủy bỏ",
      onOk() {
        props.onDelete({ id: item.id });
      },
    });
  }

  const showModalAddDichVu = (payload, isReadOnly) => {
    if (refAddDichVu.current) {
      refAddDichVu.current.show(payload, isReadOnly);
    }
  };

  const onClick = (type, item) => (e) => {
    switch (type) {
      case "edit":
        showModalAddDichVu(item, false);
        break;
      case "delete":
        showConfirm(item);
        break;
      default:
        break;
    }
  };

  return (
    <Main>
      {/* <ModalAddDichVu wrappedComponentRef={refAddDichVu} /> */}
    </Main>
  );
}
export default connect(
  (state) => ({

  }),
  ({ dichVu: { onDelete } }) => {
    return {
      onDelete,
    };
  }
)(ThongTinDichVu);
