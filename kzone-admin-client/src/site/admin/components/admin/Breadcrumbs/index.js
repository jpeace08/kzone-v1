import React from "react";
import { Link } from "react-router-dom";
// import { useRouter } from 'next/router'
import "./style.scss";
function index(props) {
  // const router = useRouter();
  const getBreadcrumbs = () => {
    let url = (window.location.pathname || "").toLowerCase();
    let obj = [];
    switch (url) {
      case "/admin":
      case "/":
      case "/admin/dashboard":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/admin/dashboard",
            name: "Dashboard",
          },
        ];
        break;
      case "/admin/quan-ly-hang-hoa":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "",
            name: "Home",
          },
          {
            url: "",
            name: "Quản lý hàng hoá",
          },
        ];
        break;
      case "/admin/kiem-kho":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "",
            name: "Home",
          },
          {
            url: "",
            name: "Kiểm kho",
          },
        ];
        break;
      case "/admin/hang-hoa-chi-tiet":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "",
            name: "Home",
          },
          {
            url: "",
            name: "Chi tiết hàng hóa",
          },
        ];
        break;
      case "/admin/dich-vu":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "",
            name: "Home",
          },
          {
            url: "",
            name: "Dịch vụ",
          },
        ];
        break;
      // case "/admin/quan-ly-khach-hang":
      //   obj = [
      //     {
      //       icon: "fal fa-home mr-1",
      //       url: "",
      //       name: "Home",
      //     },
      //     {
      //       url: "",
      //       name: "Khách hàng",
      //     },
      //   ];
      //   break;
      case "/admin/nha-cung-cap":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "",
            name: "Home",
          },
          {
            url: "",
            name: "Nhà cung cấp",
          },
        ];
        break;
      case "/admin/bang-luong":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "",
            name: "Home",
          },
          {
            url: "",
            name: "Bảng lương",
          },
        ];
        break;
      case "/admin/quan-ly-nhan-vien":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "",
            name: "Home",
          },
          {
            url: "",
            name: "Quản lý nhân viên",
          },
        ];
        break;
      case "/admin/quan-ly-phong-ban":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "",
            name: "Home",
          },
          {
            url: "",
            name: "Quản lý phòng ban",
          },
        ];
        break;
      case "/admin/phieu-thue-phong":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "",
            name: "Home",
          },
          {
            url: "",
            name: "Chứng từ mua hàng",
          },
        ];
        break;
      case "/admin/combo":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "",
            name: "Home",
          },
          {
            url: "",
            name: "Combo sản phẩm",
          },
        ];
        break;
      case "/admin/phieu-mua-dich-vu":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "",
            name: "Home",
          },
          {
            url: "",
            name: "Chứng từ mua dịch vụ",
          },
        ];
        break;
      case "/admin/hang-hoa-chi-tiet":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "",
            name: "Home",
          },
          {
            url: "",
            name: "Hàng hóa chi tiết",
          },
        ];
        break;
      case "/admin/chiet-khau-nhan-vien":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "",
            name: "Home",
          },
          {
            url: "",
            name: "Chiết khấu nhân viên",
          },
        ];
        break;
      // case "/admin/bang-luong":
      //   obj = [
      //     {
      //       icon: "fal fa-home mr-1",
      //       url: "",
      //       name: "Home",
      //     },
      //     {
      //       url: "",
      //       name: "Bảng lương",
      //     },
      //   ];
      //   break;
      default:
        if (url.indexOf("/admin/phieu-thue-phong/tao-phieu") === 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "",
              name: "Home",
            },
            {
              url: "/admin/phieu-thue-phong",
              name: "Chứng từ mua hàng",
            },
            {
              url: "",
              name: "Thêm mới",
            },
          ];
        } else if (url.indexOf("/admin/phieu-thue-phong/") === 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "",
              name: "Home",
            },
            {
              url: "/admin/phieu-thue-phong",
              name: "Chứng từ mua hàng",
            },
            {
              url: "",
              name: "Chi tiết",
            },
          ];
        }

        if (url.indexOf("/admin/phieu-thue-phong-excel-import/tao-phieu") === 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "",
              name: "Home",
            },
            {
              url: "/admin/phieu-thue-phong",
              name: "Chứng từ mua hàng",
            },
            {
              url: "",
              name: "Import Excel",
            },
          ];
        } else if (url.indexOf("/admin/phieu-thue-phong/") === 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "",
              name: "Home",
            },
            {
              url: "/admin/phieu-thue-phong",
              name: "Chứng từ mua hàng",
            },
            {
              url: "",
              name: "Chi tiết",
            },
          ];
        }

        if (url.indexOf("/admin/combo/tao-moi") === 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "",
              name: "Home",
            },
            {
              url: "/admin/combo",
              name: "Combo sản phẩm",
            },
            {
              url: "",
              name: "Thêm mới",
            },
          ];
        } else if (url.indexOf("/admin/combo/") === 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "",
              name: "Home",
            },
            {
              url: "/admin/combo",
              name: "Combo sản phẩm",
            },
            {
              url: "",
              name: "Chi tiết",
            },
          ];
        }

        if (url.indexOf("/admin/phieu-mua-dich-vu/tao-phieu") === 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "",
              name: "Home",
            },
            {
              url: "/admin/phieu-mua-dich-vu",
              name: "Chứng từ mua dịch vụ",
            },
            {
              url: "",
              name: "Thêm mới",
            },
          ];
        } else if (url.indexOf("/admin/phieu-mua-dich-vu") === 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "",
              name: "Home",
            },
            {
              url: "/admin/phieu-mua-dich-vu",
              name: "Chứng từ mua dịch vụ",
            },
            {
              url: "",
              name: "Chi tiết",
            },
          ];
        }

        else if (url.indexOf("/admin/hang-hoa-chi-tiet/") === 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "",
              name: "Home",
            },
            {
              url: "/admin/quan-ly-hang-hoa",
              name: "Danh sách hàng hóa",
            },
            {
              url: "",
              name: "Chi tiết",
            },
          ];
        }

        break;
    }
    return obj;
  };

  // console.log(window.location.pathname);
  const breadCrumb = getBreadcrumbs();
  return (
    <ol className="breadcrumb bg-info-400" style={{ display: "none" }}>
      {breadCrumb.map((item, index) => {
        if (index < breadCrumb.length - 1)
          return (
            <li className="breadcrumb-item" key={index}>
              <Link to={item.url || "#"} className="text-white">
                {item.icon && <i className="fal fa-home mr-1"></i>}
                {item.name}
              </Link>
            </li>
          );
        return (
          <li className="breadcrumb-item active text-white" key={index}>
            {item.name}
          </li>
        );
      })}
    </ol>
  );
}
export default index;
