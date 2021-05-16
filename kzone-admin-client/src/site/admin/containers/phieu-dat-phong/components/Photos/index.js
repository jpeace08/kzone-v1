import React, { useEffect, useState, useRef, useMemo } from "react";
import { connect } from "react-redux";
import { Main } from "./styled";
import { Form } from "antd";
import ImagesGalerry from "site/admin/components/ImagesGallery";

function Photos({
  currentItem,
  ...props
}) {
  const refViewImage = useRef(null);
  const [state, _setState] = useState({});

  const setState = (_state) => {
    _setState((state) => ({
      ...state,
      ...(_state || {}),
    }));
  };

  const onChange = (type) => (e) => {
    setState({
      [type]: e?.hasOwnProperty("target")
        ? e.target.value
        : e,
    });
  };

  useEffect(() => {
    const item = currentItem;
    const url = new URL(window.location.href);
    const mode = url.searchParams.get("mode");
    //TODO: update state with current item
    setState({

    })
  }, [currentItem]);

  return (
    <Main>
      <ImagesGalerry images={currentItem.images} />
    </Main>
  );
}
export default Form.create({})(
  connect(
    (state) => ({
      currentItem: state.roomType.currentItem || {},
    }),
    ({

    }) => {
      return {

      };
    }
  )(Photos)
);
