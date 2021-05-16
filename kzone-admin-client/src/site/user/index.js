import React from "react";
import Loadable from "react-loadable";
import { Switch } from "react-router-dom";
import RouterWithPaths from "components/RouterWithPaths";
function Loading() {
  return <div></div>;
}
export default function index(props) {
  const routers = [
    {
      path: ["/about"],
      component: Loadable({
        loader: () => import("@user/containers/About"),
        loading: Loading,
      }),
    },
  ];
  return (
    <div className="page-container">
      <Switch>
        {routers.map((route, key) => {
          if (route.component)
            return (
              <RouterWithPaths
                exact
                key={key}
                path={route.path}
                render={(props) => {
                  return <route.component {...props} />;
                }}
              />
            );
          return null;
        })}
      </Switch>
    </div>
  );
}
