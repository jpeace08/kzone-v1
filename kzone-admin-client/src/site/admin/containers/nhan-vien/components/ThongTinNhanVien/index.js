import React, { useState, useRef, useMemo } from "react";
import { connect } from "react-redux";
import { isValidValue } from "utils/common";
import { Modal, Icon } from "antd";
import { HOST } from "client/request";
import { Main, CustomButton } from "./styled";
import ModalAddNhanVien from "site/admin/components/ModalAddNhanVien";
import moment from "moment";
const { confirm } = Modal;

function ThongTinNhanVien({ children, item, ...props }) {
  console.log(item);
  const refModalAddNhanVien = useRef(null);
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

  const showModalAddNhanVien = (item = {}) => {
    if (refModalAddNhanVien.current) {
      refModalAddNhanVien.current.show(item);
    }
  }

  function showConfirm(item) {
    confirm({
      title: "Xác nhận",
      icon: <Icon type="delete" />,
      content: `Bạn có muốn xóa danh mục ${item.name}`,
      okText: "Đồng ý",
      cancelText: "Hủy bỏ",
      onOk() {
        props.onDeleteHangHoa({ id: item.id });
      },
    });
  }

  const onClick = (type, item) => (e) => {
    switch (type) {
      case "edit":
        showModalAddNhanVien(item, false);
        break;
      case "delete":
        break;
      default:
        break;
    }
  };

  return (
    <Main>
      {/* <ModalAddNhanVien wrappedComponentRef={refModalAddNhanVien} /> */}
    </Main>
  );
}
export default connect(
  (state) => ({

  }),
  ({
    hangHoa: {

    }
  }) => {
    return {

    };
  }
)(ThongTinNhanVien);
