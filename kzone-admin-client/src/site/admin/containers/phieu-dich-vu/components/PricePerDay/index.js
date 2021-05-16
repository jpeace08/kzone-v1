import React, { useEffect, useState, useRef, useMemo } from "react";
import { connect } from "react-redux";
import { Table } from "site/admin/components/common";
import moment from "moment";
import { InputNumber, Button } from "antd";
import { Main } from "./styled";

function PricePerDay({
  filterOption,
  listPricePerDays,
  addOrRemovePrice,
  updateState,
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
    addOrRemovePrice({ key });
  }

  const udpateListPricePerDays = (type, row) => e => {
    const value = e?.hasOwnProperty("target")
      ? e.target.value
      : e?.hasOwnProperty("_d")
        ? moment(e._d).format("YYYY-MM-DD HH:mm:ss")
        : e;
    const index = listPricePerDays?.findIndex(item => item?.key == row?.key);

    if (index != -1) {
      let newListPricePerDays = [...listPricePerDays];
      newListPricePerDays[index][type] = value;
      updateState({ listPricePerDays: [...newListPricePerDays] });
    }
  }

  useEffect(() => {
    const item = props.currentItem;
    const url = new URL(window.location.href);
    const mode = url.searchParams.get("mode");

    //TODO: set state with new current item
    setState({
      // isReadOnly:
      //   item?.statusPay == STATUS_PAY.daThanhToan || mode == "view" || false,
    });
  }, [props.currentItem]);

  let listPrices = useMemo(() => {
    let arr = [...listPricePerDays];
    arr.push({ id: -1, key: -1 });
    return arr;
  }, [listPricePerDays]);

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
                <div className="title-box">Giá phòng</div>
              </div>
            ),
            width: 180,
            dataIndex: "price",
            align: "center",
            key: "col3",
            render: (item, row, index) => {
              return row?.id != -1 ? (
                <InputNumber
                  disabled={state.isReadOnly}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  min={0}
                  placeholder="Giá "
                  value={item}
                  onChange={udpateListPricePerDays("price", row)}
                />
              ) : (
                <Button
                  type="link"
                  onClick={onClick()}
                >
                  Add new price
                </Button>
              );
            },
          },
          {
            title: (
              <div className="custome-header">
                <div className="title-box">Số người</div>
              </div>
            ),
            width: 150,
            dataIndex: "numberOfPerson",
            key: "col4",
            //align: "center",
            render: (item, row, index) => {
              return row?.id != -1 ? (
                <InputNumber
                  disabled={state.isReadOnly}
                  min={1}
                  defaultValue={item}
                  onChange={udpateListPricePerDays("numberOfPerson", row)}
                />
              ) : null;
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
              return row?.id != -1 ? (
                <InputNumber
                  disabled={state.isReadOnly}
                  min={1}
                  defaultValue={item}
                  onChange={udpateListPricePerDays("numberOfBed", row)}
                />
              ) : null;
            },
          },
          {
            title: (
              <div className="custome-header">
                <div className="title-box">Action</div>
              </div>
            ),
            width: 50,
            dataIndex: "key",
            key: "col4",
            align: "center",
            render: (item, row, index) => {
              return row?.key != -1 ? (
                <div className="list-action">
                  <Button
                    type="primary"
                    size="small"
                    icon="delete"
                    onClick={onClick(row.key)}
                  >
                    Xóa
                  </Button>
                </div>
              ) : null;
            },
          },
        ]}
        dataSource={listPrices}
      />
    </Main>
  );
}
export default connect(
  (state) => ({
    currentItem: state.roomType.currentItem,
    listPricePerDays: state.roomType.listPricePerDays || [],
  }),
  ({
    roomType: {
      addOrRemovePrice,
      updateState,
    }
  }) => {
    return {
      addOrRemovePrice,
      updateState,
    };
  }
)(PricePerDay);
