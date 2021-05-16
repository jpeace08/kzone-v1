import styled from "styled-components";

const Main = styled("div")`
  & * {
    font-size: .7rem !important;
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
    }
  }
  ul{
    color: red;
  }

  & .list-action {
    display: flex;
    justify-content: space-around;
  }
  .filter-box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    & .ant-radio-group {
      margin-bottom: 15px;
    }

    & * {
      color: #fff !important;
    }
  }
  .exchange-rate {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    & .ant-select {
      flex: 2;
      margin-right: 10px;
    }
    & .ant-input {
      flex: 3;
    }
  }
  .ant-descriptions-row{
    & .ant-descriptions-item-label{
      font-weight: 900;
      max-width: 80px;
    }
    & .ant-descriptions-item-content{
      min-width: 50px;
    }

  }

  .error-message {
    width: 300px;
    height: auto;
    color: #282828;
    border-radius: 3px;
    box-shadow: 0px 1px 1px 1px grey;
  }

  & .panel-tag {
    display: flex;
    flex-direction: row;

    & .ant-select {
      min-width: 170px;
      margin-right: 5px;
      & .ant-select-arrow {
        top: 40%;

        & i {
        padding: 0 !important;

        & svg {
          font-size: .8rem !important;
        }
      }
    }
  }
  }

  & .option-tab {
    display: flex;
    flex-direction: column;

    & .ant-form-item {
      align-items: center;
      display: flex;
      margin-bottom: 0.2em !important;
      & .ant-form-item-label {
        min-width: 200px !important;
        text-align: left;
        width: 15%;
      }

      & .ant-form-item-control-wrapper{
        width: 80%;
        flex-shrink: 3;
      }
    }
  }

  & .view-main {
    display: flex;
    /* margin-top: -28px !important; */
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;

    @media(max-width: 900px) {
      flex-direction: column;
    }

    & .view-main__info{
      margin-right: 20px;
      width: 70%;
      box-sizing: border-box;
      max-width: 70%;
      box-sizing: border-box;
      padding: 10px 5px;
      border-radius: 3px;
      /* border: 1px solid #e0e0e0; */

      @media(max-width: 900px) {
        width: 100% !important;
        max-width: 100% !important;
      }
    }

    & .view-main__currency {
      max-width: calc(100% - 67%);
      box-sizing: border-box;
      width: calc(100% - calc(100% - 70%));
      box-sizing: border-box;
      padding: 10px 5px;
      border-radius: 3px;
      /* border: 1px solid #e0e0e0; */

      & .option-tab {
        & .ant-form-item-label {
          min-width: 100px !important;
        }
      }

      @media(max-width: 900px) {
        width: 100% !important;
        max-width: 100% !important;
      }
    }
  }

  & .view-detail {
   margin: auto !important;
   
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

  .ant-col {
    padding: 0 !important;
  }
`;

export { Main };
