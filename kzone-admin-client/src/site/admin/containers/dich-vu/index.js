import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { AdminPage, Panel, FilterBox } from "site/admin/components/admin";
import { Table, Pagination, SideBar2 } from "site/admin/components/common";
import { Main } from "./styled";
import { Input, Spin, Button, Icon, Modal, Checkbox, Select } from "antd";
import ModalAddDichVu from "site/admin/components/ModalAddDichVu";
import ThongTinNhanVien from "./components/ThongTinDichVu";

function DichVu(props) {
  const refAddDichVu = useRef(null);
  const refTimeOut = useRef(null);
  const [state, _setState] = useState({
    selectedItem: [],
    showCheckBox: true,
    checkAllItem: false,
    expandedRowKeys: new Set(),
  });
  const idServices = props.dsDichVu.map((item) => item.id);

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
        idVendor: "",
        stringKeyWord: "",
      },
    });
    props.onGetAllNCC();
  }, []);
  const showAddDichVu = () => {
    if (refAddDichVu.current) {
      refAddDichVu.current.show();
    }
  };
  const onViewItem = (item, isReadOnly) => () => {
    if (refAddDichVu.current) {
      refAddDichVu.current.show(item, isReadOnly);
    }
  };
  const onChangePage = (page) => {
    props.onSearch({ page: page });
  };
  const onChangeSize = (size) => {
    props.onSearch({ size: size })
  }
  const onChangeCheckBoxAll = (e) => {
    if (!e.target.checked) {
      setState({
        selectedItem: state.selectedItem.filter(
          (item, index) => !idServices.includes(item)
        ),
      });
    } else {
      setState({
        selectedItem: [...state.selectedItem, ...idServices].filter(
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
      <ThongTinNhanVien item={item} />
    );
  };

  const showCheckBox = () => {
    setState({
      showCheckBox: !state.showCheckBox,
      selectedItem: [],
    });
  };
  const onDeleteDichVu = (item) => {
    Modal.confirm({
      title: "X??c nh???n",
      icon: <Icon type="delete" />,
      content: `B???n c?? mu???n xo?? d???ch v??? '${item.serviceName}'?`,
      okText: "?????ng ??",
      cancelText: "Hu??? b???",
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
          [type]: value,
        });
      },
      300,
      e.target.value
    );
  };
  const onChangeSelect = (type) => (e) => {
    props.onChangeInputSearch({
      [type]: e && e.target ? e.target.value : e,
    });
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
      title: "X??c nh???n",
      icon: <Icon type="delete" />,
      content: `B???n c?? mu???n xo?? ${state.selectedItem.length} d???ch v??? ???? ch???n??`,
      okText: "?????ng ??",
      cancelText: "Hu??? b???",
      onOk: () => {
        props.onDeleteMul(state.selectedItem);
        setState({
          selectedItem: [],
        });
      },
    });
  };
  const filterOption = (input, option) => {
    return (
      (option.props.name || option.props.children)
        ?.toLowerCase()
        .createUniqueText()
        .indexOf(input.toLowerCase().createUniqueText()) >= 0
    );
  };

  return (
    <Main>
      <AdminPage>
        <Panel
          title="D???ch v???"
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
                  X??a {state.selectedItem.length} d???ch v??? ???? ch???n!
                </Button>
              </div>
              <div className="right-area">
                <Button type="primary" icon="plus" onClick={showAddDichVu}>
                  Th??m m???i d???ch v???
                </Button>
              </div>
            </div>
          }
        >
          <div className="page-container">
            <SideBar2>
              <div className="page-filter">
                <FilterBox
                  title="T??m ki???m"
                  showExpandButton={true}
                  showAddButton={false}
                >
                  {/* <Input
                  // value={state.search}
                  placeholder="T??m theo m?? d???ch v???"
                  onChange={onSearchId("search")}
                // onKeyDown={onKeyDown("search")}
                /> */}
                  <Input
                    // value={state.search}
                    // style={{ marginTop: "20px" }}
                    placeholder="T??m theo t??n d???ch v???"
                    onChange={onChangeInput("stringKeyWord")}
                  // onKeyDown={onKeyDown("search")}
                  />
                  <Select
                    placeholder="T??m theo t??n nh?? cung c???p"
                    onChange={onChangeSelect("idVendor")}
                    showSearch
                    filterOption={filterOption}
                    style={{ marginTop: "20px" }}
                  >
                    <Select.Option value="">===T???t c???===</Select.Option>
                    {props.dsNCC?.map((ncc, index) => (
                      <Select.Option key={index} value={ncc.id}>
                        {ncc.name}
                      </Select.Option>
                    ))}
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
                    expandedRowRender={expandedRowRender}
                    expandedRowKeys={Array.from(state.expandedRowKeys)}
                    scroll={{ x: 800, y: 500 }}
                    className="table"
                    onRow={onRow}
                    className="custom"
                    columns={[
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">
                              <Checkbox
                                onChange={onChangeCheckBoxAll}
                                checked={idServices.every((item, index, self) =>
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
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">M?? d???ch v???</div>
                          </div>
                        ),
                        width: 130,
                        dataIndex: "serviceCode",
                        key: "col2",
                        align: "left",
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">T??n d???ch v???</div>
                          </div>
                        ),
                        width: 220,
                        dataIndex: "serviceName",
                        key: "col3",
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">M?? t???</div>
                          </div>
                        ),
                        width: 250,
                        dataIndex: "description",
                        key: "col4",
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">Gi??</div>
                          </div>
                        ),
                        width: 180,
                        dataIndex: "price",
                        key: "col5",
                        render: (value, item, index) => {
                          return <>{`${value && value.formatMoney()} VND`}</>;
                        },
                      },
                      {
                        title: (
                          <div className="custome-header">
                            <div className="title-box">Nh?? cung c???p</div>
                          </div>
                        ),
                        width: 180,
                        dataIndex: "col6",
                        key: "col6",
                        render: (value, item, index) => {
                          return <>{item.vendorForServices.name}</>;
                        },
                      },
                      // {
                      //   title: (
                      //     <div className="custome-header">
                      //       <div className="title-box">Action</div>
                      //     </div>
                      //   ),
                      //   width: 130,
                      //   dataIndex: "col6",
                      //   key: "col7",
                      //   align: "center",
                      //   render: (value, item, index) => {
                      //     return (
                      //       <div className="list-action">
                      //         <Button
                      //           type="primary"
                      //           icon="eye"
                      //           size="small"
                      //           tooltip="Xem th??ng tin d???ch v???"
                      //           onClick={onViewItem(item, true)}
                      //         />
                      //         <Button
                      //           type="primary"
                      //           icon="edit"
                      //           size="small"
                      //           tooltip="Ch???nh s???a th??ng tin d???ch v???"
                      //           onClick={onViewItem(item, false)}
                      //         />
                      //         <Button
                      //           type="primary"
                      //           icon="delete"
                      //           tooltip="X??a d???ch v???"
                      //           size="small"
                      //           onClick={() => {
                      //             onDeleteDichVu(item);
                      //           }}
                      //         />
                      //       </div>
                      //     );
                      //   },
                      // },
                    ]}
                    dataSource={props.dsDichVu}
                  ></Table>
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
        <ModalAddDichVu
          wrappedComponentRef={refAddDichVu}
          filterOption={filterOption}
        />
      </AdminPage>
    </Main>
  );
}
export default connect(
  (state) => {
    return {
      dsDichVu: state.dichVu.dsDichVu || [],
      dsNCC: state.nhaCungCap.dsAllNhaCungCap || [],
      page: state.dichVu.page || 1,
      size: state.dichVu.size || 10,
      isLoading: state.dichVu.isLoading || false,
      total: state.dichVu.totalElements || 0,
    };
  },
  ({
    dichVu: {
      onSearch,
      onChangeInputSearch,
      onDelete,
      onUpdate,
      onSearchId,
      onDeleteMul,
    },
    nhaCungCap: { getAll: onGetAllNCC },
  }) => {
    return {
      onSearch,
      onChangeInputSearch,
      onDelete,
      onUpdate,
      onSearchId,
      onDeleteMul,
      onGetAllNCC,
    };
  }
)(DichVu);
