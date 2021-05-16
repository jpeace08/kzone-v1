export const DS_LOAI_CHUNG_TU = [
  {
    id: 1,
    name: "Mua hàng trong nước nhập kho",
  },
  {
    id: 2,
    name: "Mua hàng trong nước không qua kho",
  },
  {
    id: 3,
    name: "Mua hàng nhập khẩu nhập kho",
  },
  {
    id: 4,
    name: "Mua hàng nhập khẩu không qua kho",
  },
];
export const DS_TAI_KHOAN = {
  congNo: 1,
  kho: 2,
  thue: 3,
  tien: 4,
  chiPhi: 5,
}
export const DS_DON_VI = [
  {
    id: 1,
    name: "Cái",
  },
  {
    id: 2,
    name: "Chiếc",
  },
];

export const DS_ID_THUE = {
  thueNKId: 2,
  thueGTGTId: 1,
};

export const STATUS_BILL = {
  daNhanHoaDon: 1,
  chuaNhanHoaDon: 0,
};

export const STATUS_PAY = {
  daThanhToan: 1,
  chuaThanhToan: 0,
};

export const STATUS_GOODS = {
  hangDaVe: 1,
  hangDangVe: 2,
  daXacNhan: 3,
};

export const ALLOCATION_TYPE = {
  theoGia: 1,
  theoSoLuong: 2,
}
export const COMBO_PRODUCT_TYPE = {
  hangKhongTang: 1,
  hangTang: 2,
}

//others

export const STATUS_ROOM = [
  {
    value: 0,
    title: "Khả dụng",
    color: "green-inverse",
  },
  {
    value: 1,
    title: "Đã đặt trước",
    color: "cyan-inverse",
  },
  {
    value: 2,
    title: "Chưa dọn buồng",
    color: "volcano-inverse",
  },
  {
    value: 3,
    title: "Đang dọn buồng",
    color: "orange-inverse",
  },
  {
    value: 4,
    title: "Khách đang ở",
    color: "blue-inverse",
  },
];

export const TYPE_OF_BOOKING = [
  {
    value: 0,
    title: "Thuê theo giờ",
  },
  {
    value: 1,
    title: "Thuê qua đêm",
  },
  {
    value: 2,
    title: "Thuê theo ngày",
  }
];

export const TYPE_OF_CUSTOMER = [
  {
    value: 0,
    title: "Khách lẻ",
  },
  {
    value: 1,
    title: "Khách đoàn",
  },
];