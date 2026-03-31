import { z } from "zod";
import { trademeGet } from "../api.js";
import { formatCategories } from "../formatters.js";

export const getCategoriesSchema = z.object({
  category_number: z
    .string()
    .optional()
    .describe("Category number to get subcategories of. Omit for top-level categories."),
});

export type GetCategoriesInput = z.infer<typeof getCategoriesSchema>;

export async function getCategories(input: GetCategoriesInput): Promise<string> {
  const endpoint = input.category_number
    ? `Categories/${input.category_number}`
    : "Categories";

  const result = await trademeGet(endpoint);

  if (!result.ok) return result.error;
  return formatCategories(result.data);
}
