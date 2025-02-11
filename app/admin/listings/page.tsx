"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LoaderCircle, MapPinHouse, Pencil, Trash2 } from "lucide-react";
import { formatIndianPrice } from "@/lib/formatIndianPrice";
import Link from "next/link";

type Listing = {
  id: number;
  title: string;
  type: string;
  price: number;
  description: string;
  image_urls: string[];
  city: string;
  is_featured: boolean;
};

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      const { data } = await supabase.from("listings").select("*");
      setListings(data || []);
      setLoading(false);
    };
    fetchListings();
  }, []);

  const deleteListing = async (id: number) => {
    await supabase.from("listings").delete().eq("id", id);
    setListings((prev) => prev.filter((listing) => listing.id !== id));
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-xl font-bold mb-3">Listings</h2>
      {loading ? (
        <div className="flex items-center justify-center w-full min-h-96">
          <LoaderCircle size={20} className="animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-8">
          {listings.filter(listing => listing.is_featured).map((listing) => (
            <div key={listing.id} className="min-w-80 sm:min-w-96 max-w-80 sm:max-w-96 transition-all">
              <img src={listing.image_urls[0]} alt={listing.title} className="w-full h-60 object-cover rounded-lg" />
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
                  <p className="text-black font-semibold">&#8377;{formatIndianPrice(listing.price)}</p>
                </div>
              </div>
              <div className="flex flex-row gap-2">
                <Link href={`edit/${listing.id}`} className="group flex flex-row items-center gap-2 bg-black rounded-full my-3 py-2 px-4 hover:px-6 text-center text-sm transition-all duration-500 text-white w-max">
                  <Pencil size={16} className="text-white" />
                  Edit
                </Link>
                <button onClick={() => deleteListing(listing.id)} className="group flex flex-row items-center gap-2 bg-red-500 rounded-full my-3 py-2 px-4 hover:px-6 text-center text-sm transition-all duration-500 text-white w-max">
                  <Trash2 size={16} className="text-white" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
