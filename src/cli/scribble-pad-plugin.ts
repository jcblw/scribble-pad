import { Compiler } from "webpack";
import chokidar from "chokidar";
import { spawn } from "child_process";
import path from "path";

const PLUGIN_NAME = "ScribblePad";
const delimiter = "~~";

export class ScribblePadPlugin {
  compiler: Compiler | null;
  env: string;
  scribblePad: string;
  directory: string;

  constructor({ env, scribblePad, directory }) {
    this.env = env || "unknown";
    this.scribblePad = scribblePad;
    this.directory = directory;
    this.compiler = null;
  }
  // copy of
  // https://github.com/webpack/webpack-dev-server/blob/4ab1f21bc85cc1695255c739160ad00dc14375f1/lib/Server.js#L992
  watch(server) {
    this.log("server started");
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
  log(msg: string) {
    // console.log(`${delimiter}${this.env} ${msg} ${delimiter}`);
  }
  getChangedFiles(compiler) {
    const { watchFileSystem } = compiler;
    const watcher = watchFileSystem.watcher || watchFileSystem.wfs.watcher;

    return Object.keys(watcher.mtimes);
  }
  apply(c) {
    this.compiler = c;
    const compiler = this.compiler;

    compiler.hooks.watchRun.tap(PLUGIN_NAME, compilation => {
      this.log(JSON.stringify(this.getChangedFiles(compilation)));
      // this.log("watchRun");
    });
    compiler.hooks.watchClose.tap(PLUGIN_NAME, () => {
      // this.log("watch close");
    });
    compiler.hooks.run.tap(PLUGIN_NAME, () => {
      // this.log("run");
    });
    compiler.hooks.afterCompile.tap(PLUGIN_NAME, compilation => {
      // this.log(`after compile`);
      const { fileDependencies } = compilation;
      const files = Array.from(fileDependencies);
      if (!files.includes(this.scribblePad)) {
        // this.log(`File ${this.scribblePad} added to compilation watch`);
        compilation.fileDependencies.add(this.scribblePad);
      }
    });
    compiler.hooks.done.tap(PLUGIN_NAME, () => {
      // this.log("done");
    });
    compiler.hooks.failed.tap(PLUGIN_NAME, () => {
      // this.log("failed");
    });
    compiler.hooks.invalid.tap(PLUGIN_NAME, () => {
      // this.log("invalid");
    });
  }
}
