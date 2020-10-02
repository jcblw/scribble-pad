import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./app.css";
import { getCanvas } from "./scribble";
import debounce from "debounce";

import { config, onDraw, onSetup, onResize } from "./subject";

const Canvas = getCanvas();

function App() {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handle = debounce(() => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
      onResize({
        width: window.innerWidth,
        height: window.innerHeight,
        pixelRatio: window.devicePixelRatio
      });
    }, 200);
    window.addEventListener("resize", handle);
    onResize({
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: window.devicePixelRatio
    });
    return () => window.removeEventListener("resize", handle);
  }, [height, width]);
  return (
    <Canvas
      loop={config.loop}
      width={width}
      height={height}
      onSetup={onSetup}
      onDraw={onDraw}
    />
  );
}

export const renderApp = () => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("app")
  );
};
