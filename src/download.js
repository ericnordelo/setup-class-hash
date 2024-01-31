import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import { getOsInfo } from "./platform";
import { versionWithPrefix } from "./version";

export async function download(version) {
  const osInfo = getOsInfo();
  const tag = versionWithPrefix(version);
  const basename = `class-hash-${tag}-${osInfo}`;
  const extension = "tar.gz";
  const repo = "ericnordelo/starknet-class-hash";
  const url = `https://github.com/${repo}/releases/download/${tag}/${basename}.${extension}`;

  core.info(`Downloading class-hash from ${url}`);
  const pathToTarball = await tc.downloadTool(url);
  const extractedPath = await tc.extractTar(pathToTarball);

  core.debug(`Extracted to ${extractedPath}`);
  return extractedPath;
}
