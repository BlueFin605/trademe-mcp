import { z } from "zod";
import { trademeGet } from "../api.js";
import { formatSearchResults } from "../formatters.js";

export const searchTrademeSchema = z.object({
  search_string: z.string().describe("Search keywords"),
  category: z.string().optional().describe("Trade Me category number (use get_categories to find these)"),
  sort_order: z
    .enum([
      "Default",
      "ExpiryAsc",
      "ExpiryDesc",
      "PriceAsc",
      "PriceDesc",
      "BidsMost",
      "BuyNowAsc",
      "BuyNowDesc",
      "StartDateDesc",
    ])
    .optional()
    .describe("Sort order. Use StartDateDesc for newest listings first"),
  condition: z.enum(["New", "Used", "All"]).optional().describe("Item condition filter"),
  price_min: z.number().optional().describe("Minimum price in NZD"),
  price_max: z.number().optional().describe("Maximum price in NZD"),
  buy_now: z.boolean().optional().describe("Only show Buy Now listings"),
  region: z.number().optional().describe("Trade Me region ID"),
  page: z.number().optional().describe("Page number (starts at 1)"),
  rows: z.number().max(25).optional().describe("Results per page (max 25)"),
});

export type SearchTrademeInput = z.infer<typeof searchTrademeSchema>;

export async function searchTrademe(input: SearchTrademeInput): Promise<string> {
  const result = await trademeGet("Search/General", {
    search_string: input.search_string,
    category: input.category,
    sort_order: input.sort_order,
    condition: input.condition === "All" ? undefined : input.condition,
    price_min: input.price_min,
    price_max: input.price_max,
    buy: input.buy_now ? "BuyNow" : undefined,
    region: input.region,
    page: input.page,
    rows: input.rows ?? 25,
  });

  if (!result.ok) return result.error;
  return formatSearchResults(result.data, input.search_string);
}
