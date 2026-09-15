"use client";

import { knownPrice } from "@/lib/property-search";
import { formatIndianPrice } from "@/lib/formatIndianPrice";
import { supabase } from "@/lib/supabase";
import {
  Bed,
  LoaderCircle,
  MapPinHouse,
  Scaling,
  ShowerHead,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Separator } from "../ui/separator";

type Listing = {
  id: number;
  title: string;
  type: string;
  price: number;
  description: string;
  image_urls: string[];
  city: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  is_featured: boolean;
};

export default function Featured() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    const fetchListings = async () => {
      try {
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .eq("is_featured", true)
          .order("id", { ascending: false })
          .limit(12)
          .abortSignal(controller.signal);
        if (controller.signal.aborted) return;
        if (error) throw error;
        setListings(data || []);
      } catch {
        if (!controller.signal.aborted) setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    void fetchListings();
    return () => controller.abort();
  }, [attempt]);

  return (
    <div className="flex flex-col gap-8 overflow-hidden py-20 pb-0">
      <div className="flex flex-col sm:flex-row sm:gap-10 px-5">
        <div className="flex flex-col w-1/2 gap-2">
          <h2 className="text-4xl font-semibold">
            <span className="text-red-500">Popular</span> Properties
          </h2>
          <Link
            href={`/listings`}
            className="group flex flex-row gap-3 bg-black rounded-full my-3 py-2 px-4 hover:px-6 text-center text-sm transition-all duration-500 text-white w-max"
          >
            Explore All Properties
            <p className="rotate-45 group-hover:rotate-90 transition-all duration-500">
              &uarr;
            </p>
          </Link>
        </div>
        <div className="flex w-full sm:w-1/2">
          <p className="text-zinc-500">
            Discover the most sought-after properties in our collection,
            featuring top-rated listings that are highly favored by our clients.
          </p>
        </div>
      </div>

      <Separator className="w-4/5 mx-auto" />

      {loading ? (
        <div className="flex items-center justify-center w-full min-h-96">
          <LoaderCircle size={20} className="animate-spin" />
        </div>
      ) : error ? (
        <div className="results-state" role="alert">
          <p>Featured properties are temporarily unavailable.</p>
          <button
            className="results-filter-button"
            onClick={() => setAttempt((value) => value + 1)}
          >
            Try again
          </button>
        </div>
      ) : !listings.length ? (
        <div className="results-state">
          <p>Featured properties will appear here soon.</p>
          <Link className="results-filter-button" href="/listings">
            Browse all properties
          </Link>
        </div>
      ) : (
        <div className="flex flex-row gap-8 overflow-y-hidden overflow-x-auto whitespace-nowrap px-5 sm:px-8 py-10">
          {/* Featured listing cards */}
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="property-card group bg-white min-w-80 sm:min-w-96 max-w-80 sm:max-w-96 transition-all"
            >
              {listing.image_urls?.[0] ? (
                <img
                  src={listing.image_urls[0]}
                  alt={listing.title}
                  loading="lazy"
                  className="w-full h-60 object-cover rounded-lg transition-all duration-500 group-hover:scale-[1.025]"
                />
              ) : (
                <div className="flex h-60 items-center justify-center rounded-lg bg-zinc-100 text-sm text-zinc-500">
                  Photos coming soon
                </div>
              )}
              <div className="flex flex-row items-start justify-between gap-4 py-3 w-full">
                <div className="flex flex-col w-2/3">
                  <h2 className="text-lg font-medium max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                    {listing.title}
                  </h2>
                  <div className="flex flex-row items-center gap-1">
                    <MapPinHouse size={10} className="text-zinc-500" />
                    <p className="text-xs text-zinc-500">{listing.city}</p>
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
              <div className="flex opacity-100 translate-y-0 group-hover:opacity-0 group-hover:-translate-y-5 transition-all duration-250 delay-500 group-hover:delay-0">
                <p className="text-xs text-zinc-700 font-medium w-max overflow-hidden text-ellipsis">
                  {listing.description}
                </p>
              </div>
              <div className="flex flex-row gap-2 py-1">
                <div className="flex flex-col opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  <div className="flex flex-row items-center gap-1">
                    <Bed size={14} strokeWidth={3} />
                    <p className="text-sm font-semibold">{listing.bedrooms}</p>
                  </div>
                  <p className="text-xs text-zinc-600 font-medium">
                    {listing.bedrooms > 1 ? "Bedrooms" : "Bedroom"}
                  </p>
                </div>
                <div className="flex flex-col opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-200">
                  <div className="flex flex-row items-center gap-1">
                    <ShowerHead size={14} strokeWidth={3} />
                    <p className="text-sm font-semibold">{listing.bathrooms}</p>
                  </div>
                  <p className="text-xs text-zinc-600 font-medium">
                    {listing.bathrooms > 1 ? "Bathrooms" : "Bathroom"}
                  </p>
                </div>
                <div className="flex flex-col opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-300">
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
      )}
    </div>
  );
}
