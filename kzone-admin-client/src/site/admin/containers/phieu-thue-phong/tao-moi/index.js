import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { AdminPage, Panel } from "site/admin/components/admin";
import moment from "moment";
import { Main } from "./styled";

import {
  Form,
  Select,
  Spin,
  Tabs,
  Row,
  Button,
} from "antd";
import BookedRooms from "../components/BookedRooms";
import Infomation from "../components/Infomation";
import Customer from "../components/Customer";
import AvailableRooms from "../components/AvailableRooms";

const { TabPane } = Tabs;
const { Option } = Select;

function Booking({
  isLoading,
  isLoadingCreate,
  currentItem,
  listRoomsOfBooking,
  listRooms,
  onCreate,
  onUpdate,
  onSearch,
  onSearchRoomType,
  ...props
}) {
  const [state, _setState] = useState({});
  const url = new URL(window.location.href);
  const mode = url.searchParams.get("mode");
  const setState = (_state) => {
    _setState((state) => ({
      ...state,
      ...(_state || {}),
    }));
  };
  const { getFieldDecorator } = props.form;

  const onChange = (type) => (e) => {
    let newState = {
      [type]: e?.hasOwnProperty("target")
        ? e.target.value
        : e?.hasOwnProperty("_d")
          ? moment(e._d).format("YYYY-MM-DD HH:mm:ss")
          : e,
    };
    setState(newState);
  };

  const onSave = () => {
    setState({

    });
    props.form.validateFields((error, values) => {
      if (!error) {
        let payload = {

        };

        if (state.id == (undefined || null || "")) {
          //TODO:create:
          onCreate(payload).then((s) => {
            props.history.push("/admin/phieu-thue-phong");
          });
        } else {
          //TODO: update
          onUpdate({
            id: state.id,
            payload,
          })
            .then((s) => {
              props.history.push("/admin/phieu-thue-phong");
            });
        }
      }
    });
  };

  useEffect(() => {
    //TODO: update state with current item
    if (currentItem != null && (mode == "view" || mode == "edit")) {
      const item = currentItem;
      let newState = {
        show: true,

      };
      if (mode == "view") {
        newState.isReadOnly = true;
      }
      setState(newState);
    }
  }, [currentItem]);

  useEffect(() => {
    if (props.match.params.id == "tao-moi") {
      //nếu là tạo mới thì xoá item trong model

    } else {
      //TODO: get room booking bill by id
      onSearch({ id: props.match.params.id });
    }
  }, [props.match.params.id]);

  useEffect(() => {
    onSearchRoomType({ dataSearch: { size: 999 } });
  }, []);

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
          title={`${props.match.params.id == "tao-moi"
            ? "THÊM MỚI"
            : state.isReadOnly
              ? "XEM THÔNG TIN"
              : "CHỈNH SỬA"
            } PHIẾU THUÊ PHÒNG
          `}
          icon={[<i className="fal fa-window"></i>]}
          toolbar={
            <div className="panel-tag">
              <Select
                onChange={onChange("status")}
                placeholder="Trạng thái thanh toán"
                value={state.status || 0}
              >
                <Option key="col1" value={0}>Chưa thanh toán</Option>
                <Option key="col2" value={1}>Đã thanh toán</Option>
              </Select>
              {!state.isReadOnly && (
                <Button
                  style={{ minWidth: 100, marginRight: "10px" }}
                  type="primary"
                  onClick={onSave}
                >
                  Lưu
                </Button>
              )}
            </div>
          }
        >
          <Spin spinning={isLoading || isLoadingCreate}>
            <Form>
              <div className="view-main">
                <div className="view-main__info">
                  <Tabs type="line" defaultActiveKey="1" style={{ minHeight: "290px" }}>
                    <TabPane key="1" tab="Thông tin thuê phòng">
                      <Infomation
                        form={props.form}
                        filterOption={filterOption}
                      />
                    </TabPane>
                    <TabPane key="3" tab="Thông tin khách hàng">
                      <Customer
                        form={props.form}
                        filterOption={filterOption}
                      />
                    </TabPane>
                  </Tabs>
                  <Row className="view-detail" gutter={[8, 8]} style={{ width: "100%" }}>
                    <Tabs type="line">
                      <TabPane key="11" tab="Danh sách phòng thuê">
                        <BookedRooms filterOption={filterOption} />
                      </TabPane>
                    </Tabs>
                  </Row>
                </div>
                <div className="view-main__currency">
                  <Tabs type="line" defaultActiveKey="1" style={{ minHeight: "290px" }}>
                    <TabPane key="jpeace08" tab="Phòng khả dụng">
                      <AvailableRooms filterOption={filterOption} />
                    </TabPane>
                  </Tabs>
                </div>
              </div>
            </Form>
          </Spin>
        </Panel>
      </AdminPage>
    </Main >
  );
}
export default Form.create({})(
  connect(
    (state) => ({
      isLoading: state.booking.isLoading || false,
      isLoadingCreate: state.booking.isLoadingCreate || false,
      currentItem: state.booking.currentItem,
      listRoomsOfBooking: state.booking.listRoomsOfBooking || [],
      listRooms: state.room.listRooms || [],
    }),
    ({
      booking: {
        onCreate,
        onUpdate,
        onSearch,
      },
      roomType: {
        onSearch: onSearchRoomType,
      }
    }) => {
      return {
        onCreate,
        onUpdate,
        onSearch,
        onSearchRoomType,
      };
    }
  )(Booking)
);
