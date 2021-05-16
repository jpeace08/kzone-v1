import React from "react";
import "./style.scss";
export default function() {
  return (
    <div className="admin-loading">
      <div className="lds-dual-ring"></div>
      <div>Đang tải</div>
    </div>
  );
}
