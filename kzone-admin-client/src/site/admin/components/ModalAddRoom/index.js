import React, {
  useImperativeHandle,
  useState,
  useMemo,
  forwardRef,
} from "react";
import { Main } from "./styled";
import {
  Button,
  Form,
  Input,
  Spin,
  InputNumber,
  Select,
  Row,
  Col,
} from "antd";
import { connect } from "react-redux";
import { STATUS_ROOM } from "constant";
const { Option } = Select;

const ModalAddRoom = (props, ref) => {
  const {
    isLoadingCreate,
    listTypeOfRooms,
    onCreate,
    onUpdate,
    form: { getFieldDecorator },
  } = props;

  const [state, _setState] = useState({});

  const setState = (data = {}) => {
    _setState((state) => ({
      ...state,
      ...data,
    }));
  };

  useImperativeHandle(ref, () => ({
    show: (item = {}, isReadOnly) => {
      setState({
        show: true,
        id: item?.id != (undefined && null && "") ? item?.id : "",
        roomNumber: item?.roomNumber || "",
        numberOfBed: item?.numberOfBed || "",
        floor: item?.floor || "",
        status: item?.status != (undefined && null && "") ? item?.status : 2,
        roomTypeId: item?.roomType?.id != (undefined && null && "") ? item?.roomType?.id : "",
        isReadOnly: isReadOnly || false,
      });
      props.form.resetFields();
    },
  }));

  const onChange = (type) => (e) => {
    setState({
      [type]: e?.hasOwnProperty("target")
        ? e.target.value
        : e?.hasOwnProperty("_d")
          ? e._d
          : e,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefaults();
  };

  const onOK = (ok) => () => {
    if (ok) {
      props.form.validateFields((errors, values) => {
        if (!errors) {
          const payload = {
            roomNumber: state.roomNumber,
            numberOfBed: state.numberOfBed || 1,
            floor: state.floor,
            status: state.status,
            roomTypeId: state.roomTypeId,
          };
          if (state.id == undefined || state.id == null || state.id == "") {
            //TODO: create room
            onCreate(payload)
              .then((s) => {
                setState({ show: false });
              })
              .catch((e) => {
                // setState({ show: false });
              });
          } else
            //TODO: update room
            onUpdate({ id: state.id, payload })
              .then((s) => {
                setState({ show: false });
              })
              .catch((e) => {
                // setState({ show: false });
              });
        }
      });
    } else setState({ show: false });
  };

  let numberOfBeds = useMemo(() => {
    let arr = [];
    if (listTypeOfRooms && state.roomTypeId) {
      arr = listTypeOfRooms?.find(i => i?.id == state.roomTypeId);
      arr = arr?.pricePerDays?.map(i => i?.numberOfBed);
    }
    return arr;
  }, [state.roomTypeId]);

  return (
    <Main
      visible={state.show}
      style={{ maxWidth: 660 }}
      closable={false}
      centered
      onCancel={onOK(false)}
      footer={[null]}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <Spin spinning={isLoadingCreate}>
        <div className="modal-des">
          <h4 className="title-des">
            {state.id
              ? state.isReadOnly
                ? "TH??NG TIN"
                : "CH???NH S???A"
              : "TH??M M???I"}{" "}
            PH??NG
          </h4>
          <div className="content-des">
            <Form onSubmit={handleSubmit}>
              <Row gutter={[8, 8]}>
                <Col span={12}>
                  <Form.Item label={"S??? ph??ng"}>
                    {getFieldDecorator("roomNumber", {
                      rules: [
                        {
                          required: true,
                          message: "Vui l??ng nh???p s??? ph??ng!",
                        },
                        {
                          whitespace: true,
                          message: "Vui l??ng nh???p s??? ph??ng!",
                        },
                      ],
                      initialValue: state.roomNumber,
                    })(
                      <Input
                        disabled={state.id != ("" && undefined && null) || state.isReadOnly}
                        onChange={onChange("roomNumber")}
                        placeholder={"Nh???p s??? ph??ng"}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={"S??? gi?????ng"}>
                    {getFieldDecorator("numberOfBed", {
                      rules: [
                        {
                          required: true,
                          message: "Vui l??ng nh???p s??? l?????ng gi?????ng!",
                        },
                      ],
                      initialValue: state.numberOfBed,
                    })(
                      <Select >
                        {numberOfBeds?.map((i, index) => (
                          <Option key={`col${index}`} value={i}>{i}</Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={"T???ng"}>
                    {getFieldDecorator("floor", {
                      rules: [
                        {
                          required: true,
                          message: "Vui l??ng nh???p t???ng cho ph??ng!",
                        },
                      ],
                      initialValue: state.floor,
                    })(
                      <InputNumber
                        min={1}
                        disabled={state.id != ("" && undefined && null) || state.isReadOnly}
                        onChange={onChange("floor")}
                        placeholder={"Nh???p t???ng cho ph??ng"}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={"Tr???ng th??i ph??ng"}>
                    {getFieldDecorator("status", {
                      rules: [
                        {
                          required: true,
                          message: "Vui l??ng ch???n tr???ng th??i ph??ng!",
                        },
                      ],
                      initialValue: state.status,
                    })(
                      <Select
                        disabled={state.isReadOnly}
                        placeholder="Tr???ng th??i ph??ng"
                        onChange={onChange("status")}
                      >
                        {STATUS_ROOM?.map((s, index) => (
                          <Option key={index} value={s?.value}>
                            {s?.title}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={"Lo???i ph??ng"}>
                    {getFieldDecorator("roomTypeId", {
                      rules: [
                        {
                          required: true,
                          message: "Vui l??ng ch???n lo???i ph??ng!",
                        },
                      ],
                      initialValue: state.roomTypeId,
                    })(
                      <Select
                        disabled={state.id != ("" && undefined && null) || state.isReadOnly}
                        placeholder="Lo???i ph??ng"
                        onChange={onChange("roomTypeId")}
                      >
                        {listTypeOfRooms?.map((type, index) => (
                          <Option key={index} value={type.id}>
                            {type?.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
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
              onClick={onOK(false)}
            >
              ????ng
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
                Hu???
              </Button>
              <Button
                type="primary"
                style={{
                  minWidth: 100,
                }}
                onClick={onOK(true)}
              >
                L??u
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
      isLoadingCreate: state.room.isLoadingCreate || false,
      listTypeOfRooms: state.roomType.listTypeOfRooms || [],
    }),
    ({
      room: {
        onCreate,
        onUpdate,
      }
    }) => ({
      onCreate,
      onUpdate,
    }),
    null,
    { forwardRef: true }
  )(forwardRef(ModalAddRoom))
);
