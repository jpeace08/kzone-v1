import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { AdminPage, Panel, FilterBox } from "site/admin/components/admin";
import { Main } from "./styled";
import { Input, Select, Tag, Button, Spin, Checkbox } from "antd";
import ModalAddPhongBan from "site/admin/components/ModalAddPhongBan";
import ModalVaiTro from "site/admin/components/ModalAddVaiTro";
import ModalAddNhanVien from "site/admin/components/ModalAddNhanVien";
import { Table, Pagination, SideBar2 } from "site/admin/components/common";
import HeaderSortable from "site/admin/components/common/Table/HeaderSortable";
import ThongTinNhanVien from "./components/ThongTinNhanVien";
import { HOST } from "client/request";

const Option = Select.Option;
function NhanVien(props) {
  const refAddPhongBan = useRef(null);
  const refAddVaiTro = useRef(null);
  const refAddNhanVien = useRef(null);
  const refTimeOut = useRef(null);

  const [state, _setState] = useState({
    selectedItem: [],
    showCheckBox: true,
    expandedRowKeys: new Set(),
  });

  const isHidden = (field) => {
    if (props.dsHangHoa.length > 0) {
      const item = props.dsHangHoa[0];
      return item[field] && item[field] == -1;
    }
    return false;
  }

  const setState = (_state) => {
    _setState((state) => ({
      ...state,
      ...(_state || {}),
    }));
  };
  useEffect(() => {
    props.phongBanGetAll();
    props.vaiTroGetAll();
    props.onSearch({
      dataSearch: { stringQuery: "", roleId: "", departmentId: "" },
    });
  }, []);

  const onKeyDown = (type) => (e) => {
    if (e.keyCode == 13) {
      props.onChangeInputSearch({
        [type]: state[type],
      });
    }
  };

  const onChangeInput = (type) => (e) => {
    if (refTimeOut.current) {
      clearTimeout(refTimeOut.current);
      refTimeOut.current = null;
    }
    refTimeOut.current = setTimeout(
      (value) => {
        props.onChangeInputSearch({
          [type]: value,
        });
      },
      300,
      e.target.value
    );
  };
  const onChangeSelect = (type) => (e) => {
    props.onChangeInputSearch({
      [type]: e,
    });
  };
  const onChangeSize = (size) => {
    props.onSearch({ size: size });
  }
  const showAddPhongBan = () => {
    if (refAddPhongBan.current) {
      refAddPhongBan.current.show();
    }
  };
  const showAddNhanVien = () => {
    if (refAddNhanVien.current) {
      refAddNhanVien.current.show();
    }
  };
  const showAddVaiTro = () => {
    if (refAddVaiTro.current) {
      refAddVaiTro.current.show();
    }
  };

  const onChangePage = (page) => {
    props.onSearch({ page: page });
  };

  const onViewItem = (item, isReadOnly) => () => {
    if (refAddNhanVien.current) {
      refAddNhanVien.current.show(item, isReadOnly);
    }
  };

  // const onResetPassword = (item) => () => {
  //   Modal.confirm({
  //     title: "Xác nhận",
  //     icon: <Icon type="retweet" />,
  //     content: `Bạn có muốn reset mật khẩu của nhân viên ${item.name}?`,
  //     okText: "Đồng ý",
  //     cancelText: "Huỷ bỏ",
  //     onOk: () => {
  //       props.onResetPassword({ id: item.id });
  //     },
  //   });
  // };
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
      <ThongTinNhanVien item={item} />
    );
  };

  const sort = (type) => () => {
    props.onChangeSort({ type });
  };
  return (
    <Main>
      <AdminPage>
        <Panel
          title="QUẢN LÝ NHÂN VIÊN"
          icon={[<i className="fal fa-window"></i>]}
          toolbar={
            <div className="panel-tag">
              <div className="right-area">
                <Button type="primary" icon="plus" onClick={showAddNhanVien}>
                  Thêm mới nhân viên
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
                    // value={state.search}
                    placeholder="Tìm theo tên nhân viên, email, số điện thoại"
                    onChange={onChangeInput("stringQuery")}
                    onKeyDown={onKeyDown("stringQuery")}
                  />
                </FilterBox>
                <FilterBox
                  title="Vai trò"
                  showExpandButton={true}
                  showAddButton={props.auth?.role == 4}
                  onAddButtonClick={showAddVaiTro}
                >
                  <Select
                    // value={state.role}
                    placeholder="Chọn vai trò"
                    onChange={onChangeSelect("roleId")}
                  >
                    <Option value="">===Tất cả===</Option>
                    {props.dsVaiTro.map((item, index) => {
                      return (
                        <Option key={index} value={item.id}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                </FilterBox>
                <FilterBox
                  title="Phòng ban"
                  showExpandButton={true}
                  showAddButton={true}
                  onAddButtonClick={showAddPhongBan}
                >
                  <Select
                    // value={state.phongBanId}
                    placeholder="Chọn phòng ban"
                    onChange={onChangeSelect("departmentId")}
                  >
                    <Option value="">===Tất cả===</Option>
                    {props.dsPhongBan.map((item, index) => {
                      return (
                        <Option key={index} value={item.id}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
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
                    scroll={{ x: 800, y: "calc(100vh - 385px)" }}
                    className="custom"
                    onRow={onRow}
                    expandedRowRender={expandedRowRender}
                    expandedRowKeys={Array.from(state.expandedRowKeys)}
                    columns={[
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box"></div>
                          </div>
                        ),
                        width: 70,
                        dataIndex: "id",
                        key: "1",
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
                            <HeaderSortable
                              title="Mã nhân viên"
                              showSort={true}
                              dataSort={
                                props.sortType == 1
                                  ? 1
                                  : props.sortType == 2
                                    ? 2
                                    : 0
                              }
                              onClick={sort(props.sortType == 1 ? 2 : 1)}
                            />
                          </div>
                        ),
                        width: 120,
                        dataIndex: "id",
                        key: "2",
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <HeaderSortable
                              title="Tên đăng nhập"
                              showSort={true}
                              dataSort={
                                props.sortType == 3
                                  ? 1
                                  : props.sortType == 4
                                    ? 2
                                    : 0
                              }
                              onClick={sort(props.sortType == 3 ? 4 : 3)}
                            />
                          </div>
                        ),
                        width: 180,
                        dataIndex: "username",
                        key: "3",
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">Hình ảnh</div>
                          </div>
                        ),
                        width: 100,
                        dataIndex: "avatar",
                        key: "col2",
                        //align: "center",,
                        render: (value, item, index) =>
                        // !isValidValue(value) ? null : (
                        (
                          <img
                            src={`${HOST}${value || "/images/no_image_9195ab60_1392_40b1_ae4f_84e11e9c4e17.jpg"}`}
                            alt=""
                            key={item}
                            style={{
                              width: "30px",
                              height: "30px",
                              objectFit: "contain",
                            }}
                          />
                        ),
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <HeaderSortable
                              title="Tên Nhân viên"
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
                        width: 180,
                        dataIndex: "name",
                        key: "3",
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">Giới tính</div>
                          </div>
                        ),
                        width: 180,
                        dataIndex: "gender",
                        key: "4",
                        render: (value, row, index) => {
                          if (value == 1) return "Nam";
                          return "Nữ";
                        },
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">Ngày sinh</div>
                          </div>
                        ),
                        width: 180,
                        dataIndex: "dob",
                        key: "5",
                        render: (value, row, index) => {
                          return (
                            value?.toDateObject().format("dd/MM/yyyy") || ""
                          );
                        },
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">Vai trò</div>
                          </div>
                        ),
                        width: 180,
                        dataIndex: "roles",
                        key: "6",
                        render: (value, row, index) => {
                          return (
                            <>
                              {value?.map((item, index) => {
                                return (
                                  <span
                                    key={index}
                                    className="badge border border-primary text-primary"
                                  >
                                    {item.name}
                                  </span>
                                );
                              })}
                            </>
                          );
                        },
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">SĐT</div>
                          </div>
                        ),
                        width: 150,
                        dataIndex: "phone",
                        key: "7",
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">Email</div>
                          </div>
                        ),
                        width: 200,
                        dataIndex: "email",
                        key: "8",
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">Địa chỉ</div>
                          </div>
                        ),
                        width: 250,
                        dataIndex: "address",
                        key: "9",
                      },
                      // {
                      //   title: (
                      //     <div className="custome-header">
                      //       <div className="title-box">Action</div>
                      //     </div>
                      //   ),
                      //   width: 70,
                      //   dataIndex: "col6",
                      //   key: "11",
                      //   render: (value, item, index) => {
                      //     return (
                      //       <div className="list-action">
                      //         {/* <Button
                      //           type="primary"
                      //           icon="delete"
                      //           tooltip="Xoá nhân viên"
                      //           size="small"
                      //           onClick={onDeleteItem(item)}
                      //         /> */}
                      //         {/* <Button
                      //           type="primary"
                      //           icon="retweet"
                      //           tooltip="Reset mật khẩu"
                      //           size="small"
                      //           onClick={onResetPassword(item)}
                      //         /> */}
                      //         <Button
                      //           type="primary"
                      //           icon="edit"
                      //           size="small"
                      //           disabled={props.auth?.role != 4}
                      //           tooltip="Chỉnh sửa thông tin nhân viên"
                      //           onClick={onViewItem(item, false)}
                      //         />
                      //         <Button
                      //           type="primary"
                      //           icon="eye"
                      //           size="small"
                      //           tooltip="Xem thông tin nhân viên"
                      //           onClick={onViewItem(item, true)}
                      //         />
                      //       </div>
                      //     );
                      //   },
                      // },
                    ]}
                    dataSource={props.dsNhanVien}
                  ></Table>
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
                </Spin>
              </div>
            </div>
          </div>
        </Panel>
        <ModalAddPhongBan wrappedComponentRef={refAddPhongBan} />
        <ModalVaiTro wrappedComponentRef={refAddVaiTro} />
        <ModalAddNhanVien wrappedComponentRef={refAddNhanVien} />
      </AdminPage>
    </Main>
  );
}
export default connect(
  (state) => {
    return {
      dsPhongBan: state.phongBan.dsPhongBan || [],
      auth: state.auth.auth,
      dsNhanVien: state.nhanVien.dsNhanVien || [],
      isLoading: state.nhanVien.isLoading || false,
      page: state.nhanVien.page || 1,
      size: state.nhanVien.size || 10,
      total: state.nhanVien.totalElements || 0,
      dsVaiTro: state.vaiTro.dsVaiTro || [],
      sortType: state.nhanVien.dataSort?.type,
    };
  },
  ({
    phongBan: { getAll: phongBanGetAll },
    vaiTro: { getAll: vaiTroGetAll },
    nhanVien: {
      onSearch,
      onChangeInputSearch,
      onChangeSort,
      onDelete,
      clearDataSearch,
      // onResetPassword
    },
  }) => {
    return {
      phongBanGetAll,
      vaiTroGetAll,
      onSearch,
      onChangeInputSearch,
      onChangeSort,
      onDelete,
      clearDataSearch,
      // onResetPassword,
    };
  }
)(NhanVien);
