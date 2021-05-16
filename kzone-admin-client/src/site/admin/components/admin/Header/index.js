import React, { useState, useLayoutEffect, useRef, useMemo, useEffect } from "react";
import { Select, Button, Tooltip, Popover, Icon } from "antd";
import "./style.scss";
import { connect } from "react-redux";
import ModalAddQuyen from "../../ModalAddQuyen";
import ModalChangePassword from "../../ModalChangePassword";

const { Option } = Select;

const Header = (props) => {

  const screenShort = useRef(null);
  const refSetupPermission = useRef(null);
  const refChangePassword = useRef(null);
  const [size, setSize] = useState([0, 0]);
  const [state, _setState] = useState({
    showChangePass: false,
    showSelectKho: false,
  });
  const setState = (data = {}) => {
    _setState((state) => {
      return { ...state, ...data };
    });
  };
  const onUserInfo = () => {
    window.location.href = "/admin/user-info";
  };
  const onChangePass = () => {
    if (refChangePassword.current) {
      refChangePassword.current.show();
    }
    setState({
      showChangePass: true,
    });
  };
  const closeModal = () => {
    setState({
      showChangePass: false,
    });
  };
  const useWindowSize = () => {
    useLayoutEffect(() => {
      updateSize();
      window.addEventListener("resize", updateSize);
      updateSize();
      return () => window.removeEventListener("resize", updateSize);
    }, []);
    return size;
  };
  const updateSize = () => {
    let offsetBottom;
    if (screenShort.current) {
      let parentHeight = window.innerHeight;
      offsetBottom = parentHeight - 547;
    }
    setSize(offsetBottom);
  };

  useEffect(() => {

  }, []);


  const filterOption = (input, option) => {
    return (
      (option.props.name || option.props.children)
        ?.toLowerCase()
        .createUniqueText()
        .indexOf(input.toLowerCase().createUniqueText()) >= 0
    );
  };
  return (
    <header className="page-header" role="banner">
      <div className="page-logo">
        <a
          href="#"
          className="page-logo-link press-scale-down d-flex align-items-center position-relative"
        // data-toggle="modal"
        // data-target="#modal-shortcut"
        >
          <img
            src={require("resources/images/logo.png")}
            alt="Kzone The Star Hotel"
            aria-roledescription="logo"
          />
          {/* <span className="page-logo-text mr-1">Kzone The Star Hotel</span> */}
          {/* <span className="position-absolute text-white opacity-50 small pos-top pos-right mr-2 mt-n2"></span>
          <i className="fal fa-angle-down d-inline-block ml-1 fs-lg color-primary-300"></i> */}
        </a>
      </div>

      <div className="hidden-md-down dropdown-icon-menu position-relative">
        <a
          href="#"
          className="header-btn btn js-waves-off"
          data-action="toggle"
          data-class="nav-function-hidden"
          title="Hide Navigation"
        >
          <i className="ni ni-menu"></i>
        </a>
        <ul>
          <li>
            <a
              href="#"
              className="btn js-waves-off"
              data-action="toggle"
              data-class="nav-function-minify"
              title="Minify Navigation"
            >
              <i className="ni ni-minify-nav"></i>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="btn js-waves-off"
              data-action="toggle"
              data-class="nav-function-fixed"
              title="Lock Navigation"
            >
              <i className="ni ni-lock-nav"></i>
            </a>
          </li>
        </ul>
      </div>
      <div className="hidden-lg-up">
        <a
          href="#"
          className="header-btn btn press-scale-down waves-effect waves-themed"
          data-action="toggle"
          data-class="mobile-nav-on"
        >
          <i className="ni ni-menu"></i>
        </a>
      </div>
      <div className="ml-auto d-flex">
        {/* <div className="hidden-md-down header-icon _c">
          <Tooltip title="">
            <Button
              onClick={() => {
                window.location.href = "/admin/phieu-chi-nhan-vien";
              }}
              // icon="diff"
              type="danger"
              style={{ width: "100%", marginRight: 15 }}
            >
              Phiếu chi nhân viên
            </Button>
          </Tooltip>
        </div> */}
        {/* <div className="hidden-md-down header-icon _c">
          <Popover
            placement="bottomRight"
            content={(
              <>
                <Select
                  style={{ width: "100%", marginBottom: "5px" }}
                  placeholder="Chọn kho hàng..."
                  showSearch
                  filterOption={filterOption}
                  autoClearSearchVaelue
                  onSelect={onChange("currentItem")}
                  value={props.currentItem}
                  title="Chọn kho hàng"
                >
                  <Select.Option key={0} value={-1}>
                    Tất cả kho
                  </Select.Option>
                  {props.dsKiemKho?.map((item, index) => (
                    <Option key={index + 1} value={item.id}>
                      {item?.warehouseName}
                    </Option>
                  ))}
                </Select>
              </>
            )}
            trigger="click"
          >

            <Button
              icon="environment"
              type="ghost"
              title="Chọn kho hàng"
              size="large"
              style={{ border: 0, color: "#edb997", fontSize: 22.2, marginBottom: 2.2 }}
            >
            </Button>
          </Popover>

        </div> */}

        {/* <div className="hidden-md-down">
          <a
            href="#"
            className="header-icon"
            data-toggle="modal"
            data-target=".js-modal-settings"
          >
            <i className="fal fa-cog" style={{ color: "#edb997" }}></i>
          </a>
        </div> */}

        <div>
          <a
            href="#"
            data-toggle="dropdown"
            title={props.auth && props.auth.email}
            className="header-icon d-flex align-items-center justify-content-center ml-2"
          >
            <img
              src="/img/demo/avatars/avatar-admin.png"
              className="profile-image rounded-circle"
              alt={props.auth && props.auth.full_name}
            />
          </a>
          <div
            className={`dropdown-menu dropdown-menu-animated dropdown-lg ${useWindowSize() <= 10 && "screenShort"
              }`}
            ref={screenShort}
          >
            <div className="dropdown-header bg-trans-gradient d-flex flex-row py-4 rounded-top">
              <div className="d-flex flex-row align-items-center mt-1 mb-1 color-white">
                <a
                  //   onClick={() => {
                  //     onUserInfo();
                  //   }}
                  className="fw-500 pt-3 pb-3"
                >
                  <span className="mr-2">
                    <img
                      src="/img/demo/avatars/avatar-admin.png"
                      className="rounded-circle profile-image"
                      alt={props.auth && props.auth.full_name}
                    />
                  </span>
                  <div className="info-card-text">
                    <div className="fs-lg text-truncate text-truncate-lg">
                      {props.auth && props.auth.full_name}
                    </div>
                    <span className="text-truncate text-truncate-md opacity-80">
                      {props.auth && props.auth.email}
                    </span>
                  </div>
                </a>
              </div>
            </div>
            <div className="dropdown-divider m-0"></div>
            <a
              onClick={onChangePass}
              className="dropdown-item fw-500 pt-3 pb-3"
            >
              <span data-i18n="drpdwn.reset_layout">Thay đổi mật khẩu</span>
            </a>
            {props.auth.role == 4 && (
              <a
                onClick={() => {
                  if (refSetupPermission.current)
                    refSetupPermission.current.show();
                }}
                className="dropdown-item fw-500 pt-3 pb-3"
              >
                <span data-i18n="drpdwn.reset_layout">Cài đặt quyền </span>
              </a>
            )}

            <a href="#" className="dropdown-item" data-action="app-reset">
              <span data-i18n="drpdwn.reset_layout">Đặt lại bố cục</span>
            </a>
            <a
              href="#"
              className="dropdown-item"
              data-toggle="modal"
              data-target=".js-modal-settings"
            >
              <span>Cài đặt</span>
            </a>
            <a href="#" className="dropdown-item" data-action="app-fullscreen">
              <span>Toàn màn hình</span>
              <i className="float-right text-muted fw-n">F11</i>
            </a>
            <a
              onClick={() => {
                localStorage.clear();
                props.onLogout();
                // window.location.href = "/login";
              }}
              className="dropdown-item fw-500 pt-3 pb-3"
            >
              <span>Đăng xuất</span>
            </a>
          </div>
        </div>
      </div>
      <ModalAddQuyen wrappedComponentRef={refSetupPermission}></ModalAddQuyen>
      <ModalChangePassword
        wrappedComponentRef={refChangePassword}
      ></ModalChangePassword>
    </header>
  );
};

export default connect(
  (state) => {
    return {
      auth: state.auth.auth,
    };
  },
  ({
    auth: { onLogout },
  }) => {
    return {
      onLogout,
    };
  }
)(Header);
