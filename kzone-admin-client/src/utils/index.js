export const combineUrlParams = (url = "", params = {}) => {
  const keys = Object.keys(params);
  const paramUrl = keys
    .reduce(
      (result, key) =>
        params[key] !== undefined && params[key] !== null && params[key] !== ""
          ? [...result, `${key}=${params[key]}`]
          : [...result],
      []
    )
    .join("&");
  return `${url}?${paramUrl}`;
};

export const combineParamsPath = (url = "", params = {}) => {
  const keys = Object.keys(params);
  const paramUrl = keys
    .reduce(
      (result, key) =>
        params[key] !== undefined && params[key] !== null && params[key] !== ""
          ? [...result, `${key}=${params[key]}`]
          : [...result],
      []
    )
    .join("/");
  return `${url}/${paramUrl}`;
};

export const convertArray = (element, prop, value) => {
  const arr = [];
  for (let i = 1; i <= element; i += 1) {
    arr.push({
      key: i,
      [prop]: value,
    });
  }
  return arr;
};

export const convertObjectToParams = (obj = {}) => {
  const keys = Object.keys(obj);
  return keys
    .reduce(
      (result, key) =>
        obj[key] !== undefined && obj[key] !== null && obj[key] !== ""
          ? [...result, `${key}=${obj[key]}`]
          : [...result],
      []
    )
    .join("&");
};