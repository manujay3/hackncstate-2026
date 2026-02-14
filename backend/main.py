import asyncio
import base64
import os
import tempfile
from urllib.parse import urlparse

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agent import analyze_url

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

    # Login form detection
    has_login_form = any(
        kw in html
        for kw in ['type="password"', "type='password'", 'input type="email"', "login", "sign in"]
    )
    if has_login_form:
        score += 15
        reasons.append("Login/credential form detected")

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
    }
