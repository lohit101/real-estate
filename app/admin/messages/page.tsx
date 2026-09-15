"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, RefreshCw, Search } from "lucide-react";
import { useAdminData } from "@/components/admin/use-admin-data";
import { dateLabel, Enquiry, replyLink, withinDays } from "@/lib/admin-data";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeading,
  Pagination,
} from "@/components/admin/ui";

export default function MessagesPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <Messages />
    </Suspense>
  );
}
function Messages() {
  const params = useSearchParams();
  const { data, loading, error, reload } = useAdminData<Enquiry>("messages");
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState(params.get("period") || "");
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPeriod(params.get("period") || "");
  }, [params]);
  useEffect(() => {
    setPage(1);
  }, [query, period]);
  const filtered = data
    .filter(
      (message) =>
        (!period || withinDays(message.created_at, Number(period))) &&
        [message.name, message.email, message.message].some((value) =>
          value?.toLowerCase().includes(query.trim().toLowerCase()),
        ),
    )
    .sort(
      (a, b) =>
        (Date.parse(b.created_at) || 0) - (Date.parse(a.created_at) || 0),
    );
  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(filtered.length / 10)),
  );
  return (
    <>
      <PageHeading
        title="Messages & enquiries"
        description="Review buyer enquiries and continue the conversation by email."
        action={
          <button className="cms-button" disabled={loading} onClick={reload}>
            <RefreshCw size={15} />
            Refresh messages
          </button>
        }
      />
      <section className="cms-panel">
        <div className="cms-toolbar">
          <label className="cms-search">
            <Search size={17} />
            <input
              aria-label="Search messages"
              placeholder="Search name, email or message…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <select
            aria-label="Message date range"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="">All time</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
        {loading ? (
          <LoadingState label="Loading enquiries…" />
        ) : error ? (
          <ErrorState message={error} retry={reload} />
        ) : !filtered.length ? (
          <EmptyState
            title={
              data.length ? "No matching enquiries" : "Your inbox is ready"
            }
            description={
              data.length
                ? "Try another name, email, or date range."
                : "When a visitor contacts you through the website, their message will appear here."
            }
          >
            {data.length > 0 && (
              <button
                className="cms-button"
                onClick={() => {
                  setQuery("");
                  setPeriod("");
                }}
              >
                Clear filters
              </button>
            )}
          </EmptyState>
        ) : (
          <>
            <div className="cms-messages">
              {filtered
                .slice((currentPage - 1) * 10, currentPage * 10)
                .map((message) => (
                  <article key={message.id}>
                    <header>
                      <div className="cms-message-sender">
                        <div className="cms-avatar" aria-hidden="true">
                          {message.name?.trim().slice(0, 1).toUpperCase() ||
                            "?"}
                        </div>
                        <div>
                          <h2>{message.name || "Website visitor"}</h2>
                          <a href={replyLink(message)}>{message.email}</a>
                        </div>
                      </div>
                      <time dateTime={message.created_at}>
                        {dateLabel(message.created_at)}
                      </time>
                    </header>
                    <p className="cms-message-body">{message.message}</p>
                    <footer>
                      <span>Website enquiry · #{message.id}</span>
                      <a href={replyLink(message)} className="cms-button">
                        <Mail size={15} />
                        Reply by email
                      </a>
                    </footer>
                  </article>
                ))}
            </div>
            <Pagination
              page={currentPage}
              total={filtered.length}
              pageSize={10}
              onChange={setPage}
            />
          </>
        )}
      </section>
    </>
  );
}
