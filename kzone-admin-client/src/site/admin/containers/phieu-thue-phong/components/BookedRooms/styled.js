import styled from "styled-components";

const Main = styled("div")`
  & > ul {
    padding: 10px;
    & li {
      color: red;
    }
  }
  .ant-input-number{
    width: 100% !important;
  }

  & .list-action {
    align-items: center;
    flex-direction: row;
    justify-content: space-around;
    display: flex;

    & button {
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
  }
`;

export { Main };
