import React, { useEffect, useState, useRef, useMemo } from "react";
import { connect } from "react-redux";
import { AdminPage, Panel, FilterBox } from "site/admin/components/admin";
import { Pagination, Table } from "site/admin/components/common";
import ModalAddRoom from "site/admin/components/ModalAddRoom";
import { Main } from "./styled";
import {
  Input,
  Select,
  Button,
  Modal,
  Spin,
  Icon,
  Checkbox,
  message,
  Tooltip,
  Tag,
} from "antd";
import { STATUS_ROOM } from "constant";

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

const generateFloor = () => {
  let floors = [];
  for (let index = 1; index <= 50; index++) {
    floors.push(index);
  }
  return floors;
}

function Room({
  total,
  size,
  page,
  sortType,
  isLoading,
  isLoadingCreate,
  listRooms,
  listTypeOfRooms,
  onSearchRoomType,
  onSearchRoom,
  onDeleteRoom,
  onChangeInputSearch,
  ...props
}) {
  const refTimeOut = useRef(null);
  const refAddRoom = useRef(null);
  const roomIds = listRooms.map((item) => item?.id);
  const floors = generateFloor();

  const [state, _setState] = useState({
    expandedRowKeys: new Set(),
    showCheckBox: false,
    selectedItem: [],
    floor: "",
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
        onChangeInputSearch({
          [type]: value.trim(),
        });
      },
      300,
      e.target.value
    );
  };

  const onChangeSelect = (type) => (e) => {
    onChangeInputSearch({
      [type]: e && e.target ? e.target.value : e,
    });
  };

  const onChange = (type) => e => {
    setState({
      [type]: e?.hasOwnProperty("target")
        ? e.target.value
        : e?.hasOwnProperty("_d")
          ? e._d
          : e
    })
  }

  const onChangePage = (page) => {
    // props.onSearchHangHoa({ page: page });
  };
  const onChangeSize = (size) => {
    // props.onSearchHangHoa({ size: size });
  };
  function showConfirm(item) {
    confirm({
      title: "Xác nhận",
      icon: <Icon type="delete" />,
      content: `Bạn có muốn xóa phòng ${item.numberRoom}`,
      okText: "Đồng ý",
      cancelText: "Hủy bỏ",
      onOk() {
        onDeleteRoom({ id: item.id });
      },
    });
  }

  const onClickAction = ({ type = "add", payload = {} }) => (e) => {
    switch (type) {
      case "add":
        showModalAddRoom({}, false);
        break;
      case "delete":
        showConfirm(payload);
        break;
      case "edit":
        showModalAddRoom(payload, false);
        break;
      case "view":
        // showHangHoaChiTiet(payload);
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
          // props.onDeleteMultiple(state.selectedItem);
        },
      });
      return;
    }
    message.warning("Bạn chưa chọn danh mục sản phẩm nào");
  };

  const showModalAddRoom = (payload, isReadOnly) => {
    if (refAddRoom.current) {
      refAddRoom.current.show(payload, isReadOnly);
    }
  };

  const filterOption = (input, option) => {
    return (
      (option.props.name || option.props.children)
        ?.toLowerCase()
        .createUniqueText()
        .indexOf(input.toLowerCase().createUniqueText()) >= 0
    );
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
      },
    };
  };

  const onChangeCheckBoxAll = (e) => {
    if (!e?.target?.checked) {
      setState({
        selectedItem: state.selectedItem.filter(
          (item, index) => !roomIds.includes(item)
        ),
      });
    } else {
      setState({
        selectedItem: [...state.selectedItem, ...roomIds].filter(
          (item, i, self) => item && self.indexOf(item) === i
        ),
      });
    }
  };

  useEffect(() => {
    onSearchRoom({
      dataSearch: {
        floor: state.floor,
      }
    });
  }, [state.floor]);

  useEffect(() => {
    onSearchRoomType({
      dataSearch: {
        size: 999,
      }
    });
    onSearchRoom({});
  }, []);

  return (
    <Main>
      <AdminPage>
        <Panel
          title="Quản lý phòng"
          icon={[<i className="fal fa-window"></i>]}
          toolbar={
            <div className="panel-tag">
              <div className="right-area">
                <Select
                  style={{ minWidth: 100, marginRight: 10 }}
                  placeholder="Floor"
                  onChange={onChange("floor")}
                  value={state.floor}
                >
                  <Option key={`col${0}`} value="">Tất cả</Option>
                  {floors?.map((floor, index) => (
                    <Option key={`op${index + 1}`} value={floor}>
                      {floor}
                    </Option>
                  ))}
                </Select>
                {state.selectedItem.length > 0 && (
                  <Button
                    icon="delete"
                    type="danger"
                    onClick={onDeleteMultiple}
                  >
                    Xóa phòng
                  </Button>
                )}
                <Button icon="plus" type="primary" onClick={onClickAction({})}>
                  Thêm phòng
                </Button>
              </div>
            </div>
          }
        >
          <div className="page-container">
            <div className="page-filter">
              <FilterBox
                title="Loại phòng"
                showAddButton={false}
                showExpandButton={true}
              >
                <Select
                  placeholder="Tìm kiếm loại phòng"
                  onChange={onChangeSelect("roomTypeId")}
                >
                  <Option value="">===Tất cả===</Option>
                  {listTypeOfRooms?.map((t, index) => (
                    <Option key={index} value={t.id}>
                      {t.name}
                    </Option>
                  ))}
                </Select>
              </FilterBox>
              <FilterBox
                title="Số phòng"
                showExpandButton={true}
                showAddButton={false}
              >
                <Search
                  // value={state.search}
                  placeholder="Tìm theo số phòng"
                  onChange={onChangeInput("roomNumber")}
                />
              </FilterBox>
              <FilterBox
                title="Trạng thái phòng"
                showAddButton={false}
                showExpandButton={true}
              >
                <Select
                  placeholder="Tìm kiếm theo trạng thái phòng"
                  onChange={onChangeSelect("status")}
                >
                  <Option value="">===Tất cả===</Option>
                  {STATUS_ROOM?.map((s, index) => (
                    <Option key={index} value={s?.value}>
                      {s?.title}
                    </Option>
                  ))}
                </Select>
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
                                checked={roomIds?.every(
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
                        hidden: !state.showCheckBox,
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
                            <div className="title-box">Số phòng</div>
                          </div>
                        ),
                        width: 150,
                        dataIndex: "roomNumber",
                        key: "1",
                        align: "center",
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">Số giường</div>
                          </div>
                        ),
                        width: 150,
                        dataIndex: "numberOfBed",
                        key: "2",
                        align: "center",
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">Trạng thái</div>
                          </div>
                        ),
                        width: 150,
                        dataIndex: "status",
                        key: "3",
                        align: "center",
                        render: (value, item, index) => {
                          const status = STATUS_ROOM?.find(i => i.value == value);
                          return (
                            <Tag color={status.color}>{status.title}</Tag>
                          );
                        }
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">Tầng</div>
                          </div>
                        ),
                        width: 150,
                        dataIndex: "floor",
                        key: "4",
                        align: "center",
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">Loại phòng</div>
                          </div>
                        ),
                        width: 150,
                        dataIndex: "roomType",
                        key: "5",
                        align: "center",
                        render: (value, item, index) => {
                          return value?.name;
                        }
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">Action</div>
                          </div>
                        ),
                        width: 150,
                        key: "6",
                        align: "center",
                        fixed: "right",
                        render: (value, item, index) => {
                          return (
                            <div className="list-action">
                              <Tooltip title="Xem thông tin phòng">
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
                              <Tooltip title="Chỉnh sửa thông tin phòng">
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
                              <Tooltip title="Xóa thông tin phòng">
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
                    dataSource={listRooms}
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
          <ModalAddRoom wrappedComponentRef={refAddRoom} />
        </Panel>
      </AdminPage>
    </Main>
  );
}
export default connect(
  (state) => ({
    page: state.room.page || 0,
    size: state.room.size || 10,
    total: state.room.totalElement || 0,
    isLoading: state.room.isLoading || false,
    isLoadingCreate: state.room.isLoadingCreate || false,
    listRooms: state.room.listRooms || [],
    listTypeOfRooms: state.roomType.listTypeOfRooms || [],
  }),
  ({
    roomType: {
      onSearch: onSearchRoomType,
    },
    room: {
      onSearch: onSearchRoom,
      onDelete: onDeleteRoom,
      onChangeInputSearch,
    }
  }) => {
    return {
      onSearchRoomType,
      onSearchRoom,
      onDeleteRoom,
      onChangeInputSearch,
    };
  }
)(Room);
