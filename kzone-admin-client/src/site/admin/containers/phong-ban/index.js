import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { AdminPage, Panel, FilterBox } from "site/admin/components/admin";
import { Table, Pagination, SideBar2 } from "site/admin/components/common";
import { Main } from "./styled";
import { Input, Spin, Button, Icon, Modal, Checkbox, Tooltip, Select } from "antd";
import HeaderSortable from "site/admin/components/common/Table/HeaderSortable";
import ModalAddPhongBan from "site/admin/components/ModalAddPhongBan";
import ModalViewDSNhanVien from "site/admin/components/ModalViewDSNhanVien";
import ThongTinPhongBan from "./components/ThongTinPhongBan";
function PhongBan(props) {
  const refAddPhongBan = useRef(null);
  const refTimeOut = useRef(null);
  const refViewNhanVien = useRef(null);
  const [state, _setState] = useState({
    selectedItem: [],
    showCheckBox: true,
    checkAllItem: false,
    expandedRowKeys: new Set(),
  });
  const idPB = props.dsPhongBan.map((item) => item.id);

  const setState = (_state) => {
    _setState((state) => ({
      ...state,
      ...(_state || {}),
    }));
  };

  const isHidden = (field) => {
    if (props.dsHangHoa.length > 0) {
      const item = props.dsHangHoa[0];
      return item[field] && item[field] == -1;
    }
    return false;
  }

  useEffect(() => {
    props.onSearch({
      dataSearch: {
        name: "",
        idDepartment: "",
      },
    });
  }, []);
  const showAddPhongBan = () => {
    if (refAddPhongBan.current) {
      refAddPhongBan.current.show({});
    }
  };
  const showDSNhanVien = (item) => () => {
    if (refViewNhanVien.current) {
      refViewNhanVien.current.show(item);
    }
  };
  const onViewItem = (item, isReadOnly) => () => {
    if (refAddPhongBan.current) {
      refAddPhongBan.current.show(item, isReadOnly);
    }
  };
  const onChangePage = (page) => {
    props.onSearch({ page: page });
  };

  const onChangeSize = (size) => {
    props.onSearch({ size: size });
  };
  const onChangeCheckBoxAll = (e) => {
    if (!e.target.checked) {
      setState({
        selectedItem: state.selectedItem.filter(
          (item, index) => !idPB.includes(item)
        ),
      });
    } else {
      setState({
        selectedItem: [...state.selectedItem, ...idPB].filter(
          (item, i, self) => item && self.indexOf(item) === i
        ),
      });
    }
  };

  const onRow = (record, rowIndex) => {
    return {
      onDoubleClick: (event) => {
        showCheckBox();
      }, // double click row
      onClick: (e) => {
        toggleExpandByKey(record?.id);
      },
    };
  };

  const toggleExpandByKey = (key) => {
    let exist = state.expandedRowKeys.has(key);
    state.expandedRowKeys.clear();
    setState({
      expandedRowKeys: exist ? state.expandedRowKeys : state.expandedRowKeys.add(key),
    });
  };

  const expandedRowRender = (item, expanded) => {
    return (
      <ThongTinPhongBan item={item} />
    );
  };

  const showCheckBox = () => {
    setState({
      showCheckBox: !state.showCheckBox,
      selectedItem: [],
    });
  };
  const onDeletePB = (item) => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <Icon type="delete" />,
      content: `Bạn có muốn xoá phòng ban ${item.name}?`,
      okText: "Đồng ý",
      cancelText: "Huỷ bỏ",
      onOk: () => {
        props.onDelete({ id: item.id });
      },
    });
  };
  const onSearchId = (type) => (e) => {
    if (refTimeOut.current) {
      clearTimeout(refTimeOut.current);
      refTimeOut.current = null;
    }
    refTimeOut.current = setTimeout(
      (value) => {
        props.onSearchId(value);
        // props.onChangeInputSearch({
        //   [type]: value,
        // });
      },
      300,
      e.target.value
    );
  };
  const onChangeInput = (type) => (e) => {
    if (refTimeOut.current) {
      clearTimeout(refTimeOut.current);
      refTimeOut.current = null;
    }
    refTimeOut.current = setTimeout(
      (value) => {
        props.onChangeInputSearch({
          [type]: value.trim(),
        });
      },
      300,
      e.target.value
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
  const onDeleteMul = () => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <Icon type="delete" />,
      content: `Bạn có muốn xoá ${state.selectedItem.length} phòng ban đã chọn??`,
      okText: "Đồng ý",
      cancelText: "Huỷ bỏ",
      onOk: () => {
        props.onDeleteMul(state.selectedItem);
        setState({
          selectedItem: [],
        });
      },
    });
  };
  const sort = (type) => () => {
    props.onChangeSort({ type });
  };
  return (
    <Main>
      <AdminPage>
        <Panel
          title="Phòng ban"
          icon={[<i className="fal fa-window"></i>]}
          toolbar={
            <div className="panel-tag">
              <div className="right-area">
                <Button
                  type="danger"
                  icon="delete"
                  onClick={onDeleteMul}
                  hidden={state.selectedItem.length == 0 ? true : false}
                  style={{ marginRight: "15px" }}
                >
                  Xóa {state.selectedItem.length} phòng ban đã chọn!
                </Button>
              </div>
              <div className="right-area">
                <Button type="primary" icon="plus" onClick={showAddPhongBan}>
                  Thêm mới phòng ban
                </Button>
              </div>
            </div>
          }
        >
          <div className="page-container">
            <SideBar2>
              <div className="page-filter">
                <FilterBox
                  title="Tìm kiếm"
                  showExpandButton={true}
                  showAddButton={false}
                >
                  <Input
                    placeholder="Tìm theo mã phòng ban"
                    onChange={onChangeInput("idDepartment")}
                  />
                  <Input
                    style={{ marginTop: "20px" }}
                    placeholder="Tìm theo tên phòng ban"
                    onChange={onChangeInput("name")}
                  />
                </FilterBox>
              </div>
            </SideBar2>

            <div className="page-main">
              <div style={{ overflow: "auto", width: "100%", flex: 1 }}>
                <Spin spinning={props.isLoading}>
                  <Table
                    rowKey="id"
                    expandIconAsCell={false}
                    expandIconColumnIndex={-1}
                    expandedRowRender={expandedRowRender}
                    expandedRowKeys={Array.from(state.expandedRowKeys)}
                    scroll={{ x: 800, y: "calc(100vh - 385px)" }}
                    dataSource={props.dsPhongBan}
                    className="custom"
                    onRow={onRow}
                    columns={[
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">
                              <Checkbox
                                onChange={onChangeCheckBoxAll}
                                checked={idPB.every((item, index, self) =>
                                  state.selectedItem?.includes(item)
                                )}
                              />
                            </div>
                          </div>
                        ),
                        width: 70,
                        dataIndex: "id",
                        key: "col0",
                        // align: "center",
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
                      // {
                      //   title: (
                      //     <div className="custome-header">
                      //       <div className="title-box">STT</div>
                      //     </div>
                      //   ),
                      //   width: 100,
                      //   dataIndex: "index",
                      //   key: "col1",
                      //   align: "center",
                      // },
                      {
                        title: (
                          <div className="custome-header">
                            <HeaderSortable
                              title="Mã phòng ban"
                              showSort={true}
                              dataSort={
                                props.sortType == 1
                                  ? 1
                                  : props.sortType == 4
                                    ? 2
                                    : 0
                              }
                              onClick={sort(props.sortType == 1 ? 4 : 1)}
                            />
                          </div>
                        ),
                        width: 150,
                        dataIndex: "departmentCode",
                        key: "col2",
                        // align: "center",
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <HeaderSortable
                              title="Tên phòng ban"
                              showSort={true}
                              dataSort={
                                props.sortType == 5
                                  ? 1
                                  : props.sortType == 6
                                    ? 2
                                    : 0
                              }
                              onClick={sort(props.sortType == 5 ? 6 : 5)}
                            />
                          </div>
                        ),
                        width: 300,
                        dataIndex: "name",
                        key: "col3",
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">Trưởng phòng</div>
                          </div>
                        ),
                        width: 250,
                        dataIndex: "userName",
                        key: "col4",
                      },
                      // {
                      //   title: (
                      //     <div className="custome-header">
                      //       <div className="title-box">Action</div>
                      //     </div>
                      //   ),
                      //   width: 150,
                      //   key: "col5",
                      //   align: "center",
                      //   render: (value, item, index) => {
                      //     return (
                      //       <div className="list-action">
                      //         <Tooltip title="Chỉnh sửa thông tin phòng ban">
                      //           <Button
                      //             type="primary"
                      //             icon="edit"
                      //             size="small"
                      //             onClick={onViewItem(item, false)}
                      //           />
                      //         </Tooltip>
                      //         <Tooltip title="Xem danh sách nhân viên thuộc phòng ban">
                      //           <Button
                      //             type="primary"
                      //             icon="user"
                      //             size="small"
                      //             onClick={showDSNhanVien(item)}
                      //           />
                      //         </Tooltip>
                      //         <Tooltip title="Xem thông tin phòng ban">
                      //           <Button
                      //             type="primary"
                      //             icon="eye"
                      //             size="small"
                      //             onClick={onViewItem(item, true)}
                      //           />
                      //         </Tooltip>
                      //         <Tooltip title="Xóa phòng ban">
                      //           <Button
                      //             type="primary"
                      //             icon="delete"
                      //             size="small"
                      //             onClick={() => {
                      //               onDeletePB(item);
                      //             }}
                      //           />
                      //         </Tooltip>
                      //       </div>
                      //     );
                      //   },
                      // },
                    ]}
                  />
                </Spin>
                {props.total > 0 && (
                  <Pagination
                    onPageChange={onChangePage}
                    onChangeSize={onChangeSize}
                    page={props.page}
                    size={props.size}
                    total={props.total}
                    style={{ flex: 1, justifyContent: "flex-end" }}
                  />
                )}
              </div>
            </div>
          </div>
        </Panel>
        <ModalAddPhongBan wrappedComponentRef={refAddPhongBan} />
        <ModalViewDSNhanVien wrappedComponentRef={refViewNhanVien} />
      </AdminPage>
    </Main>
  );
}
export default connect(
  (state) => {
    return {
      dsPhongBan: state.phongBan.dsPhongBan || [],
      page: state.phongBan.page || 1,
      size: state.phongBan.size || 10,
      isLoading: state.phongBan.isLoading || false,
      total: state.phongBan.totalElements || 0,
      sortType: state.phongBan.dataSort?.type,
    };
  },
  ({
    phongBan: {
      onSearch,
      onChangeInputSearch,
      onChangeSort,
      onDelete,
      onSearchId,
      onDeleteMul,
    },
  }) => {
    return {
      onSearch,
      onChangeInputSearch,
      onChangeSort,
      onDelete,
      onSearchId,
      onDeleteMul,
    };
  }
)(PhongBan);
