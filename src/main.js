import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import {
  determineVersion,
  versionWithPrefix,
} from "./versions";
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
        let pathToCli = tc.find("class-hash", version, osInfo);
        if (!pathToCli) {
          const downloadPath = await download(version);
          pathToCli = await tc.cacheDir(
            downloadPath,
            "class-hash",
            version,
            osInfo,
          );
        }

        core.addPath(pathToCli);
      },
    );
  } catch (e) {
    core.setFailed(e);
  }
}