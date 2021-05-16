import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { AdminPage, Panel, FilterBox } from "site/admin/components/admin";
import { Main } from "./styled";
import {
  Row,
  Col,
  Input,
  Select,
  message,
  List,
  DatePicker,
  Form,
  Button,
  Radio,
} from "antd";
function KhachHang(props) {
  const [state, _setState] = useState({
    nhomKhachId: "Tất cả các nhóm",
    nguoiTaoId: [],
    loaiKhachId: "Tất cả",
    gioiTinhId: "Tất cả",
    trangThaiId: "Tất cả",
  });
  const dataSearchNKH = ["Tất cả các nhóm", "Nhom 1", "Nhom 2"];
  const setState = (_state) => {
    _setState((state) => ({
      ...state,
      ...(_state || {}),
    }));
  };

  const onChangeRadio = (type) => (e) => {
    setState({
      [type]: e.target.value,
    });
  };
  const onChangeSelect = (type) => (e) => {
    setState({
      [type]: e,
    });
  };
  const showAddNhomKH = () => {
    message.error("show add nhóm khách hàng");
  };
  const { RangePicker } = DatePicker;
  const dateFormat = "YYYY/MM/DD";
  const onSearchBox = ({ target: { value } }) => {
    const filterData =
      value &&
      dataSearchNKH.reduce((acc, currentValue) => {
        if (
          currentValue.toLocaleLowerCase().includes(value.toLocaleLowerCase())
        ) {
          return [...acc, currentValue];
        } else return acc;
      }, []);
    setState({
      nhomKhachIds: filterData || dataSearchNKH,
    });
  };
  function onChangeBirthday(dates, dateStrings) {
    setState({
      birthdayId: dateStrings[0] + "-" + dateStrings[1],
    });
  }
  function onChangeDateCreate(dates, dateStrings) {
    setState({
      dateCreateId: dateStrings[0] + "-" + dateStrings[1],
    });
  }
  function onChangeNGD(dates, dateStrings) {
    setState({
      NGDId: dateStrings[0] + "-" + dateStrings[1],
    });
  }
  function onHandleFilterNKH(e) {
    setState({
      nhomKhachId: e.target.getAttribute("value"),
    });
  }
  const childrenBG = [];
  const { Option } = Select;

  for (let i = 1; i < 5; i++) {
    // đẩy danh sách chọn vào đây
    childrenBG.push(
      <Option key={"NV" + i.toString()}>{"Nhân viên " + i.toString()}</Option>
    );
  }
   // const onFinishTongBan = (values) => {
  //   setState({
  //     tongBanId: values
  //   });
  // };
  // const onFinishFailed = (errorInfo) => {
  //   console.log('Failed:', errorInfo);
  // };

  return (
    <Main>
      <AdminPage>
        <Panel
          title="Quản lý khách hàng"
          icon={[<i className="fal fa-window"></i>]}
        >
          <Row gutter={[6, 6]}>
            <Col span={6}>
              <FilterBox
                title="Nhóm khách hàng"
                showExpandButton={true}
                showAddButton={true}
                onExpandButtonClick={showAddNhomKH}
              >
                <Input.Search
                  placeholder="Tìm kiếm nhóm hàng..."
                  onChange={onSearchBox}
                />
                <List
                  style={{ color: "white", margin: "0 5%" }}
                  size="small"
                  bordered={false}
                  dataSource={
                    state.nhomKhachIds ? state.nhomKhachIds : dataSearchNKH
                  }
                  renderItem={(item) => (
                    <List.Item
                      key={item}
                      onClick={onHandleFilterNKH}
                      value={item}
                      style={{ cursor: "pointer" }}
                    >
                      {item}
                    </List.Item>
                  )}
                />
              </FilterBox>
              <FilterBox
                title="Ngày tạo"
                showExpandButton={true}
                showAddButton={false}
              >
                <RangePicker
                  onChange={onChangeDateCreate}
                  format={"DD/MM/YYYY"}
                />
              </FilterBox>
              <FilterBox
                title="Người tạo"
                showExpandButton={true}
                showAddButton={false}
              >
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Chọn người tạo..."
                  defaultValue={state.nguoiTaoId}
                  onChange={onChangeSelect("nguoiTaoId")}
                >
                  {childrenBG}
                </Select>
              </FilterBox>
              <FilterBox
                title="Sinh nhật"
                showExpandButton={true}
                showAddButton={false}
              >
                <RangePicker onChange={onChangeBirthday} format={"DD/MM"} />
              </FilterBox>
              <FilterBox
                title="Ngày giao dịch cuối"
                showExpandButton={true}
                showAddButton={false}
              >
                <RangePicker onChange={onChangeNGD} format={"DD/MM/YYYY"} />
              </FilterBox>
              {/* <FilterBox
                title="Tổng bán"
                showExpandButton={true}
                showAddButton={false}
              >
                {/* <Form
                  // {...layout}
                  name="basic"
                  onFinish={onFinishTongBan}
                  onFinishFailed={onFinishFailed}

                >
                  <Form.Item
                    label="Từ"
                    style={{ display: 'inline-block' }}
                  >
                    <Input placeholder='Giá trị' />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Submit
                   </Button>
                  </Form.Item> 

                </Form>
              </FilterBox>*/}
              <FilterBox
                title="Loại khách"
                showExpandButton={true}
                showAddButton={false}
              >
                <Radio.Group
                  onChange={onChangeRadio("loaiKhachId")}
                  value={state.loaiKhachId}
                >
                  <Radio value={"Tất cả"}> Tất cả </Radio> <br />
                  <Radio value={"Cá nhân"}> Cá nhân </Radio>
                  <br />
                  <Radio value={"Công ty"}> Công ty </Radio>
                </Radio.Group>
              </FilterBox>
              <FilterBox
                title="Giới tính"
                showExpandButton={true}
                showAddButton={false}
              >
                <Radio.Group
                  onChange={onChangeRadio("gioiTinhId")}
                  value={state.gioiTinhId}
                >
                  <Radio value={"Tất cả"}> Tất cả </Radio>
                  <br />
                  <Radio value={"Nam"}> Nam </Radio>
                  <br />
                  <Radio value={"Nữ"}> Nữ </Radio>
                </Radio.Group>
              </FilterBox>
              <FilterBox
                title="Giới tính"
                showExpandButton={true}
                showAddButton={false}
              >
                <Radio.Group
                  onChange={onChangeRadio("trangThaiId")}
                  value={state.trangThaiId}
                >
                  <Radio value={"Tất cả"}> Tất cả </Radio>
                  <Radio value={"Đang hoạt động"}> Đang hoạt động </Radio>
                  <br />
                  <Radio value={"Ngừng hoạt động"}> Ngừng hoạt động </Radio>
                  <br />
                </Radio.Group>
              </FilterBox>
            </Col>
          </Row>
        </Panel>
      </AdminPage>
    </Main>
  );
}
export default connect(
  (state) => {
    return {};
  },
  ({}) => {
    return {};
  }
)(KhachHang);
