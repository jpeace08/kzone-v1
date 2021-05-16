import React, { useState, useEffect } from "react";
import { Main } from "./styled";
import { connect } from "react-redux";

const RoomItem = ({
  item,
  ...props
}) => {
  const [state, _setState] = useState({});

  const setState = (data = {}) => {
    _setState((state) => {
      return { ...state, ...data };
    });
  };
  console.log(item);
  useEffect(() => {

  }, []);

  return (
    <Main {...props}>
      <div className="row room-number">{item?.roomNumber}</div>
      <div className="row room-bed">{item?.numberOfBed}</div>
      <div className="row room-price__time-hour">{item?.roomType?.shortTimePrice}</div>
      <div className="row room-price__time-overnight">{item?.roomType?.overNightPrice}</div>
      <div className="row room-price__time-day">0-0</div>
    </Main>
  );
};

export default connect()(RoomItem);