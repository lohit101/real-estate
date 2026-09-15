export type PropertyRecord = {
  id: number;
  title: string;
  category: string;
  type: string;
  price: number;
  description: string;
  city: string;
  builder: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  furnished_status: string;
  amenities: string[];
  property_age: string;
  image_urls: string[];
  is_featured: boolean;
};

export type Enquiry = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export function propertyIssues(property: PropertyRecord): string[] {
  const issues: string[] = [];
  if (!property.image_urls?.length) issues.push("Add photos");
  if (!property.title?.trim()) issues.push("Add a title");
  if (!property.description?.trim()) issues.push("Add a description");
  if (!property.city?.trim()) issues.push("Add a city");
  if (!(Number(property.price) > 0)) issues.push("Set a price");
  if (!(Number(property.square_feet) > 0)) issues.push("Add floor area");
  return issues;
}

export function withinDays(date: string, days: number, now = Date.now()) {
  const timestamp = Date.parse(date);
  return (
    Number.isFinite(timestamp) &&
    timestamp <= now &&
    timestamp >= now - days * 86400000
  );
}

export function dateLabel(date: string) {
  const value = new Date(date);
  return Number.isNaN(value.getTime())
    ? "Date unavailable"
    : value.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

export function filterProperties(
  properties: PropertyRecord[],
  filters: {
    query: string;
    category: string;
    city: string;
    visibility: string;
  },
) {
  const query = filters.query.trim().toLowerCase();
  return properties.filter(
    (property) =>
      (!query ||
        [
          property.title,
          property.city,
          property.builder,
          property.type,
          String(property.id),
        ].some((value) => value?.toLowerCase().includes(query))) &&
      (!filters.category || property.category === filters.category) &&
      (!filters.city || property.city === filters.city) &&
      (!filters.visibility ||
        (filters.visibility === "featured"
          ? property.is_featured
          : filters.visibility === "standard"
            ? !property.is_featured
            : propertyIssues(property).length > 0)),
  );
}

export function replyLink(enquiry: Enquiry) {
  return `mailto:${encodeURIComponent(enquiry.email)}?subject=${encodeURIComponent("Your enquiry with 1o1 Realtor")}`;
}
