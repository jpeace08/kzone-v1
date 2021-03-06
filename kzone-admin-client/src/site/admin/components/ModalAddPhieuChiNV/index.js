import React, {
  useImperativeHandle,
  useState,
  forwardRef,
  useRef,
  useEffect,
} from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Spin,
  Select,
  message,
  Modal,
  Icon,
  Descriptions,
} from "antd";
import { connect } from "react-redux";
import { Main, CustomButton } from "./styled";
import { Table, SideBar2 } from "site/admin/components/common";
import ModalAddContentPhieuChi from "../ModalAddContentPhieuChi";
const ModalAddPhieuChiNV = (props, ref) => {
  const refAddContentPhieuChi = useRef(null);
  const [state, _setState] = useState({
    totalCost: 0,
    isValidMoney: true,
  });
  const setState = (data = {}) => {
    _setState((state) => {
      return { ...state, ...data };
    });
  };
  useImperativeHandle(ref, () => ({
    show: (item = {}, isReadOnly) => {
      setState({
        show: true,
        dataSource: [],
        totalCost: 0,
        count: 0,
        isReadOnly: isReadOnly || false,
        dsContentPhieuChi: props.dsContentPhieuChi,
        id: item?.id || "",
      });
      props.form.resetFields();
    },
  }));
  useEffect(() => {
    if (props.dsContentPhieuChi.length > 1) {
      const dsContentPhieuChi = props.dsContentPhieuChi.filter(
        (item) =>
          state.dsContentPhieuChi &&
          state.dsContentPhieuChi.indexOf(item) == -1 &&
          state.dataSource &&
          state.dataSource.findIndex((it) => it.contentId == item.id) == -1
      );
      setState({
        dsContentPhieuChi,
      });
    }
  }, [props.dsContentPhieuChi]);
  useEffect(() => {
    setState({
      dataSource: [],
      totalCost: 0,
      count: 0,
      id: "",
    });
  }, []);
  useEffect(() => {
    if (state.id && state.id != "") {
      props
        .onGetChiTietPhieuChiById(state.id)
        .then((s) => {
          var dataSource = s,
            totalCost = 0,
            dsContentSelected = [];
          dataSource.forEach((item) => {
            totalCost += item.amount;
            dsContentSelected.push(item.contentId);
          });
          // let dsContentPhieuChi = props.dsContentPhieuChi.filter(item => !dsContentSelected.includes(item.id));
          setState({
            dataSource,
            count: dataSource.length,
            totalCost,
          });
          setState({
            dsContentPhieuChi: props.dsContentPhieuChi.filter(
              (item) => !dsContentSelected.includes(item.id)
            ),
          });
        })
        .catch((e) => {
          message.error(e?.message || "L???i! Kh??ng t??m ???????c b???n ghi chi ti???t!");
        });
    }
  }, [state.id]);
  const handleSubmit = () => { };

  const onSave = (ok) => () => {
    if (ok) {
      props.form.validateFields((errors, values) => {
        if (!errors) {
          if (state.dataSource.length < 1) {
            message.error("Danh s??ch chi ph?? kh??ng ???????c ????? tr???ng!");
            return;
          }
          if (!state.isValidMoney || state.totalCost < 1) {
            message.error("Ti???n chi ph?? ph???i l???n h??n 0!");
            return;
          }

          if (!state.id) {
            props
              .onCreatePhieuChiNV({
                userId: props.auth.id,
                detail: [...state.dataSource],
              })
              .then((s) => {
                setState({
                  id: "",
                  show: false,
                });
              })
              .catch((e) => {
                setState({
                  id: "",
                });
              });
          } else {
            let payload = [...state.dataSource];
            props
              .onUpdatePhieuChiNV({ id: state.id, payload })
              .then((s) => {
                setState({
                  id: "",
                  show: false,
                });
              })
              .catch((e) => {
                setState({
                  id: "",
                  // show: false,
                });
              });
          }
        }
      });
    } else
      setState({
        id: "",
        show: false,
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

  const handleAdd = () => {
    const newData = {
      key: state.count,
      amount: 0,
      contentId: "",
    };
    setState({
      dataSource: [...state.dataSource, newData],
      count: state.count + 1,
      isValidMoney: false,
    });
  };
  const handleDelete = (row) => (e) => {
    Modal.confirm({
      title: "X??c nh???n",
      icon: <Icon type="delete" />,
      content: `B???n mu???n xo?? n???i dung phi???u chi n??y?`,
      okText: "?????ng ??",
      cancelText: "Hu??? b???",
      onOk: () => {
        let newState = {};
        let dataSource = state.dataSource;
        const index = dataSource.findIndex((item) => item.key == row.key);
        if (index != -1) {
          let totalCost = state.totalCost - row.amount;
          dataSource.splice(index, 1);
          newState.dataSource = dataSource;
          newState.totalCost = totalCost;
          if (row.contentId != "") {
            let object = props.dsContentPhieuChi.find(
              (item) => item.id == row.contentId
            );
            let dsContentPhieuChi = [...state.dsContentPhieuChi, object];
            newState.dsContentPhieuChi = dsContentPhieuChi;
          }
        }
        setState(newState);
      },
    });
  };
  const updatePhieuChi = (field, row) => (e) => {
    let value = e?.hasOwnProperty("target") ? e.target.value : e;
    if (field == "contentId") {
      var dsContentPhieuChi = state.dsContentPhieuChi;
      if (row.contentId != value && row.contentId != "") {
        let object = props.dsContentPhieuChi.find(
          (item) => item.id == row.contentId
        );
        dsContentPhieuChi = [...dsContentPhieuChi, object];
      }
      row[field] = value;
      dsContentPhieuChi = dsContentPhieuChi.filter((item) => item.id != value);
      setState({
        dsContentPhieuChi,
      });
    }
    if (field == "amount") {
      if (value == 0) {
        setState({
          isValidMoney: false,
        })
        return;
      }
      else {
        let totalCost = 0;
        row[field] = value;
        state.dataSource.forEach((element) => {
          totalCost += parseInt(element.amount);
        });
        setState({
          totalCost,
          isValidMoney: true,
        });
      }
    }
    setState({
      dataSource: state.dataSource,
    });
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
              {state.id
                ? state.isReadOnly
                  ? "TH??NG TIN"
                  : "CH???NH S???A"
                : "TH??M M???I"}{" "}
              PHI???U CHI NH??N VI??N
            </h4>
            <div className="content-des">
              <Form onSubmit={handleSubmit}>
                <div className="action-area">
                  <CustomButton
                    disabled={state.isReadOnly}
                    // style={{ minWidth: 200, marginLeft: 5, backgroundColor: "#fa8c16" }}
                    onClick={handleAdd}
                    icon="plus"
                    bgcolor="#fa8c16"
                  >
                    Th??m m???t b???n ghi
                  </CustomButton>
                  <CustomButton
                    disabled={state.isReadOnly}
                    onClick={() => {
                      if (refAddContentPhieuChi.current)
                        refAddContentPhieuChi.current.show();
                    }}
                    // style={{ minWidth: 200, marginLeft: 5, backgroundColor: "#fa8c16" }}
                    icon="plus"
                    bgcolor="#fa8c16"
                  >
                    Th??m n???i dung
                  </CustomButton>

                </div>
                <Table
                  rowKey={"key"}
                  scroll={{ x: 50, y: 250 }}
                  className="custom"
                  bordered
                  dataSource={state.dataSource}
                  columns={[
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">N???i dung</div>
                        </div>
                      ),
                      width: 250,
                      key: "col1",
                      align: "left",
                      render: (value, row, index) => {
                        return (
                          <Select
                            showSearch
                            disabled={state.isReadOnly}
                            onSelect={updatePhieuChi("contentId", row)}
                            filterOption={filterOption}
                            placeholder="Ch???n n???i dung phi???u chi"
                            style={{ width: "100%" }}
                            defaultValue={row.contentId}
                          >
                            {state.dsContentPhieuChi.map((item, index) => (
                              <Select.Option key={index + 1} value={item.id}>
                                {item.description}
                              </Select.Option>
                            ))}
                          </Select>
                        );
                      },
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">T???ng chi</div>
                        </div>
                      ),
                      width: 180,
                      key: "col2",
                      dataIndex: "amount",
                      align: "center",
                      render: (value, row, index) => {
                        return (
                          <>
                            <InputNumber
                              disabled={state.isReadOnly}
                              min={0}
                              maxLength={15}
                              step={1000}
                              formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                              }
                              style={{ width: "80%" }}
                              defaultValue={row.amount}
                              onChange={updatePhieuChi("amount", row)}
                            />
                            <Button
                              disabled={state.isReadOnly}
                              onClick={handleDelete(row)}
                              type="danger"
                              icon="delete"
                            />
                          </>
                        );
                      },
                    },
                  ]}
                />
                <Descriptions
                  size="default"
                  column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                  bordered
                >
                  <Descriptions.Item label="T???ng ti???n chi ph??">
                    {state.totalCost.formatMoney()}
                  </Descriptions.Item>
                </Descriptions>
              </Form>
            </div>
          </div>
          <div className="action-footer">
            {state.isReadOnly ? (
              <Button
                type="danger"
                style={{
                  minWidth: 100,
                }}
                onClick={onSave(false)}
              >
                ????ng
              </Button>
            ) : (
              <>
                <Button
                  type="danger"
                  style={{ minWidth: 100 }}
                  onClick={onSave(false)}
                >
                  Hu???
                </Button>
                <Button
                  type="primary"
                  style={{ minWidth: 100 }}
                  onClick={onSave(true)}
                >
                  L??u
                </Button>
              </>
            )}
          </div>
        </Spin>
      </Spin>
      <ModalAddContentPhieuChi wrappedComponentRef={refAddContentPhieuChi} />
    </Main>
  );
};

export default Form.create({})(
  connect(
    (state) => ({
      isLoadingCreate: state.phieuChi.isLoadingCreate || false,
      auth: state.auth.auth,
      isLoading: state.phieuChi.isLoading || false,
      dsPhieuChi: state.phieuChi.dsPhieuChi || [],
      dsNhomNDPhieuChi: state.phieuChi.dsNhomNDPhieuChi || [],
      dsContentPhieuChi: state.phieuChi.dsContentPhieuChi || [],
    }),
    ({
      phieuChi: {
        onCreatePhieuChiNV,
        onSearchGroupContent,
        onSearchContent,
        onGetChiTietPhieuChiById,
        onUpdatePhieuChiNV,
      },
    }) => ({
      onSearchContent,
      onCreatePhieuChiNV,
      onSearchGroupContent,
      onGetChiTietPhieuChiById,
      onUpdatePhieuChiNV,
    }),
    null,
    { forwardRef: true }
  )(forwardRef(ModalAddPhieuChiNV))
);
