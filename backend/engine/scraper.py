from playwright.sync_api import sync_playwright
import re
import time
import requests
from bs4 import BeautifulSoup

class JobScraper:
    def __init__(self):
        # List of User-Agents to mimic a real browser and avoid bot detection
        self.user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"

    def scrape_url(self, url: str) -> str:
        """
        Try Playwright first, fallback to requests+BeautifulSoup if Playwright fails.
        """
        print(f"[SCRAPER] Attempting to scrape: {url}")
        
        # Try Playwright first
        try:
            content = self._scrape_with_playwright(url)
            if content:
                print(f"[SCRAPER] Playwright success, content length: {len(content)}")
                return content
        except Exception as e:
            print(f"[SCRAPER] Playwright failed: {e}")
        
        # Fallback to requests + BeautifulSoup
        try:
            content = self._scrape_with_requests(url)
            if content:
                print(f"[SCRAPER] Requests fallback success, content length: {len(content)}")
                return content
        except Exception as e:
            print(f"[SCRAPER] Requests fallback failed: {e}")
        
        print(f"[SCRAPER] All methods failed for URL: {url}")
        return ""

    def _scrape_with_playwright(self, url: str) -> str:
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
                print(f"[PLAYWRIGHT] Opening URL: {url}...")
                page.goto(url, wait_until="networkidle", timeout=60000)

                # Extract the visible text content from the body tag
                raw_text = page.inner_text("body")

                # Clean the text: Remove extra whitespace and junk characters
                cleaned_text = self._clean_text(raw_text)
                
                browser.close()
                return cleaned_text

            except Exception as e:
                browser.close()
                raise e

    def _scrape_with_requests(self, url: str) -> str:
        """
        Fallback method using requests + BeautifulSoup for basic scraping.
        """
        headers = {
            'User-Agent': self.user_agent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
        }
        
        print(f"[REQUESTS] Fetching URL: {url}")
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()  # Raise exception for bad status codes
        
        # Parse HTML
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
        
        # Get text content
        text = soup.get_text()
        
        # Clean and return
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