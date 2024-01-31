import path from "path";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import {
  determineVersion,
  versionWithPrefix,
} from "./version";
import { download } from "./download";
import { getOsInfo } from "./platform";

export default async function main() {
  try {
    const versionInput = core.getInput("version");

    const version = await determineVersion(
      versionInput
    );

    const osInfo = getOsInfo();

    await core.group(
      `Setting up class-hash ${versionWithPrefix(version)}`,
      async () => {
        let prefix = tc.find("class-hash", version, osInfo);
        if (!prefix) {
          const download = await download(version);
          prefix = await tc.cacheDir(
            download,
            "class-hash",
            version,
            osInfo,
          );
        }

        core.addPath(path.join(prefix, "bin"));
      },
    );
  } catch (e) {
    core.setFailed(e);
  }
}