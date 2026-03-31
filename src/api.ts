const BASE_URL = "https://api.trademe.co.nz/v1";
const TIMEOUT_MS = 10_000;

export async function trademeGet(
  endpoint: string,
  params: Record<string, string | number | boolean | undefined> = {}
): Promise<{ ok: true; data: any } | { ok: false; error: string }> {
  const url = new URL(`${BASE_URL}/${endpoint}.json`);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        Origin: "https://www.trademe.co.nz",
        Referer: "https://www.trademe.co.nz/",
      },
    });

    clearTimeout(timeout);

    if (response.status === 429) {
      return {
        ok: false,
        error: "Trade Me rate limit reached. Please try again in a minute.",
      };
    }

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      return {
        ok: false,
        error: `Trade Me API error (HTTP ${response.status}): ${body || response.statusText}`,
      };
    }

    const data = await response.json();
    return { ok: true, data };
  } catch (err: any) {
    if (err.name === "AbortError") {
      return {
        ok: false,
        error: "Trade Me API request timed out after 10 seconds.",
      };
    }
    return {
      ok: false,
      error: `Failed to reach Trade Me API: ${err.message}`,
    };
  }
}
