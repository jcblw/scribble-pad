import { spawn } from "child_process";
import path from "path";
import React, { useEffect, useState, useRef } from "react";
import { Text, useApp, Box } from "ink";
import Spinner from "ink-spinner";
import { useCompiler, CompilerStatus } from "./use-compiler";
import { useShutdown } from "./use-shutdown";

interface TerminalProps {
  filepath: string;
}

export const Terminal: React.FC<TerminalProps> = ({ filepath }) => {
  const { logs, rawLogs, status, fileName, build } = useCompiler({
    filepath
  });
  // handle shutdown gracefully
  useShutdown({ build });

  const isCompilerComplete = status === CompilerStatus.Complete;
  const isCompilerError = status === CompilerStatus.Error;

  return (
    <Box flexDirection="column">
      <Box flexDirection="row">
        <Box paddingRight={1}>
          <Text color="gray">Building Scribble Pad for</Text>
        </Box>
        <Text color="yellow" underline>
          {fileName}
        </Text>
      </Box>
      <Box flexDirection="row">
        {!isCompilerComplete ? (
          <Box paddingRight={2}>
            <Text color="gray">
              <Spinner />
            </Text>
          </Box>
        ) : null}
        <Text color="gray">{logs[logs.length - 1] ?? ""}</Text>
      </Box>
      {true ? (
        <Box flexDirection="column">
          <Text color="red">Errors:</Text>
          {(rawLogs.current ?? []).map(log => {
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
