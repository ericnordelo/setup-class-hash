export async function determineVersion(
  version,
) {
  version = version?.trim();

  if (version.startsWith("v")) {
    version = version.substring(1);
  }

  return version;
}

export function versionWithPrefix(version) {
  return /^\d/.test(version) ? `v${version}` : version;
}

export async function getFullVersion() {
  const { stdout } = await exec.getExecOutput(`class_hash -V`);
  const match = stdout.match(/^class_hash ([^ ]+)/);
  if (!match) {
    throw new Error(
      `unable to determine class_hash version from 'class_hash -V' output: ${stdout}`,
    );
  }
  return match[1];
}
