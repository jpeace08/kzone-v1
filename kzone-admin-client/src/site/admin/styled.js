import styled from "styled-components";

const Main = styled("div")`
  & .panel-tag {
    display: flex;
    margin-bottom: 10px;
    justify-content: flex-end;
    border-left: none;
    background: unset;
    padding: 2px;
    margin-bottom: 0 !important;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
    padding-right: 10px;
    & .right-area {
      align-self: flex-end;
      display: flex;
      & button {
        margin-right: 10px;
      }

      .ant-btn {
        display: flex;
        align-items: center;
        & i {
          color: #fff;
          font-size: unset;
          padding-right: 10px;
        }
      }
    }
  }
  & .page-container {
    display: flex;
    & .page-filter {
      width: 250px;
      max-height: calc(100% - 10px);
      overflow-y: auto;
      overflow-x: hidden;
    }
    & .page-main {
      flex: 1;
      margin-left: 10px;
      overflow: auto;

      & .ant-tabs-bar {
        margin: 0 0 0px 0;
      }
      & .ant-tabs-top-content {
        border: 1px solid #e8e8e8;
        border-top: none;
      }
      & .list-action {
        display: flex;
        & button {
          margin: 2px;
        }
      }
    }
  }
  &.pagination-table{    
    display: flex;
    justify-items: center;
    flex: 1;
    margin-top: 5px !important;
    justify-content: flex-end;
    align-items: center;
   &.label{
    color: #9FA2B4;
    margin: 0px !important;
    padding: 0;
    margin-right: 30px !important;
    font-size: 14px;
   }
   &.btn-next{
       width: 10px;
       margin-left:20px;
       cursor: pointer;
   }
   &.btn-pre{
       width: 10px;
       margin-right: 20px;
       cursor: pointer;
   }
   &.current-page{
        font-weight: bold;
        font-size: 14px;
        margin: 0px 4px!important;
        padding: 3px 10px;
        border: 1px solid #0090da;
        border-radius: 4px;
        cursor: pointer;
   }
   &.active {
    background: #0090da;
    color: #fff;
   } 
  }
  
`;

export { Main };
