import { message } from "antd";
import cacheUtils from "utils/cache-utils";
import productGroupProvider from "data-access/product-group-provider";

const formatData = (data = {}) => {
  const {
    listChild,
    productGroup: { id, name, parent_id, uid, numTree },
  } = data;
  return {
    id,
    name,
    numTree,
    parent_id,
    uid,
    children: listChild,
  };
};

const filterProductGroup = (data = []) => {
  const result = [];
  data.forEach((pGroup) => {
    let node = formatData(pGroup);
    if (node.children && node.children.length > 0) {
      const res = filterProductGroup(node.children);
      node.children = [...res];
    }
    result.push(node);
  });
  return result;
};

export default {
  state: {
    dsNhomHangHoa: [],
  },
  reducers: {
    updateData(state, payload = {}) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch) => ({
    getAll: (payload, state) => {
      return new Promise(async (resolve, reject) => {
        let userId = state.auth.auth?.id;
        let dsNhomHangHoa = await cacheUtils.read(
          userId,
          "DATA_NHOM_HANG_HOA",
          [],
          false
        );
        dispatch.nhomHangHoa.updateData({
          dsNhomHangHoa,
        });

        productGroupProvider
          .getAll()
          .then((s) => {
            dispatch.nhomHangHoa.updateData({
              isLoadingCreate: false,
            });
            const { groupDTOS } = s?.data;
            //TODO: filter nesccessary fields:
            //TODO: update state
            //TODO: cache
            let dsNhomHangHoa = filterProductGroup(groupDTOS);
            dispatch.nhomHangHoa.updateData({
              dsNhomHangHoa,
              isLoadingCreate: false,
            });
            cacheUtils.save(userId, "DATA_NHOM_HANG_HOA", dsNhomHangHoa, false);
          })
          .catch((e) => {
            dispatch.nhomHangHoa.updateData({
              isLoadingCreate: false,
            });
          });
      });
    },
    onCreate: (nhomHangHoa, state) => {
      return new Promise((resolve, reject) => {
        dispatch.nhomHangHoa.updateData({
          isLoadingCreate: true,
        });

        productGroupProvider
          .create(nhomHangHoa)
          .then((s) => {
            dispatch.nhomHangHoa.updateData({
              isLoadingCreate: false,
            });
            dispatch.nhomHangHoa.getAll();
            message.success("Th??m m???i th??nh c??ng");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "T???o m???i kh??ng th??nh c??ng");
            dispatch.nhomHangHoa.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    onUpdate: (payload, state) => {
      return new Promise((resolve, reject) => {
        dispatch.nhomHangHoa.updateData({
          isLoadingCreate: true,
        });

        productGroupProvider
          .update(payload)
          .then((s) => {
            dispatch.nhomHangHoa.updateData({
              isLoadingCreate: false,
            });

            dispatch.nhomHangHoa.getAll();
            message.success("C???p nh???t th??nh c??ng !");
            resolve(s?.data);
          })
          .catch(e => {
            message.error(e?.message || "C???p nh???t kh??ng th??nh c??ng!");
            dispatch.nhomHangHoa.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
    onDelete: (payload, state) => {
      return new Promise((resolve, reject) => {
        dispatch.nhomHangHoa.updateData({
          isLoadingCreate: true,
        });

        productGroupProvider
          .delete(payload)
          .then((s) => {
            dispatch.nhomHangHoa.updateData({
              isLoadingCreate: false,
            });

            dispatch.nhomHangHoa.getAll();
            message.success("X??a th??nh c??ng !");
            resolve(s?.data);
          })
          .catch((e) => {
            message.error(e?.message || "X??a kh??ng th??nh c??ng!");
            dispatch.nhomHangHoa.updateData({
              isLoadingCreate: false,
            });
            reject(e);
          });
      });
    },
  }),
};
