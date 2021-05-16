import styled from "styled-components";

const Main = styled("div")`
  padding-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  box-sizing: border-box;
  & fieldset {
    border-radius: 5px;
    width: 50%;
    box-sizing: border-box;

    &:first-of-type {
      margin-right: 10px;
    }

    & .ant-form-item {
      align-items: center;
      display: flex;
      margin-bottom: 0.2em !important;

      @media(max-width: 1000px) {
        flex-direction: column;

        & * {
          width: 100% !important;
        }
      }

      & .ant-form-item-label {
        min-width: 150px;
        text-align: left;
        width: 20%;
      }

      & .ant-form-item-control-wrapper{
        width: 80%;

        & .ant-input-number {
          width: 100%;
        }
      }
    }
  }
`;

export { Main };
