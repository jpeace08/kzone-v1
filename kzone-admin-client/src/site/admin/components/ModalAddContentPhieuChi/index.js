import React, { useImperativeHandle, useState, forwardRef, useMemo } from "react";
import { Button, Form, Input, Spin, Select } from "antd";
import { connect } from "react-redux";
import { Main } from "./styled";

const ModalAddContentPhieuChi = (props, ref) => {
  const { getFieldDecorator } = props.form;

  const [state, _setState] = useState({
    showAddGroupContent: false,
  });

  const setState = (data = {}) => {
    _setState((state) => {
      return { ...state, ...data };
    });
  };

  useImperativeHandle(ref, () => ({
    show: () => {
      setState({
        show: true,
      });
      props.form.resetFields("groupId");
      props.onSearchGroupContent({});
    },
  }));

  const handleSubmit = () => { };

  const onChange = (type) => (e) => {
    setState({
      [type]: e && e.target ? e.target.value : e,
    });
  };

  const onOK = (ok, isDelete) => () => {
    if (ok) {
      props.form.validateFields((errors, values) => {
        if (!errors) {
          let payload = {
            groupId: state.groupId,
            contentId: state.contentPC
          }
          props.setValueContent(payload)
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
  const showAddGroupContent = () => {
    setState({
      showAddGroupContent: !state.showAddGroupContent
    })
  }
  const onCreateGroupContent = (e) => {
    if (e.keyCode == 13) {
      let value = e && e.target ? e.target.value : e;
      props.onCreateGroupContent(value);
      setState({
        showAddGroupContent: false,

      })
    }
  }
  const onCreateContent = (e) => {
    if (e.keyCode == 13) {
      let description = e && e.target ? e.target.value : e;
      let contentGroupId = state.groupId;
      contentGroupId && props.onCreateContent({ contentGroupId, description });
      setState({
        content: "",
      })
    }
  }
  return (
    <Main
      visible={state.show}
      style={{ maxWidth: 420 }}
      closable={false}
      centered
      onCancel={onOK(false, false)}
      footer={[null]}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <Spin spinning={props.isLoadingCreate}>
        <div className="modal-des">
          <h4 className="title-des">
            TH??M N???I DUNG PHI???U CHI
          </h4>
          <div className="content-des">
            <Form onSubmit={handleSubmit}>
              <Form.Item label={"Nh??m n???i dung phi???u chi"}>
                <Select
                  placeholder="Ch???n nh??m n???i dung"
                  style={{ width: '85%', marginRight: '5%' }}
                  onChange={onChange("groupId")}
                  value={state.groupId}
                  showSearch
                  filterOption={filterOption}
                >
                  {props.dsNhomNDPhieuChi?.map((item, index) => (
                    <Select.Option key={index + 1} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
                <Button
                  icon="plus"
                  style={{ width: '10%' }}
                  onClick={showAddGroupContent}
                  title="Th??m m???t nh??m n???i dung"
                />
                {state.showAddGroupContent &&
                  <Input
                    placeholder="Nh???p t??n nh??m n???i dung c???n th??m"
                    onKeyDown={onCreateGroupContent}
                  />
                }
              </Form.Item>
              {state.groupId && <Form.Item label={"Nh???p t??n n???i dung c???n th??m"}>
                <Input
                  placeholder="Nh???p n???i dung c???n th??m"
                  onKeyDown={onCreateContent}
                  onChange={onChange("content")}
                  value={state.content}
                />
              </Form.Item>
              }
            </Form>
          </div>
        </div>
        <hr />
        <div className="action-footer">
          <Button
            type="danger"
            style={{
              minWidth: 100,
            }}
            onClick={onOK(false)}
          >
            ????NG
          </Button>
        </div>
      </Spin>
    </Main>
  );
};

export default Form.create({})(
  connect(
    (state) => ({
      isLoadingCreate: state.phieuChi.isLoadingCreate || false,
      dsContentPhieuChi: state.phieuChi.dsContentPhieuChi || [],
      dsNhomNDPhieuChi: state.phieuChi.dsNhomNDPhieuChi || [],
    }),
    ({ phieuChi: {
      onSearchGroupContent,
      onCreateGroupContent,
      onCreateContent,
      setDsContentPhieuChi,
      setValueContent,
    }
    }) => ({
      onSearchGroupContent,
      onCreateGroupContent,
      onCreateContent,
      setDsContentPhieuChi,
      setValueContent,
    }),
    null,
    { forwardRef: true }
  )(forwardRef(ModalAddContentPhieuChi))
);
