export const cleanUp = ({ exit }) => async () => {
  exit();
};

export const cleanMsg = (msg: Buffer) => {
  return `${msg || ""}`
    .replace(
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
      ""
    )
    .replace("\n", "")
    .trim();
};

export const ownPluginMessages = (msg: string) => {
  return (msg.match(/~~(.*?)~~/g) || []).map(msg => msg.replace(/~~/g, ""));
};

export const isFail = (msg: string) => {
  return /fail/gi.test(msg);
};

export const isRenderer = (msg: string) => {
  return /Renderer/g.test(msg);
};

export const isCompileComplete = (msg: string) => {
  return isRenderer(msg) && /Compiled successfully/.test(msg);
};
