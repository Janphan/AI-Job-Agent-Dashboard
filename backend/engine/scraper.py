from playwright.sync_api import sync_playwright
import re
import requests
from bs4 import BeautifulSoup

class JobScraper:
    def __init__(self):
        self.user_agent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

    def scrape_url(self, url: str) -> str:
        print(f"[SCRAPER] Attempting to scrape: {url}")

        try:
            content = self._scrape_with_playwright(url)
            if content:
                print(f"[SCRAPER] Playwright success, content length: {len(content)}")
                return content
        except Exception as e:
            print(f"[SCRAPER] Playwright failed: {e}")

        try:
            content = self._scrape_with_requests(url)
            if content:
                print(f"[SCRAPER] Requests fallback success, content length: {len(content)}")
                return content
        except Exception as e:
            print(f"[SCRAPER] Requests fallback failed: {e}")

        print(f"[SCRAPER] All methods failed for URL: {url}")
        return ""

    def is_blocked(self, content: str) -> bool:
        blocked_keywords = ["cf-challenge", "humans only", "please verify you are a human",
                            "access denied", "cloudflare", "__cf_chl_rt_tk"]
        lower = content.lower()
        return any(kw in lower for kw in blocked_keywords)

    def _scrape_with_playwright(self, url: str) -> str:
        with sync_playwright() as p:
            browser = p.chromium.launch(
                headless=True,
                args=[
                    "--disable-blink-features=AutomationControlled",
                    "--no-sandbox",
                ],
            )
            context = browser.new_context(
                user_agent=self.user_agent,
                viewport={"width": 1920, "height": 1080},
                locale="en-US",
            )
            page = context.new_page()

            try:
                print(f"[PLAYWRIGHT] Opening URL: {url}...")
                page.goto(url, wait_until="domcontentloaded", timeout=30000)
                page.wait_for_timeout(3000)
                raw_text = page.inner_text("body")
                cleaned_text = self._clean_text(raw_text)
                browser.close()
                return cleaned_text
            except Exception as e:
                browser.close()
                raise e

    def _scrape_with_requests(self, url: str) -> str:
        headers = {
            'User-Agent': self.user_agent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
        }
        print(f"[REQUESTS] Fetching URL: {url}")
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        for script in soup(["script", "style"]):
            script.decompose()
        text = soup.get_text()
        return self._clean_text(text)

    def _clean_text(self, text: str) -> str:
        """
        Removes excessive empty lines and unnecessary whitespace.
        """
        # Replace multiple newlines with a single newline
        text = re.sub(r'\n+', '\n', text)
        # Strip whitespace from the beginning and end of each line
        lines = [line.strip() for line in text.split('\n') if line.strip() != '']
        return '\n'.join(lines)

    def scrape_job_content(self, url):
        """
        Scrape job content from URL using Playwright.
        """
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                page = browser.new_page()
                page.goto(url)
                time.sleep(3)  # Wait for page load
                
                # Get all text content from page
                content = page.evaluate("document.body.innerText")
                browser.close()
                
                return content
        except Exception as e:
            print(f"Scraping error: {e}")
            return None