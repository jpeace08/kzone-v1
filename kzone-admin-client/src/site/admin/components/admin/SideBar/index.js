import React, { useState, useEffect, useRef } from "react";
import "./style.scss";
import { connect } from "react-redux";
import ItemMenu from "../ItemMenu";
import $ from "jquery";

const SideBar = (props) => {
  const menus = useRef(null);
  const [state, _setState] = useState({
    show: false,
    // menus: getMenu()
  });

  const setState = (_state) => {
    _setState((state) => ({
      ...state,
      ...(_state || {}),
    }));
  };
  const getMenu = () => {
    let allMenus = [
      {
        userTypes: [],
        userType: 6,
        href: "/admin/dashboard",
        name: "Dashboard",
        icon: "fal fa-game-board-alt",
        filter: "dashboard tổng quan",
      },
      {
        userTypes: [],
        userType: 6,
        href: "#",
        name: "Phòng",
        icon: "fal fa-database",
        menus: [
          {
            href: "/admin/danh-sach-phong",
            name: "Danh sách phòng",
          },
          {
            href: "/admin/loai-phong",
            name: "Loại phòng",
          },
          {
            href: "/admin/dich-vu",
            name: "Dịch vụ",
          },
          {
            href: "/admin/phieu-dat-phong",
            name: "Phiếu đặt phòng",
          },
          {
            href: "/admin/phieu-thue-phong",
            name: "Phiếu thuê phòng",
          },
          {
            href: "/admin/phieu-dich-vu",
            name: "Phiếu dịch vụ",
          },
        ],
      },
      {
        userTypes: [6],
        userType: 6,
        href: "#",
        name: "Đối tác",
        icon: "fal fa-radiation",
        menus: [
          {
            href: "/admin/khach-hang",
            name: "Khách hàng",
          },
        ],
      },
      {
        userTypes: [6],
        userType: 6,
        href: "#",
        name: "Nhân sự",
        icon: "fal fa-user-cog",
        menus: [
          {
            href: "/admin/phong-ban",
            name: "Phòng ban",
          },
          {
            href: "/admin/nhan-vien",
            name: "Nhân viên",
          },
        ],
      },
      {
        userTypes: [6],
        userType: 6,
        href: "#",
        name: "Tin tức",
        icon: "fal fa-radiation",
        menus: [
          {
            href: "/admin/tin-tuc",
            name: "Tin tức",
          },
        ],
      },
      {
        userTypes: [6],
        userType: 6,
        href: "#",
        name: "Báo cáo",
        icon: "fal fa-radiation",
        menus: [
          {
            href: "/admin/bao-cao",
            name: "Báo cáo",
          },
        ],
      },
    ];
    return allMenus.filter((item) => {
      // const currentRole = (props.auth && props.auth.authorities) || [];
      // const isAuthorized = currentRole.some((permission) =>
      //   item.userType.includes(permission)
      // ); 
      const isAuthorized = props.auth?.roles?.map(i => i?.value)?.includes(item?.userType);
      if (!item.userType) return true;
      if (isAuthorized) return true;
    });
  };
  useEffect(() => {
    try {
      window.initApp.listFilter(
        $("#js-nav-menu"),
        $("#nav_filter_input"),
        $("#js-primary-nav")
      );
    } catch (error) { }
  });
  useEffect(() => {
    setState({ menus: getMenu() });
    if (menus.current) {
      setState({ menus: menus.current });
    }
  }, []);
  const toggle = (item) => {
    item.open = !item.open;
    menus.current = [...state.menus];
    setState({ menus: menus.current });
  };
  return (
    <aside className="page-sidebar list-filter-active">
      <div className="page-logo" style={{ padding: 0, height: 66 }}>
        <a
          href="#"
          className={`page-logo-link 
          press-scale-down 
          d-flex align-items-center position-relative`}
          style={{ padding: "5px 10px", width: "65%" }}
        >
          <img
            src={require("resources/images/logo.png")}
            alt="Kzone The Star Hotel"
            className="site-logo"
            aria-roledescription="logo"
          />
          {/* <span className="site-name">Kzone The Star Hotel</span> */}
        </a>
      </div>
      <nav
        id="js-primary-nav"
        className="primary-nav js-list-filter"
        role="navigation"
      >
        <div className="nav-filter">
          <div className="position-relative">
            <input
              type="text"
              id="nav_filter_input"
              placeholder="Tìm kiếm tính năng"
              className="form-control"
              tabIndex="0"
            />
            <a
              href="#"
              onClick={() => {
                return false;
              }}
              className="btn-primary btn-search-close js-waves-off"
              data-action="toggle"
              data-class="list-filter-active"
              data-target=".page-sidebar"
            >
              <i className="fal fa-chevron-up"></i>
            </a>
          </div>
        </div>
        <div className="info-card">
          <img
            src="/img/demo/avatars/avatar-admin.png"
            className="profile-image rounded-circle"
            alt={props.auth && props.auth?.username}
          />
          <div className="info-card-text">
            <a href="#" className="d-flex align-items-center text-white">
              <span className="text-truncate text-truncate-sm d-inline-block">
                {props.auth && props.auth?.username}
              </span>
            </a>
            {/* {props.auth && props.auth.email && (
              <span className="d-inline-block text-truncate text-truncate-sm">
                {props.auth && props.auth.email}
              </span>
            )} */}
          </div>
          <img
            src="/img/card-backgrounds/cover-2-lg.png"
            className="cover"
            alt="cover"
          />
          <a
            href="#"
            onClick={() => {
              return false;
            }}
            className="pull-trigger-btn"
            data-action="toggle"
            data-class="list-filter-active"
            data-target=".page-sidebar"
            data-focus="nav_filter_input"
          >
            <i className="fal fa-angle-down"></i>
          </a>
        </div>
        <ul id="js-nav-menu" className="nav-menu">
          {state.menus &&
            state.menus.length &&
            state.menus.map((item, index) => {
              return (
                <ItemMenu
                  key={index}
                  item={item}
                  toggle={toggle}
                  auth={props.auth}
                />
              );
            })}
        </ul>
        <div className="filter-message js-filter-message bg-success-600"></div>
      </nav>
      <div className="nav-footer shadow-top">
        <a
          href="#"
          onClick={() => {
            return false;
          }}
          data-action="toggle"
          data-class="nav-function-minify"
          className="hidden-md-down"
        >
          <i className="ni ni-chevron-right"></i>
          <i className="ni ni-chevron-right"></i>
        </a>
        <ul className="list-table m-auto nav-footer-buttons"></ul>
      </div>
    </aside>
  );
};
export default connect((state) => {
  return {
    auth: state.auth.auth,
  };
})(SideBar);
