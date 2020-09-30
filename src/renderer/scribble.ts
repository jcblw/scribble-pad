import { WebGL, WebGL2, Canvas2d } from "react-scribble";
import { config } from "./subject";

export const getCanvas = () => {
  if (config.context === "webgl") {
    return WebGL.Canvas;
  } else if (config.context === "webgl2") {
    return WebGL2.Canvas;
  }
  return Canvas2d.Canvas;
};

export const getDrawHook = () => {
  if (config.context === "webgl") {
    return WebGL.useDraw;
  } else if (config.context === "webgl2") {
    return WebGL2.useDraw;
  }
  return Canvas2d.useDraw;
};
