import styled from "styled-components";
import { Modal } from "antd";

export const Main = styled(Modal)`
  width: 800px !important;
  & .ant-form-item{
    margin-bottom: 1em !important;
    display: flex;
    & .ant-form-item-label{
      flex-grow:0;
      min-width:120px;
      text-align: left;
    }
    & .ant-form-item-control-wrapper{
      flex-grow:4;
    }
  }

  & .ant-modal-body {
    padding: 20px;
  & .ant-select {
        width: 100%;
      }
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
  & fieldset {
    border: 1px solid #cacaca !important;
    padding: 10px;
    margin-bottom: 20px;
    & legend {
      width: auto !important;
      padding: 0 10px;
      font-weight: bold;
      border: none;
      margin-bottom: 0;
      font-size: 13px !important;
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
