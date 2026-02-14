from playwright.sync_api import sync_playwright

def extract_scripts(page):
    """Return all script src URLs on the page."""
    scripts = page.query_selector_all("script")
    src_list = []
    for s in scripts:
        src = s.get_attribute("src")
        if src:
            src_list.append(src)
    return src_list

def fetch_full_page_data(url, screenshot_path="screenshot.png"):
    redirects = []
    downloads = []
    scripts = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(accept_downloads=True)
        page = context.new_page()

        # Track redirects
        def on_frame_navigated(frame):
            redirects.append(frame.url)
        page.on("framenavigated", on_frame_navigated)

        # Track downloads
        def on_download(download):
            downloads.append(download.suggested_filename)
        page.on("download", on_download)

        # Go to the page
        page.goto(url, wait_until="domcontentloaded")
        page.screenshot(path=screenshot_path)

        # Extract scripts
        scripts = extract_scripts(page)

        browser.close()

    print(f"Screenshot saved as {screenshot_path}")
    print("Redirects during navigation:")
    for r in redirects:
        print("-", r)
    print("Downloads detected:")
    for d in downloads:
        print("-", d)
    print("Scripts found:")
    for s in scripts:
        print("-", s)

if __name__ == "__main__":
    url = input("Enter a URL to analyze: ")
    fetch_full_page_data(url)
