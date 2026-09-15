"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, LoaderCircle, LogIn } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (active && data.user) router.replace("/admin/dashboard");
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [router]);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setError(
          "We couldn't sign you in. Check your email and password, then try again.",
        );
        return;
      }
      router.replace("/admin/dashboard");
    } catch {
      setError(
        "Unable to connect. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="cms-login">
      <div className="cms-login-card">
        <Link href="/" className="cms-brand">
          <Building2 size={28} strokeWidth={1.5} />
          <div>
            <strong>1o1 Realtor</strong>
            <span>Property workspace</span>
          </div>
        </Link>
        <h1>Welcome back</h1>
        <p>Sign in to manage properties and enquiries.</p>
        <form onSubmit={login}>
          <label className="cms-field" htmlFor="email">
            Email address
            <input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="you@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={loading}
            />
          </label>
          <label className="cms-field" htmlFor="password">
            Password
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={loading}
            />
          </label>
          {error && (
            <p className="cms-inline-error" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="cms-button cms-primary"
            disabled={loading}
          >
            {loading ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <LogIn size={16} />
            )}
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <Link className="cms-text-link" href="/">
          <ArrowLeft size={14} />
          Back to website
        </Link>
      </div>
    </main>
  );
}
