import cacheUtils from "utils/cache-utils";
import { message } from "antd";
import imageProvider from "data-access/image-provider";
export default {
  state: {},
  reducers: {
    updateData(state, payload = {}) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch) => ({
    onImageUpload: (file, state) => {
      return new Promise((resolve, reject) => {
        imageProvider
          .uploadImage({ file })
          .then((s) => {
            console.log(s);
            resolve(s);//?.data?.filename
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
  }),
};
