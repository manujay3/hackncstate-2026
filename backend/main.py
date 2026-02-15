import asyncio
import base64
import os
import tempfile
from datetime import datetime
from urllib.parse import urlparse

import json
import logging
import re
import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agent import analyze_url

load_dotenv()

app = FastAPI(title="LinkScout API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class PreviewRequest(BaseModel):
    url: str


@app.get("/health")
def health():
    return {"ok": True}


def fetch_whois(domain: str) -> dict | None:
    """Call the WhoisXML API and return the raw JSON, or None on failure."""
    api_key = os.environ.get("WHOIS_API_KEY", "")
    if not api_key:
        return None
    try:
        resp = requests.get(
            "https://www.whoisxmlapi.com/whoisserver/WhoisService",
            params={"apiKey": api_key, "domainName": domain, "outputFormat": "JSON"},
            timeout=10,
        )
        resp.raise_for_status()
        return resp.json()
    except Exception:
        return None


def extract_whois_relevant_data(whois_json: dict) -> dict | None:
    """Extract user-friendly fields from a WhoisXML API response."""
    record = whois_json.get("WhoisRecord")
    if not record:
        return None

    domain_name = record.get("domainName", "")
    registrar = record.get("registrarName", "Unknown")

    # Domain age
    created = record.get("createdDate") or record.get("registryData", {}).get("createdDate")
    domain_age_years = None
    if created:
        try:
            created_dt = datetime.fromisoformat(created.replace("Z", "+00:00"))
            domain_age_years = round((datetime.now(created_dt.tzinfo) - created_dt).days / 365.25, 1)
        except Exception:
            pass

    # Days since last update
    updated = record.get("updatedDate") or record.get("registryData", {}).get("updatedDate")
    days_since_update = None
    if updated:
        try:
            updated_dt = datetime.fromisoformat(updated.replace("Z", "+00:00"))
            days_since_update = (datetime.now(updated_dt.tzinfo) - updated_dt).days
        except Exception:
            pass

    # TLD
    tld = domain_name.rsplit(".", 1)[-1] if "." in domain_name else ""

    # Private registration
    registrant = record.get("registrant", {})
    contact_email = record.get("contactEmail", "")
    private_registration = any([
        "privacy" in (registrant.get("organization", "") or "").lower(),
        "proxy" in (registrant.get("organization", "") or "").lower(),
        "redacted" in (registrant.get("name", "") or "").lower(),
        "redacted" in contact_email.lower(),
        "privacy" in contact_email.lower(),
    ])

    return {
        "domainName": domain_name,
        "registrar": registrar,
        "domainAgeYears": domain_age_years,
        "daysSinceLastUpdate": days_since_update,
        "tld": tld,
        "privateRegistration": private_registration,
    }


def fetch_pagerank(domain: str) -> dict | None:
    """Call the Open PageRank API and return rank data, or None on failure."""
    api_key = os.environ.get("OPEN_PAGERANK_KEY", "")
    if not api_key:
        return None
    try:
        resp = requests.get(
            "https://openpagerank.com/api/v1.0/getPageRank",
            params={"domains[]": domain},
            headers={"API-OPR": api_key},
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json()
        results = data.get("response", [])
        if not results:
            return None
        entry = results[0]
        return {
            "pageRankDecimal": entry.get("page_rank_decimal"),
            "pageRankInteger": entry.get("page_rank_integer"),
            "rank": entry.get("rank"),
        }
    except Exception:
        return None


def fetch_safe_browsing(url: str) -> dict:
    """Call the Google Safe Browsing Lookup API v4 and return extracted data."""
    api_key = os.environ.get("GOOGLE_SAFE_BROWSING_KEY", "")
    if not api_key:
        return {"is_flagged": False, "threat_types": []}
    try:
        resp = requests.post(
            f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={api_key}",
            json={
                "client": {"clientId": "safelink", "clientVersion": "1.0"},
                "threatInfo": {
                    "threatTypes": [
                        "MALWARE",
                        "SOCIAL_ENGINEERING",
                        "UNWANTED_SOFTWARE",
                        "POTENTIALLY_HARMFUL_APPLICATION",
                    ],
                    "platformTypes": ["ANY_PLATFORM"],
                    "threatEntryTypes": ["URL"],
                    "threatEntries": [{"url": url}],
                },
            },
            timeout=10,
        )
        resp.raise_for_status()
        return extract_safe_browsing_data(resp.json())
    except Exception:
        return {"is_flagged": False, "threat_types": []}


def extract_safe_browsing_data(response_json: dict) -> dict:
    """Extract threat info from a Google Safe Browsing API response."""
    matches = response_json.get("matches", [])
    if not matches:
        return {"is_flagged": False, "threat_types": []}
    threat_types = list(set(match["threatType"] for match in matches))
    return {"is_flagged": True, "threat_types": threat_types}


def ask_gemini_for_score(
    url: str,
    final_url: str,
    whois_data: dict | None,
    safe_browsing: dict,
    pagerank_data: dict | None,
    signals: dict,
) -> dict:
    """Send all API data to Gemini and get a final risk score + reasoning."""
    api_key = os.environ.get("GEMINI_API", "")
    if not api_key:
        return {"score": None, "tier": None, "reasoning": None}

    prompt = f"""You are a cybersecurity analyst evaluating the safety of a website. Based on the data below, produce a final risk assessment.

URL submitted: {url}
Final URL after redirects: {final_url}

=== WHOIS Data ===
{json.dumps(whois_data, indent=2) if whois_data else "Not available"}

=== Google Safe Browsing ===
Flagged: {safe_browsing.get("is_flagged", False)}
Threat types: {", ".join(safe_browsing.get("threat_types", [])) or "None"}

=== OpenPageRank ===
{json.dumps(pagerank_data, indent=2) if pagerank_data else "Not available"}

=== Page Signals ===
SSL/TLS: {signals.get("ssl", False)}
Has login form: {signals.get("hasLoginForm", False)}
Third-party scripts count: {signals.get("thirdPartyScriptsCount", 0)}
Has privacy policy: {signals.get("hasPrivacyLink", False)}

Instructions:
1. Provide a risk score from 0 to 100 where 0 is extremely dangerous and 100 is very safe.
2. Provide a tier: "HIGH" (score 61-100), "MEDIUM" (score 31-60), or "LOW" (score 0-30).
3. Provide exactly 2 sentences explaining your reasoning in plain English for a non-technical user.

Respond ONLY in this exact JSON format with no other text:
{{"score": <number>, "tier": "<LOW|MEDIUM|HIGH>", "reasoning": "<2 sentences>"}}"""

    try:
        resp = requests.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}",
            json={
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.2},
            },
            timeout=30,
        )
        resp.raise_for_status()
        result = resp.json()
        text = result["candidates"][0]["content"]["parts"][0]["text"].strip()
        logging.info(f"Gemini raw response: {text}")
        # Strip markdown code fences if present
        json_match = re.search(r'\{[^{}]*"score"[^{}]*\}', text, re.DOTALL)
        if json_match:
            text = json_match.group(0)
        else:
            # Try stripping code fences
            text = re.sub(r'^```\w*\n?', '', text)
            text = re.sub(r'\n?```$', '', text)
            text = text.strip()
        parsed = json.loads(text)
        score = int(parsed["score"])
        tier = str(parsed.get("tier", "")).upper()
        reasoning = str(parsed.get("reasoning", ""))
        if tier not in ("LOW", "MEDIUM", "HIGH"):
            tier = "HIGH" if score >= 61 else "MEDIUM" if score >= 31 else "LOW"
        return {"score": min(max(score, 0), 100), "tier": tier, "reasoning": reasoning}
    except Exception as e:
        logging.error(f"Gemini API error: {e}")
        return {"score": None, "tier": None, "reasoning": None}


def compute_risk(agent_data: dict, url: str) -> dict:
    """Simple heuristic risk scoring based on agent scan data."""
    score = 0
    reasons: list[str] = []

    final_url = agent_data.get("final_url", "")
    redirects = agent_data.get("redirects", [])
    scripts = agent_data.get("scripts", [])
    html = agent_data.get("html", "").lower()
    privacy = agent_data.get("privacy_policy", {})

    # SSL check
    ssl = final_url.startswith("https://")
    if not ssl:
        score += 20
        reasons.append("No SSL/TLS encryption")


    # Third-party scripts
    parsed_final = urlparse(final_url)
    final_domain = parsed_final.netloc
    third_party_scripts = [
        s for s in scripts
        if s and urlparse(s).netloc and urlparse(s).netloc != final_domain
    ]
    tp_count = len(third_party_scripts)
    if tp_count > 10:
        score += 15
        reasons.append(f"High number of third-party scripts ({tp_count})")
    elif tp_count > 5:
        score += 8
        reasons.append(f"Moderate third-party scripts ({tp_count})")

    # Redirect chain
    redirect_count = len(redirects)
    if redirect_count > 3:
        score += 20
        reasons.append(f"Long redirect chain ({redirect_count} hops)")
    elif redirect_count > 1:
        score += 10
        reasons.append(f"Redirect chain ({redirect_count} hops)")

    # Privacy policy
    has_privacy = bool(privacy and privacy.get("link"))
    if not has_privacy:
        score += 10
        reasons.append("No privacy policy found")

    # Domain analysis
    domain_parts = final_domain.split(".")
    if len(domain_parts) > 3:
        score += 5
        reasons.append("Deeply nested subdomain")

    suspicious_tlds = [".xyz", ".top", ".click", ".buzz", ".tk", ".ml", ".ga", ".cf"]
    if any(final_domain.endswith(tld) for tld in suspicious_tlds):
        score += 15
        reasons.append("Suspicious top-level domain")

    # URL mismatch (input vs final)
    input_domain = urlparse(url).netloc
    if input_domain and final_domain and input_domain != final_domain:
        score += 10
        reasons.append(f"Final domain ({final_domain}) differs from input ({input_domain})")

    score = min(score, 100)

    if score >= 70:
        tier = "HIGH"
    elif score >= 40:
        tier = "MEDIUM"
    else:
        tier = "LOW"

    return {"score": score, "tier": tier, "reasons": reasons}


@app.post("/api/preview")
async def preview(req: PreviewRequest):
    url = req.url.strip()
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")

    if not url.startswith("http://") and not url.startswith("https://"):
        url = "https://" + url

    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
        screenshot_path = tmp.name

    try:
        data = await asyncio.to_thread(analyze_url, url, screenshot_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent error: {e}")

    if data is None:
        raise HTTPException(status_code=502, detail="Failed to load the URL")

    # Read screenshot as base64
    screenshot_b64 = ""
    if os.path.exists(screenshot_path):
        with open(screenshot_path, "rb") as f:
            screenshot_b64 = base64.b64encode(f.read()).decode()
        os.unlink(screenshot_path)

    final_url = data.get("final_url", url)
    redirects = data.get("redirects", [])
    scripts = data.get("scripts", [])
    privacy = data.get("privacy_policy", {})
    html = data.get("html", "").lower()

    has_login_form = any(
        kw in html
        for kw in ['type="password"', "type='password'", 'input type="email"', "login", "sign in"]
    )

    parsed_final = urlparse(final_url)
    final_domain = parsed_final.netloc
    third_party_scripts = [
        s for s in scripts
        if s and urlparse(s).netloc and urlparse(s).netloc != final_domain
    ]

    ssl = final_url.startswith("https://")
    has_privacy = bool(privacy and privacy.get("link"))

    risk = compute_risk(data, url)

    # WHOIS lookup
    whois_data = None
    try:
        whois_domain = final_domain.removeprefix("www.")
        raw_whois = fetch_whois(whois_domain)
        if raw_whois:
            whois_data = extract_whois_relevant_data(raw_whois)
    except Exception:
        pass

    # OpenPageRank lookup
    pagerank_data = None
    try:
        pr_domain = final_domain.removeprefix("www.")
        pagerank_data = fetch_pagerank(pr_domain)
    except Exception:
        pass

    # Google Safe Browsing lookup
    safe_browsing = fetch_safe_browsing(final_url)

    # Gemini AI risk assessment
    signals_for_gemini = {
        "ssl": ssl,
        "hasLoginForm": has_login_form,
        "thirdPartyScriptsCount": len(third_party_scripts),
        "hasPrivacyLink": has_privacy,
    }
    gemini_risk = ask_gemini_for_score(
        url, final_url, whois_data, safe_browsing, pagerank_data, signals_for_gemini
    )
    # Use Gemini score if available, fall back to heuristic
    if gemini_risk["score"] is not None:
        risk = {
            "score": gemini_risk["score"],
            "tier": gemini_risk["tier"],
            "reasons": risk["reasons"],
            "reasoning": gemini_risk["reasoning"],
        }
    else:
        risk["reasoning"] = None

    return {
        "ok": True,
        "finalUrl": final_url,
        "redirectCount": len(redirects),
        "redirects": redirects,
        "screenshotBase64": screenshot_b64,
        "signals": {
            "title": data.get("html", "")[:200],
            "ssl": ssl,
            "hasPrivacyLink": has_privacy,
            "hasLoginForm": has_login_form,
            "thirdPartyScriptsCount": len(third_party_scripts),
        },
        "privacy": {
            "link": privacy.get("link") if privacy else None,
            "snippet": (privacy.get("text") or "")[:500] if privacy else None,
        },
        "scripts": scripts[:20],
        "risk": risk,
        "whois": whois_data,
        "safeBrowsing": safe_browsing,
        "pageRank": pagerank_data,
    }
