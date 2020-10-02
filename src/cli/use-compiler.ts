import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import path from "path";
import { useEffect, useState, useRef } from "react";
import {
  cleanMsg,
  isCompileComplete,
  isFail,
  ownPluginMessages
} from "./utils";

const electronWebpackPath = path.resolve(__dirname, "../scripts/start.js");

interface UseCompilerOptions {
  filepath: string;
}

export enum CompilerStatus {
  Compiling = "compiling",
  Starting = "starting",
  Error = "error",
  Complete = "complete"
}

export const useCompiler = ({ filepath }: UseCompilerOptions) => {
  const rawLogs = useRef<string[]>([]);
  const [logs, setLogs] = useState<string[]>(["Starting"]);
  const [build, setBuild] = useState<ChildProcessWithoutNullStreams | null>(
    null
  );
  const [status, setStatus] = useState(CompilerStatus.Starting);
  const fileName = filepath.split("/").pop();

  useEffect(() => {
    let child = spawn(electronWebpackPath, ["dev"], {
      env: {
        ...process.env,
        SCRIBBLE_PAD: filepath
      },
      cwd: path.resolve(__dirname, "../")
    });
    setBuild(child);
    return () => {
      child.kill("SIGTERM");
    };
  }, [filepath]);

  useEffect(() => {
    const handleStdout = (data: Buffer) => {
      const msg = cleanMsg(data);
      if (isCompileComplete(msg)) {
        setStatus(CompilerStatus.Complete);
      }
      if (isFail(msg)) {
        setStatus(CompilerStatus.Error);
      }
      setLogs([...logs.slice(0, 10), ...(ownPluginMessages(msg) ?? [])]);
      if (typeof rawLogs.current === "undefined") {
        rawLogs.current = [];
      }
      rawLogs.current = [...rawLogs.current, msg];
    };

    const handleStderr = (data: Buffer) => {
      // setStatus(CompilerStatus.Error);
      const msg = cleanMsg(data);
      setLogs([...logs.slice(0, 10), msg]);
    };

    if (build) {
      build.stdout.on("data", handleStdout);
      build.stderr.on("data", handleStderr);
    }
    return () => {
      if (build) {
        build.stdout.off("data", handleStdout);
        build.stderr.off("data", handleStdout);
      }
    };
  }, [build, logs]);

  return {
    fileName,
    status,
    build,
    logs,
    rawLogs
  };
};
