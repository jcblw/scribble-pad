// import * as ScribblePadSubject from "scribble-pad-subject";
const ScribblePadSubject = require(process.env.SCRIBBLE_PAD);

interface Config {
  context?: string;
  loop?: boolean;
}

const noop = () => {};

export const config: Config = {
  context: "2d",
  loop: true,
  ...(ScribblePadSubject.config || {})
};

export const onSetup = ScribblePadSubject.onSetup || noop;
export const onDraw = ScribblePadSubject.onDraw || noop;
export const onResize = ScribblePadSubject.onResize || noop;
