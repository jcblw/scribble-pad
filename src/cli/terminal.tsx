import { spawn } from "child_process";
import path from "path";
import React, { useEffect, useState, useRef } from "react";
import { Text, useApp, Box } from "ink";
import Spinner from "ink-spinner";

const electronWebpackPath = path.resolve(
  __dirname,
  "../node_modules/electron-webpack/out/cli.js"
);

interface TerminalProps {
  filepath: string;
}

const cleanUp = ({ build, exit }) => async () => {
  build.kill("SIGINT");
  exit();
};

const cleanMsg = (msg: string) => {
  return `${msg}`
    .replace(
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
      ""
    )
    .replace("\n", "");
};

const isFail = (msg: string) => {
  return /fail/gi.test(msg);
};

const isRenderer = (msg: string) => {
  return /Renderer/g.test(msg);
};

const isCompileComplete = (msg: string) => {
  return isRenderer(msg) && /Compiled successfully/.test(msg);
};

export const Terminal: React.FC<TerminalProps> = ({ filepath }) => {
  const logs = useRef<string[]>();
  const { exit } = useApp();
  const [hasCompletedCompile, setHasCompletedCompile] = useState(false);
  const [hasFail, setHasFail] = useState(false);
  const [latestLog, setLatestLog] = useState<string>("Compiling...");

  const filename = filepath.split("/").pop();

  useEffect(() => {
    const build = spawn(electronWebpackPath, ["dev"], {
      env: {
        ...process.env,
        SCRIBBLE_PAD: filepath
      },
      cwd: path.resolve(__dirname, "../")
    });

    build.stdout.on("data", data => {
      const msg = cleanMsg(data);
      if (isCompileComplete(msg)) {
        setLatestLog("Compile complete");
        setHasCompletedCompile(true);
      } else {
        setLatestLog(msg);
      }
      if (typeof logs.current === "undefined") {
        logs.current = [];
      }
      logs.current = [...logs.current.slice(0, 5), msg];
      if (isFail(msg)) {
        setHasFail(true);
      }
    });

    build.stderr.on("data", () => {
      setHasFail(true);
    });

    process.on("SIGINT", cleanUp({ build, exit }));
    process.on("SIGTERM", cleanUp({ build, exit }));
    // eslint-disable-next-line
  }, []);

  return (
    <Box flexDirection="column">
      <Box flexDirection="row">
        <Box paddingRight={1}>
          <Text color="gray">Building Scribble Pad for</Text>
        </Box>
        <Text color="yellow" underline>
          {filename}
        </Text>
      </Box>
      <Box flexDirection="row">
        {!hasCompletedCompile ? (
          <Box paddingRight={2}>
            <Text color="gray">
              <Spinner />
            </Text>
          </Box>
        ) : null}
        <Text color="gray">{latestLog}</Text>
      </Box>
      {hasFail ? (
        <Box flexDirection="column">
          <Text color="red">Errors:</Text>
          {(logs.current ?? []).map(log => {
            return (
              <Text color="redBright" key={log}>
                {log}
              </Text>
            );
          })}
        </Box>
      ) : null}
    </Box>
  );
};
