#!/usr/bin/env node
import path from "path";
import { start } from ".";

process.env.NODE_ENV = "development";

(async () => {
  const filepath = path.resolve(process.cwd(), process.argv[2]);

  start(filepath);
})();
