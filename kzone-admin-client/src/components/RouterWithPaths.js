import React from "react";
import { Switch, Route } from "react-router-dom";
const RouterWithPaths = ({ path = "", roles = [], ...rest }) => {
  return (
    <Switch key={rest.key}>
      {typeof path === "string" ? (
        <Route path={path} {...rest} />
      ) : (
        path.map((item, index) => <Route path={item} {...rest} key={index} />)
      )}
    </Switch>
  );
};

export default RouterWithPaths;
