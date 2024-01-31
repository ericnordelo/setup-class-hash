import path from "path";
import fs from "fs/promises";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import { getOsInfo } from "./platform";
import { versionWithPrefix } from "./versions";

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

  const pathToCli = await findDir(extractedPath);

  core.debug(`Extracted to ${pathToCli}`);
  return pathToCli;
}

async function findDir(extractedPath) {
  for (const dirent of await fs.readdir(extractedPath, {
    withFileTypes: true,
  })) {
    if (dirent.isDirectory() && dirent.name.startsWith("class-hash-")) {
      return path.join(extractedPath, dirent.name);
    }
  }

  throw new Error(`could not find class-hash directory in ${extractedPath}`);
}
