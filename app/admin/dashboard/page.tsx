"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { User } from "@supabase/auth-helpers-nextjs";

type Listing = {
  id: number;
  title: string;
  type: string;
  price: number;
  image_urls: string[];
};

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        router.push("/admin/login"); // Redirect to login if not authenticated
      }
    };
    getUser();

    const fetchListings = async () => {
      const { data } = await supabase.from("listings").select("*");
      setListings(data || []);
    };
    fetchListings();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const deleteListing = async (id: number) => {
    await supabase.from("listings").delete().eq("id", id);
    setListings((prev) => prev.filter((listing) => listing.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      {user ? (
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      ) : (
        <p>Redirecting to login...</p>
      )}
      <button onClick={() => router.push("/admin/add")} className="mb-4 px-4 py-2 bg-green-500 text-white rounded">Add Listing</button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div key={listing.id} className="p-4 bg-white shadow rounded">
            <img src={listing.image_urls[0]} alt={listing.title} className="w-full h-40 object-cover rounded" />
            <h2 className="text-xl font-bold text-black">{listing.title}</h2>
            <p className="text-gray-600">{listing.type} - ${listing.price}</p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => router.push(`/admin/edit/${listing.id}`)} className="px-3 py-1 bg-blue-500 text-white rounded">Edit</button>
              <button onClick={() => deleteListing(listing.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
