import styled from "styled-components";
import { Modal } from "antd";

export const Main = styled(Modal)`
  width: 700px !important;
  & .ant-modal-body {
    padding: 20px;
    & .ant-form {
      & .ant-form-item {
        margin-bottom: 10px !important;
        & .ant-form-ite-label {
          line-height: 25px;
          & .ant-form-item-required {
            // &:before {
            //   display: none;
            // }
          }
        }
        & .ant-input-number{
          width: 100%;
        }
      }
    }
  }
  .title-box {
     justify-content: center; 
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
`;
