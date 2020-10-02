import { Socket } from "net";

type SocketWrite = Socket["write"];

export const webpackPattern = /｢wds｣|｢wds｣|｢wdm｣/g;

const ogOut = process.stdout.write.bind(process.stdout);
const ogErr = process.stderr.write.bind(process.stderr);

const captureWebpackOutput = (fn: SocketWrite): SocketWrite => (buffer, cb) => {
  if (`${buffer}`.match(webpackPattern)) {
    return fn(buffer, cb);
  }
  return ogOut(buffer, cb);
};

// @ts-ignore
process.stdout.write = captureWebpackOutput(() => {});
// @ts-ignore
process.stderr.write = captureWebpackOutput(() => {});

export const stub = (writeMock: SocketWrite) => {
  // @ts-ignore
  process.stdout.write = captureWebpackOutput(writeMock);
  // @ts-ignore
  process.stderr.write = captureWebpackOutput(writeMock);
};

export const restore = () => {
  process.stdout.write = ogOut;
  process.stderr.write = ogErr;
};
