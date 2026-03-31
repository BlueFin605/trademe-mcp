import { z } from "zod";
import { trademeGet } from "../api.js";
import { formatListingDetail } from "../formatters.js";

export const getListingSchema = z.object({
  listing_id: z.number().describe("The Trade Me listing ID"),
});

export type GetListingInput = z.infer<typeof getListingSchema>;

export async function getListing(input: GetListingInput): Promise<string> {
  const result = await trademeGet(`Listings/${input.listing_id}`);

  if (!result.ok) return result.error;
  return formatListingDetail(result.data);
}
