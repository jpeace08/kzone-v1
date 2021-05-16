import React, { useEffect } from "react";
import stringUtils from "mainam-react-native-string-utils";
import "./style.scss";

const Panel = (props) => {
  useEffect(() => {
    try {
      eval('$("body").smartPanel(); $("[data-original-title]").tooltip();');
    } catch (e) { }
  }, []);
  let x = {};
  if (!props.sortable && props.sortable !== undefined) {
    x["data-panel-sortable"] = true;
  }
  if (props.allowClose === false) {
    x["data-panel-close"] = false;
  }
  x["data-panel-close"] = false;
  if (props.allowFullScreen === false) {
    x["data-panel-fullscreen"] = false;
  }
  x["data-panel-fullscreen"] = false;
  if (props.allowCollapse === false) {
    x["data-panel-collapsed"] = false;
  }
  x["data-panel-collapsed"] = false;
  if (props.allowSetting === false) {
    x["data-panel-setting"] = false;
  }
  x["data-panel-setting"] = false;

  return (
    <div id={props.id || stringUtils.guid()} className="panel" {...x}>
      <div className="panel-hdr color-success-600">
        {Array.isArray(props.icon) ? (
          props.icon[0]
        ) : (
          <img src={props.icon} className="icon-panel" alt="" onError={i => i.target.src = ''} />
        )}
        <h2
          className="ui-sortable-handle"
          onDragOver={(e) => {
            // console.log(e);
          }}
        >
          {props.title}
        </h2>
        {props.toolbar && <div className="panel-toolbar">{props.toolbar}</div>}
      </div>
      <div className="panel-container collapse fullscreen show">
        <div className="panel-content">{props.children}</div>
      </div>
      {props.bottom}
    </div>
  );
}
export default Panel;
