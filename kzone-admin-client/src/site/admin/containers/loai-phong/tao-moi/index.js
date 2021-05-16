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
  Upload,
} from "antd";
import PricePerDay from "../components/PricePerDay";
import Infomation from "../components/Infomation";
import Photos from "../components/Photos";
import Rooms from "../components/Rooms";

const { TabPane } = Tabs;
const { Option } = Select;

function RoomType({
  isLoading,
  isLoadingCreate,
  currentItem,
  listPricePerDays,
  onImageUpload,
  onCreate,
  onUpdate,
  searchById,
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

  const handleChangeUploadImage = (data) => {
    onImageUpload({ file: data.file.originFileObj }).then((s) => {
      setState({
        images: [
          ...(state.images || []),
          s,
        ],
      });
    });
  };

  const onSave = () => {
    setState({

    });
    props.form.validateFields((error, values) => {
      if (!error) {
        let payload = {
          name: props.form.getFieldValue("name"),
          adultNumber: props.form.getFieldValue("adultNumber"),
          childNumber: props.form.getFieldValue("childNumber"),
          discountHoliday: props.form.getFieldValue("discountHoliday"),
          discountGroup: props.form.getFieldValue("discountGroup"),
          description: props.form.getFieldValue("description"),
          shortTimePrice: props.form.getFieldValue("shortTimePrice"),
          overNightPrice: props.form.getFieldValue("overNightPrice"),
          surcharge: props.form.getFieldValue("surcharge"),
          images: state.images || [],
        };

        if (!state.id) {
          payload.pricePerDays = listPricePerDays.map(i => ({
            price: i.price,
            numberOfPerson: i.numberOfPerson,
            numberOfBed: i.numberOfBed,
          }));
          //TODO:create:
          onCreate(payload).then((s) => {
            props.history.push("/admin/loai-phong");
          });
        } else {
          payload.pricePerDays = listPricePerDays.map(i => ({
            id: i?.id || undefined,
            price: i.price,
            numberOfPerson: i.numberOfPerson,
            numberOfBed: i.numberOfBed,
          }));
          //TODO: update
          onUpdate({
            id: state.id,
            payload,
          })
            .then((s) => {
              props.history.push("/admin/loai-phong");
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
        id: item?.id,
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
      // props.setCurrentItem(null);
      // props.clearOldData();
    } else {
      //TODO: get room type by id
      searchById({ id: props.match.params.id });
    }
  }, [props.match.params.id]);

  useEffect(() => {

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
            } LOẠI PHÒNG
          `}
          icon={[<i className="fal fa-window"></i>]}
          toolbar={
            <div className="panel-tag">
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
                    <TabPane key="1" tab="Infomation">
                      <Infomation
                        form={props.form}
                        filterOption={filterOption}
                      />
                      <Row className="view-detail" gutter={[8, 8]} style={{ width: "100%" }}>
                        <Tabs type="line">
                          <TabPane key="11" tab="Giá theo ngày">
                            <PricePerDay filterOption={filterOption} />
                          </TabPane>
                        </Tabs>
                      </Row>
                    </TabPane>
                    <TabPane key="2" tab="Rooms">
                      <Rooms
                        form={props.form}
                        filterOption={filterOption}
                      />
                    </TabPane>
                    <TabPane key="3" tab="Photos">
                      <Photos
                        form={props.form}
                        filterOption={filterOption}
                      />
                    </TabPane>
                  </Tabs>
                </div>
                <div className="view-main__currency">
                  <Tabs type="line" defaultActiveKey="1" style={{ minHeight: "290px" }}>
                    <TabPane key="jpeace08" tab="Upload">
                      <Upload
                        multiple
                        disabled={state.isReadOnly}
                        listType="picture-card"
                        className="avatar-uploader"
                        onChange={handleChangeUploadImage}
                      >
                        Upload
                      </Upload>
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
      isLoading: state.roomType.isLoading || false,
      isLoadingCreate: state.roomType.isLoadingCreate || false,
      currentItem: state.roomType.currentItem,
      listPricePerDays: state.roomType.listPricePerDays || [],
    }),
    ({
      roomType: {
        onCreate,
        onUpdate,
        searchById,
      },
      image: {
        onImageUpload
      }
    }) => {
      return {
        onCreate,
        onUpdate,
        searchById,
        onImageUpload,
      };
    }
  )(RoomType)
);
