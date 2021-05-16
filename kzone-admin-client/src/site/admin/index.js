import React, { useEffect } from "react";
import Loadable from "react-loadable";
import { Switch } from "react-router-dom";
import RouterWithPaths from "components/RouterWithPaths";
import {
  SideBar,
  Header,
  Breadcrumbs,
  Footer,
  SettingLayout,
} from "site/admin/components/admin";
import { connect } from "react-redux";
import "antd/dist/antd.css";
import { Loading } from "site/admin/components/admin";
import { Main } from "./styled";
const Admin = (props) => {
  useEffect(() => {
    window.registerEvent();
  });
  const checkAdmin = (url) => {
    if (props.auth.role == 4) {
      return () => import(`${url}`);
    }
    return () => import("site/admin/containers/home");
  }

  const routers = [
    {
      roles: [],
      path: ["/admin", "/admin/dashboard", "/", ""],
      component: Loadable({
        loader: () => import("site/admin/containers/home"),
        loading: Loading,
      }),
    },
    {
      roles: [],
      path: "/admin/danh-sach-phong",
      component: Loadable({
        loader: () => import("site/admin/containers/phong"),
        loading: Loading,
      }),
    },
    {
      roles: [],
      path: "/admin/loai-phong",
      component: Loadable({
        loader: () => import("site/admin/containers/loai-phong"),
        loading: Loading,
      }),
    },
    {
      roles: [],
      path: "/admin/loai-phong/:id",
      component: Loadable({
        loader: () => import("site/admin/containers/loai-phong/tao-moi"),
        loading: Loading,
      }),
    },
    {
      roles: [],
      path: "/admin/loai-phong/tao-moi",
      component: Loadable({
        loader: () => import("site/admin/containers/loai-phong/tao-moi"),
        loading: Loading,
      }),
    },
    {
      roles: [],
      path: "/admin/dich-vu",
      component: Loadable({
        loader: () => import("site/admin/containers/dich-vu"),
        loading: Loading,
      }),
    },
    {
      roles: [],
      path: "/admin/admin/phieu-dat-phong",
      component: Loadable({
        loader: () => import("site/admin/containers/phieu-dat-phong"),
        loading: Loading,
      }),
    },
    {
      roles: [],
      path: "/admin/phieu-thue-phong",
      component: Loadable({
        loader: () => import("site/admin/containers/phieu-thue-phong"),
        loading: Loading,
      }),
    },
    {
      roles: [],
      path: "/admin/phieu-dich-vu",
      component: Loadable({
        loader: () => import("site/admin/containers/phieu-dich-vu"),
        loading: Loading,
      }),
    },
    {
      roles: [],
      path: "/admin/phieu-dich-vu/:id",
      component: Loadable({
        loader: () => import("site/admin/containers/phieu-dich-vu/tao-moi"),
        loading: Loading,
      }),
    },
    {
      roles: [],
      path: "/admin/phieu-thue-phong/:id",
      component: Loadable({
        loader: () => import("site/admin/containers/phieu-thue-phong/tao-moi"),
        loading: Loading,
      }),
    },
    {
      roles: [],
      path: "/admin/phieu-dich-vu/tao-phieu",
      component: Loadable({
        loader: () => import("site/admin/containers/phieu-dich-vu/tao-moi"),
        loading: Loading,
      }),
    },
    {
      roles: [],
      path: "/admin/phieu-thue-phong/tao-phieu",
      component: Loadable({
        loader: () => import("site/admin/containers/phieu-thue-phong/tao-moi"),
        loading: Loading,
      }),
    },
    {
      roles: [],
      role: 4,
      path: "/admin/phong-ban",
      component: Loadable({
        loader: () => import("site/admin/containers/phong-ban"),
        loading: Loading,
      }),
    },
    {
      roles: [],
      role: 4,
      path: "/admin/nhan-vien",
      component: Loadable({
        loader: () => import("site/admin/containers/nhan-vien"),
        loading: Loading,
      }),
    },

    {
      roles: [],
      role: 4,
      path: "/admin/khach-hang",
      component: Loadable({
        loader: () => import("site/admin/containers/khach-hang"),
        loading: Loading,
      }),
    },
    // {
    //   roles: [],
    //   role: 4,
    //   path: "/admin/chiet-khau-nhan-vien",
    //   component: Loadable({
    //     loader: () => import("site/admin/containers/chiet-khau-nhan-vien"),
    //     loading: Loading,
    //   }),
    // },
    // {
    //   roles: [],
    //   role: 4,
    //   path: "/admin/bang-luong",
    //   component: Loadable({
    //     loader: () => import("site/admin/containers/bang-luong"),
    //     loading: Loading,
    //   }),
    // },
  ];
  if (!props.auth || !props.auth?.id) {
    localStorage.clear();
    props.history.push("/login");
    return null;
  }

  return (
    <Main>
      <div className="page-wrapper">
        <div className="page-inner">
          <SideBar />
          <div className="page-content-wrapper">
            <Header />
            <main id="js-page-content" role="main" className="page-content">
              <Breadcrumbs />
              <Switch>
                {routers.map((route, key) => {
                  let roles = props.auth?.roles?.map(item => item?.value);
                  let check = !(route.role) ?
                    true : roles?.includes(route.role) ? true : false

                  if (route.component && check)
                    return (
                      <RouterWithPaths
                        exact
                        key={key}
                        roles={route.roles}
                        path={route.path}
                        render={(props) => {
                          return <route.component {...props} />;
                        }}
                      />
                    );
                  return null;
                })}
              </Switch>
            </main>
            <div
              className="page-content-overlay"
              data-action="toggle"
              data-class="mobile-nav-on"
            ></div>
            <Footer />
            <div
              className="modal fade modal-backdrop-transparent"
              id="modal-shortcut"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="modal-shortcut"
              aria-hidden="true"
            >
              <div
                className="modal-dialog modal-dialog-top modal-transparent"
                role="document"
              >
                <div className="modal-content">
                  <div className="modal-body">
                    <ul className="app-list w-auto h-auto p-0 text-left">
                      <li>
                        <a
                          href="intel_introduction.html"
                          className="app-list-item text-white border-0 m-0"
                        >
                          <div className="icon-stack">
                            <i className="base base-7 icon-stack-3x opacity-100 color-primary-500 "></i>
                            <i className="base base-7 icon-stack-2x opacity-100 color-primary-300 "></i>
                            <i className="fal fa-home icon-stack-1x opacity-100 color-white"></i>
                          </div>
                          <span className="app-list-name">Home</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="page_inbox_general.html"
                          className="app-list-item text-white border-0 m-0"
                        >
                          <div className="icon-stack">
                            <i className="base base-7 icon-stack-3x opacity-100 color-success-500 "></i>
                            <i className="base base-7 icon-stack-2x opacity-100 color-success-300 "></i>
                            <i className="ni ni-envelope icon-stack-1x text-white"></i>
                          </div>
                          <span className="app-list-name">Inbox</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="intel_introduction.html"
                          className="app-list-item text-white border-0 m-0"
                        >
                          <div className="icon-stack">
                            <i className="base base-7 icon-stack-2x opacity-100 color-primary-300 "></i>
                            <i className="fal fa-plus icon-stack-1x opacity-100 color-white"></i>
                          </div>
                          <span className="app-list-name">Add More</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <p id="js-color-profile" className="d-none">
              <span className="color-primary-50"></span>
              <span className="color-primary-100"></span>
              <span className="color-primary-200"></span>
              <span className="color-primary-300"></span>
              <span className="color-primary-400"></span>
              <span className="color-primary-500"></span>
              <span className="color-primary-600"></span>
              <span className="color-primary-700"></span>
              <span className="color-primary-800"></span>
              <span className="color-primary-900"></span>
              <span className="color-info-50"></span>
              <span className="color-info-100"></span>
              <span className="color-info-200"></span>
              <span className="color-info-300"></span>
              <span className="color-info-400"></span>
              <span className="color-info-500"></span>
              <span className="color-info-600"></span>
              <span className="color-info-700"></span>
              <span className="color-info-800"></span>
              <span className="color-info-900"></span>
              <span className="color-danger-50"></span>
              <span className="color-danger-100"></span>
              <span className="color-danger-200"></span>
              <span className="color-danger-300"></span>
              <span className="color-danger-400"></span>
              <span className="color-danger-500"></span>
              <span className="color-danger-600"></span>
              <span className="color-danger-700"></span>
              <span className="color-danger-800"></span>
              <span className="color-danger-900"></span>
              <span className="color-warning-50"></span>
              <span className="color-warning-100"></span>
              <span className="color-warning-200"></span>
              <span className="color-warning-300"></span>
              <span className="color-warning-400"></span>
              <span className="color-warning-500"></span>
              <span className="color-warning-600"></span>
              <span className="color-warning-700"></span>
              <span className="color-warning-800"></span>
              <span className="color-warning-900"></span>
              <span className="color-success-50"></span>
              <span className="color-success-100"></span>
              <span className="color-success-200"></span>
              <span className="color-success-300"></span>
              <span className="color-success-400"></span>
              <span className="color-success-500"></span>
              <span className="color-success-600"></span>
              <span className="color-success-700"></span>
              <span className="color-success-800"></span>
              <span className="color-success-900"></span>
              <span className="color-fusion-50"></span>
              <span className="color-fusion-100"></span>
              <span className="color-fusion-200"></span>
              <span className="color-fusion-300"></span>
              <span className="color-fusion-400"></span>
              <span className="color-fusion-500"></span>
              <span className="color-fusion-600"></span>
              <span className="color-fusion-700"></span>
              <span className="color-fusion-800"></span>
              <span className="color-fusion-900"></span>
            </p>
          </div>
        </div>
      </div>
      <SettingLayout />
    </Main>
  );
};

export default connect((state) => {
  return {
    auth: state.auth.auth,
  };
})(Admin);
