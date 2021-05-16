import styled from "styled-components/macro";
import { Table } from "site/admin/components/common";

const Main = styled("div")`
  & * {
    font-size: .7rem !important;
  }
  .filter-box {
    display:flex;
    flex-direction:column;
    justify-content: space-between;

    & .ant-radio-group {
      margin-bottom: 15px;
    }

    & * {
      color: #fff !important;
    }

    & .ant-input-search * {
      color: #2b2b2b !important;
    }
  }
  
  .ant-table {
    .ant-select {
      width: 100%;
    }
    & .list-action {
      align-items: center;
      flex-direction: row;
      justify-content: space-around;
      display: flex;
    }
     & .ant-table-tbody td {
     align-items: center;
     padding: 2px 10px !important;
     font-size: .7rem !important;

     & * {
       font-size: .7rem !important;
     }

     & p {
       margin-bottom: 0 !important;
     }
   }
  }
  
  .ant-input-number {
    width: 100% !important;
  }
`;

export { Main };
