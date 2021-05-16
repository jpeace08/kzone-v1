import styled from "styled-components";
import { Modal } from "antd";

export const Main = styled(Modal)`
  .ant-modal{
    width: 800px !important;
    padding-bottom: 110px !important;
  } 
  & .ant-modal-body { 
    padding: 20px;
    & .ant-form {
      & .ant-form-item {
        margin-bottom: 10px !important;
        & .ant-form-item-label {
          line-height: 25px;
          & .ant-form-item-required {
            // &:before {
            //   display: none;
            // }
          }
        }
      }
    }
  }
  .modal-des {
    color: #333;
    & p {
      margin-bottom: 0;
    }
    & .content-des {
      font-weight: 500;
    }
    & .title-des {
      font-weight: bold;
      font-size: 18px;
      line-height: 23px;
      color: #165974;
      padding-bottom: 5px;
      border-bottom: 0.5px solid #165974;
      text-transform: uppercase;
    }
  }
  & .action-footer {
    margin-top: 15px;
    justify-content: flex-end;
    display: flex;
    & button {
      margin-left: 5px;
      margin-right: 5px;
    }
  }
  & .ant-modal-footer { 
    border-top: 0;
    padding: 0px;
  }
  .ant-descriptions-row{
    & .ant-descriptions-item-label{
      font-weight: 900;
      max-width: 50px; 
      text-align:center;
    }
    & .ant-descriptions-item-content{
      min-width: 80px;
      color: red;
      font-weight: 1000; 
    }

  }
`;
