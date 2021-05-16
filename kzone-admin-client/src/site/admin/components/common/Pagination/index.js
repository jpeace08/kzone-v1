import { Select } from "antd";
import React from "react";
import "./style.scss";

export default function index(props) {
  let className = "pagination-table ";
  if (props.className) className += props.className;
  // const selectItem = (item) => () => {
  //     if (props.selectItem) {
  //         props.selectItem(item);
  //     }
  // }
  let { page, size, total } = props;
  let current = page * size;
  current = Math.min(current, total);
  let listPage = [];
  let _totalPage = " ";
  if (Math.floor(total / size) === total / size) {
    _totalPage = Math.floor(total / size);
  } else {
    _totalPage = 1 + Math.floor(total / size);
  }
  for (let i = page - 2; i < page + 2; i++) {
    if (i > 0 && i <= _totalPage) listPage.push(i);
  }
  let totalPage = parseInt(total / size);
  if (totalPage * size < total) totalPage += 1;
  if (page > totalPage) {
    page = totalPage;
  }
  if (page <= 0) page = 1;
  const onClick = (type) => () => {
    if (props.onPageChange) {
      if (type === 0) {
        if (page > 1) props.onPageChange(page - 1);
      } else {
        if (page < totalPage) props.onPageChange(page + 1);
      }
    }
  };
  const onChangeSize = (e) => {
    props.onChangeSize(e);
  }
  return (
    <div className={className}>
      <div style={{ flex: 1 }}>
        Số bản ghi:<Select
          defaultValue={props.size}
          style={{ minWidth: 100, marginLeft: 15 }}
          onSelect={onChangeSize}
        >
          <Select.Option value={10}>10</Select.Option>
          <Select.Option value={20}>20</Select.Option>
          <Select.Option value={50}>50</Select.Option>
          <Select.Option value={100}>100</Select.Option>
        </Select>
      </div>
      <label className="label">
        {" "}

        {total > 0 ? `1 - ${current} trong ${total}` : ""}{" "}

      </label>
      <img
        className="btn-pre"
        src={require("./images/left.png")}
        onClick={onClick(0)}
        alt=" "
      />
      {listPage &&
        listPage.length &&
        listPage.map((option, index) => {
          return (
            <label
              key={index}
              className={"current-page " + (page === option ? "active" : "")}
              onClick={() => {
                props.onPageChange(option);
              }}
            >
              {option}
            </label>
          );
        })}
      {/* <label className='current-page'>
                {
                    page
                }
            </label> */}
      <img
        className="btn-next"
        src={require("./images/right.png")}
        onClick={onClick(1)}
        alt=" "
      />
    </div>
  );
}
