import { combineUrlParams } from "utils";
import { client } from "client/request";
import { IMAGE_UPLOAD } from "../client/api";
import cacheUtils from "utils/cache-utils";

export default {
  uploadImage: ({ file, ...payload }) => {
    return new Promise(async (resolve, reject) => {
      const dataForm = new FormData();
      dataForm.append("file", file);

      for (const name in file) {
        dataForm.append(name, file[name]);
      }
      const auth = await JSON.parse(localStorage.getItem("auth"));
      client
        .post(`${IMAGE_UPLOAD}`, dataForm, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `${auth?.tokenType} ${auth?.token}`,
          },
        })
        .then((s) => {
          if (s?.data?.code === 1 && s?.data?.data?.filename) {
            resolve(s?.data?.data?.filename);
          } else {
            reject(s?.data);
          }
        })
        .catch((e) => {
          reject(e?.data);
        });
    });
  },
};
