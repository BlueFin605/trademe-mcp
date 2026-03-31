function parseTradeMeDate(dateString: string): Date {
  // Trade Me returns dates as "/Date(1774563783137)/"
  const match = dateString.match(/\/Date\((\d+)\)\//);
  if (match) return new Date(parseInt(match[1], 10));
  return new Date(dateString);
}

function timeAgo(dateString: string): string {
  const date = parseTradeMeDate(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" });
}

function listingUrl(listingId: number): string {
  return `https://www.trademe.co.nz/a/marketplace/listing/${listingId}`;
}

function formatPrice(listing: any): string {
  if (listing.PriceDisplay) return listing.PriceDisplay;
  if (listing.BuyNowPrice) return `$${listing.BuyNowPrice.toFixed(2)}`;
  if (listing.StartPrice) return `$${listing.StartPrice.toFixed(2)}`;
  return "Price not listed";
}

function formatLocation(listing: any): string {
  const parts: string[] = [];
  if (listing.Suburb) parts.push(listing.Suburb);
  if (listing.Region) parts.push(listing.Region);
  return parts.join(", ") || "Location not specified";
}

export function formatSearchResults(data: any, searchTerms: string): string {
  const total = data.TotalCount ?? data.List?.length ?? 0;
  const page = data.Page ?? 1;
  const pageSize = data.PageSize ?? 25;
  const totalPages = Math.ceil(total / pageSize);
  const listings: any[] = data.List ?? [];

  if (listings.length === 0) {
    return `No results found for "${searchTerms}".`;
  }

  const lines: string[] = [
    `Found ${total} result${total === 1 ? "" : "s"} (page ${page} of ${totalPages}):`,
    "",
  ];

  for (let i = 0; i < listings.length; i++) {
    const l = listings[i];
    const num = (page - 1) * pageSize + i + 1;
    lines.push(`${num}. ${l.Title}`);
    lines.push(`   Price: ${formatPrice(l)}`);
    lines.push(`   Location: ${formatLocation(l)}`);
    if (l.IsNew !== undefined) {
      lines.push(`   Condition: ${l.IsNew ? "New" : "Used"}`);
    }
    if (l.StartDate) {
      lines.push(`   Listed: ${timeAgo(l.StartDate)}`);
    }
    if (l.BidCount !== undefined && l.BidCount > 0) {
      lines.push(`   Bids: ${l.BidCount}`);
    }
    if (l.HasBuyNow) {
      lines.push(`   Buy Now available`);
    }
    lines.push(`   Link: ${listingUrl(l.ListingId)}`);
    lines.push("");
  }

  if (page < totalPages) {
    lines.push(`Use page ${page + 1} to see more results.`);
  }

  return lines.join("\n");
}

export function formatMotorResults(data: any, searchTerms: string): string {
  const total = data.TotalCount ?? data.List?.length ?? 0;
  const page = data.Page ?? 1;
  const pageSize = data.PageSize ?? 25;
  const totalPages = Math.ceil(total / pageSize);
  const listings: any[] = data.List ?? [];

  if (listings.length === 0) {
    return `No vehicle results found for "${searchTerms}".`;
  }

  const lines: string[] = [
    `Found ${total} vehicle${total === 1 ? "" : "s"} (page ${page} of ${totalPages}):`,
    "",
  ];

  for (let i = 0; i < listings.length; i++) {
    const l = listings[i];
    const num = (page - 1) * pageSize + i + 1;
    lines.push(`${num}. ${l.Title}`);
    lines.push(`   Price: ${formatPrice(l)}`);
    lines.push(`   Location: ${formatLocation(l)}`);
    if (l.Year) lines.push(`   Year: ${l.Year}`);
    if (l.Odometer) lines.push(`   Odometer: ${l.Odometer}`);
    if (l.Transmission) lines.push(`   Transmission: ${l.Transmission}`);
    if (l.EngineSize) lines.push(`   Engine: ${l.EngineSize}`);
    if (l.StartDate) lines.push(`   Listed: ${timeAgo(l.StartDate)}`);
    lines.push(`   Link: ${listingUrl(l.ListingId)}`);
    lines.push("");
  }

  if (page < totalPages) {
    lines.push(`Use page ${page + 1} to see more results.`);
  }

  return lines.join("\n");
}

export function formatPropertyResults(data: any, searchTerms: string): string {
  const total = data.TotalCount ?? data.List?.length ?? 0;
  const page = data.Page ?? 1;
  const pageSize = data.PageSize ?? 25;
  const totalPages = Math.ceil(total / pageSize);
  const listings: any[] = data.List ?? [];

  if (listings.length === 0) {
    return `No property results found for "${searchTerms}".`;
  }

  const lines: string[] = [
    `Found ${total} propert${total === 1 ? "y" : "ies"} (page ${page} of ${totalPages}):`,
    "",
  ];

  for (let i = 0; i < listings.length; i++) {
    const l = listings[i];
    const num = (page - 1) * pageSize + i + 1;
    lines.push(`${num}. ${l.Title}`);
    lines.push(`   Price: ${formatPrice(l)}`);
    lines.push(`   Location: ${formatLocation(l)}`);
    if (l.Bedrooms) lines.push(`   Bedrooms: ${l.Bedrooms}`);
    if (l.Bathrooms) lines.push(`   Bathrooms: ${l.Bathrooms}`);
    if (l.PropertyType) lines.push(`   Type: ${l.PropertyType}`);
    if (l.LandArea) lines.push(`   Land: ${l.LandArea}m²`);
    if (l.StartDate) lines.push(`   Listed: ${timeAgo(l.StartDate)}`);
    lines.push(`   Link: ${listingUrl(l.ListingId)}`);
    lines.push("");
  }

  if (page < totalPages) {
    lines.push(`Use page ${page + 1} to see more results.`);
  }

  return lines.join("\n");
}

export function formatListingDetail(data: any): string {
  const lines: string[] = [
    `# ${data.Title}`,
    "",
    `Price: ${formatPrice(data)}`,
    `Location: ${formatLocation(data)}`,
  ];

  if (data.StartDate) lines.push(`Listed: ${timeAgo(data.StartDate)}`);
  if (data.EndDate) lines.push(`Closes: ${parseTradeMeDate(data.EndDate).toLocaleString("en-NZ")}`);
  if (data.BidCount !== undefined) lines.push(`Bids: ${data.BidCount}`);
  if (data.ViewCount !== undefined) lines.push(`Views: ${data.ViewCount}`);
  if (data.IsNew !== undefined) lines.push(`Condition: ${data.IsNew ? "New" : "Used"}`);

  if (data.Body || data.Description) {
    lines.push("");
    lines.push("## Description");
    lines.push(data.Body || data.Description);
  }

  if (data.Photos?.length) {
    lines.push("");
    lines.push("## Photos");
    for (const photo of data.Photos) {
      const url = photo.Value?.FullSize || photo.Value?.Large || photo.Value?.Medium;
      if (url) lines.push(`- ${url}`);
    }
  }

  if (data.Member) {
    lines.push("");
    lines.push(`Seller: ${data.Member.Nickname || "Unknown"}`);
    if (data.Member.IsAddressVerified) lines.push("(Address verified)");
  }

  lines.push("");
  lines.push(`Link: ${listingUrl(data.ListingId)}`);

  return lines.join("\n");
}

export function formatCategories(data: any): string {
  const categories: any[] = data.Subcategories ?? [];

  if (categories.length === 0) {
    return "No subcategories found.";
  }

  const lines: string[] = [`Categories (${data.Name || "Root"}):`,""];

  for (const cat of categories) {
    const subCount = cat.SubcategoryCount ?? cat.Subcategories?.length ?? 0;
    const suffix = subCount > 0 ? ` (${subCount} subcategories)` : "";
    lines.push(`- ${cat.Name} [${cat.Number}]${suffix}`);
  }

  return lines.join("\n");
}
