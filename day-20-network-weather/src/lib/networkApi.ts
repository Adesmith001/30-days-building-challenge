const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"]);

const configurationMessage =
  "Configure VITE_NETWORK_TEST_API_BASE_URL with a deployed measurement API. Local servers only measure this device or network.";

function isLocalNetworkHostname(hostname: string) {
  if (LOCAL_HOSTNAMES.has(hostname) || hostname.endsWith(".local")) return true;

  const octets = hostname.split(".").map(Number);
  if (octets.length !== 4 || octets.some((octet) => !Number.isInteger(octet))) {
    return false;
  }

  const [first, second] = octets;
  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168)
  );
}

export function resolveNetworkApiBase(
  configuredBase?: string,
  currentOrigin = window.location.origin,
) {
  const currentUrl = new URL(currentOrigin);
  const configured = configuredBase?.trim();

  if (!configured && isLocalNetworkHostname(currentUrl.hostname)) {
    throw new Error(configurationMessage);
  }

  const measurementUrl = new URL(configured || currentUrl.origin);
  if (isLocalNetworkHostname(measurementUrl.hostname)) {
    throw new Error(configurationMessage);
  }

  return measurementUrl.href.replace(/\/$/, "");
}

export function networkApiUrl(path: string) {
  const base = resolveNetworkApiBase(
    import.meta.env.VITE_NETWORK_TEST_API_BASE_URL,
  );
  return new URL(path.replace(/^\//, ""), `${base}/`).toString();
}

export function networkTestErrorMessage(error: unknown) {
  return error instanceof Error && error.message
    ? error.message
    : "The network scan could not complete. Try again shortly.";
}
