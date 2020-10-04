import webpack, { Compiler } from "webpack";
import { useEffect, useState, useRef, useMemo } from "react";
import {
  cleanMsg,
  isCompileComplete,
  isFail,
  ownPluginMessages
} from "./utils";
import createConfig from "./webpack.config";
import WebpackDevServer from "webpack-dev-server";
import { stub, webpackPattern, restore } from "./logs";
// call webpack directly

interface UseCompilerOptions {
  filepath: string;
  debug?: boolean;
  port?: number;
  host?: string;
}

export enum CompilerStatus {
  Compiling = "compiling",
  Starting = "starting",
  Error = "error",
  Complete = "complete"
}

export enum DevServerStatus {
  Waiting = "waiting",
  Starting = "starting",
  Started = "started",
  Error = "error"
}

export const useCompiler = ({
  filepath,
  debug,
  port = 9080,
  host = "0.0.0.0"
}: UseCompilerOptions) => {
  const rawLogs = useRef<string[]>([]);
  const [logs, setLogs] = useState<string[]>(["Starting"]);
  const [status, setStatus] = useState(CompilerStatus.Starting);
  const [devServerStatus, setDevServerStatus] = useState(
    DevServerStatus.Waiting
  );
  const fileName = filepath.split("/").pop();
  const config = useMemo(
    () => createConfig({ env: "development", scribblePad: filepath }),
    [filepath]
  );
  const compiler = useMemo(() => {
    if (config) {
      return webpack(config);
    }
    return null;
  }, [config]);
  const devServer = useMemo(() => {
    if (compiler && config) {
      setLogs([...logs, "Compiling"]);
      return new WebpackDevServer(compiler, config.devServer);
    }
    return null;
    // eslint-disable-next-line
  }, [compiler, config]);

  useEffect(() => {
    stub((buffer: Buffer) => {
      const msg = `${buffer}`;
      if (/Compiled successfully./.test(msg)) {
        setStatus(CompilerStatus.Complete);
        setLogs([...logs, "✅ Compile complete"]);
      }
      if (/Failed to compile./.test(msg)) {
        setStatus(CompilerStatus.Error);
        setLogs([...logs, "🚨 Failed to compile"]);
      }
      if (/Compiling.../.test(msg)) {
        setStatus(CompilerStatus.Error);
        setLogs([...logs, "Re-compiling"]);
      }
      rawLogs.current = [
        ...rawLogs.current.splice(0, 10),
        `${buffer}`.replace(webpackPattern, "🕸")
      ];
      if (debug) {
        setLogs(rawLogs.current);
      }
      return true;
    });
    return () => restore();
  }, [debug, logs]);

  useEffect(() => {
    if (devServer && devServerStatus === DevServerStatus.Waiting) {
      devServer.listen(port, host, err => {
        if (err) {
          setDevServerStatus(DevServerStatus.Error);
          return;
        }
        setDevServerStatus(DevServerStatus.Started);
      });
    }
    // eslint-disable-next-line
  }, [devServer]);

  return {
    port,
    fileName,
    status,
    devServerStatus,
    logs,
    rawLogs,
    host
  };
};
