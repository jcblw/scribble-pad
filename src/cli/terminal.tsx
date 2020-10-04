import { spawn } from "child_process";
import path from "path";
import React, { useEffect, useState, useRef } from "react";
import { Text, useApp, Box } from "ink";
import Spinner from "ink-spinner";
import { useCompiler, CompilerStatus, DevServerStatus } from "./use-compiler";
import { useShutdown } from "./use-shutdown";

interface TerminalProps {
  filepath: string;
  debug?: boolean;
}

export const Terminal: React.FC<TerminalProps> = ({ filepath, debug }) => {
  const {
    logs,
    rawLogs,
    status,
    fileName,
    devServerStatus,
    port,
    host
  } = useCompiler({
    filepath,
    debug
  });
  // handle shutdown gracefully
  useShutdown();

  const isCompilerComplete = status === CompilerStatus.Complete;
  const isCompilerError = status === CompilerStatus.Error;

  const isDevServerStarting = devServerStatus === DevServerStatus.Starting;

  return (
    <>
      <Box flexDirection="column">
        <Box flexDirection="row">
          <Box paddingRight={2}>
            <Text color="gray">{"Scribble Pad".padEnd(15)}:</Text>
          </Box>
          <Text color="yellow" underline>
            {fileName}
          </Text>
        </Box>
        <Box flexDirection="row">
          <Box paddingRight={2}>
            <Text color="gray">{"Dev Server".padEnd(15)}:</Text>
          </Box>
          {isDevServerStarting ? (
            <Box paddingRight={2}>
              <Text color="blue">
                <Spinner />
              </Text>
            </Box>
          ) : null}
          <Text color="blue">
            {host}:{port}
          </Text>
        </Box>
        <Box flexDirection="row">
          <Box paddingRight={2}>
            <Text color="gray">{"Compiler".padEnd(15)}:</Text>
          </Box>
          {!isCompilerComplete ? (
            <Box paddingRight={2}>
              <Text color="gray">
                <Spinner />
              </Text>
            </Box>
          ) : null}
          {debug ? (
            <Box flexDirection="column">
              {logs.map((log, i) => {
                return (
                  <Text color="gray" key={`${log}-${i}`}>
                    {log}
                  </Text>
                );
              })}
            </Box>
          ) : (
            <Text color="gray">{logs[logs.length - 1] ?? ""}</Text>
          )}
        </Box>
        {isCompilerError ? (
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
    </>
  );
};
