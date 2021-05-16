import React, { useState, useRef, useMemo } from "react";
import { connect } from "react-redux";
import { isValidValue } from "utils/common";
import { Modal, Icon } from "antd";
import { Main, CustomButton } from "./styled";
import ModalAddPhongBan from "site/admin/components/ModalAddPhongBan";
import ModalViewDSNhanVien from "site/admin/components/ModalViewDSNhanVien";
const { confirm } = Modal;

function ThongTinPhongBan({ children, item, ...props }) {
  console.log(item);
  const refAddPhongBan = useRef(null);
  const refViewNhanVien = useRef(null);
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

  const isHidden = (field) => {
    if (props.dsHangHoa.length > 0) {
      const item = props.dsHangHoa[0];
      return item[field] && item[field] == -1;
    }
    return false;
  };

  function showConfirm(item) {
    confirm({
      title: "Xác nhận",
      icon: <Icon type="delete" />,
      content: `Bạn có muốn xóa phong ban ${item.name}`,
      okText: "Đồng ý",
      cancelText: "Hủy bỏ",
      onOk() {
        props.onDelete({ id: item.id });
      },
    });
  }

  const showAddPhongBan = (payload, isReadOnly) => {
    if (refAddPhongBan.current) {
      refAddPhongBan.current.show(payload, isReadOnly);
    }
  };

  const showDSNhanVien = (item) => () => {
    if (refViewNhanVien.current) {
      refViewNhanVien.current.show(item);
    }
  };

  const onClick = (type, item) => (e) => {
    switch (type) {
      case "edit":
        showAddPhongBan(item, false);
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
      {/* <ModalAddPhongBan wrappedComponentRef={refAddPhongBan} /> */}
      {/* <ModalViewDSNhanVien wrappedComponentRef={refViewNhanVien} /> */}
    </Main>
  );
}
export default connect(
  (state) => ({}),
  ({

  }) => {
    return {

    };
  }
)(ThongTinPhongBan);
