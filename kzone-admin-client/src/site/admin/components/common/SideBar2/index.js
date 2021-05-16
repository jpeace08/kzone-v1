import React, { useState } from "react";

import { Main } from "./styled";
import { Button, Icon } from "antd";

const SideBar2 = ({ children, ...props }) => {
  const [state, _setState] = useState({
    collapsed: false,
  });

  const setState = (_state) => {
    _setState((state) => ({
      ...state,
      ...(_state || {}),
    }));
  };

  const onCollapse = () => {
    setState({ collapsed: !state.collapsed });
  };

  return (
    <Main collapsed={state.collapsed}>
      <div className="filter-bar" width={250}>
        {children}
      </div>
      <Button
        className="btn-collapse"
        type="primary"
        onClick={onCollapse}
        style={{ marginBottom: 16 }}
      >
        {!state.collapsed ? (
          <Icon type="menu-fold" />
        ) : (
          <Icon type="menu-unfold" />
        )}
      </Button>
    </Main>
  );
};

export default SideBar2;
