import { z } from "zod";
import { trademeGet } from "../api.js";
import { formatMotorResults } from "../formatters.js";

export const searchMotorsSchema = z.object({
  search_string: z.string().optional().describe("Search keywords"),
  make: z.string().optional().describe("Vehicle make (e.g., Toyota, Honda, BMW)"),
  model: z.string().optional().describe("Vehicle model (e.g., Corolla, Civic)"),
  year_min: z.number().optional().describe("Minimum year"),
  year_max: z.number().optional().describe("Maximum year"),
  price_min: z.number().optional().describe("Minimum price in NZD"),
  price_max: z.number().optional().describe("Maximum price in NZD"),
  odometer_min: z.number().optional().describe("Minimum odometer reading in km"),
  odometer_max: z.number().optional().describe("Maximum odometer reading in km"),
  transmission: z.enum(["Automatic", "Manual"]).optional().describe("Transmission type"),
  body_style: z.string().optional().describe("Body style (e.g., Sedan, SUV, Hatchback, Ute)"),
  sort_order: z
    .enum(["Default", "ExpiryAsc", "PriceAsc", "PriceDesc", "StartDateDesc", "BidsMost"])
    .optional()
    .describe("Sort order. Use StartDateDesc for newest listings first"),
  region: z.number().optional().describe("Trade Me region ID"),
  page: z.number().optional().describe("Page number (starts at 1)"),
  rows: z.number().max(25).optional().describe("Results per page (max 25)"),
});

export type SearchMotorsInput = z.infer<typeof searchMotorsSchema>;

export async function searchMotors(input: SearchMotorsInput): Promise<string> {
  const result = await trademeGet("Search/Motor/Used", {
    search_string: input.search_string,
    make: input.make,
    model: input.model,
    year_min: input.year_min,
    year_max: input.year_max,
    price_min: input.price_min,
    price_max: input.price_max,
    odometer_min: input.odometer_min,
    odometer_max: input.odometer_max,
    transmission: input.transmission,
    body_style: input.body_style,
    sort_order: input.sort_order,
    region: input.region,
    page: input.page,
    rows: input.rows ?? 25,
  });

  if (!result.ok) return result.error;
  return formatMotorResults(result.data, input.search_string || input.make || "vehicles");
}
