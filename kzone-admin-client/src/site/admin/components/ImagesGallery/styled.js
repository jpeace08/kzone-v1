import styled from "styled-components";

const Main = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  padding: 10px;
`;

const ImageItem = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 3px;
  background: #00000024;
  display: flex;
  box-shadow: 0px 0px 5px 0px #d2d2d2d4;
  margin: 2px;
  border: .3px solid #dbdbdb;
  & img {
    width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

export { Main, ImageItem };