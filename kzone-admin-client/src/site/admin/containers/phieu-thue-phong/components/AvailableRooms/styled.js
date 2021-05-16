import styled from "styled-components";

const Main = styled("div")`
  & .choosen {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;

    & .ant-select {
      
      margin-right: 5px;
      &:first-of-type {
        width: 50%;
      }
      &:nth-of-type(2) {
        width: 25%;
      }
      &:last-of-type {
        margin-right: 0;
        width: 20%;
      }
    }
  }

  & .list-room {
    padding: 5px;
    border-radius: 3px;
    border: 1px solid #cacaca;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

export { Main };
