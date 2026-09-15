const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
// Transpile the actual shared module; resolve its options dependency without a bundler.
const code = ts.transpileModule(
  fs.readFileSync(require.resolve("../lib/property-search.ts"), "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  },
).outputText;
const api = {};
new Function("require", "exports", code)(
  (name) =>
    name === "./property-options"
      ? require("../lib/property-options.ts")
      : require(name),
  api,
);
const {
  defaultFilters,
  parsePropertyFilters,
  searchProperties,
  changeCategory,
  propertySearchHref,
  priceRanges,
  knownPrice,
} = api;
const home = {
  id: 1,
  title: "Park Apartment",
  category: "Residential",
  type: "Apartment",
  city: "Delhi",
  price: 10000000,
  amenities: ["Parking", "Gym"],
  is_featured: false,
};
const office = {
  ...home,
  id: 2,
  title: "City Office",
  category: "Commercial",
  type: "Office Space",
  price: 20000000,
  is_featured: true,
};
const villa = {
  ...home,
  id: 3,
  title: "Hill Villa",
  type: "Villa",
  city: "Gurgaon",
  price: 150000000,
  amenities: ["Parking"],
};
const list = [home, office, villa];
const ids = (data, filters = {}) =>
  searchProperties(data, { ...defaultFilters, ...filters }).map((p) => p.id);
const parse = (query) => parsePropertyFilters(new URLSearchParams(query));

test("all selected filters are mandatory, never a majority vote", () => {
  assert.deepEqual(
    ids(list, {
      category: "Residential",
      type: "Apartment",
      city: "Delhi",
      minPrice: 8000000,
      maxPrice: 12000000,
      amenities: ["Parking", "Gym"],
    }),
    [1],
  );
  assert.deepEqual(ids(list, { category: "Commercial", city: "Gurgaon" }), []);
});
test("blank URL filters are unrestricted and do not impose a 10 crore cap", () => {
  const { filters, errors } = parse("category=&type=&city=&amenities=");
  assert.deepEqual(errors, []);
  assert.deepEqual(ids(list, filters), [3, 2, 1]);
});
test("amenities require every selected value and handle null data", () => {
  assert.deepEqual(
    ids([...list, { ...home, id: 4, amenities: null }], {
      amenities: ["Parking", "Gym"],
    }),
    [2, 1],
  );
  assert.deepEqual(
    parse("amenities=Parking,,&amenities=parking,Gym,").filters.amenities,
    ["Parking", "Gym"],
  );
});
test("matching ignores case and extra whitespace, but does not use substring city matches", () => {
  assert.deepEqual(
    ids(
      [
        {
          ...home,
          category: " residential ",
          type: "APARTMENT",
          city: "  Delhi  ",
          amenities: [" parking ", "GYM"],
        },
      ],
      {
        category: "Residential",
        type: "Apartment",
        city: "Delhi",
        amenities: ["Parking", "Gym"],
      },
    ),
    [1],
  );
  assert.deepEqual(
    ids([{ ...home, city: "New Delhi" }], { city: "Delhi" }),
    [],
  );
});
test("category tiles and legacy plural type values map to stored property types", () => {
  assert.equal(parse("type=Office+Spaces").filters.type, "Office Space");
  assert.equal(parse("type=Food+Courts").filters.type, "Food Court");
  assert.equal(parse("type=Multiplexes").filters.type, "Multiplex");
  assert.deepEqual(
    ids(list, parse("category=residential&type=Apartments").filters),
    [1],
  );
});
test("changing category clears incompatible types and retains independent filters", () => {
  const filters = {
    ...defaultFilters,
    category: "Residential",
    type: "Apartment",
    city: "Delhi",
    minPrice: 5000000,
    amenities: ["Parking"],
  };
  assert.deepEqual(changeCategory(filters, "Commercial"), {
    ...filters,
    category: "Commercial",
    type: "",
  });
  assert.equal(changeCategory(filters, "").type, "Apartment");
});
test("all budget presets round-trip through shareable URLs", () => {
  for (const range of priceRanges) {
    const url = new URL(
      propertySearchHref({
        ...defaultFilters,
        minPrice: range.min,
        maxPrice: range.max,
      }),
      "http://test",
    );
    const { filters, errors } = parsePropertyFilters(url.searchParams);
    assert.deepEqual(errors, []);
    assert.equal(filters.minPrice, range.min);
    assert.equal(filters.maxPrice, range.max);
  }
});
test("price bounds are inclusive, numeric strings work, and unknown prices are excluded from budgets", () => {
  const data = [
    home,
    { ...home, id: 2, price: "20000000" },
    { ...home, id: 3, price: null },
    { ...home, id: 4, price: 0 },
  ];
  assert.deepEqual(
    ids(data, { minPrice: 10000000, maxPrice: 20000000 }),
    [2, 1],
  );
  assert.deepEqual(ids(data, { maxPrice: 10000000 }), [1]);
  assert.equal(knownPrice(""), null);
  assert.equal(knownPrice("NaN"), null);
});
test("malformed, infinite, negative, reversed prices and incompatible types report errors", () => {
  for (const query of [
    "minPrice=nope",
    "maxPrice=Infinity",
    "minPrice=-1",
    "minPrice=200&maxPrice=100",
    "category=Commercial&type=Villa",
  ]) {
    const parsed = parse(query);
    assert.ok(parsed.errors.length > 0, query);
    assert.deepEqual(searchProperties(list, parsed.filters), []);
  }
});
test("unknown filter values never silently broaden results", () => {
  assert.deepEqual(ids(list, parse("category=Industrial").filters), []);
  assert.deepEqual(ids(list, parse("amenities=Helipad").filters), []);
});
test("price sorts are numeric, keep unknown prices last, and break ties by newest ID", () => {
  const data = [
    home,
    { ...home, id: 2, price: 9000000 },
    { ...home, id: 3, price: 10000000 },
    { ...home, id: 4, price: null },
  ];
  assert.deepEqual(ids(data, { sort: "price-asc" }), [2, 3, 1, 4]);
  assert.deepEqual(ids(data, { sort: "price-desc" }), [3, 1, 2, 4]);
});
test("newest, featured, and alphabetical sorting do not mutate input data", () => {
  assert.deepEqual(ids(list), [3, 2, 1]);
  assert.deepEqual(ids(list, { sort: "featured" }), [2, 3, 1]);
  assert.deepEqual(ids(list, { sort: "title" }), [2, 3, 1]);
  assert.deepEqual(
    list.map((p) => p.id),
    [1, 2, 3],
  );
});
test("serialized URLs preserve all active filters and sorting while omitting empty/default values", () => {
  const filters = {
    ...defaultFilters,
    category: "Commercial",
    type: "Office Space",
    city: "Delhi",
    minPrice: 0,
    maxPrice: 20000000,
    amenities: ["Gym", "Parking"],
    sort: "price-asc",
  };
  assert.deepEqual(
    parsePropertyFilters(
      new URL(propertySearchHref(filters), "http://test").searchParams,
    ).filters,
    filters,
  );
  assert.equal(propertySearchHref(defaultFilters), "/listings");
  assert.equal(parse("sort=invalid").filters.sort, "newest");
});
