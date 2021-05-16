import React, { useEffect } from "react";
import { connect } from "react-redux";
import { AdminPage } from "site/admin/components/admin";
import { Main } from "./styled";
function CheckIn(props) {
  useEffect(() => {}, []);
  return (
    <Main>
      <AdminPage></AdminPage>
    </Main>
  );
}
export default connect(
  (state) => {
    return {};
  },
  ({}) => {
    return {};
  }
)(CheckIn);
