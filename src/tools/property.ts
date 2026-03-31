import { z } from "zod";
import { trademeGet } from "../api.js";
import { formatPropertyResults } from "../formatters.js";

export const searchPropertySchema = z.object({
  search_string: z.string().optional().describe("Search keywords"),
  price_min: z.number().optional().describe("Minimum price in NZD"),
  price_max: z.number().optional().describe("Maximum price in NZD"),
  bedrooms_min: z.number().optional().describe("Minimum number of bedrooms"),
  bedrooms_max: z.number().optional().describe("Maximum number of bedrooms"),
  bathrooms_min: z.number().optional().describe("Minimum number of bathrooms"),
  property_type: z
    .string()
    .optional()
    .describe("Property type (e.g., House, Apartment, Townhouse, Section, Lifestyle)"),
  district: z.number().optional().describe("Trade Me district ID"),
  region: z.number().optional().describe("Trade Me region ID"),
  sort_order: z
    .enum(["Default", "ExpiryAsc", "PriceAsc", "PriceDesc", "StartDateDesc", "BidsMost"])
    .optional()
    .describe("Sort order. Use StartDateDesc for newest listings first"),
  page: z.number().optional().describe("Page number (starts at 1)"),
  rows: z.number().max(25).optional().describe("Results per page (max 25)"),
});

export type SearchPropertyInput = z.infer<typeof searchPropertySchema>;

export async function searchProperty(input: SearchPropertyInput): Promise<string> {
  const result = await trademeGet("Search/Property/Residential", {
    search_string: input.search_string,
    price_min: input.price_min,
    price_max: input.price_max,
    bedrooms_min: input.bedrooms_min,
    bedrooms_max: input.bedrooms_max,
    bathrooms_min: input.bathrooms_min,
    property_type: input.property_type,
    district: input.district,
    region: input.region,
    sort_order: input.sort_order,
    page: input.page,
    rows: input.rows ?? 25,
  });

  if (!result.ok) return result.error;
  return formatPropertyResults(result.data, input.search_string || "property");
}
