import { client } from "client/request";
import { combineUrlParams } from "utils";
import { EXCEL_GET_DATA, FILE_UPLOAD } from "client/api";

export default {
  getFileData: (payload) => {
    return new Promise(async (resolve, reject) => {
      const auth = await JSON.parse(localStorage.getItem("auth"));
      client
        .get(combineUrlParams(`${EXCEL_GET_DATA}`, {
          fileName: `${payload?.fileName?.split("/").pop()}` + ""
        }), {
          headers: {
            "Authorization": `${auth?.tokenType} ${auth?.accessToken}`,
          },
        })
        .then((s) => {
          if (s?.data?.code === 1) {
            resolve(s?.data?.data);
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
