import { ChildProcessWithoutNullStreams } from "child_process";
import { useEffect } from "react";
import { useApp } from "ink";
import { cleanUp } from "./utils";

interface UseCompilerOptions {
  build: ChildProcessWithoutNullStreams | null;
}

export const useShutdown = ({ build }: UseCompilerOptions) => {
  const { exit } = useApp();
  useEffect(() => {
    const handler = cleanUp({ build, exit });
    process.on("SIGINT", handler);
    process.on("SIGTERM", handler);
    return () => {
      process.off("SIGINT", handler);
      process.off("SIGTERM", handler);
    };
  }, [build, exit]);
};
