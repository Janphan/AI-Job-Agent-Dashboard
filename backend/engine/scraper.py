from playwright.sync_api import sync_playwright
import re

class JobScraper:
    def __init__(self):
        # List of User-Agents to mimic a real browser and avoid bot detection
        self.user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"

    def scrape_url(self, url: str) -> str:
        """
        Launches a headless browser, navigates to the URL, and extracts all body text.
        """
        with sync_playwright() as p:
            # Launch Chromium browser (headless=True means no visible window)
            browser = p.chromium.launch(headless=True)
            
            # Create a new browser context with a specific User-Agent
            context = browser.new_context(user_agent=self.user_agent)
            page = context.new_page()

            try:
                # Navigate to URL and wait until the network is idle (fully loaded)
                print(f"Opening URL: {url}...")
                page.goto(url, wait_until="networkidle", timeout=60000)

                # Extract the visible text content from the body tag
                raw_text = page.inner_text("body")

                # Clean the text: Remove extra whitespace and junk characters
                cleaned_text = self._clean_text(raw_text)
                
                browser.close()
                return cleaned_text

            except Exception as e:
                browser.close()
                print(f"Scraping error: {e}")
                return ""

    def _clean_text(self, text: str) -> str:
        """
        Removes excessive empty lines and unnecessary whitespace.
        """
        # Replace multiple newlines with a single newline
        text = re.sub(r'\n+', '\n', text)
        # Strip whitespace from the beginning and end of each line
        lines = [line.strip() for line in text.split('\n') if line.strip() != '']
        return '\n'.join(lines)