"""
Scrape Tool - Fetches web content from URLs or active browser tab
"""

import requests
from bs4 import BeautifulSoup
from typing import Sequence
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
from . import BaseTool
from utils.logger import get_logger

logger = get_logger("scrape_tool")

class ScrapeTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="Windows-MCP:Scrape",
            description="Fetch content from a URL or the active browser tab. "
                       "By default (use_dom=False), performs HTTP request and returns markdown. "
                       "If use_dom=True, extracts visible text from active browser tab's DOM."
        )
    
    def get_tool_definition(self) -> Tool:
        return Tool(
            name=self.name,
            description=self.description,
            inputSchema={
                "type": "object",
                "properties": {
                    "url": {
                        "type": "string",
                        "description": "URL to fetch content from"
                    },
                    "use_dom": {
                        "type": "boolean",
                        "default": False,
                        "description": "Extract from active browser tab instead of HTTP request"
                    }
                },
                "required": ["url"]
            }
        )
    
    async def execute(self, arguments: dict) -> Sequence[TextContent | ImageContent | EmbeddedResource]:
        url = arguments["url"]
        use_dom = arguments.get("use_dom", False)
        
        try:
            if use_dom:
                # Extract from browser DOM
                content = await self._scrape_from_browser(url)
            else:
                # HTTP request
                content = await self._scrape_from_http(url)
            
            logger.info(f"Scraped content from {url}")
            
            return [TextContent(
                type="text",
                text=content
            )]
            
        except Exception as e:
            error_msg = f"Scrape failed: {str(e)}"
            logger.error(error_msg, exc_info=True)
            return [TextContent(
                type="text",
                text=f"ERROR: {error_msg}"
            )]
    
    async def _scrape_from_http(self, url: str) -> str:
        """Fetch content via HTTP request"""
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Parse HTML
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style", "nav", "footer"]):
            script.decompose()
        
        # Get text
        text = soup.get_text()
        
        # Clean up whitespace
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = '\n'.join(chunk for chunk in chunks if chunk)
        
        # Format as markdown
        title = soup.title.string if soup.title else url
        
        markdown = f"# {title}\n\n"
        markdown += f"Source: {url}\n\n"
        markdown += "---\n\n"
        markdown += text[:5000]  # Limit to 5000 chars
        
        if len(text) > 5000:
            markdown += "\n\n... (content truncated)"
        
        return markdown
    
    async def _scrape_from_browser(self, url: str) -> str:
        """Extract from active browser tab using accessibility tree"""
        from utils.accessibility import get_browser_dom
        
        # Get DOM from active browser
        dom_content = get_browser_dom(url)
        
        if not dom_content:
            return f"ERROR: Could not extract DOM from browser for {url}"
        
        return dom_content
