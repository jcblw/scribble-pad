import { useEffect } from "react";
import { useApp } from "ink";
import { cleanUp } from "./utils";

export const useShutdown = () => {
  const { exit } = useApp();
  useEffect(() => {
    const handler = cleanUp({ exit });
    process.on("SIGINT", handler);
    process.on("SIGTERM", handler);
    return () => {
      process.off("SIGINT", handler);
      process.off("SIGTERM", handler);
    };
  }, [exit]);
};
