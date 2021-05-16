import { Button } from "antd";
import styled from "styled-components/macro";

const Main = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 10px;
  position: relative;
  justify-content: space-around;
  .b {
    max-width: 40%;
    @media(max-width: 900px) {
      max-width: 40%;
    }
    ul {
      padding: 0;
      li {
        text-decoration: none;
        list-style-type: none;
      }
    }
     & .product-name {
    color: #2c4b65;
    font-size: 20pt;
    font-weight: 700;
    margin: 10px 0;
  }

  & .action-area {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
  }

  & .product-info {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;

    & .product-avatar {
      width: auto;
      height: auto;
      margin-right: 10px;
      & img {
        object-fit: contain;
        width: 250px;
        height:250px;
      }
    }

    & .product-images {
      margin-right: 30px;
    }

    & .product-info__meta {
      margin-right: 30px;
      width: auto;
      & span:nth-of-type(1) {
        min-width: 150px;
      }
      &:nth-of-type(2) {
        & span.type {
          width: 150px;
        }
      }
    }
    & ._col2 {
        & span:nth-of-type(1) {
          min-width: 150px !important;
        }
      }
  }
  }
`;

const CustomButton = styled(Button)`
  width: 100px;
  color: #fff;
  font-weight: 500;
  margin: 0 20px;
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

export { Main, CustomButton };
