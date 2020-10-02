const chokidar = require("chokidar");
const { spawn } = require("child_process");
const path = require("path");

const PLUGIN_NAME = "ScribblePad";
const delimiter = "~~";

module.exports = class ScribblePadPlugin {
  constructor({ env, scribblePad, directory }) {
    this.env = env || "unknown";
    this.scribblePad = scribblePad;
    this.directory = directory;
  }
  // copy of
  // https://github.com/webpack/webpack-dev-server/blob/4ab1f21bc85cc1695255c739160ad00dc14375f1/lib/Server.js#L992
  watch(server) {
    const usePolling = server.watchOptions.poll ? true : undefined;
    const interval =
      typeof server.watchOptions.poll === "number"
        ? server.watchOptions.poll
        : undefined;

    // this.watcher = chokidar.watch(this.scribblePad, {
    //   ignoreInitial: true,
    //   persistent: true,
    //   followSymlinks: false,
    //   atomic: false,
    //   alwaysStat: true,
    //   ignorePermissionErrors: true,
    //   ignored: server.watchOptions.ignored,
    //   usePolling,
    //   interval
    // });

    if (server.options.liveReload !== false) {
      // this.log(`Setting up Scribble Pad ${this.scribblePad}`);
      // this.log(`Watcher on socket ${server.sockPath}`);
      // this.watcher.on("change", changed => {
      // const projectFile = path.resolve(__dirname, "../src/renderer/index.ts");
      // this.log(`File ${changed} changed`);
      // this.log(`touching file ${projectFile}`);
      // const touch = spawn("touch", [projectFile]);
      // touch.on("exit", () => {
      //   server.sockWrite(server.sockets, "content-changed");
      // });
      // });
    }
    // server.contentBaseWatchers.push(this.watcher);
  }
  log(msg) {
    console.log(`${delimiter}${this.env} ${msg} ${delimiter}`);
  }
  getChangedFiles(compiler) {
    const { watchFileSystem } = compiler;
    const watcher = watchFileSystem.watcher || watchFileSystem.wfs.watcher;

    return Object.keys(watcher.mtimes);
  }
  apply(compiler) {
    this.compiler = compiler;

    compiler.hooks.watchRun.tap(PLUGIN_NAME, compilation => {
      this.log(JSON.stringify(this.getChangedFiles(compilation)));
      this.log("watchRun");
    });
    compiler.hooks.watchClose.tap(PLUGIN_NAME, (context, entry) => {
      this.log("watch close");
    });
    compiler.hooks.run.tap(PLUGIN_NAME, (params, entry) => {
      this.log("run");
    });
    compiler.hooks.afterCompile.tap(PLUGIN_NAME, (compilation, entry) => {
      this.log(`after compile`);
      const { fileDependencies } = compilation;
      const files = Array.from(fileDependencies);
      if (!files.includes(this.scribblePad)) {
        this.log(`File ${this.scribblePad} added to compilation watch`);
        compilation.fileDependencies.add(this.scribblePad);
      }
    });
    compiler.hooks.done.tap(PLUGIN_NAME, (context, entry) => {
      this.log("done");
    });
    compiler.hooks.failed.tap(PLUGIN_NAME, (context, entry) => {
      this.log("failed");
    });
    compiler.hooks.invalid.tap(PLUGIN_NAME, (context, entry) => {
      this.log("invalid");
    });
  }
};
