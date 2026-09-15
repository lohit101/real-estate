"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useAdminData<T>(table: "listings" | "messages") {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const generation = useRef(0);

  const reload = useCallback(async () => {
    const request = ++generation.current;
    setLoading(true);
    setError("");
    try {
      const records: T[] = [];
      // Fetch every page so totals and filters also work beyond Supabase's row limit.
      for (let offset = 0; ; offset += 500) {
        const { data: page, error: queryError } = await supabase
          .from(table)
          .select("*")
          .order("id", { ascending: false })
          .range(offset, offset + 499);
        if (request !== generation.current) return;
        if (queryError) throw queryError;
        records.push(...((page || []) as T[]));
        if (!page || page.length < 500) break;
      }
      setData(records);
    } catch {
      if (request === generation.current)
        setError(
          `We couldn't load ${table === "listings" ? "properties" : "messages"}. Please try again.`,
        );
    } finally {
      if (request === generation.current) setLoading(false);
    }
  }, [table]);

  useEffect(() => {
    void reload();
    return () => {
      // Invalidate the latest request, including reloads started after this effect.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      generation.current++;
    };
  }, [reload]);

  return { data, setData, loading, error, reload };
}
