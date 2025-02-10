"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { User } from "@supabase/auth-helpers-nextjs";
import { LoaderCircle, MapPinHouse, Pencil, Trash2 } from "lucide-react";
import { formatIndianPrice } from "@/lib/formatIndianPrice";
import Link from "next/link";

interface AdminPageProps {
  tab: string;
}

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

type Message = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export default function AdminPage({ tab }: AdminPageProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const activeTab = tab;
  const router = useRouter();

  useEffect(() => {
    const fetchListings = async () => {
      const { data } = await supabase.from("listings").select("*");
      setListings(data || []);
      setLoading(false);
    };
    fetchListings();

    const fetchMessages = async () => {
      const { data } = await supabase.from("messages").select("*");
      setMessages(data || []);
      setLoading(false);
    };
    fetchMessages();
  }, []);

  const deleteListing = async (id: number) => {
    await supabase.from("listings").delete().eq("id", id);
    setListings((prev) => prev.filter((listing) => listing.id !== id));
  };

  return (
    <div className="p-6 w-full">
      {/* <div className="mt-4">
        <button
          onClick={() => setActiveTab("listings")}
          className={`px-4 py-2 ${activeTab === "listings" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"} rounded`}
        >
          Listings
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`ml-2 px-4 py-2 ${activeTab === "messages" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"} rounded`}
        >
          Messages
        </button>
      </div> */}
      {activeTab === "listings" && (
        loading ? (
          <div className="flex items-center justify-center w-full min-h-96">
            <LoaderCircle size={20} className="animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-8">
            {/* Featured listing cards */}
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
        )
      )}
      {activeTab === "messages" && (
        <div className="mt-4 w-full">
          <h2 className="text-xl font-bold">Messages</h2>
          <div className="grid grid-cols-1 gap-6 mt-4">
            {messages.map((message) => (
              <div key={message.id} className="p-4 bg-white shadow rounded">
                <h3 className="text-lg font-bold">{message.name}</h3>
                <p className="text-gray-600">{message.email}</p>
                <p className="text-gray-800 mt-2">{message.message}</p>
                <p className="text-gray-500 text-sm mt-2">{new Date(message.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
