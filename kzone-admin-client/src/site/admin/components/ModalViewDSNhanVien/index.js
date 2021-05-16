import React, { useImperativeHandle, useState, forwardRef, useEffect, useMemo } from "react";
import { Main } from "./styled";
import { Table, Table2 } from "site/admin/components/common";
import { Button, Form, Descriptions, Spin } from "antd";
import { connect } from "react-redux";

const ModalViewDSNhanVien = (props, ref) => {
  const [state, _setState] = useState({});

  const setState = (data = {}) => {
    _setState((state) => {
      return { ...state, ...data };
    });
  };
  useImperativeHandle(ref, () => ({
    show: (item = {}) => {
      setState({
        show: true,
        namePB: item?.name,
        idPB: item?.id,
        nameUser: item?.userName,
      });
      props.form.resetFields();
    },
  }));
  const handleSubmit = () => { };


  const onClose = () => {
    setState({ show: false });
  };

  useEffect(() => {
    props.clearOldData();
  }, []);

  useEffect(() => {
    if (state.idPB != null) {
      props.onSearchNhanVien({
        dataSearch: {
          departmentId: state?.idPB,
        }
      })
    }
  }, [state.idPB]);

  return (
    <Main
      visible={state.show}
      style={{ minWidth: 800 }}
      closable={false}
      centered
      onCancel={onClose}
      footer={[null]}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <div className="modal-des">
        <h4 className="title-des" >
          DANH SÁCH NHÂN VIÊN CỦA PHÒNG BAN {state.namePB}
        </h4>
        <div className="content-des">
          <Descriptions bordered>
            <Descriptions.Item label="Trưởng phòng:">
              {state.nameUser}
            </Descriptions.Item>
          </Descriptions>
          <br />
          <Spin spinning={props.isLoading}>
            <Table
              rowKey="id"
              scroll={{ x: 800, y: 500 }}
              className="custom"
              dataSource={props.dsNhanVien}
              columns={[
                // {
                //   title: (
                //     <div className="custome-header">
                //       <div className="title-box">STT</div>
                //     </div>
                //   ),
                //   width: 70,
                //   dataIndex: "index",
                //   key: "2",
                //   align: "center",
                // },
                {
                  title: (
                    <div className="custome-header">
                      <div className="title-box">Tên đăng nhập</div>
                    </div>
                  ),
                  width: 180,
                  dataIndex: "username",
                  key: "3",
                },
                {
                  title: (
                    <div className="custome-header">
                      <div className="title-box">Tên Nhân viên</div>
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
                        {value.map((item, index) => {
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
              ]}
            />
          </Spin>
        </div>
      </div>
      <div className="action-footer">
        <Button
          type="danger"
          style={{ minWidth: 100 }}
          onClick={onClose}
        >
          Đóng
        </Button>
      </div>
    </Main>
  );
};

export default Form.create({})(
  connect(
    (state) => ({
      isLoading: state.nhanVien.isLoading || false,
      dsNhanVien: state.nhanVien.dsNhanVien || [],
      // forms: state.form.forms || [],
    }),
    ({
      nhanVien: {
        onSearch: onSearchNhanVien,
        clearOldData,
      },
    }) => ({
      onSearchNhanVien,
      clearOldData,
    }),
    null,
    { forwardRef: true }
  )(forwardRef(ModalViewDSNhanVien))
);
