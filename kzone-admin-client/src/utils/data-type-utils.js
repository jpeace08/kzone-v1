Array.prototype.sum =
  Array.prototype.sum ||
  function (initValue) {
    try {
      return this.reduce((total, e) => {
        return total + e;
      }, initValue);
    } catch (error) {
      return initValue;
    }
  };
Number.prototype.formatMoney = function () {
  return this.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').replace(".00", "").replace(/,/g, ",");
}
String.prototype.formatMoney = function () {
  try {
    return parseInt(this).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').replace(".00", "").replace(/,/g, ",");
  } catch (error) {

  }
  return this;
}
/// Number:  200 ->  00000200
Number.prototype.formattedNumberCode = function () {
  return this.toLocaleString('en-US', {
    minimumIntegerDigits: 7,
    useGrouping: false
  })
}

Array.prototype.addElement = (start, number, payload) => {
  try {
    this.splice(start, number, payload);
    return this;
  } catch (error) {
    return this;
  }
}