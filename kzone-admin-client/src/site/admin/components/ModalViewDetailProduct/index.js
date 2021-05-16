import React, {
  useImperativeHandle,
  useState,
  forwardRef,
  useMemo,
} from "react";
import { Main } from "./styled";
import { Button, Form, Spin } from "antd";
import { Table2 } from "site/admin/components/common";
import { connect } from "react-redux";
import { object } from "prop-types";

const ModalEditChiTietHangHoa = (props, ref) => {
  const [state, _setState] = useState({});

  const setState = (data = {}) => {
    _setState((state) => ({
      ...state,
      ...data,
    }));
  };

  useImperativeHandle(ref, () => ({
    show: (item = {}) => {
      setState({
        show: true,
        item: item,
        isReadOnly: true,
      });
      props.form.resetFields();
    },
  }));

  const onOK = (ok) => () => {
    setState({
      show: ok,
    });
  };

  const renderListCostIncurred = () => {
    const res = state?.item?.allocationCostIncurredList?.map((item, index) => ({
      title: (
        <div className="custome-header">
          <div className="title-box">
            {item?.costIncurred?.costIncurredName}
          </div>
        </div>
      ),
      width: "150",
      dataIndex: item.costIncurred.id + "_cost",
      key: `${index}`,
      align: "center",
      render: (value) => {
        return value;
      },
    }));
    return res || [];
  };

  const renderListTaxes = () => {
    const res = state?.item?.taxDetailReturnDTOList?.map((item, index) => ({
      title: (
        <div className="custome-header">
          <div className="title-box">{item?.taxEntity?.name}</div>
        </div>
      ),
      align: "center",
      children: [
        {
          title: "Tỷ xuất",
          key: `taxRate-${index}`,
          width: 100,
          align: "center",
          render: () => {
            return item?.taxRate;
          },
        },
        {
          title: "Tiền thuế",
          key: `totalTax-${index}`,
          align: "center",
          width: 100,
          render: () => {
            return item?.totalTax.formatMoney();
          },
        },
      ],
    }));
    return res || [];
  };

  const costIncurredCols = useMemo(() => renderListCostIncurred(), [
    state?.item,
  ]);
  const taxesCols = useMemo(() => renderListTaxes(), [state?.item]);

  return (
    <Main
      visible={state.show}
      style={{ maxWidth: 660, width: "300px" }}
      closable={false}
      centered
      onCancel={onOK(false)}
      footer={[null]}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <Spin spinning={false}>
        <div className="modal-des">
          <h4 className="title-des">XEM CHI TIẾT</h4>
          <div className="content-des">
            <h6 className="title-des sub-title">Chi phí phát sinh</h6>
            <Table2
              scroll={{ x: 800, y: 500 }}
              className="custom"
              columns={[...costIncurredCols]}
              dataSource={[
                (() => {
                  let obj = {};
                  state?.item?.allocationCostIncurredList.forEach((item) => {
                    obj[item.costIncurred.id + "_cost"] =
                      item.totalAmountAllocationOfCostIncurred;
                  });
                  return obj;
                })(),
                // state?.item?.allocationCostIncurredList
                //   .map((item) => {
                //     let obj = {};
                //     obj[item.costIncurred.id + "_cost"] =
                //       item.totalAmountAllocationOfCostIncurred;
                //     return obj;
                //   })
                //   .reduce((a, b) => {
                //     return { ...a, ...b };
                //   }, {}),
              ]}
            ></Table2>
          </div>
          <div className="content-des">
            <h6 className="title-des sub-title">Thuế</h6>
            <Table2
              scroll={{ x: 800, y: 500 }}
              className="custom"
              columns={[...taxesCols]}
              dataSource={[{}]}
            >
              <thead>
                <tr>
                  {state?.item?.taxDetailReturnDTOList?.map((item, index) => {
                    return (
                      <th colSpan={2} key={index}>
                        <div style={{ textAlign: "center" }}>
                          <div className="title-box">
                            {item?.taxEntity?.name}
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
                <tr>
                  {state?.item?.taxDetailReturnDTOList?.map((item, index) => {
                    return (
                      <React.Fragment key={index}>
                        <th
                          key={index + "_" + 1}
                          style={{ textAlign: "center" }}
                        >
                          Tỷ xuất
                        </th>
                        <th
                          key={index + "_" + 2}
                          style={{ textAlign: "center" }}
                        >
                          Tiền thuế
                        </th>
                      </React.Fragment>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {state?.item?.taxDetailReturnDTOList?.map((item, index) => {
                    return (
                      <React.Fragment key={index}>
                        <td
                          key={index + "_" + 1}
                          style={{ textAlign: "center" }}
                        >
                          {item?.taxRate}
                        </td>
                        <td
                          key={index + "_" + 2}
                          style={{ textAlign: "center" }}
                        >
                          {item?.totalTax}
                        </td>
                      </React.Fragment>
                    );
                  })}
                </tr>
              </tbody>
            </Table2>
          </div>
        </div>
        <div className="action-footer">
          <Button
            type="danger"
            style={{
              minWidth: 100,
            }}
            onClick={onOK(false)}
          >
            Đóng
          </Button>
        </div>
      </Spin>
    </Main>
  );
};

export default Form.create({})(
  connect(
    (state) => ({}),
    ({ }) => ({}),
    null,
    { forwardRef: true }
  )(forwardRef(ModalEditChiTietHangHoa))
);
