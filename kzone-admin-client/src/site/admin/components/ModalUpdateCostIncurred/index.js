import React, { useImperativeHandle, useState, forwardRef, useMemo, useEffect } from "react";
import { Button, Form, Input, InputNumber, message, Spin } from "antd";
import { connect } from "react-redux";
import { Main } from "./styled";
import { Table } from "site/admin/components/common";

const ModalUpdateCostIncurred = (props, ref) => {

  const [state, _setState] = useState({
    totalCost: 0,
  });

  const setState = (data = {}) => {
    _setState((state) => {
      return { ...state, ...data };
    });
  };

  useImperativeHandle(ref, () => ({
    show: (item = {}) => {

      props.form.resetFields();
      props.clearOldData();

      var totalCost;
      props.getTotalAllocation(item?.id).then((s) => {
        totalCost = s;
        setState({
          show: true,
          id: item?.id || "",
          totalCost: totalCost || 0,
        });
      });
    },
  }));

  const handleSubmit = () => { };
  const onSave = (ok) => () => {
    if (ok) {
      props.form.validateFields((errors, values) => {
        if (!errors) {
          let payload = props.dsChiPhi
          if (state.id)
            props
              .onUpdateCostIncurred({
                id: state.id,
                payload
              })
              .then((s) => {
                setState({ show: false });
              })
              .catch((e) => {
                setState({ show: false });
              });
        }
      });
    } else setState({ show: false });
  };
  const onChange = (type) => (e) => {
    setState({
      [type]: e?.hasOwnProperty("target")
        ? e.target.value
        : e?.hasOwnProperty("_d")
          ? e._d
          : e,
    });
  };
  const updateChiPhi = (row) => (e) => {
    row.costIncurredAmount = e
    props.setDsChiPhi(props.dsChiPhi);
    // calTotalCost();
    let totalCost = 0;
    props.dsChiPhi.forEach(item => {
      totalCost += item?.costIncurredAmount
    });

    setState({
      totalCost
    });
  }
  const onCreateCPPS = () => {
    if (!state.searchTerm || state.searchTerm == "") {
      message.error("Chi phí phát sinh không được để trống! Thêm chi phí thất bại!");
      return;
    }
    else {
      props.onCreateCPPS({
        currentId: state.id,
        costIncurredName: state.searchTerm
      });
      setState({
        searchTerm: "",
      })
    }
  };
  return (
    <Main
      visible={state.show}
      style={{ minWidth: 800, maxWidth: 900 }}
      closable={false}
      centered
      onCancel={onSave(false)}
      footer={[null]}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <Spin spinning={props.isLoadingCreate}>
        <Spin spinning={props.isLoading}>
          <div className="modal-des">
            <h4 className="title-des">
              CHỈNH SỬA CHI PHÍ PHÁT SINH
          </h4>
            <div className="content-des">
              <Form onSubmit={handleSubmit}>
                <Table
                  scroll={{ x: 50, y: 250 }}
                  className="custom"
                  dataSource={props.dsChiPhi}
                  columns={[
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Tên chi phí</div>
                          <div className="addition-box">
                            <Input
                              value={state.searchTerm}
                              placeholder="Thêm một chi phí phát sinh"
                              style={{ width: "70%", marginRight: "2%" }}
                              onChange={(e) => {
                                setState({
                                  searchTerm: e && e.target?.value,
                                })
                              }}
                            />
                            <Button
                              style={{ width: "28%" }}
                              onClick={onCreateCPPS}
                            >
                              Thêm
                          </Button>
                          </div>
                        </div>
                      ),
                      width: 250,
                      key: 'col1',
                      align: "left",
                      render: (value, row, index) => {
                        return (
                          <p>{row.costIncurredName}</p>
                        )
                      }
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Tổng chi phí</div>
                          <div className="addition-box" style={{ color: "blue" }}>
                            <b>{state.totalCost.formatMoney()} VND</b>
                          </div>
                        </div>
                      ),
                      width: 180,
                      key: 'col2',
                      align: "center",
                      render: (value, row, index) => {
                        return (
                          <InputNumber
                            min={0}
                            formatter={(value) =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            style={{ width: "100%" }}
                            value={row.costIncurredAmount}
                            onChange={updateChiPhi(row)}
                            defaultValue={row.costIncurredAmount}
                          />
                        )
                      }
                    }
                  ]}
                />
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
      </Spin>
    </Main>
  );
};

export default Form.create({})(
  connect(
    (state) => ({
      isLoadingCreate: state.chiPhiPhatSinh.isLoadingCreate || false,
      isLoading: state.phieuMuaHang.isLoading || false,
      dsChiPhi: state.phieuMuaHang.dsChiPhi || [],
      totalCost: state.phieuMuaHang.totalCostIncurred || []
    }),
    ({ phieuMuaHang: {
      getTotalAllocation,
      onUpdateCostIncurred,
      setDsChiPhi, clearOldData },
      chiPhiPhatSinh: { onCreate: onCreateCPPS }
    }) => ({
      onUpdateCostIncurred,
      getTotalAllocation,
      setDsChiPhi,
      onCreateCPPS,
      clearOldData
    }),
    null,
    { forwardRef: true }
  )(forwardRef(ModalUpdateCostIncurred))
);
