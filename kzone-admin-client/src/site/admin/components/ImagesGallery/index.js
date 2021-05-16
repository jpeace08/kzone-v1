import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Main, ImageItem } from "./styled";
import { HOST } from "client/request";

function ImagesGalerry({ images, ...props }) {
  const [state, _setState] = useState({});

  const setState = (_state) => {
    _setState((state) => ({
      ...state,
      ...(_state || {}),
    }));
  };

  return (
    <Main>
      {images &&
        images.map((i, index) => (
          <ImageItem key={index}>
            <img src={`${HOST}images/${i.path}`} />
          </ImageItem>
        ))
      }
    </Main>
  );
}
export default connect(
  (state) => {
    return {

    };
  },
  ({

  }) => {
    return {

    };
  }
)(ImagesGalerry);
