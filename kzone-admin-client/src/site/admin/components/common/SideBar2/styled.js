import styled from "styled-components";
import { Layout } from "antd";
const { Sider } = Layout;

export const Main = styled("div")`
  width: 250px;
  ${(props) => (props.collapsed ? `width: 0px;` : `width: 250px;`)}
  transition: width 0.5s ease-in;
  max-height: calc(100vh - 240px);
  display: flex;
  flex-direction: column;
  & .filter-bar {
    max-height: 100%;

    flex: 1;
    background-color: #fff;
    ${(props) =>
      props.collapsed
        ? `
        opacity: 0;
        transition: opacity 0.1s ease;        
        `
        : `opacity: 1;
        transition: opacity 1s ease;
    `}
  }
  & .btn-collapse {
    align-self: baseline;
    margin-bottom: 16px;
    position: fixed;
    top: 53px;
    z-index: 1051;
    left: 11px;
  }
`;
