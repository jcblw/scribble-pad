import React from "react";
import { Terminal } from "./terminal";
import { render } from "ink";

export const start = (path: string, debug?: boolean) => {
  render(<Terminal filepath={path} debug={debug} />);
};
