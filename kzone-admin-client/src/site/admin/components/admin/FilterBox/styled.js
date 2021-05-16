import styled from "styled-components";

const Main = styled("article")`
  margin-bottom: 15px;
  background-color: #fff;
  position: relative;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  -webkit-box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) 3px 5px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) 3px 5px rgba(0, 0, 0, 0.5);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) 3px 5px rgba(0, 0, 0, 0.5);
  box-shadow: 0 5px 15px rgb(0 0 0 / 10%);
  & .card-header {
    font-weight: bold;
    display: flex;
    align-items: center;
    padding: 10px;
    font-size: 16px;
    & .box-title {
      flex: 1;
      margin-right: 5px;
    }
    & .right-area {
      display: flex;

      & .btn-add {
        cursor: pointer;
        display: flex;
        margin-left: 5px;
      }
      & .btn-expand {
        margin-left: 5px;
        cursor: pointer;
        display: flex;
        transition: transform 0.5s;
      }
      & .anticon {
      }
    }
  }
  & .card-body {
    overflow: hidden;
    & .card-childen {
      padding: 10px !important;
      & .ant-select {
        width: 100%;
      }
    }
  }

  &.expand {
    & .btn-expand {
      transform: rotate(180deg);
      transition: transform 0.5s;
    }
  }
`;

export { Main };
