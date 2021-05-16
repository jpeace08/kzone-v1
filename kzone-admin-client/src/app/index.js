import React, { useEffect } from "react";
import { connect } from "react-redux";

import { ThemeProvider } from "styled-components";
import { pink } from "themes";
import Admin from "site/admin";
import Auth from "site/user/containers/auth/LoginScreen";
import { Main } from "./styled";
import { ConfigProvider } from "antd";
import viVN from "antd/es/locale/vi_VN";
import RouterWithPaths from "components/RouterWithPaths";

import { Switch } from "react-router-dom";
import { useHistory } from "react-router-dom";

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

const App = (props) => {
  const history = useHistory();

  useEffect(() => {
    reportWindowSize();
    window.addEventListener("resize", reportWindowSize);
    return () => {
      window.removeEventListener("resize", reportWindowSize);
    };
  }, []);
  const reportWindowSize = () => {
    props.updateApplication({
      width: window.innerWidth,
    });
  };
  const logout = connect(null, ({ auth: { onLogout } }) => ({ onLogout }))(
    (props) => {
      props.onLogout();
      return null;
    }
  );
  String.prototype.uintTextBox = function () {
    var re = /^\d*$/;
    return re.test(this);
  };
  const routers = [
    {
      path: ["/login"],
      component: Auth,
    },
    {
      path: ["/logout"],
      component: logout,
    },
    {
      path: ["/admin", "/"],
      component: Admin,
    },
  ];
  return (
    <Main>
      <ThemeProvider theme={pink}>
        <ConfigProvider locale={viVN}>
          <Switch>
            {routers.map((route, key) => {
              if (route.component)
                return (
                  <RouterWithPaths
                    key={key}
                    path={route.path}
                    render={(props) => {
                      return <route.component {...props} />;
                    }}
                  />
                );
              return null;
            })}
          </Switch>
        </ConfigProvider>
      </ThemeProvider>
    </Main>
  );
};

const mapState = (state) => ({
  auth: state.auth.auth,
});

const mapDispatch = ({
  auth: { onLogin, updateData },
  application: { updateData: updateApplication },
}) => ({
  onLogin,
  updateData,
  updateApplication,
});

export default connect(mapState, mapDispatch)(App);
