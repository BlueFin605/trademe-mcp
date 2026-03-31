# Trade Me MCP Server

An MCP (Model Context Protocol) server that lets AI assistants search Trade Me listings using natural language. No API key required.

## Setup

### Prerequisites

- Node.js 18+

### Install

```bash
cd /path/to/TradeMeMCP
npm install
```

### Add to Claude Code

Create or edit `.mcp.json` in your project root (or `~/.claude/.mcp.json` for global access):

```json
{
  "mcpServers": {
    "trademe": {
      "command": "npx",
      "args": ["tsx", "/path/to/TradeMeMCP/src/index.ts"]
    }
  }
}
```

Restart Claude Code to pick up the new server.

## Tools

### search_trademe

General search across all Trade Me marketplace categories — electronics, clothing, collectibles, etc.

**Parameters:** `search_string` (required), `category`, `sort_order`, `condition`, `price_min`, `price_max`, `buy_now`, `region`, `page`, `rows`

**Example prompts:**
- "Find me a used tent under $200"
- "Search for PS5 controllers in Wellington"
- "What Nintendo Switch games were listed today?"

### search_motors

Search Trade Me Motors for vehicles with make/model/year filtering.

**Parameters:** `search_string`, `make`, `model`, `year_min`, `year_max`, `price_min`, `price_max`, `odometer_min`, `odometer_max`, `transmission`, `body_style`, `sort_order`, `region`, `page`, `rows`

**Example prompts:**
- "Find automatic SUVs under $30k with less than 100,000 km"
- "Show me Toyota Hiluxes from 2018 or newer"

### search_property

Search Trade Me Property for residential listings.

**Parameters:** `search_string`, `price_min`, `price_max`, `bedrooms_min`, `bedrooms_max`, `bathrooms_min`, `property_type`, `district`, `region`, `sort_order`, `page`, `rows`

**Example prompts:**
- "3 bedroom houses in Wellington under $800k"
- "Apartments for sale in Auckland with 2+ bathrooms"

### get_listing

Get full details for a specific listing including description, photos, seller info, and bid history.

**Parameters:** `listing_id` (required)

**Example prompts:**
- "Show me the full details for that first listing"
- "Get more info on listing 5858861442"

### get_categories

Browse Trade Me's category tree to discover category numbers for more targeted searches.

**Parameters:** `category_number` (optional — omit for top-level categories)

**Example prompts:**
- "What categories does Trade Me have?"
- "Show me the subcategories under Electronics"

## Tips

- **New listings:** Ask for results sorted by newest first — the tool supports `StartDateDesc` sort order, and Claude can filter by listing date.
- **Pagination:** Results come 25 per page. Ask Claude to "show more" or "next page" to continue browsing.
- **Refinement:** You can refine searches conversationally — "cheaper ones", "only in Auckland", "only used condition".
- **Cross-category:** You don't need to know which Trade Me section something is in. Just describe what you want.

## Project Structure

```
src/
  index.ts          — MCP server setup and tool registration
  api.ts            — Trade Me API client
  formatters.ts     — Response formatting (JSON → readable text)
  tools/
    search.ts       — search_trademe tool
    motors.ts       — search_motors tool
    property.ts     — search_property tool
    listing.ts      — get_listing tool
    categories.ts   — get_categories tool
```
