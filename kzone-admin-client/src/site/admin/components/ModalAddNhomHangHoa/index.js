import React, { useImperativeHandle, useState, forwardRef, useMemo } from "react";
import { Button, Form, Input, Spin, TreeSelect } from "antd";
import { connect } from "react-redux";
import { Main } from "./styled";

export const filterObject = (payload = {}, param = {}) => {
  const result = {
    [param?.key || "key"]: payload?.id || "",
    [param?.title || "title"]: payload?.name || "",
    [param?.children || "children"]: payload?.children || [],
  };
  if (param.parentId) result[param.parentId] = payload.parent_id;
  return result;
};

export const filterArrayObject = (payload = [], param = {}) => {
  const cookedData = [];
  payload.forEach(item => {
    const child = filterObject(item, param);
    if (child.children && child.children.length > 0) {
      const node = filterArrayObject(child.children, param);
      child.children = [...node];
    }
    else child.children = null;
    cookedData.push(child);
  });
  return cookedData;
}

const getProductGroupsTreeData = (ds, param) => {
  let data = filterArrayObject(ds, param);
  data = [{ value: 0, title: "Nhóm cha" }, ...data];
  return data;
}

const ModalAddNhomHangHoa = (props, ref) => {
  const { form: { getFieldDecorator }, dsNhomHangHoa } = props;
  const param = {
    key: "value",
    title: "title",
    children: "children",
    parentId: "parent_id",
  };
  let productGroups = useMemo(() => getProductGroupsTreeData(dsNhomHangHoa, param), [dsNhomHangHoa, param]);
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
        id: item?.id || "",
        name: item?.name || "",
        parent_id: item?.parent_id || 0,
      });
      props.form.resetFields();
    },
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const onChange = (type) => (e) => {
    setState({
      [type]: e && e.target ? e.target.value : e,
    });
  };

  const onOK = (ok, isDelete) => () => {
    if (ok) {
      props.form.validateFields((errors, values) => {
        if (!errors) {
          if (!state.id)
            props
              .onCreate({
                name: state.name,
                parentId: state.parent_id || 0,
              })
              .then((s) => {
                setState({ show: false });
              })
              .catch(e => {
                setState({ show: false });
              });
          else {
            if (isDelete) {
              props
                .onDelete(state.id)
                .then((s) => {
                  setState({ show: false });
                })
                .catch(e => {
                  setState({ show: false });
                });
            }
            else {
              props
                .onUpdate({
                  id: state.id,
                  body: {
                    name: state.name,
                    parentId: state.parent_id,
                  }
                })
                .then((s) => {
                  setState({ show: false });
                })
                .catch(e => {
                  setState({ show: false });
                });
            }
          }
        }
      });
    } else setState({ show: false });
  };

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
            {state.id ? "CHỈNH SỬA" : "THÊM MỚI"} NHÓM HÀNG HÓA
          </h4>
          <div className="content-des">
            <Form onSubmit={handleSubmit}>
              <Form.Item label={"Tên nhóm hàng hóa"}>
                {getFieldDecorator("name", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng nhập tên nhóm hàng hóa!",
                    },
                  ],
                  initialValue: state.name,
                })(
                  <Input
                    onChange={onChange("name")}
                    onKeyDown={(e) => {
                      if (e?.key == 'Enter') {
                        onOK(true, false)();
                      }
                    }}
                    placeholder={"Nhập tên nhóm hàng hóa"}
                  />
                )}
              </Form.Item>
              <Form.Item label={"Nhóm cha"}>
                {getFieldDecorator("parent_id", {
                  rules: [],
                  initialValue: state.parent_id,
                })(
                  <TreeSelect
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                    placeholder="Lựa chọn"
                    allowClear
                    treeDefaultExpandAll
                    onSelect={onChange("parent_id")}
                    showSearch
                    // onChange={onChange("parent_id")}
                    treeNodeFilterProp="title"
                    treeData={productGroups}
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
              onClick={onOK(false, false)}
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
                onClick={onOK(false, false)}
              >
                Huỷ
              </Button>
              <Button
                type="primary"
                style={{
                  minWidth: 100,
                }}
                onClick={onOK(true, false)}
              >
                Lưu
              </Button>
              <Button
                hidden={state?.id == undefined || state.id == ""}
                type="ghost"
                style={{
                  minWidth: 100,
                }}
                onClick={onOK(true, true)}
              >
                Xóa
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
      isLoadingCreate: state.nhomHangHoa.isLoadingCreate || false,
      dsNhomHangHoa: state.nhomHangHoa.dsNhomHangHoa || [],
    }),
    ({ nhomHangHoa: {
      onCreate,
      onUpdate,
      onDelete,
    } }) => ({
      onCreate,
      onUpdate,
      onDelete,
    }),
    null,
    { forwardRef: true }
  )(forwardRef(ModalAddNhomHangHoa))
);
