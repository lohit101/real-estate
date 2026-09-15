"use client";

import "./admin.css";

import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import {
  Building2,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Mail,
  Plus,
} from "lucide-react";
import { LoadingState } from "@/components/admin/ui";

const links = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Listings", href: "/admin/listings", icon: Building2 },
  { name: "Messages", href: "/admin/messages", icon: Mail },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) return;
    let active = true;
    setChecking(true);
    supabase.auth
      .getUser()
      .then(({ data, error }) => {
        if (!active) return;
        if (error || !data.user) {
          setUser(null);
          router.replace("/admin/login");
        } else setUser(data.user);
        setChecking(false);
      })
      .catch(() => {
        if (active) {
          setUser(null);
          router.replace("/admin/login");
          setChecking(false);
        }
      });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      if (!session) router.replace("/admin/login");
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [isLogin, router]);

  async function logout() {
    setLoggingOut(true);
    setError("");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      router.replace("/admin/login");
    } catch {
      setError("Sign out failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  if (isLogin) return <div className="cms-root">{children}</div>;
  if (checking || !user)
    return (
      <div className="cms-root cms-auth-check">
        <LoadingState label="Checking your session…" />
      </div>
    );
  const section = pathname.includes("/add")
    ? "Add property"
    : pathname.includes("/edit/")
      ? "Edit property"
      : links.find((link) => link.href === pathname)?.name || "Workspace";

  return (
    <SidebarProvider className="cms-root">
      <CloseMobileNavigation />
      <Sidebar className="cms-root cms-sidebar">
        <SidebarHeader>
          <Link className="cms-brand" href="/admin/dashboard">
            <Building2 size={26} strokeWidth={1.5} />
            <div>
              <strong>1o1 Realtor</strong>
              <span>Property workspace</span>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <div className="cms-nav-label">WORKSPACE</div>
          <nav aria-label="Admin navigation" className="cms-navigation">
            {links.map(({ name, href, icon: Icon }) => {
              const active =
                pathname === href ||
                (href === "/admin/listings" &&
                  (pathname.includes("/edit/") || pathname === "/admin/add"));
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon size={18} />
                  {name}
                </Link>
              );
            })}
          </nav>
          <div className="cms-sidebar-action">
            <Link href="/admin/add" className="cms-button">
              <Plus size={16} />
              Add property
            </Link>
          </div>
        </SidebarContent>
        <SidebarFooter>
          <div className="cms-account">
            <span>Signed in as</span>
            <p title={user.email}>{user.email || "Authenticated account"}</p>
            {error && (
              <p role="alert" className="cms-error-text">
                {error}
              </p>
            )}
            <button
              className="cms-button"
              onClick={logout}
              disabled={loggingOut}
            >
              <LogOut size={16} />
              {loggingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <div className="cms-workspace">
        <div className="cms-topbar">
          <div>
            <SidebarTrigger aria-label="Toggle navigation" />
            <span>
              Workspace <span className="cms-breadcrumb-slash">/</span>{" "}
              <strong>{section}</strong>
            </span>
          </div>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="cms-text-link"
          >
            View website <ExternalLink size={14} />
          </Link>
        </div>
        <main id="admin-main" className="cms-main">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}

function CloseMobileNavigation() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);
  return null;
}
