"use client";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import ListingsPage from "../listings/page";
import MessagesPage from "../messages/page";
import Link from "next/link";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="p-6 w-full">
      {loading ? (
        <div className="flex items-center justify-center w-full min-h-96">
          <LoaderCircle size={20} className="animate-spin" />
        </div>
      ) : (
        <>
        <Link href={'/admin/add'} className="bg-green-500 text-white py-2 px-4 rounded-full">+ Add Property</Link>
        <ListingsPage />
        <MessagesPage />
        </>
      )}
    </div>
  );
}
