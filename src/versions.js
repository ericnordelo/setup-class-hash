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
