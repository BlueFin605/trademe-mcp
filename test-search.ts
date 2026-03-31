import { trademeGet } from "./src/api.js";
import { formatSearchResults } from "./src/formatters.js";

async function main() {
  const result = await trademeGet("Search/General", {
    search_string: "meta quest 2 OR \"oculus quest 2\"",
    buy: "BuyNow",
    rows: 25,
    sort_order: "PriceAsc",
  });
  if (result.ok) {
    console.log(formatSearchResults(result.data, "meta quest 2 vr headset"));
  } else {
    console.log("Error:", result.error);
  }
}
main();
