#!/usr/bin/env node
import path from "path";
import { start } from ".";

process.env.NODE_ENV = "development";
const debug = process.argv.includes("--debug");

(async () => {
  const filepath = path.resolve(process.cwd(), process.argv[2]);
  start(filepath, debug);
})();
