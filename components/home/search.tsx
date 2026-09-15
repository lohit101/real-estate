"use client";

import { useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, SearchIcon } from "lucide-react";
import { amenitiesList, cities } from "@/lib/property-options";
import {
  changeCategory,
  defaultFilters,
  priceRanges,
  propertySearchHref,
  typesForCategory,
  validateFilters,
  type PropertyFilters,
} from "@/lib/property-search";
import { formatIndianPrice } from "@/lib/formatIndianPrice";

export default function Search({
  initialFilters = defaultFilters,
  onSearch,
}: {
  initialFilters?: PropertyFilters;
  onSearch?: (filters: PropertyFilters) => void;
}) {
  const router = useRouter();
  const id = useId();
  const [filters, setFilters] = useState<PropertyFilters>(() => ({
    ...initialFilters,
    minPrice: Number.isFinite(initialFilters.minPrice)
      ? initialFilters.minPrice
      : null,
    maxPrice: Number.isFinite(initialFilters.maxPrice)
      ? initialFilters.maxPrice
      : null,
  }));
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const hasBudget = filters.minPrice !== null || filters.maxPrice !== null;
  const range = priceRanges.find(
    (range) => range.min === filters.minPrice && range.max === filters.maxPrice,
  );
  const budgetValue = range?.value || (hasBudget ? "custom" : "");
  const controlClass =
    "block w-full p-2 border border-gray-300 rounded-full shadow-xs focus:ring-black focus:border-black sm:text-sm";

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const errors = validateFilters(filters);
    if (errors.length) {
      setError(errors.join(" "));
      return;
    }
    setError("");
    startTransition(() => {
      if (onSearch) onSearch(filters);
      else router.push(propertySearchHref(filters));
    });
  }

  return (
    <div className="property-search flex p-3 mx-auto bg-white/30 backdrop-blur-md w-full shadow-lg">
      <form
        onSubmit={submit}
        aria-label="Property search"
        className="flex flex-col sm:flex-row gap-5 mx-auto py-3 px-3 sm:pl-6 bg-white w-full shadow-lg"
      >
        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <select
              aria-label="Property category"
              id={`${id}-category`}
              name="category"
              value={filters.category}
              onChange={(event) =>
                setFilters((previous) =>
                  changeCategory(previous, event.target.value),
                )
              }
              className={controlClass}
            >
              <option value="">All categories</option>
              <option value="Commercial">Commercial</option>
              <option value="Residential">Residential</option>
              {filters.category &&
                !["Commercial", "Residential"].includes(filters.category) && (
                  <option value={filters.category}>{filters.category}</option>
                )}
            </select>
            <select
              aria-label="Property type"
              id={`${id}-type`}
              name="type"
              value={filters.type}
              onChange={(event) =>
                setFilters((previous) => ({
                  ...previous,
                  type: event.target.value,
                }))
              }
              className={controlClass}
            >
              <option value="">All property types</option>
              {filters.type &&
                !typesForCategory(filters.category).includes(filters.type) && (
                  <option value={filters.type}>{filters.type}</option>
                )}
              {typesForCategory(filters.category).map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
            <select
              aria-label="Property city"
              id={`${id}-city`}
              name="city"
              value={filters.city}
              onChange={(event) =>
                setFilters((previous) => ({
                  ...previous,
                  city: event.target.value,
                }))
              }
              className={controlClass}
            >
              <option value="">All cities</option>
              {filters.city && !cities.includes(filters.city) && (
                <option value={filters.city}>{filters.city}</option>
              )}
              {cities.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-5 w-full">
            <div className="flex flex-col gap-2">
              <span
                id={`${id}-amenities`}
                className="block text-sm font-semibold text-gray-700"
              >
                Amenities
              </span>
              <div
                role="group"
                aria-labelledby={`${id}-amenities`}
                className="mt-1 flex flex-wrap sm:flex-nowrap gap-1"
              >
                {Array.from(
                  new Set([...amenitiesList, ...filters.amenities]),
                ).map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    aria-pressed={filters.amenities.includes(amenity)}
                    className="search-amenity w-max text-xs cursor-pointer px-3 py-1 rounded-full transition-all"
                    onClick={() =>
                      setFilters((previous) => ({
                        ...previous,
                        amenities: previous.amenities.includes(amenity)
                          ? previous.amenities.filter(
                              (value) => value !== amenity,
                            )
                          : [...previous.amenities, amenity],
                      }))
                    }
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label
                htmlFor={`${id}-price`}
                className="block text-sm font-semibold text-gray-700"
              >
                Price Range
              </label>
              <select
                id={`${id}-price`}
                name="price"
                value={budgetValue}
                onChange={(event) => {
                  const selected = priceRanges.find(
                    (range) => range.value === event.target.value,
                  );
                  setFilters((previous) => ({
                    ...previous,
                    minPrice: selected?.min ?? null,
                    maxPrice: selected?.max ?? null,
                  }));
                }}
                className={controlClass}
              >
                <option value="">Any price</option>
                {budgetValue === "custom" && (
                  <option value="custom">
                    {filters.minPrice !== null
                      ? `₹${formatIndianPrice(filters.minPrice)}`
                      : "Any minimum"}{" "}
                    to{" "}
                    {filters.maxPrice !== null
                      ? `₹${formatIndianPrice(filters.maxPrice)}`
                      : "any maximum"}
                  </option>
                )}
                {priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
        </div>
        <button
          aria-label="Search properties"
          type="submit"
          disabled={pending}
          className="flex items-center justify-center h-max sm:h-full w-full sm:w-max sm:aspect-square bg-black text-white font-semibold p-3 sm:p-0 shadow-xs hover:bg-black/90 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-500 disabled:bg-zinc-800"
        >
          <span className="hidden sm:flex">
            {pending ? (
              <LoaderCircle size={40} className="animate-spin" />
            ) : (
              <SearchIcon size={40} strokeWidth={2} />
            )}
          </span>
          <span className="flex sm:hidden gap-2">
            {pending ? (
              <LoaderCircle size={25} className="animate-spin" />
            ) : (
              <SearchIcon size={25} />
            )}
            <span className="text-xl font-medium">
              {pending ? "Searching..." : "Search"}
            </span>
          </span>
        </button>
      </form>
    </div>
  );
}
