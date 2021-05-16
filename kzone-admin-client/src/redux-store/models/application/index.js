export default {
  state: {
    url: null,
    isVisible: false,
  }, // initial state
  reducers: {
    updateData(state, payload = {}) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch) => ({
    setCurrentFuction: (payload, state) => {
      dispatch.application.updateData({
        currentFunction: payload,
      });
    },
    openPatientStreatment: ({ patientDocument, history }, state) => {
      let currentFunction = state.application.currentFunction;
      let url = "";
      switch (currentFunction) {
        case "CNS":
          url = `/app/vital-signs/${patientDocument}`;
          if (history) {
            history.push(url);
          } else {
            window.location.href = url;
          }
          break;
        case "HSBA":
        default:
          url = `/app/files/${patientDocument}`;
          if (history) {
            history.push(url);
          } else {
            window.location.href = url;
          }
          break;
      }
    },
    setCurrentSizePage: (payload) => {
      dispatch.application.updateData({
        currentSize: payload,
      })
    },
  }),
};
