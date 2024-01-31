import path from "path";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import {
  determineVersion,
  getFullVersion,
  versionWithPrefix,
} from "./versions";
import { downloadScarb } from "./download";
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
          const download = await downloadScarb(version);
          prefix = await tc.cacheDir(
            download,
            "class-hash",
            version,
            osInfo,
          );
        }

        core.setOutput("class-hash-prefix", prefix);
        core.addPath(path.join(prefix, "bin"));
      },
    );

    core.setOutput("class-hash-version", await getFullVersion());
  } catch (e) {
    core.setFailed(e);
  }
}