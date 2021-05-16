import styled from "styled-components";
import { Modal, Button } from "antd";

const Main = styled(Modal)`
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
  & .action-area {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 10px;
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
  .ant-descriptions-row{
    & .ant-descriptions-item-label{
      font-weight: 900;
      min-width: 50px; 
      width: 58%;
      text-align:center;
    }
    & .ant-descriptions-item-content{
      /* min-width: 80px; */
      text-align: center;
      color: red;
      font-weight: 1000; 
    }

  }
`;
const CustomButton = styled(Button)`
  min-width: 200;
  color: #fff;
  font-weight: 500;
  margin-right: 10px;
  display: flex;
  align-items: center;

  background-color: ${({ bgcolor }) => bgcolor ? bgcolor : "#fff"};
  &:hover, &:active, &:focus{
    background-color: ${({ bgcolor }) => bgcolor ? bgcolor : "#fff"};
    color: #fff;
  }
  
  &:first-of-type {
    margin-left: 0;
  }
  &:last-of-type {
    margin-right:0;
  }
`;

export { Main, CustomButton }

