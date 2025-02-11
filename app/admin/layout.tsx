"use client";

import { usePathname } from "next/navigation";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarProvider } from "@/components/ui/sidebar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { User } from "@supabase/auth-helpers-nextjs";

const adminLinks = [
  { name: "Dashboard", href: "/admin/dashboard", tab: "dashboard" },
  { name: "Listings", href: "/admin/listings", tab: "listings" },
  { name: "Messages", href: "/admin/messages", tab: "messages" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
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
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  // Exclude layout for the login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="p-3">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup />
          <nav className="p-3">
            {adminLinks.map((link) => (
              <Link key={link.name} href={`/admin/${link.tab}`} className="text-sm block px-4 py-2 hover:bg-zinc-300 rounded-full">
                {link.name}
              </Link>
            ))}
          </nav>
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter>
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
        </SidebarFooter>
      </Sidebar>
      <div className="flex min-h-screen w-full">
        <main className="flex-1 p-6 w-full bg-gray-100">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}