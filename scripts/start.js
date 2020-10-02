const webpack = require("webpack");
const spawn = require("child_process");
const createConfig = require("./config/webpack.config");

// Compile Code that does not need updating
// Render

const compile = async () => {
  const mainConfig = createConfig({ target: "electron-main" });
  const rendererConfig = createConfig({ target: "electron-renderer" });

  console.log({ mainConfig, rendererConfig });
};

compile();
