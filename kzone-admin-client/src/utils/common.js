function equar(a, b) {
  if (a.length !== b.length) {
    return false;
  } else {
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }
}
const checkInwardSlip = (value = "") => {
  var re = /^([a-zA-Z0-9]){2,30}$/g;
  return re.test(value.toLowerCase());
}

const checkInvoiceNumber = (value = "") => {
  return value;
}

const isValidValue = (val = -1) => val != -1;

const isValid = (val = -1) => val > 0;

const validateInwardSlipNumber = (rule, value, callback) => {
  if (value && !checkInwardSlip(value)) {
    callback("Số chứng từ không bao gồm các kí tự đặc biệt!");
  } else {
    callback();
  }
};

const mappingData = (data = []) => {
  let result = data?.map((item, index) => {
    if (!item.productDetailsReturnDTOList.length == 0) {
      item.productDetailsReturnDTOList = item?.productDetailsReturnDTOList?.map((item2, index2) => {
        if (item2.allocationCostIncurredList[0]?.totalAmountAllocationOfCostIncurred != -1) {
          //TODO: mapping cost into detail
          let allocationCostIncurredList = item2?.allocationCostIncurredList?.map((cost, index3) => (
            {
              name: cost?.costIncurred?.costIncurredName,
              total: cost?.totalAmountAllocationOfCostIncurred || 0,
            }
          ));
          item2.costs = [...allocationCostIncurredList];
        }
        if (item2.taxDetailReturnDTOList[0].totalTax != -1) {
          //TODO: mapping tax into detail
          let taxDetailReturnDTOList = item2?.taxDetailReturnDTOList?.map((tax, index3) => ({
            name: tax?.taxEntity?.name,
            total: tax?.totalTax || 0,
          }));
          item2.taxs = [...taxDetailReturnDTOList];
        }
        return item2;
      })
    }
    return item;
  });
  return result || [];
}

export { equar, isValidValue, checkInwardSlip, mappingData, checkInvoiceNumber, isValid, validateInwardSlipNumber };
