import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table } from "site/admin/components/common";
import moment from "moment";
import { InputNumber, Button } from "antd";
import { Main } from "./styled";

function BookedRooms({
  listRoomsOfBooking,
  filterOption,
  ...props
}) {
  const [state, _setState] = useState({});

  const setState = (_state) => {
    _setState((state) => ({
      ...state,
      ...(_state || {}),
    }));
  };

  const onClick = (key = undefined) => e => {

  }

  const udpateListPricePerDays = (type, row) => e => {
    const value = e?.hasOwnProperty("target")
      ? e.target.value
      : e?.hasOwnProperty("_d")
        ? moment(e._d).format("YYYY-MM-DD HH:mm:ss")
        : e;
    // const index = listPricePerDays?.findIndex(item => item?.key == row?.key);

    // if (index != -1) {
    //   let newListPricePerDays = [...listPricePerDays];
    //   newListPricePerDays[index][type] = value;
    //   updateState({ listPricePerDays: [...newListPricePerDays] });
    // }
  }

  useEffect(() => {
    const item = props.currentItem;
    const url = new URL(window.location.href);
    const mode = url.searchParams.get("mode");

    //TODO: set state with new current item
    setState({
      // isReadOnly:
    });
  }, [props.currentItem]);

  return (
    <Main>
      <Table
        scroll={{ x: 800, y: 500 }}
        className="custom"
        rowKey={"key"}
        columns={[
          {
            title: (
              <div className="custome-header">
                <div className="title-box">Số phòng</div>
              </div>
            ),
            width: 180,
            dataIndex: "roomNumber",
            align: "center",
            key: "col3",
          },
          {
            title: (
              <div className="custome-header">
                <div className="title-box">Giá phòng</div>
              </div>
            ),
            width: 180,
            dataIndex: "price",
            align: "center",
            key: "col3",
            render: (item, row, index) => {
              return (
                <InputNumber
                  disabled={state.isReadOnly}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  min={0}
                  placeholder="Giá "
                  value={item}
                // onChange={}
                />
              );
            },
          },
          {
            title: (
              <div className="custome-header">
                <div className="title-box">Số người lớn</div>
              </div>
            ),
            width: 150,
            dataIndex: "adultNumber",
            key: "col4",
            align: "center",
            render: (item, row, index) => {
              return (
                <InputNumber
                  disabled={state.isReadOnly}
                  min={1}
                  defaultValue={item}
                // onChange={}
                />
              );
            },
          },
          {
            title: (
              <div className="custome-header">
                <div className="title-box">Số trẻ em</div>
              </div>
            ),
            width: 150,
            dataIndex: "childNumber",
            key: "col4",
            align: "center",
            render: (item, row, index) => {
              return (
                <InputNumber
                  disabled={state.isReadOnly}
                  min={1}
                  defaultValue={item}
                // onChange={}
                />
              );
            },
          },
          {
            title: (
              <div className="custome-header">
                <div className="title-box">Số giường</div>
              </div>
            ),
            width: 150,
            dataIndex: "numberOfBed",
            key: "col4",
            align: "center",
            render: (item, row, index) => {
              return (
                item
              );
            },
          },
          {
            title: (
              <div className="custome-header">
                <div className="title-box">Action</div>
              </div>
            ),
            width: 80,
            dataIndex: "key",
            key: "col4",
            align: "center",
            render: (item, row, index) => {
              return (
                <div className="list-action">
                  <Button
                    type="primary"
                    size="small"
                    icon="delete"
                    onClick={onClick(row.key)}
                  />
                </div>
              );
            },
          },
        ]}
        dataSource={listRoomsOfBooking}
      />
    </Main>
  );
}
export default connect(
  (state) => ({
    listRoomsOfBooking: state.booking.listRoomsOfBooking || [],
  }),
  ({

  }) => {
    return {

    };
  }
)(BookedRooms);
