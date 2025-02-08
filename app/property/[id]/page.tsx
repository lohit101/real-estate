"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";

type Listing = {
  id: number;
  title: string;
  type: string;
  price: number;
  description: string;
  image_urls: string[];
};

export default function PropertyDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchProperty = async () => {
      let { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();
      if (!error) setProperty(data as Listing);
      setLoading(false);
    };
    fetchProperty();
  }, [id]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!property) return <p className="text-center text-red-500">Property not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold">{property.title}</h1>
      <p className="text-gray-600">{property.type} • ${property.price}</p>
      <div className="mt-4 flex space-x-2 overflow-x-auto">
        {property.image_urls.map((url, index) => (
          <img key={index} src={url} alt={`Property ${index}`} className="h-40 w-40 object-cover rounded-lg" />
        ))}
      </div>
      <p className="mt-4 text-gray-700">{property.description}</p>
    </div>
  );
}
