export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function getCategoryName(
  category: { name: string } | string,
): string {
  return typeof category === "string" ? category : category.name;
}

export function getCategorySlug(
  category: { slug: string } | string,
): string | undefined {
  return typeof category === "string" ? undefined : category.slug;
}
