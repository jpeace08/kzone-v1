import React, { useState, useLayoutEffect } from "react";
import { Main } from "./styled";
import { Icon } from "antd";
import AnimateHeight from "react-animate-height";
const FilterBox = (props) => {
  const [state, _setState] = useState({
    expand: true,
  });

  const setState = (_state) => {
    _setState((state) => ({
      ...state,
      ...(_state || {}),
    }));
  };

  const onExpandButtonClick = () => {
    setState({
      expand: !state.expand,
    });
  };

  const onAddButtonClick = () => {
    if (props.onAddButtonClick) props.onAddButtonClick();
  };
  return (
    <Main
      className={`card border ${state.expand ? "expand" : ""}`}
      expand={state.expand}
    >
      <div className="card-header bg-info-600">
        <span className="box-title">{props.title} </span>
        <div className="right-area">
          {props.showAddButton && (
            <div className="btn-add" onClick={onAddButtonClick}>
              <Icon type="plus-circle" />
            </div>
          )}
          {props.showExpandButton && (
            <div className="btn-expand" onClick={onExpandButtonClick}>
              <Icon type="down-circle" />
            </div>
          )}
        </div>
      </div>
      <AnimateHeight
        className="card-body p-0 bg-info-300"
        duration={200}
        height={state.expand ? "auto" : 0}
      >
        <div className="card-childen">{props.children}</div>
      </AnimateHeight>
      <div className="card-footer bg-info-800 py-2"></div>
    </Main>
  );
};
export default FilterBox;
