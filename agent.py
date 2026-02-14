import json
import uuid
import time
from playwright.sync_api import sync_playwright
from urllib.parse import urljoin

# --- Helper functions ---
def extract_scripts(page):
    """Return all script src URLs on the page."""
    return [s.get_attribute("src") for s in page.query_selector_all("script") if s.get_attribute("src")]

def get_privacy_policy_text(context, base_url, original_page_content):
    """
    Scans for a privacy policy link.
    FIX: Ignores product pages and enforces strictly legal wording.
    """
    result = {"link": None, "text": None}
    
    # 1. Strong keywords: These usually indicate the actual legal doc
    strong_keywords = ["privacy policy", "privacy notice", "privacy statement", "legal notice"]
    
    try:
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(original_page_content, 'html.parser')
        
        best_link = None
        
        # Find all links
        all_links = soup.find_all('a', href=True)
        
        for a in all_links:
            href = a['href']
            text = a.get_text(" ", strip=True).lower()
            
            # --- FILTER 1: Ignore Junk ---
            # Ignore javascript links, anchors, and empty text
            if not text or not href or href.startswith("javascript") or href.startswith("#"):
                continue
                
            # --- FILTER 2: Ignore Products (Amazon specific and general) ---
            # Products usually have /dp/ in the URL or very long titles
            if "/dp/" in href or "/gp/product" in href or len(text) > 50:
                continue

            # --- FILTER 3: Strict Matching ---
            # Check for EXACT match first (highest priority)
            if text in strong_keywords:
                best_link = href
                break # We found the holy grail, stop looking.
            
            # Check for partial match (e.g., "Your Privacy Rights") if we haven't found a best link yet
            if "privacy" in text and "settings" not in text and not best_link:
                best_link = href

        if best_link:
            # Normalize URL
            if not best_link.startswith("http"):
                best_link = urljoin(base_url, best_link)
            
            print(f"🎯 Privacy Link Candidate: {best_link}")
            result["link"] = best_link
            
            # Open in a NEW page (tab) to grab the text
            policy_page = context.new_page()
            try:
                policy_page.goto(best_link, timeout=15000, wait_until="domcontentloaded")
                # Grab text from <main>, <article>, or fallback to <body>
                # This avoids grabbing navbars/footers again if possible
                content_text = ""
                try:
                    content_text = policy_page.inner_text("main")
                except:
                    content_text = policy_page.inner_text("body")
                    
                result["text"] = content_text
            except Exception as e:
                print(f"Could not load privacy link {best_link}: {e}")
            finally:
                policy_page.close()
        else:
            print("❌ No valid Privacy Policy link found.")
                
    except Exception as e:
        print(f"Error extracting privacy policy: {e}")

    return result


def analyze_url(url, screenshot_path="screenshot.png"):
    """
    Single-pass analysis: 
    1. Open URL 
    2. Capture basic data (redirects, HTML, scripts)
    3. Find & scrape Privacy Policy (using same browser context)
    """
    redirects = []
    downloads = []
    
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        )
        
        # Setup event listeners
        page = context.new_page()
        page.on("framenavigated", lambda frame: redirects.append(frame.url) if frame == page.main_frame else None)
        page.on("download", lambda download: downloads.append(download.suggested_filename))

        # 1. Visit Main URL
        try:
            page.goto(url, wait_until="domcontentloaded", timeout=15000)
            page.wait_for_timeout(2000) # Allow JS to settle
        except Exception as e:
            print(f"Navigation failed: {e}")
            browser.close()
            return None

        # 2. Capture Main Page Data
        page.screenshot(path=screenshot_path)
        main_html = page.content()
        scripts = extract_scripts(page)
        final_url = page.url

        # 3. Extract Privacy Policy (Reusing context)
        # We pass the HTML we just captured so we don't have to scrape the live DOM again
        privacy_data = get_privacy_policy_text(context, final_url, main_html)

        browser.close()

    return {
        "final_url": final_url,
        "redirects": redirects,
        "html": main_html,
        "screenshot_path": screenshot_path,
        "downloads": downloads,
        "scripts": scripts,
        "privacy_policy": privacy_data
    }

# --- Main ---
if __name__ == "__main__":
    target_url = input("Enter a URL to analyze: ")
    if not target_url.startswith("http"):
        target_url = "https://" + target_url
        
    job_id = str(uuid.uuid4())
    print(f"Starting analysis on {target_url}...")

    # Step 1: Run Analysis
    data = analyze_url(target_url)

    if data:
        # Step 2: Structure Final JSON
        job_json = {
            "job_id": job_id,
            "status": "success",
            "result": {
                "explanation": "Agent scan completed. Ready for Risk Engine.",
                "screenshot_url": data["screenshot_path"]
            },
            "agent_data": data # Contains HTML, Privacy Text, Scripts, etc.
        }

        # Step 3: Save
        output_file = "job_output.json"
        with open(output_file, "w") as f:
            json.dump(job_json, f, indent=4)
        
        print(f"Success! Data saved to {output_file}")
        print(f"Privacy Policy Found: {data['privacy_policy']['link']}")
    else:
        print("Analysis failed.")