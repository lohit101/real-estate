import {
  amenitiesList,
  commercialTypes,
  residentialTypes,
} from "./property-options";

export type PropertySort =
  "newest" | "price-asc" | "price-desc" | "featured" | "title";
export type PropertyFilters = {
  category: string;
  type: string;
  city: string;
  minPrice: number | null;
  maxPrice: number | null;
  amenities: string[];
  sort: PropertySort;
};
export type SearchableProperty = {
  id: number;
  title?: string | null;
  category?: string | null;
  type?: string | null;
  city?: string | null;
  price?: number | string | null;
  amenities?: string[] | null;
  is_featured?: boolean | null;
};
export const defaultFilters: PropertyFilters = {
  category: "",
  type: "",
  city: "",
  minPrice: null,
  maxPrice: null,
  amenities: [],
  sort: "newest",
};
export const sortOptions: { value: PropertySort; label: string }[] = [
  { value: "newest", label: "Newest added" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "featured", label: "Featured first" },
  { value: "title", label: "Name: A to Z" },
];
export const priceRanges = [
  { value: "under-40l", label: "Up to ₹40 Lacs", min: null, max: 4000000 },
  { value: "40l-1cr", label: "₹40 Lacs – ₹1 Cr", min: 4000000, max: 10000000 },
  { value: "1cr-2cr", label: "₹1 Cr – ₹2 Cr", min: 10000000, max: 20000000 },
  { value: "2cr-5cr", label: "₹2 Cr – ₹5 Cr", min: 20000000, max: 50000000 },
  { value: "5cr-10cr", label: "₹5 Cr – ₹10 Cr", min: 50000000, max: 100000000 },
  { value: "above-10cr", label: "₹10 Cr and above", min: 100000000, max: null },
];
const normalized = (value: unknown) =>
  typeof value === "string"
    ? value.trim().replace(/\s+/g, " ").toLowerCase()
    : "";
const typeAliases: Record<string, string> = {
  "food courts": "Food Court",
  "office spaces": "Office Space",
  multiplexes: "Multiplex",
  apartments: "Apartment",
  houses: "House",
  villas: "Villa",
  studios: "Studio",
  "retail shop": "Retail Shops",
};
const canonical = (value: string, choices: string[]) =>
  choices.find((choice) => normalized(choice) === normalized(value)) ||
  value.trim();
export const canonicalType = (value: string) =>
  typeAliases[normalized(value)] ||
  canonical(value, [...commercialTypes, ...residentialTypes]);
export function typesForCategory(category: string) {
  return normalized(category) === "commercial"
    ? commercialTypes
    : normalized(category) === "residential"
      ? residentialTypes
      : [...commercialTypes, ...residentialTypes];
}
export function changeCategory(
  filters: PropertyFilters,
  category: string,
): PropertyFilters {
  return {
    ...filters,
    category,
    type: typesForCategory(category).includes(filters.type) ? filters.type : "",
  };
}
export function validateFilters(filters: PropertyFilters) {
  const errors: string[] = [];
  if (
    [filters.minPrice, filters.maxPrice].some(
      (value) => value !== null && (!Number.isFinite(value) || value < 0),
    )
  )
    errors.push("Price limits must be valid, non-negative numbers.");
  if (
    filters.minPrice !== null &&
    filters.maxPrice !== null &&
    filters.minPrice > filters.maxPrice
  )
    errors.push("The minimum price cannot exceed the maximum price.");
  if (
    ["Commercial", "Residential"].includes(filters.category) &&
    filters.type &&
    !typesForCategory(filters.category).includes(filters.type)
  )
    errors.push("The selected property type does not belong to this category.");
  return errors;
}
export function parsePropertyFilters(
  params: Pick<URLSearchParams, "get" | "getAll">,
): { filters: PropertyFilters; errors: string[] } {
  const price = (key: string) => {
    const value = params.get(key)?.trim();
    if (!value) return null;
    return /^\d+(?:\.\d+)?$/.test(value) ? Number(value) : NaN;
  };
  const sort = params.get("sort");
  const filters: PropertyFilters = {
    category: canonical(params.get("category") || "", [
      "Commercial",
      "Residential",
    ]),
    type: canonicalType(params.get("type") || ""),
    city: (params.get("city") || "").trim(),
    minPrice: price("minPrice"),
    maxPrice: price("maxPrice"),
    amenities: [
      ...new Set(
        params
          .getAll("amenities")
          .flatMap((value) => value.split(","))
          .map((value) => canonical(value, amenitiesList))
          .filter(Boolean),
      ),
    ],
    sort: sortOptions.some((option) => option.value === sort)
      ? (sort as PropertySort)
      : "newest",
  };
  return { filters, errors: validateFilters(filters) };
}
export function propertySearchHref(filters: Partial<PropertyFilters> = {}) {
  const params = new URLSearchParams();
  for (const key of ["category", "type", "city"] as const)
    if (filters[key]?.trim()) params.set(key, filters[key]!.trim());
  for (const key of ["minPrice", "maxPrice"] as const)
    if (
      filters[key] !== undefined &&
      filters[key] !== null &&
      Number.isFinite(filters[key])
    )
      params.set(key, String(filters[key]));
  const amenities = [
    ...new Set(
      (filters.amenities || []).map((value) => value.trim()).filter(Boolean),
    ),
  ];
  if (amenities.length) params.set("amenities", amenities.join(","));
  if (filters.sort && filters.sort !== "newest")
    params.set("sort", filters.sort);
  return `/listings${params.size ? `?${params}` : ""}`;
}
export function knownPrice(value: SearchableProperty["price"]): number | null {
  const price =
    typeof value === "number" || (typeof value === "string" && value.trim())
      ? Number(value)
      : NaN;
  return Number.isFinite(price) && price > 0 ? price : null;
}
export function searchProperties<T extends SearchableProperty>(
  properties: T[],
  filters: PropertyFilters,
): T[] {
  if (validateFilters(filters).length) return [];
  return properties
    .filter((property) => {
      if (
        filters.category &&
        normalized(property.category) !== normalized(filters.category)
      )
        return false;
      if (
        filters.type &&
        normalized(canonicalType(property.type || "")) !==
          normalized(filters.type)
      )
        return false;
      if (
        filters.city &&
        normalized(property.city) !== normalized(filters.city)
      )
        return false;
      const price = knownPrice(property.price);
      if (
        (filters.minPrice !== null || filters.maxPrice !== null) &&
        price === null
      )
        return false;
      if (filters.minPrice !== null && price! < filters.minPrice) return false;
      if (filters.maxPrice !== null && price! > filters.maxPrice) return false;
      const amenities = new Set(
        (Array.isArray(property.amenities) ? property.amenities : []).map(
          normalized,
        ),
      );
      return filters.amenities.every((amenity) =>
        amenities.has(normalized(amenity)),
      );
    })
    .sort((a, b) => {
      if (filters.sort === "price-asc" || filters.sort === "price-desc") {
        const aPrice = knownPrice(a.price),
          bPrice = knownPrice(b.price);
        if (aPrice === null && bPrice !== null) return 1;
        if (aPrice !== null && bPrice === null) return -1;
        if (aPrice !== null && bPrice !== null && aPrice !== bPrice)
          return filters.sort === "price-asc"
            ? aPrice - bPrice
            : bPrice - aPrice;
      }
      if (filters.sort === "featured" && !!a.is_featured !== !!b.is_featured)
        return a.is_featured ? -1 : 1;
      if (filters.sort === "title") {
        const result = (a.title || "").localeCompare(b.title || "", "en-IN", {
          numeric: true,
          sensitivity: "base",
        });
        if (result) return result;
      }
      return b.id - a.id;
    });
}
