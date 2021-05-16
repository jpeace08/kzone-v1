import excelFileProvider from "data-access/file-excel-provider";
export default {
  state: {},
  reducers: {
    updateData(state, payload = {}) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch) => ({
    getFileData: (payload, state) => {
      dispatch.file.updateData({ isLoading: true, });
      return new Promise((resolve, reject) => {
        excelFileProvider
          .getFileData({ ...payload })
          .then((s) => {
            dispatch.file.updateData({
              isLoading: false,
            })
            resolve(s);
          })
          .catch((e) => {
            dispatch.file.updateData({
              isLoading: false,
            })
            reject(e);
          });
      });
    },
  }),
};
