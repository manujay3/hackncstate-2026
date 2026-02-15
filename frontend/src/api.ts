const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export interface ScanResult {
  ok: boolean;
  finalUrl: string;
  redirectCount: number;
  redirects: string[];
  screenshotBase64: string;
  signals: {
    title: string;
    ssl: boolean;
    hasPrivacyLink: boolean;
    hasLoginForm: boolean;
    thirdPartyScriptsCount: number;
  };
  privacy: {
    link: string | null;
    snippet: string | null;
  };
  scripts: string[];
  risk: {
    score: number;
    tier: "LOW" | "MEDIUM" | "HIGH";
    reasons: string[];
    reasoning: string | null;
  };
  whois: {
    domainName: string;
    registrar: string;
    domainAgeYears: number | null;
    daysSinceLastUpdate: number | null;
    tld: string;
    privateRegistration: boolean;
  } | null;
  safeBrowsing: {
    is_flagged: boolean;
    threat_types: string[];
  };
  pageRank: {
    pageRankDecimal: number | null;
    pageRankInteger: number | null;
    rank: string | null;
  } | null;
}

export async function previewUrl(url: string): Promise<ScanResult> {
  const res = await fetch(`${API_URL}/api/preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }

  return res.json();
}
