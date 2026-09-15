const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  propertyIssues,
  filterProperties,
  withinDays,
  dateLabel,
  replyLink,
} = require("../lib/admin-data.ts");

const complete = {
  id: 1,
  title: "Park Residence",
  city: "Delhi",
  builder: "Urban Homes",
  category: "Residential",
  type: "Apartment",
  price: 12000000,
  square_feet: 1400,
  description: "Three-bedroom apartment overlooking the park.",
  image_urls: ["https://example.com/property.jpg"],
  is_featured: true,
};
const office = {
  ...complete,
  id: 2,
  title: "Business Centre",
  city: "Gurgaon",
  category: "Commercial",
  type: "Office Space",
  is_featured: false,
};
const filters = { query: "", category: "", city: "", visibility: "" };

test("complete properties do not appear in the attention queue", () => {
  assert.deepEqual(propertyIssues(complete), []);
});
test("missing photos and invalid price/area are surfaced without crashing on null data", () => {
  assert.deepEqual(
    propertyIssues({
      ...complete,
      title: null,
      image_urls: null,
      description: " ",
      city: "",
      price: 0,
      square_feet: -1,
    }),
    [
      "Add photos",
      "Add a title",
      "Add a description",
      "Add a city",
      "Set a price",
      "Add floor area",
    ],
  );
});
test("inventory includes unfeatured properties by default", () => {
  assert.deepEqual(
    filterProperties([complete, office], filters).map((p) => p.id),
    [1, 2],
  );
});
test("filters are combined rather than accepting partial matches", () => {
  assert.deepEqual(
    filterProperties([complete, office], {
      ...filters,
      query: "urban",
      category: "Commercial",
      city: "Gurgaon",
      visibility: "standard",
    }).map((p) => p.id),
    [2],
  );
  assert.deepEqual(
    filterProperties([complete, office], {
      ...filters,
      category: "Commercial",
      city: "Delhi",
    }),
    [],
  );
});
test("search supports IDs and case-insensitive text with surrounding whitespace", () => {
  assert.deepEqual(
    filterProperties([complete, office], { ...filters, query: "  PARK  " }).map(
      (p) => p.id,
    ),
    [1],
  );
  assert.deepEqual(
    filterProperties([complete, office], { ...filters, query: "2" }).map(
      (p) => p.id,
    ),
    [2],
  );
});
test("featured and attention filters select the correct records", () => {
  assert.deepEqual(
    filterProperties([complete, office], {
      ...filters,
      visibility: "featured",
    }).map((p) => p.id),
    [1],
  );
  assert.deepEqual(
    filterProperties([complete, { ...office, image_urls: [] }], {
      ...filters,
      visibility: "attention",
    }).map((p) => p.id),
    [2],
  );
});
test("rolling enquiry counts exclude invalid, future, and old timestamps", () => {
  const now = Date.parse("2026-09-16T12:00:00Z");
  assert.equal(withinDays("2026-09-09T12:00:00Z", 7, now), true);
  assert.equal(withinDays("2026-09-09T11:59:59Z", 7, now), false);
  assert.equal(withinDays("2026-09-17T12:00:00Z", 7, now), false);
  assert.equal(withinDays("invalid", 7, now), false);
  assert.equal(dateLabel("invalid"), "Date unavailable");
});
test("reply links encode email and subject without allowing injected mail headers", () => {
  const link = replyLink({
    email: "buyer+home@example.com?bcc=someone@example.com",
  });
  assert.equal(link.split("?").length, 2);
  assert.ok(
    link.startsWith(
      "mailto:buyer%2Bhome%40example.com%3Fbcc%3Dsomeone%40example.com?subject=",
    ),
  );
});
