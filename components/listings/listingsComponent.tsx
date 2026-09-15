"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Bed,
  Building2,
  LoaderCircle,
  MapPinHouse,
  Scaling,
  ShowerHead,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import Search from "@/components/home/search";
import { formatIndianPrice } from "@/lib/formatIndianPrice";
import {
  changeCategory,
  knownPrice,
  parsePropertyFilters,
  propertySearchHref,
  searchProperties,
  sortOptions,
  type PropertyFilters,
  type PropertySort,
} from "@/lib/property-search";
import { usePropertyCatalog } from "@/hooks/use-property-catalog";

export default function ListingsComponent() {
  const router = useRouter();
  const params = useSearchParams();
  const { filters, errors } = parsePropertyFilters(params);
  const { properties, loading, error, retry } = usePropertyCatalog();
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const results = searchProperties(properties, filters);
  const rawPage = Number(params.get("page"));
  const page = Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(results.length / 24)),
  );
  const visible = results.slice((currentPage - 1) * 24, currentPage * 24);
  function apply(next: PropertyFilters) {
    startTransition(() =>
      router.push(propertySearchHref(next), { scroll: false }),
    );
  }
  const clear = () =>
    apply({
      category: "",
      type: "",
      city: "",
      minPrice: null,
      maxPrice: null,
      amenities: [],
      sort: filters.sort,
    });
  const chips: { label: string; remove: () => void }[] = [];
  if (filters.type)
    chips.push({
      label: filters.type,
      remove: () => apply({ ...filters, type: "" }),
    });
  if (filters.city)
    chips.push({
      label: filters.city,
      remove: () => apply({ ...filters, city: "" }),
    });
  if (
    (filters.minPrice !== null || filters.maxPrice !== null) &&
    !errors.length
  )
    chips.push({
      label: `${filters.minPrice !== null ? `₹${formatIndianPrice(filters.minPrice)}` : "Any minimum"} to ${filters.maxPrice !== null ? `₹${formatIndianPrice(filters.maxPrice)}` : "any maximum"}`,
      remove: () => apply({ ...filters, minPrice: null, maxPrice: null }),
    });
  filters.amenities.forEach((amenity) =>
    chips.push({
      label: amenity,
      remove: () =>
        apply({
          ...filters,
          amenities: filters.amenities.filter((value) => value !== amenity),
        }),
    }),
  );
  function pageHref(page: number) {
    const url = new URL(propertySearchHref(filters), "http://local");
    if (page > 1) url.searchParams.set("page", String(page));
    return url.pathname + url.search;
  }

  return (
    <div
      className="site-surface listings-page container mx-auto px-5 sm:px-4 py-24"
      aria-busy={pending || loading}
    >
      <div className="flex flex-col sm:flex-row sm:px-20">
        <div className="flex flex-col w-full sm:w-1/2 gap-2">
          <h2 className="text-4xl font-semibold">
            Discover <span className="text-red-500">Stylish Spaces</span> and{" "}
            <span className="text-red-500">Inspiring Details</span>
          </h2>
          <div
            className="flex flex-row flex-wrap items-center gap-3"
            aria-label="Property categories"
          >
            {[
              { value: "", label: "All" },
              { value: "Commercial", label: "Commercial" },
              { value: "Residential", label: "Residential" },
            ].map((category) => (
              <button
                key={category.value}
                aria-pressed={filters.category === category.value}
                disabled={pending || errors.length > 0}
                onClick={() => apply(changeCategory(filters, category.value))}
                className={`group flex flex-row gap-3 ${filters.category === category.value ? "bg-black text-white" : "bg-white text-black hover:bg-black/10"} rounded-full my-3 py-2 px-4 text-center text-sm transition-all duration-500 w-max`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex w-full sm:w-1/2 flex-col gap-4">
          <p className="text-zinc-500" role="status">
            {loading
              ? "Finding properties…"
              : error || errors.length
                ? "Adjust your search or try again below."
                : `${results.length} ${results.length === 1 ? "property matches" : "properties match"} your search.`}
          </p>
          <div className="results-controls">
            <button
              className="results-filter-button"
              onClick={() => setEditing(true)}
            >
              <SlidersHorizontal size={16} />
              Edit filters
            </button>
            <label htmlFor="property-sort" className="sr-only">
              Sort properties
            </label>
            <select
              id="property-sort"
              value={filters.sort}
              onChange={(event) =>
                apply({ ...filters, sort: event.target.value as PropertySort })
              }
              disabled={pending || errors.length > 0}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {!errors.length && (filters.category || chips.length > 0) && (
            <div className="results-filter-chips">
              {chips.map((chip) => (
                <button
                  key={chip.label}
                  onClick={chip.remove}
                  aria-label={`Remove ${chip.label} filter`}
                >
                  {chip.label}
                  <X size={12} />
                </button>
              ))}
              <button onClick={clear} className="results-clear">
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
      <Separator className="w-4/5 mx-auto my-10" />
      {errors.length ? (
        <div role="alert" className="results-state">
          <h3>Check your search filters</h3>
          <p>{errors.join(" ")}</p>
          <div>
            <button
              className="results-filter-button"
              onClick={() => setEditing(true)}
            >
              Edit filters
            </button>
            <button className="results-filter-button" onClick={clear}>
              Clear filters
            </button>
          </div>
        </div>
      ) : loading ? (
        <div
          role="status"
          className="flex items-center justify-center w-full min-h-96 gap-3"
        >
          <LoaderCircle size={20} className="animate-spin" />
          <span>Loading properties…</span>
        </div>
      ) : error ? (
        <div role="alert" className="results-state">
          <h3>Properties are temporarily unavailable</h3>
          <p>{error}</p>
          <button className="results-filter-button" onClick={retry}>
            Try again
          </button>
        </div>
      ) : !results.length ? (
        <div className="results-state">
          <Building2 size={30} />
          <h3>No properties match these filters</h3>
          <p>Try a different city, a wider price range, or fewer amenities.</p>
          <div>
            <button
              className="results-filter-button"
              onClick={() => setEditing(true)}
            >
              Edit filters
            </button>
            <button className="results-filter-button" onClick={clear}>
              View all properties
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {visible.map((listing) => (
              <div
                key={listing.id}
                className="property-card group bg-white max-w-96 transition-all"
              >
                {listing.image_urls?.[0] ? (
                  <img
                    src={listing.image_urls[0]}
                    alt={listing.title || "Property"}
                    loading="lazy"
                    className="w-full h-60 object-cover rounded-lg transition-all duration-500 group-hover:scale-[1.025]"
                  />
                ) : (
                  <div className="flex h-60 w-full flex-col items-center justify-center gap-2 rounded-lg bg-zinc-100 text-zinc-500">
                    <Building2 size={28} />
                    <span className="text-sm">Photos coming soon</span>
                  </div>
                )}
                <div className="flex flex-row items-start justify-between gap-4 py-3 w-full">
                  <div className="flex flex-col w-2/3">
                    <h2 className="text-lg font-medium max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                      {listing.title || "Property listing"}
                    </h2>
                    <div className="flex flex-row items-center gap-1">
                      <MapPinHouse size={10} className="text-zinc-500" />
                      <p className="text-xs text-zinc-500">
                        {listing.city || "Location available on enquiry"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col w-1/3">
                    <p className="text-xs text-zinc-500">Starting from</p>
                    <p className="text-black font-semibold">
                      {knownPrice(listing.price) !== null
                        ? `₹${formatIndianPrice(Number(listing.price))}`
                        : "Price on request"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row gap-2 py-1">
                  <div className="flex flex-col opacity-100 sm:opacity-0 translate-y-3 sm:translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    <div className="flex flex-row items-center gap-1">
                      <Bed size={14} strokeWidth={3} />
                      <p className="text-sm font-semibold">
                        {listing.bedrooms}
                      </p>
                    </div>
                    <p className="text-xs text-zinc-600 font-medium">
                      {listing.bedrooms > 1 ? "Bedrooms" : "Bedroom"}
                    </p>
                  </div>
                  <div className="flex flex-col opacity-100 sm:opacity-0 translate-y-3 sm:translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-200">
                    <div className="flex flex-row items-center gap-1">
                      <ShowerHead size={14} strokeWidth={3} />
                      <p className="text-sm font-semibold">
                        {listing.bathrooms}
                      </p>
                    </div>
                    <p className="text-xs text-zinc-600 font-medium">
                      {listing.bathrooms > 1 ? "Bathrooms" : "Bathroom"}
                    </p>
                  </div>
                  <div className="flex flex-col opacity-100 sm:opacity-0 translate-y-3 sm:translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-300">
                    <div className="flex flex-row items-center gap-1">
                      <Scaling size={14} strokeWidth={3} />
                      <p className="text-sm font-semibold">
                        {listing.square_feet}
                      </p>
                    </div>
                    <p className="text-xs text-zinc-600 font-medium">Sq. Ft.</p>
                  </div>
                </div>
                <Link
                  href={`/property/${listing.id}`}
                  className="group flex flex-row gap-3 bg-black rounded-full my-3 py-2 px-4 hover:px-6 text-center text-sm transition-all duration-500 text-white w-max translate-y-5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto"
                >
                  Explore Property
                  <p className="rotate-45 group-hover:rotate-90 transition-all duration-500">
                    &uarr;
                  </p>
                </Link>
              </div>
            ))}
          </div>
          {results.length > 24 && (
            <nav
              aria-label="Property result pages"
              className="results-pagination"
            >
              <span>
                {(currentPage - 1) * 24 + 1}–
                {Math.min(currentPage * 24, results.length)} of {results.length}{" "}
                properties
              </span>
              <div>
                {currentPage > 1 && (
                  <Link
                    className="results-filter-button"
                    href={pageHref(currentPage - 1)}
                  >
                    Previous
                  </Link>
                )}
                <span>
                  Page {currentPage} of {Math.ceil(results.length / 24)}
                </span>
                {currentPage * 24 < results.length && (
                  <Link
                    className="results-filter-button"
                    href={pageHref(currentPage + 1)}
                  >
                    Next
                  </Link>
                )}
              </div>
            </nav>
          )}
        </>
      )}
      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="site-surface results-search-dialog sm:max-w-4xl">
          <DialogTitle>Refine your property search</DialogTitle>
          <DialogDescription>
            Properties must match every filter you select. Leave a field open to
            include all options.
          </DialogDescription>
          <Search
            key={params.toString()}
            initialFilters={filters}
            onSearch={(next) => {
              apply(next);
              setEditing(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
