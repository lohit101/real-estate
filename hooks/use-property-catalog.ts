"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { PropertyRecord } from "@/lib/admin-data";

type PublicProperty = Pick<
  PropertyRecord,
  | "id"
  | "title"
  | "category"
  | "type"
  | "price"
  | "city"
  | "bedrooms"
  | "bathrooms"
  | "square_feet"
  | "amenities"
  | "image_urls"
  | "is_featured"
>;

export function usePropertyCatalog() {
  const [properties, setProperties] = useState<PublicProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    (async () => {
      try {
        const records: PublicProperty[] = [];
        for (let offset = 0; ; offset += 500) {
          const { data, error } = await supabase
            .from("listings")
            .select(
              "id,title,category,type,price,city,bedrooms,bathrooms,square_feet,amenities,image_urls,is_featured",
            )
            .order("id", { ascending: false })
            .range(offset, offset + 499)
            .abortSignal(controller.signal);
          if (controller.signal.aborted) return;
          if (error) throw error;
          records.push(...((data || []) as PublicProperty[]));
          if (!data || data.length < 500) break;
        }
        setProperties(records);
      } catch {
        if (!controller.signal.aborted)
          setError(
            "We couldn't load properties. Please check your connection and try again.",
          );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [attempt]);
  return {
    properties,
    loading,
    error,
    retry: () => setAttempt((value) => value + 1),
  };
}
