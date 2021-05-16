import React, { useImperativeHandle, useState, forwardRef, useEffect, useMemo } from "react";
import { Main } from "./styled";
import { Table, Table2, Pagination } from "site/admin/components/common";
import { Button, Form, Input, Row, Col, Checkbox, Spin, Select } from "antd";
import { connect } from "react-redux";
const Option = Select.Option;

const ModalAddQuyen = (props, ref) => {
  const { getFieldDecorator } = props.form;
  const [state, _setState] = useState({});
  const pmsIds = props.dsQuyen.map(item => item.id);
  const setState = (data = {}) => {
    _setState((state) => {
      return { ...state, ...data };
    });
  };
  useImperativeHandle(ref, () => ({
    show: () => {
      setState({
        show: true,
        selectedItem: [],
        userId: ""
      });
      props.form.resetFields();
      props.onSearchQuyen({
        dataSearch: { name: "" },
        size: 999
      });
      props.getAllNhanVien();
      props.clearOldData({});
    },
  }));
  const handleSubmit = () => { };
  useEffect(() => {
    setState({
      selectedItem: props.selectedItem.map(item => {
        return (item.id)
      })
    })
  }, [props.selectedItem])

  const onChange = (type) => (e) => {
    props.getByUser(e)
    setState({
      [type]: e,
    });
  };
  const checkType = (value) => {
    const item = props.selectedItem.find(i => i.id == value);
    if (!item) return
    else {
      if (item.type == 1) return true;
      return false;
    }
  }
  const onSave = (ok) => () => {
    if (ok) {
      props.form.validateFields((errors, values) => {
        if (!errors) {
          let payload = {
            permissionIds: state.selectedItem.filter(item => !checkType(item))
          }
          props
            .onUpdatePermission({
              id: state.userId,
              ...payload
            })
            .then((s) => {
              setState({ show: false });
              window.location.reload(false);
            });
        }
      });
    } else setState({ show: false });
  };
  const filterOption = (input, option) => {
    return (
      (option.props.name || option.props.children)
        ?.toLowerCase()
        .createUniqueText()
        .indexOf(input.toLowerCase().createUniqueText()) >= 0
    );
  };
  const renderPermissions = (dsQuyen) => {
    const permissionBox = dsQuyen.map((item, index) => ({
      title: (
        <div className="custome-header">
          <div className="title-box">{item.name}</div>
        </div>
      ),
      width: 300,
      key: `${index}`,
      align: "center",
      render: () => {
        return (
          <Checkbox
            onChange={onChangeCheckBox(item.id)}
            checked={state.selectedItem.includes(item.id)}
          />
        )

      }
    }));
    return [...permissionBox]
  }
  const pmsCols = useMemo(() => renderPermissions(props.dsQuyen), [props.dsQuyen])
  const onChangeCheckBoxAll = (e) => {
    if (!e.target.checked) {
      setState({
        selectedItem: state.selectedItem.filter(
          (item, index) => !pmsIds.includes(item)
        ),
      });
    } else {
      setState({
        selectedItem: [...state.selectedItem, ...pmsIds].filter(
          (item, i, self) => item && self.indexOf(item) === i
        ),
      });
    }
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
  const onChangePage = (page) => {
    props.onSearchQuyen({ page: page });
  };
  const onChangeSize = (size) => {
    props.onSearchQuyen({ size: size });
  };
  return (
    <Main
      visible={state.show}
      style={{ minWidth: 520 }}
      closable={false}
      centered
      onCancel={onSave(false)}
      footer={[null]}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <Spin spinning={props.isLoadingCreate}>
        <div className="modal-des">
          <h4 className="title-des">
            CÀI ĐẶT QUYỀN CHO USER
          </h4>
          <div className="content-des">
            <Form onSubmit={handleSubmit}>
              <Form.Item label={"Tên nhân viên"}>
                {getFieldDecorator("userId", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng chọn tên nhân viên!",
                    },
                  ],
                  initialValue: state.userId,
                })(
                  <Select
                    onChange={onChange("userId")}
                    placeholder={"Chọn tên nhân viên"}
                    showSearch
                    filterOption={filterOption}
                  >
                    {props.dsNhanVien.map((item, index) => {
                      return (
                        <Option key={index} value={item.id}>
                          {`${item.username} - ${item.name}`}
                        </Option>
                      )
                    })}
                  </Select>
                )}

              </Form.Item>
              {/* <div>
                <Table2
                  scroll={{ x: 800, y: 500 }}
                  className="custom"
                  dataSource={[{}]}
                  columns={[
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Tìm kiếm</div>
                        </div>
                      ),
                      width: 250,
                      key: 'col1',
                      dataIndex: 'id',
                      align: "left",
                      render: () => {
                        return (
                          <Input.Search
                            onChange={e => {
                              props.onSearchQuyen({
                                dataSearch: { name: e.target?.value },
                                size: 999
                              })
                            }}
                          />
                        )
                      }
                    },
                    ...pmsCols
                  ]}
                />
              </div> */}
              <Table
                scroll={{ x: 50, y: 250 }}
                className="custom"
                dataSource={props.dsQuyen}
                columns={[
                  {
                    title: (
                      <div className="custome-header">
                        <div className="title-box"></div>
                        <div className="addition-box">
                          <Input.Search
                            placeholder="Tìm kiếm tên quyền"
                            onChange={e => {
                              props.onSearchQuyen({
                                dataSearch: { name: e.target?.value },
                                size: 999
                              })
                            }}
                          />
                        </div>
                      </div>
                    ),
                    width: 250,
                    key: 'col1',
                    dataIndex: 'name',
                    align: "left",
                  },
                  {
                    title: (
                      <div className="custome-header">
                        <div className="title-box">Cho phép</div>
                        <div className="addition-box">
                          <Checkbox
                            onChange={onChangeCheckBoxAll}
                            checked={
                              pmsIds.every(item => state.selectedItem?.includes(item))
                            }
                          />
                        </div>
                      </div>
                    ),
                    width: 150,
                    key: 'col2',
                    dataIndex: 'id',
                    align: "center",
                    render: (value, item, index) => {
                      return (
                        <Checkbox
                          disabled={checkType(value)}
                          onChange={onChangeCheckBox(value)}
                          checked={state.selectedItem.includes(value) || checkType(value)}
                        />
                      )
                    }
                  }
                ]}
              />
              {props.total > 0 && <Pagination
                onPageChange={onChangePage}
                onChangeSize={onChangeSize}
                page={props.page}
                size={props.size}
                total={props.total}
                style={{ flex: 1, justifyContent: "flex-end" }}
              />
              }
            </Form>
          </div>
        </div>
        <div className="action-footer">
          <Button
            type="danger"
            style={{ minWidth: 100 }}
            onClick={onSave(false)}
          >
            Huỷ
          </Button>
          <Button
            type="primary"
            style={{ minWidth: 100 }}
            onClick={onSave(true)}
          >
            Lưu
          </Button>
        </div>
      </Spin>
    </Main>
  );
};

export default Form.create({})(
  connect(
    (state) => ({
      isLoadingCreate: state.nhanVien.isLoadingCreate || false,
      dsQuyen: state.quyen.dsQuyen || [],
      dsNhanVien: state.nhanVien.dsNhanVien || [],
      selectedItem: state.quyen.selectedItem || [],
      page: state.quyen.page || 1,
      size: state.quyen.size || 10,
      total: state.quyen.totalElements || 0,
      // forms: state.form.forms || [],
    }),
    ({ nhanVien: { getAll: getAllNhanVien, onUpdatePermission },
      quyen: { onSearch: onSearchQuyen, getByUser, clearOldData } }) => ({
        getAllNhanVien,
        onSearchQuyen,
        onUpdatePermission,
        getByUser,
        clearOldData,
      }),
    null,
    { forwardRef: true }
  )(forwardRef(ModalAddQuyen))
);
