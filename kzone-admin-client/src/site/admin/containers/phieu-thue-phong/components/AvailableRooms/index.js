import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Main } from "./styled";
import { Form, Select, Spin } from "antd";
import RoomItem from "site/admin/components/RoomItem";

const { Option } = Select;

const generateFloor = () => {
  let floors = [];
  for (let index = 1; index <= 50; index++) {
    floors.push(index);
  }
  return floors;
}

function AvailableRooms({
  isLoading,
  listRooms,
  listTypeOfRooms,
  onSearch,
  onChangeListRoomsOfBooking,
  filterOption,
  ...props
}) {
  const [state, _setState] = useState({
    numberOfBeds: [],
  });

  const setState = (_state) => {
    _setState((state) => ({
      ...state,
      ...(_state || {}),
    }));
  };
  const { getFieldDecorator } = props.form;

  const onChange = (type) => (e) => {
    setState({
      [type]: e?.hasOwnProperty("target")
        ? e.target.value
        : e?.hasOwnProperty("_d")
          ? moment(e._d).format("YYYY-MM-DD HH:mm:ss")
          : e,
    });
  };

  const onClickRoomItem = (room) => e => {
    onChangeListRoomsOfBooking({ room });
  }

  useEffect(() => {
    const item = props.currentItem;
    const url = new URL(window.location.href);
    const mode = url.searchParams.get("mode");

    // TODO: update state with current item
    setState({

    });
  }, [props.currentItem]);

  useEffect(() => {
    onSearch({
      dataSearch: {
        size: 999,
        roomTypeId: state?.roomType,
        status: 0,
      }
    });
  }, [state.roomType]);

  useEffect(() => {
    onSearch({
      dataSearch: {
        floor: state.floor,
      }
    });
  }, [state.floor]);

  let numberOfBeds = useMemo(() => {
    let data = listRooms?.map(i => i?.numberOfBed);
    return data;
  }, [listRooms]);

  return (
    <Main>
      <Spin spinning={isLoading}>
        <div className="choosen">
          <Select
            value={state.roomType}
            onChange={onChange("roomType")}
            placeholder="Chọn loại phòng"
          >
            <Option key="all" value="">Tất cả</Option>
            {listTypeOfRooms?.map((type, index) => (
              <Option key={`col${index}`} value={type?.id}>
                {type?.name}
              </Option>
            ))}
          </Select>
          <Select
            value={state.numberOfBed}
            onChange={onChange("numberOfBed")}
            placeholder="Số giường"
          >
            <Option key="all" value="">Tất cả</Option>
            {numberOfBeds?.map((i, index) => (
              <Option key={`col${index}`} value={i}>
                {i}
              </Option>
            ))}
          </Select>
          <Select
            value={state.floor}
            onChange={onChange("floor")}
            placeholder="Tầng"
          >
            <Option key="all" value="">Tất cả</Option>
            {generateFloor()?.map((i, index) => (
              <Option key={`col${index}`} value={i}>{i}</Option>
            ))}
          </Select>
        </div>
        <div className="list-room">
          {listRooms?.map((room, index) => (
            <RoomItem
              onClick={onClickRoomItem(room)}
              key={`col${index}`}
              item={room}
            />
          ))}
        </div>
      </Spin>
    </Main>
  );
}
export default Form.create({})(
  connect(
    (state) => ({
      isLoading: state.room.isLoading || false,
      listRooms: state.room.listRooms || [],
      listTypeOfRooms: state.roomType.listTypeOfRooms || [],
    }),
    ({
      room: {
        onSearch,
      },
      booking: {
        onChangeListRoomsOfBooking,
      }
    }) => {
      return {
        onSearch,
        onChangeListRoomsOfBooking,
      };
    }
  )(AvailableRooms)
);
