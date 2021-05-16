import React, {
  useImperativeHandle,
  useState,
  forwardRef,
  useMemo,
  useEffect,
} from "react";
import moment from "moment";
import { Button, Form, Spin, Select, DatePicker } from "antd";
import { connect } from "react-redux";
import { Main } from "./styled";
import { STATUS_GOODS } from "constant/index";

const { Option } = Select;

const ModalUpdateStatusGoods = (props, ref) => {
  const {
    form: { getFieldDecorator },
  } = props;

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
        item: item || {},
        return_date: new Date(),
      });
      props.form.resetFields();
    },
  }));

  const handleSubmit = () => { };

  const onChange = (type) => (e) => {
    setState({
      [type]: e?.hasOwnProperty("target")
        ? e.target.value
        : e?.hasOwnProperty("_d")
          ? moment(e._d).format("YYYY-MM-DD HH:mm:ss")
          : e,
    });
  };

  const onOK = (ok) => () => {
    if (ok) {
      props.form.validateFields((errors, values) => {
        if (!errors) {
          if (state.item?.id) {
            const item = state.item;
            let payload = {
              return_date: moment(state.return_date).format("YYYY-MM-DD") + " 00:00:00",
              idWarehouse: state.idWarehouse,
            }
            props
              .onUpdateStatusConfirmedToComing({
                id: state.item?.id,
                payload,
              })
              .then((s) => {
                setState({ show: false });
              })
              .catch((e) => {
                setState({ show: false });
              });
          }
        }
      });
    } else setState({ show: false });
  };

  useEffect(() => {
    props.onSearchKiemKho({ size: 9999 });
  }, []);

  return (
    <Main
      visible={state.show}
      style={{ maxWidth: 520 }}
      closable={false}
      centered
      onCancel={onOK(false)}
      footer={[null]}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <Spin spinning={props.isLoadingCreate}>
        <div className="modal-des">
          <h4 className="title-des">
            CHỈNH SỬA TRẠNG THÁI HÀNG HÓA
          </h4>
          <div className="content-des">
            <Form onSubmit={handleSubmit}>
              <Form.Item label={"Kho nhập hàng"}>
                {getFieldDecorator("idWarehouse", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng chọn kho nhập hàng!",
                    },
                  ],
                  initialValue: state.idWarehouse,
                })(
                  <Select
                    placeholder="Kho nhập hàng"
                    onChange={onChange("idWarehouse")}
                    showSearch
                    optionFilterProp="warehouseName"
                  >
                    {props.dsKiemKho?.map((item, index) => (
                      <Option key={index} value={item.id}>
                        {item.warehouseName}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label={"Ngày dự kiến hàng về"}>
                {getFieldDecorator("return_date", {
                  rules: [],
                  initialValue: moment(state.return_date),
                })(
                  <DatePicker
                    showTime
                    format="DD/ MM/ YYYY"
                    onChange={onChange("return_date")}
                  />
                )}
              </Form.Item>
            </Form>
          </div>
        </div>
        <div className="action-footer">
          {state.readOnly ? (
            <Button
              type="danger"
              style={{
                minWidth: 100,
              }}
              onClick={onOK(false)}
            >
              Đóng
            </Button>
          ) : (
            <>
              <Button
                type="danger"
                style={{
                  minWidth: 100,
                }}
                onClick={onOK(false)}
              >
                Huỷ
              </Button>
              <Button
                type="primary"
                style={{
                  minWidth: 100,
                }}
                onClick={onOK(true)}
              >
                Lưu
              </Button>
            </>
          )}
        </div>
      </Spin>
    </Main>
  );
};

export default Form.create({})(
  connect(
    (state) => ({
      isLoadingCreate: state.phieuMuaHang.isLoadingCreate || false,
      dsKiemKho: state.kiemKho.dsKiemKho || [],
    }),
    ({
      phieuMuaHang: {
        onUpdateStatusConfirmedToComing,
      },
      kiemKho: {
        onSearch: onSearchKiemKho,
      }
    }) => ({
      onSearchKiemKho,
      onUpdateStatusConfirmedToComing,
    }),
    null,
    { forwardRef: true }
  )(forwardRef(ModalUpdateStatusGoods))
);
