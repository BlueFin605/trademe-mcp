import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { searchTrademeSchema, searchTrademe } from "./tools/search.js";
import { searchMotorsSchema, searchMotors } from "./tools/motors.js";
import { searchPropertySchema, searchProperty } from "./tools/property.js";
import { getListingSchema, getListing } from "./tools/listing.js";
import { getCategoriesSchema, getCategories } from "./tools/categories.js";

const server = new McpServer({
  name: "trademe",
  version: "1.0.0",
});

server.tool(
  "search_trademe",
  "Search Trade Me listings across all categories. Use for general goods, electronics, clothing, collectibles, etc. Supports filtering by price, condition, region, and sorting by newest/price/expiry.",
  searchTrademeSchema.shape,
  async ({ search_string, ...rest }) => ({
    content: [{ type: "text", text: await searchTrademe({ search_string, ...rest }) }],
  })
);

server.tool(
  "search_motors",
  "Search Trade Me Motors for used vehicles. Supports filtering by make, model, year, price, odometer, transmission, and body style.",
  searchMotorsSchema.shape,
  async (input) => ({
    content: [{ type: "text", text: await searchMotors(input) }],
  })
);

server.tool(
  "search_property",
  "Search Trade Me Property for residential listings. Supports filtering by price, bedrooms, bathrooms, property type, and region.",
  searchPropertySchema.shape,
  async (input) => ({
    content: [{ type: "text", text: await searchProperty(input) }],
  })
);

server.tool(
  "get_listing",
  "Get full details for a specific Trade Me listing by its ID. Returns description, photos, seller info, bid history, and more.",
  getListingSchema.shape,
  async (input) => ({
    content: [{ type: "text", text: await getListing(input) }],
  })
);

server.tool(
  "get_categories",
  "Browse Trade Me's category tree. Use to discover category numbers for more targeted searches. Omit category_number for top-level categories.",
  getCategoriesSchema.shape,
  async (input) => ({
    content: [{ type: "text", text: await getCategories(input) }],
  })
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Trade Me MCP server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
