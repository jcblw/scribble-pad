import React from "react";
import { Terminal } from "./terminal";
import { render } from "ink";

export const start = (path: string) => {
  render(<Terminal filepath={path} />);
};
