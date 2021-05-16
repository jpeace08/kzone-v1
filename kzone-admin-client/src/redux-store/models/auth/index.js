import { message } from "antd";
import authProvider from "data-access/auth-provider";
export default {
  state: {
    auth: (() => {
      try {
        let data = localStorage.getItem("auth") || "";
        if (data) return JSON.parse(data);
      } catch (error) {
        console.log(error);
      }
      return null;
    })()
  },
  reducers: {
    updateData(state, payload = {}) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch) => ({
    onLogin: (param, state) => {
      const { username, password } = param;
      return new Promise((resolve, reject) => {
        if (!username || !password) {
          message.error("Thông tin tài khoản không đúng");
          return;
        }
        authProvider
          .login({ password, username })
          .then((s) => {
            localStorage.setItem("auth", JSON.stringify({ ...s?.data?.auth, roles: s?.data?.roles }));
            dispatch.auth.updateData({
              auth: {
                ...s?.data?.auth,
                roles: s?.data?.roles
              },
            });
            message.success("Đăng nhập thành công");
            resolve(s?.data);
            return;
          })
          .catch((e) => {
            message.error("Đăng nhập không thành công");
            reject(e);
          });
      });
    },
    onLogout: () => {
      authProvider
        .logout()
        .then((s) => {
          localStorage.removeItem("auth");
          dispatch.auth.updateData({
            auth: null,
          });
          setTimeout(() => {
            let redirect = `/login`;
            window.location.href = redirect;
          }, 1000);
        })
        .catch((e) => {
          console.log(e);
        });
    },
  }),
};
