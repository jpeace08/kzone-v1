import React, { useEffect, useState, useRef, useMemo } from "react";
import { connect } from "react-redux";
import { AdminPage, Panel, FilterBox } from "site/admin/components/admin";
import { Pagination, Table } from "site/admin/components/common";
import { Main } from "./styled";
import {
  Input,
  Button,
  Modal,
  Spin,
  Icon,
  Checkbox,
  message,
  Tooltip,
} from "antd";
const { Search } = Input;
const { confirm } = Modal;

const listSearchKey = [];

function Booking({
  page,
  size,
  total,
  isLoading,
  listBookings,
  onDeleteBooking,
  onSearchBooking,
  ...props
}) {
  const refTimeOut = useRef(null);
  let bookingIds = listBookings?.map((i) => i.id);
  const [state, _setState] = useState({
    selectedItem: [],
    showCheckBox: true,
    expandedRowKeys: new Set(),
  });

  const setState = (_state) => {
    _setState((state) => ({
      ...state,
      ...(_state || {}),
    }));
  };

  const onChangeInput = (type) => (e) => {
    if (refTimeOut.current) {
      clearTimeout(refTimeOut.current);
      refTimeOut.current = null;
    }
    refTimeOut.current = setTimeout(
      (value) => {
        // onChangeInputSearch({
        //   [type]: value.trim(),
        // });
      },
      300,
      e.target.value
    );
  };

  const onChange = (type) => (e) => {
    let value = e?.hasOwnProperty("target")
      ? e.target.value
      : e?.hasOwnProperty("_d")
        ? e._d
        : e;
    setState({ [type]: (value + "").trim() });
  };

  const onChangePage = (page) => {
    // onSearchPhieuMuaHang({ page: page });
  };
  const onChangeSize = (size) => {
    // onSearchPhieuMuaHang({ size: size });
  };
  function showConfirm(item) {
    confirm({
      title: "Xác nhận",
      icon: <Icon type="delete" />,
      content: `Bạn có muốn xóa loại phòng ${item?.name}`,
      okText: "Đồng ý",
      cancelText: "Hủy bỏ",
      onOk() {
        onDeleteBooking({ id: item.id });
      },
    });
  }

  const onClickAction = ({ type = "add", payload = {} }) => (e) => {
    switch (type) {
      case "add":
        if (props.history) {
          props.history.push("/admin/phieu-thue-phong/tao-moi");
        } else window.location.href = "/admin/phieu-thue-phong/tao-moi";
        break;
      case "delete":
        showConfirm(payload);
        break;
      case "edit":
        if (props.history)
          props.history.push(
            "/admin/phieu-thue-phong/" + payload.id + "?mode=edit"
          );
        else
          window.location.href =
            "/admin/phieu-thue-phong/" + payload.id + "?mode=edit";
        break;
      case "view":
        if (props.history)
          props.history.push(
            "/admin/phieu-thue-phong/" + payload.id + "?mode=view"
          );
        else
          window.location.href =
            "/admin/phieu-thue-phong/" + payload.id + "?mode=view";
        break;
      default:
        break;
    }
  };

  const onDeleteMultiple = () => {
    if (state.selectedItem.length > 0) {
      confirm({
        title: "Xác nhận",
        icon: <Icon type="delete" />,
        content: `Bạn có muốn xóa ${state.selectedItem.length} danh mục`,
        okText: "Đồng ý",
        cancelText: "Hủy bỏ",
        onOk() {
          // props.onDeleteMul(state.selectedItem);
          setState({
            selectedItem: [],
          });
        },
      });
      return;
    }
    message.warning("!");
  };

  const onChangeCheckBox = (value) => () => {
    const index = state.selectedItem.indexOf(value);
    if (index != -1) {
      state.selectedItem.splice(index, 1);
      setState({
        selectedItem: [...state.selectedItem],
      });
    } else {
      setState({
        selectedItem: [...state.selectedItem, value],
      });
    }
  };

  const showCheckBox = () => {
    setState({
      showCheckBox: !state.showCheckBox,
      selectedItem: [],
    });
  };

  const onRow = (record, rowIndex) => {
    return {
      onDoubleClick: (event) => {
        showCheckBox();
      }, // double click row
      // onClick: (event) => {
      //   toggleExpandByKey(record?.key);
      // }
    };
  };

  const onChangeCheckBoxAll = (e) => {
    if (!e?.target?.checked) {
      setState({
        selectedItem: state.selectedItem.filter(
          (item, index) => !bookingIds.includes(item)
        ),
      });
    } else {
      setState({
        selectedItem: [...state.selectedItem, ...bookingIds].filter(
          (item, i, self) => item && self.indexOf(item) === i
        ),
      });
    }
  };

  const expandedRowRender = (item, expanded) => {
    return (
      <></>
    );
  }

  // const toggleExpandByKey = (key) => {
  //   let exist = state.expandedRowKeys.has(key);
  //   state.expandedRowKeys.clear();
  //   setState({
  //     viewCurrentItem: listBookings?.find(item => item.key == key),
  //     expandedRowKeys: exist ? state.expandedRowKeys : state.expandedRowKeys.add(key),
  //   });
  // };

  useEffect(() => {
    onSearchBooking({});
  }, []);

  useEffect(() => {
    setState({
      viewCurrentItem: {},
      expandedRowKeys: new Set(),
    });
  }, [page]);

  return (
    <Main>
      <AdminPage>
        <Panel
          title="Quản lý loại phòng"
          icon={[<i className="fal fa-window"></i>]}
          toolbar={
            <div className="panel-tag">
              <div className="right-area">
                {state.selectedItem.length > 0 && (
                  <Button icon="delete" type="danger" onClick={onDeleteMultiple}>
                    Xóa loại phòng
                  </Button>
                )}
                <Button icon="plus" type="primary" onClick={onClickAction({})}>
                  Thêm mới
                </Button>
              </div>
            </div>
          }
        >
          <div className="page-container">
            <div className="page-filter">
              <FilterBox
                title="Tìm kiếm"
                showExpandButton={true}
                showAddButton={false}
              >
                <div className="filter-box">
                  <Search
                    placeholder={"Tìm kiếm theo loại phòng"}
                  // onChange={onChangeInput("name")}
                  />
                </div>
              </FilterBox>
            </div>
            <div className="page-main">
              <div className="fixed">
                <Spin spinning={isLoading}>
                  <Table
                    // isHidden={state.expandedRowKeys?.size < 1}
                    expandIconAsCell={false}
                    expandIconColumnIndex={-1}
                    rowClassName={(record, index) =>
                      state.expandedRowKeys.has(record?.key)
                        ? "table-row-selected"
                        : index % 2 === 0
                          ? "table-row-light"
                          : "table-row-dark"
                    }
                    // expandedRowRender={expandedRowRender}
                    // expandedRowKeys={Array.from(state.expandedRowKeys)}
                    onRow={onRow}
                    scroll={{ x: 800, y: "calc(100vh - 355px)" }}
                    className="custom"
                    rowKey="key"
                    columns={[
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">
                              <Checkbox
                                onChange={onChangeCheckBoxAll}
                                checked={bookingIds?.every(
                                  (item, index, self) =>
                                    state.selectedItem.includes(item)
                                )}
                              />
                            </div>
                          </div>
                        ),
                        width: 70,
                        dataIndex: "id",
                        key: "0",
                        align: "center",
                        hidden: state.showCheckBox,
                        render: (value, row, index) => {
                          return (
                            <Checkbox
                              onChange={onChangeCheckBox(value)}
                              checked={state.selectedItem.includes(value)}
                            />
                          );
                        },
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">Tên loại phòng</div>
                          </div>
                        ),
                        width: 200,
                        dataIndex: "name",
                        key: "1",
                        align: "center",
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">Tổng số phòng</div>
                          </div>
                        ),
                        width: 150,
                        dataIndex: "totalRoom",
                        key: "2",
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">Giá theo giờ</div>
                          </div>
                        ),
                        width: 150,
                        dataIndex: "shortTimePrice",
                        key: "3",
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">Giá qua đêm</div>
                          </div>
                        ),
                        width: 150,
                        dataIndex: "overNightPrice",
                        key: "4",
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">Phụ thu</div>
                          </div>
                        ),
                        width: 150,
                        dataIndex: "surcharge",
                        key: "5",
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">Giảm giá (%)</div>
                          </div>
                        ),
                        width: 100,
                        dataIndex: "discountHoliday",
                        key: "6",
                      },
                      // {
                      //   title: (
                      //     <div className="custome-header">
                      //       <div className="title-box">Số giường</div>
                      //     </div>
                      //   ),
                      //   width: 100,
                      //   dataIndex: "bedNumber",
                      //   key: "7",
                      // },
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">Số người lớn</div>
                          </div>
                        ),
                        width: 100,
                        dataIndex: "adultNumber",
                        key: "8",
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">Số trẻ em</div>
                          </div>
                        ),
                        width: 100,
                        dataIndex: "childNumber",
                        key: "9",
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">Mô tả</div>
                          </div>
                        ),
                        width: 200,
                        dataIndex: "description",
                        key: "10",
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">Action</div>
                          </div>
                        ),
                        width: 150,
                        key: "11",
                        //align: "center",
                        // fixed: "right",
                        render: (value, item, index) => {
                          return (
                            <div className="list-action">
                              <Tooltip title="Xem thông tin loại phòng">
                                <Button
                                  type="primary"
                                  icon="eye"
                                  size="small"
                                  onClick={onClickAction({
                                    type: "view",
                                    payload: item,
                                  })}
                                />
                              </Tooltip>
                              <Tooltip title="Chỉnh sửa thông tin loại phòng">
                                <Button
                                  type="primary"
                                  icon="edit"
                                  size="small"
                                  onClick={onClickAction({
                                    type: "edit",
                                    payload: item,
                                  })}
                                />
                              </Tooltip>
                              <Tooltip title="Xóa thông tin loại phòng">
                                <Button
                                  type="primary"
                                  icon="delete"
                                  size="small"
                                  onClick={onClickAction({
                                    type: "delete",
                                    payload: item,
                                  })}
                                />
                              </Tooltip>
                            </div>
                          );
                        },
                      },
                    ]}
                    dataSource={listBookings}
                  />
                  {/* {state.expandedRowKeys.size < 1 && ( */}
                  <div className="footer">
                    {total > 0 && (
                      <Pagination
                        onPageChange={onChangePage}
                        onChangeSize={onChangeSize}
                        page={page}
                        size={size}
                        total={total}
                        style={{ justifyContent: "flex-end" }}
                      />
                    )}
                  </div>
                </Spin>
              </div>
            </div>
          </div>
        </Panel>
      </AdminPage>
    </Main >
  );
}
export default connect(
  (state) => ({
    page: state.booking.page || 0,
    size: state.booking.size || 10,
    total: state.booking.totalElements || 0,
    isLoading: state.booking.isLoading || false,
    listBookings: state.booking.listBookings || [],
  }),
  ({
    booking: {
      onDelete: onDeleteBooking,
      onSearch: onSearchBooking,
    }
  }) => {
    return {
      onDeleteBooking,
      onSearchBooking,
    };
  }
)(Booking);
