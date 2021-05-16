import styled from "styled-components/macro";

const Main = styled("div")`
  & .panel-tag {

    & .right-area {

      & .ant-select {

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
  }

  & .ant-table {
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
`;

export { Main };
