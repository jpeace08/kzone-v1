export const AUTH_LOGIN = "/auth/login";
export const AUTH_LOGOUT = "/auth/logout";
//phongBan
export const DEPARTMENT = "/department";
export const DEPARTMENT_GET_ALL = "/department/get-all";
export const DEPARTMENT_SEARCH = "/department/search";
export const DEPARTMENT_CREATE = "/department/create";
export const DEPARTMENT_GET_DETAIL = "/department/get-detail";
export const DEPARTMENT_DELETE = "/department/delete";
export const DEPARTMENT_UPDATE = "/department/update";
//nhomHangHoa
export const NHOM_HANG_HOA_GET_ALL = "/product-group/get-all";
export const NHOM_HANG_HOA_CREATE = "/product-group/create";
export const NHOM_HANG_HOA_UPDATE = "/product-group/update";
export const NHOM_HANG_HOA_DELETE = "/product-group/delete";
//hangHoa
export const HANG_HOA_GET_ALL = "/product/get-all";
export const HANG_HOA_SEARCH = "/product/search";
export const HANG_HOA_CREATE = "/product/create";
export const HANG_HOA_DELETE = "/product/delete";
export const HANG_HOA_UPDATE = "/product/update";
export const HANG_HOA_GET_BY_ID = "/product/get-by-id";
export const HANG_HOA_DELETE_MULTIPLE = "/product/delete";
export const HANG_HOA_GET_BY_WAREHOUSE = "/product/get-product-by-vendor-warehouse";
export const HANG_HOA_GET_PRODUCT_INWARD_SLIP = "product/get-product-add-inward_slip";
//hangHoaChiTiet
export const HANG_HOA_CHI_TIET_SEARCH = "/product-detail/search";
export const HANG_HOA_CHI_TIET_UPDATE = "/product-detail/update";
//combo
export const COMBO_SEARCH = "/combo-product/search";
export const COMBO_CREATE = "/combo-product/create";
export const COMBO_DELETE = "/combo-product/delete";
export const COMBO_UPDATE = "/combo-product/update";
export const COMBO_GET_BY_ID = "/combo-product/get-by-id";
//comboDetail
export const COMBO_DETAIL_CREATE = "/combo-detail/create";
export const COMBO_DETAIL_DELETE = "/combo-detail/delete";
export const COMBO_DETAIL_UPDATE = "/combo-detail/update";
//phieuMuaHang
export const INWARD_SLIP_CREATE = "/inward-slip-controller/create";
export const INWARD_SLIP_UPDATE = "/inward-slip-controller/update";
export const INWARD_SLIP_UPDATE_STATUS_GOODS = "/inward-slip-controller/update-status";
export const INWARD_SLIP_UPDATE_STATUS_PAY = "/inward-slip-controller/update-status-pay";
export const INWARD_SLIP_UPDATE_ALLOCATION_TYPE = "/inward-slip-controller/update-allocation-type";
export const INWARD_SLIP_SEARCH_V2 = "/inward-slip-controller/search-v2";
export const INWARD_SLIP_SEARCH = "/inward-slip-controller/search";
export const INWARD_SLIP_DELETE = "/inward-slip-controller/delete";
export const INWARD_GET_INVOICE = "/inward-slip-controller/get-invoice";
export const INWARD_GET_NUMBLE = "/inward-slip-controller/get-inward-slip-number"
export const INWARD_UPDATE_COST_INCURRED = "/inward-slip-controller/update-cost-incurred";
export const INWARD_ADD_SERVICE_VOUCHER = "/inward-slip-controller/add-service-voucher-for-inward-slip";
export const INWARD_GET_ALLOCATION = "/inward-slip-controller/get-total-allocation";
export const INWARD_UPDATE_CONFIRM_TO_COMING = "/inward-slip-controller/update-status-confirmed-to-coming";
export const INWARD_GET_WITH_WAREHOUSE = "/inward-slip-controller/get-inward-slip-barcode";
export const INWARD_GET_NUMBERS = "/inward-slip-controller/get-number-voucher-number-and-invoice-number";
//phieuChi
export const PAYMENT_VOUCHER_GOODS_UPDATE = "/payment-voucher-goods/update";
export const PAYMENT_VOUCHER_GET_SERVICES = "/payment-voucher-goods/get-by-idServiceVoucher"
export const INWARD_GET_PAYMENT_VOUCHER = "/inward-slip-controller/get-payment-voucher-goods";
export const PAYMENT_VOUCHER_CONTENT_CREATE = "/payment-voucher-content/create";
export const PAYMENT_VOUCHER_CONTENT_GET_ALL = "/payment-voucher-content/get-all";
export const PAYMENT_VOUCHER_CONTENT_SEARCH = "/payment-voucher-content/search";
export const PAYMENT_VOUCHER_GROUP_CONTENT_SEARCH = "/payment-voucher-group/search";
export const PAYMENT_VOUCHER_GROUP_CONTENT_CREATE = "/payment-voucher-group/create";
export const PAYMENT_VOUCHER_DETAIL_GET_LISTCONTENT_BY_ID = "/payment-voucher-detail/get-list-by-payment-voucher-id"
export const PAYMENT_VOUCHER_UPDATE = "/payment-voucher/update-v2";
export const PAYMENT_VOUCHER_CREATE = "/payment-voucher/create";
export const PAYMENT_VOUCHER_GET_ALL = "/payment-voucher/get-all";
export const PAYMENT_VOUCHER_UPDATE_STATUS = "/payment-voucher/update";
export const PAYMENT_VOUCHER_SEARCH = "/payment-voucher/search";
export const PAYMENT_VOUCHER_DELETE = "/payment-voucher/delete";
export const PAYMENT_VOUCHER_GET_BY_USER_ID = "/payment-voucher/get-list-by-user-id"
//ty gia
export const EXCHANGE_RATE_CREATE = "/exchange-rate/";
export const EXCHANGE_RATE_GET_ALL = "/exchange-rate/get-all";
//thue
export const TAX_CREATE = "/tax/create";
export const TAX_GET_ALL = "/tax/get-all";
//account
export const ACCOUNT_GET_ALL = "/accounting-account/get-all";
//nhà cung cấp (vendor)
export const VENDOR_CREATE = "/vendor/create";
export const VENDOR_GET_ALL = "/vendor/get-all";
export const VENDOR_GET_BY_ID = "/vendor/get-by-id";
export const VENDOR_SEARCH = "/vendor/search";
export const VENDOR_DELETE = "/vendor/delete";
export const VENDOR_UPDATE = "/vendor/update";
//roles
export const ROLES_CREATE = "/roles/create";
export const ROLES_GET_ALL = "/roles/search";
export const ROLES_SEARCH = "/roles/search";
export const ROLES_GET_DETAIL = "/roles/get-detail";
export const ROLES_DELETE = "/roles/delete";
export const ROLES_UPDATE = "/roles/update";
//permission
export const PERMISSION_SEARCH = "/permission/search";
export const PERMISSION_CREATE = "/permission/create";
export const PERMISSION_DELETE = "/permission/delete";
export const PERMISSION_GET_BY_USER = "/permission/get-by-id-user";
;
//user
export const USER_CREATE = "/user/create";
export const USER_SEARCH = "/user/search";
export const USER_DELETE = "/user/delete";
export const USER_UPDATE = "/user/update";
export const USER_UPDATE_PERMISSION = "/user/update-permission";
export const USER_UPDATE_PASSWORD = "/user/update-password";

//warehouse
export const WAREHOUSE_CREATE = "/warehouse/create";
export const WAREHOUSE_GET_ALL = "/warehouse/get-all";
export const WAREHOUSE_DELETE = "/warehouse/delete";
export const WAREHOUSE_UPDATE = "/warehouse/update";
export const WAREHOUSE_GET_BY_ID = "/warehouse/get-by-id";
export const WAREHOUSE_SEARCH = "/warehouse/search";
// services
export const SERVICE_CREATE = "/services-product/create";
export const SERVICE_SEARCH = "/services-product/search";
export const SERVICE_DELETE = "/services-product/delete";
export const SERVICE_UPDATE = "/services-product/update";
export const SERVICE_GET_BY_ID = "/services-product/get-by-id";
// services voucher 
export const SERVICES_VOUCHER_CREATE = "/service-voucher/create";
export const SERVICES_VOUCHER_SEARCH = "/service-voucher/search";
export const SERVICES_VOUCHER_SEARCH_V2 = "/service-voucher/search-v2";
export const SERVICES_VOUCHER_GET_INVOICE = "/service-voucher/get-invoice";
export const SERVICES_VOUCHER_GET_PAYMENTVOUCHER = "service-voucher/get-payment-voucher-goods";
export const SERVICES_VOUCHER_GET_INWARDSLIP = "service-voucher/get-inward-slip";
export const SERVICES_VOUCHER_UPDATE = "/service-voucher/update";
export const SERVICES_VOUCHER_UPDATE_STATUS_PAY = "/service-voucher/update-status";
export const SERVICES_VOUCHER_DELETE = "/service-voucher/delete";
export const SERVICES_VOUCHER_UNASSIGNED = "/service-voucher/get-service-voucher-unassigned";
// chi phi phat sinh 
export const COST_INCURRED_SEARCH = "/cost-incurred/search";
export const COST_INCURRED_CREATE = "/cost-incurred/create";
export const COST_INCURRED_DELETE = "/cost-incurred/delete";
export const COST_INCURRED_UPDATE = "/cost-incurred/update";
//discountEmployeeType
export const DISCOUNT_EMPLOYEE_TYPE_CREATE = "discount-employee-type/create";
export const DISCOUNT_EMPLOYEE_TYPE_DELETE = "discount-employee-type/delete";
export const DISCOUNT_EMPLOYEE_TYPE_GET_ALL = "discount-employee-type/get-all";
export const DISCOUNT_EMPLOYEE_TYPE_GET_BY_ID = "discount-employee-type/get-by-id";
export const DISCOUNT_EMPLOYEE_TYPE_UPDATE = "discount-employee-type/update";
//discountEmployee
export const DISCOUNT_EMPLOYEE_CREATE = "discount-employee/create";
export const DISCOUNT_EMPLOYEE_DELETE = "discount-employee/delete";
export const DISCOUNT_EMPLOYEE_SEARCH = "discount-employee/search";
export const DISCOUNT_EMPLOYEE_GET_BY_ID = "discount-employee/get-by-id";
export const DISCOUNT_EMPLOYEE_UPDATE = "discount-employee/update";
export const DISCOUNT_EMPLOYEE_GET_LIST_BY_USER_ID = "discount-employee/get-list-by-user-id";
export const DISCOUNT_EMPLOYEE_UPDATE_ACTIVE = "discount-employee/update-active";
// bảng lương
export const SALARIES_CREATE = "salaries/create";
export const SALARIES_DELETE = "salaries/delete";
export const SALARIES_GET_ALL = "salaries/get-all";
export const SALARIES_GET_BY_ID = "salaries/get-by-id";
export const SALARIES_GET_BY_USER = "salaries/get-by-user-id";
export const SALARIES_UPDATE = "salaries/update";
//file upload
export const FILE_UPLOAD = "file/uploadFile";
//excel file
export const EXCEL_GET_DATA = "get-data-excel-file/get-data";

//BEGIN

//image upload
export const IMAGE_UPLOAD = "/images/upload-image";

//room type
export const ROOM_TYPE_CREATE = "/room-type/create";
export const ROOM_TYPE_SEARCH = "/room-type/search";
export const ROOM_TYPE_UPDATE = "/room-type/update";
export const ROOM_TYPE_DELETE = "/room-type/delete";

//room
export const ROOM_CREATE = "/room/create";
export const ROOM_SEARCH = "/room/search";
export const ROOM_UPDATE = "/room/update";
export const ROOM_DELETE = "/room/delete";