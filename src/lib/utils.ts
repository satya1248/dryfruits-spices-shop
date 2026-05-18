import type { CurrencyCode } from "@/types";

export const BASE_CURRENCY: CurrencyCode = "INR";

export const SUPPORTED_CURRENCIES: {
  code: CurrencyCode;
  label: string;
  rateFromInr: number;
}[] = [
  { code: "INR", label: "Indian Rupee", rateFromInr: 1 },
  { code: "USD", label: "US Dollar", rateFromInr: 0.012 },
  { code: "EUR", label: "Euro", rateFromInr: 0.011 },
  { code: "GBP", label: "British Pound", rateFromInr: 0.0095 },
  { code: "AED", label: "UAE Dirham", rateFromInr: 0.044 },
  { code: "SGD", label: "Singapore Dollar", rateFromInr: 0.016 },
];

const COUNTRY_CURRENCY_MAP: Record<string, CurrencyCode> = {
  india: "INR",
  bharat: "INR",
  "united states": "USD",
  usa: "USD",
  us: "USD",
  "united kingdom": "GBP",
  uk: "GBP",
  england: "GBP",
  germany: "EUR",
  france: "EUR",
  italy: "EUR",
  spain: "EUR",
  "united arab emirates": "AED",
  uae: "AED",
  singapore: "SGD",
};

export function isCurrencyCode(value: string): value is CurrencyCode {
  return SUPPORTED_CURRENCIES.some((currency) => currency.code === value);
}

export function getExchangeRate(currency: CurrencyCode): number {
  return SUPPORTED_CURRENCIES.find((item) => item.code === currency)?.rateFromInr ?? 1;
}

export function convertFromInr(amount: number, currency: CurrencyCode): number {
  return Number((amount * getExchangeRate(currency)).toFixed(2));
}

export function getDefaultCurrencyForCountry(country: string): CurrencyCode {
  return COUNTRY_CURRENCY_MAP[country.trim().toLowerCase()] ?? BASE_CURRENCY;
}

export function formatPrice(
  price: number,
  currency: CurrencyCode = BASE_CURRENCY,
): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
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
