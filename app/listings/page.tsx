"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Navbar from "@/components/home/navbar";
import { Separator } from "@/components/ui/separator";
import { Bed, LoaderCircle, MapPinHouse, Scaling, ShowerHead } from "lucide-react";
import { formatIndianPrice } from "@/lib/formatIndianPrice";

type Listing = {
  id: number;
  title: string;
  category: string; // Add category field
  type: string;
  price: number;
  description: string;
  image_urls: string[];
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  city: string;
  furnished_status: string;
  amenities: string[];
  property_age: number;
};

export default function Listings() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("listings").select("*");
      if (!error && data) {
        const filteredListings = filterListings(data as Listing[]);
        setListings(filteredListings);
        console.log("Filtered Listings:", filteredListings);
      }
      setLoading(false);
    };

    fetchListings();
  }, [searchParams]);

  const filterListings = (listings: Listing[]) => {
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const city = searchParams.get("city");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const amenities = searchParams.get("amenities")?.split(",") || [];

    console.log("Search Parameters:", { category, type, city, minPrice, maxPrice, amenities });

    setSelectedCategory(category);

    return listings.filter((listing) => {
      console.log("Listing:", listing);
      const matchesCategory = category === null || category === "" || listing.category === category;
      const matchesType = type === null || type === "" || listing.type === type;
      const matchesCity = !city || listing.city.toLowerCase() === city.toLowerCase();
      const matchesMinPrice = !minPrice || listing.price >= Number(minPrice);
      const matchesMaxPrice = !maxPrice || listing.price <= Number(maxPrice);
      const matchesAmenities = amenities.length === 0 || amenities.every((amenity) => listing.amenities.includes(amenity));

      const matches = [matchesCategory, matchesType, matchesCity, matchesMinPrice, matchesMaxPrice, matchesAmenities];
      const matchCount = matches.filter(Boolean).length;

      console.log("Matches:", { matchesCategory, matchesType, matchesCity, matchesMinPrice, matchesMaxPrice, matchesAmenities });

      return matchCount > matches.length / 2;
    });
  };

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", category);
    router.push(`/listings?${params.toString()}`);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar />
      <div className="container mx-auto px-4 py-20 pt-28">
        <div className="flex px-20">
          <div className="flex flex-col w-1/2 gap-2">
            <h2 className="text-4xl font-semibold">Discover Stylish Spaces and Inspiring Details</h2>
            <div className="flex flex-row items-center gap-3">
              <button
                onClick={() => handleCategoryChange("Commercial")}
                className={`group flex flex-row gap-3 ${selectedCategory === 'Commercial' ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/10'} rounded-full my-3 py-2 px-4 hover:px-6 text-center text-sm transition-all duration-500 w-max`}
              >
                Commercial
              </button>
              <button
                onClick={() => handleCategoryChange("Residential")}
                className={`group flex flex-row gap-3 ${selectedCategory === 'Residential' ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/10'} rounded-full my-3 py-2 px-4 hover:px-6 text-center text-sm transition-all duration-500 w-max`}
              >
                Residential
              </button>
            </div>
          </div>
          <div className="flex w-1/2">
            <p className="text-zinc-500">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptate quidem necessitatibus error. Eveniet vero quis officiis dolor suscipit provident rerum distinctio asperiores vitae exercitationem. Voluptatem nesciunt rem non quod ducimus!
            </p>
          </div>
        </div>

        <Separator className="w-4/5 mx-auto my-10" />

        {loading ? (
          <div className="flex items-center justify-center w-full min-h-96">
            <LoaderCircle size={20} className="animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-10">
            {listings.map((listing) => (
              <div key={listing.id} className="group bg-white max-w-96 transition-all">
                <img src={listing.image_urls[0]} alt={listing.title} className="w-full h-60 object-cover rounded-lg transition-all duration-500 group-hover:scale-[1.025]" />
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
                <div className="flex flex-row gap-2 py-1">
                  <div className="flex flex-col opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    <div className="flex flex-row items-center gap-1">
                      <Bed size={14} strokeWidth={3} />
                      <p className="text-sm font-semibold">{listing.bedrooms}</p>
                    </div>
                    <p className="text-xs text-zinc-600 font-medium">{listing.bedrooms > 1 ? 'Bedrooms' : 'Bedroom'}</p>
                  </div>
                  <div className="flex flex-col opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-200">
                    <div className="flex flex-row items-center gap-1">
                      <ShowerHead size={14} strokeWidth={3} />
                      <p className="text-sm font-semibold">{listing.bathrooms}</p>
                    </div>
                    <p className="text-xs text-zinc-600 font-medium">{listing.bathrooms > 1 ? 'Bathrooms' : 'Bathroom'}</p>
                  </div>
                  <div className="flex flex-col opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-300">
                    <div className="flex flex-row items-center gap-1">
                      <Scaling size={14} strokeWidth={3} />
                      <p className="text-sm font-semibold">{listing.square_feet}</p>
                    </div>
                    <p className="text-xs text-zinc-600 font-medium">Sq. Ft.</p>
                  </div>
                </div>
                <Link href={`property/${listing.id}`} className="group flex flex-row gap-3 bg-black rounded-full my-3 py-2 px-4 hover:px-6 text-center text-sm transition-all duration-500 text-white w-max translate-y-5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
                  Explore Property
                  <p className="rotate-45 group-hover:rotate-90 transition-all duration-500">&uarr;</p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Suspense>
  );
}