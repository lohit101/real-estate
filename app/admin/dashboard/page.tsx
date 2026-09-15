"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  CircleAlert,
  Mail,
  MapPin,
  RefreshCw,
  Star,
} from "lucide-react";
import { useAdminData } from "@/components/admin/use-admin-data";
import {
  AddPropertyLink,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeading,
  Panel,
} from "@/components/admin/ui";
import {
  dateLabel,
  Enquiry,
  PropertyRecord,
  propertyIssues,
  replyLink,
  withinDays,
} from "@/lib/admin-data";
import { formatIndianPrice } from "@/lib/formatIndianPrice";

export default function AdminPage() {
  const properties = useAdminData<PropertyRecord>("listings");
  const enquiries = useAdminData<Enquiry>("messages");
  const loading = properties.loading || enquiries.loading;
  const error = properties.error || enquiries.error;
  const refresh = () => {
    void properties.reload();
    void enquiries.reload();
  };
  const featured = properties.data.filter((p) => p.is_featured).length;
  const attention = properties.data.filter((p) => propertyIssues(p).length);
  const weekly = enquiries.data.filter((message) =>
    withinDays(message.created_at, 7),
  ).length;
  const cities = new Set(
    properties.data.map((p) => p.city?.trim()).filter(Boolean),
  ).size;
  const askingValue = properties.data.reduce(
    (sum, p) => sum + Math.max(0, Number(p.price) || 0),
    0,
  );
  const recent = [...enquiries.data]
    .sort(
      (a, b) =>
        (Date.parse(b.created_at) || 0) - (Date.parse(a.created_at) || 0),
    )
    .slice(0, 5);

  return (
    <>
      <PageHeading
        title="Portfolio overview"
        description="Your properties, incoming enquiries, and what needs attention."
        action={
          <div className="cms-actions">
            <button
              className="cms-button"
              onClick={refresh}
              disabled={loading}
              aria-label="Refresh dashboard"
            >
              <RefreshCw size={16} />
            </button>
            <AddPropertyLink />
          </div>
        }
      />
      {loading ? (
        <LoadingState label="Loading your portfolio…" />
      ) : error ? (
        <ErrorState message={error} retry={refresh} />
      ) : (
        <>
          <div className="cms-stats-grid">
            {[
              {
                label: "Total properties",
                value: properties.data.length,
                detail: `Across ${cities} ${cities === 1 ? "city" : "cities"}`,
                icon: Building2,
                href: "/admin/listings",
              },
              {
                label: "Featured properties",
                value: featured,
                detail: "Selected for the homepage",
                icon: Star,
                href: "/admin/listings?view=featured",
              },
              {
                label: "Enquiries this week",
                value: weekly,
                detail: "Received in the last 7 days",
                icon: Mail,
                href: "/admin/messages?period=7",
              },
              {
                label: "Needs attention",
                value: attention.length,
                detail: "Listings with missing details",
                icon: CircleAlert,
                href: "/admin/listings?view=attention",
              },
            ].map(({ label, value, detail, icon: Icon, href }) => (
              <Link key={label} href={href} className="cms-stat">
                <div>
                  <span>{label}</span>
                  <Icon size={18} />
                </div>
                <strong>{value}</strong>
                <p>
                  {detail}
                  <ArrowUpRight size={14} />
                </p>
              </Link>
            ))}
          </div>
          <div className="cms-dashboard-grid">
            <Panel
              title="Latest enquiries"
              description={`${enquiries.data.length} total messages from your website`}
              href="/admin/messages"
            >
              {recent.length === 0 ? (
                <EmptyState
                  title="No enquiries yet"
                  description="Messages sent through your website will appear here."
                />
              ) : (
                <div className="cms-enquiry-list">
                  {recent.map((message) => (
                    <article key={message.id}>
                      <div className="cms-avatar" aria-hidden="true">
                        {message.name?.trim().slice(0, 1).toUpperCase() || "?"}
                      </div>
                      <div className="cms-enquiry-copy">
                        <div>
                          <h3>{message.name || "Website visitor"}</h3>
                          <time dateTime={message.created_at}>
                            {dateLabel(message.created_at)}
                          </time>
                        </div>
                        <p>{message.message}</p>
                        <a className="cms-text-link" href={replyLink(message)}>
                          Reply by email <ArrowUpRight size={13} />
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </Panel>
            <Panel
              title="Portfolio at a glance"
              description="Current inventory, based on your listings"
            >
              <div className="cms-portfolio-value">
                <span>Total asking value</span>
                <strong>₹{formatIndianPrice(askingValue)}</strong>
                <p>Combined listing prices, not sales revenue.</p>
              </div>
              <dl className="cms-breakdown">
                {["Residential", "Commercial"].map((category) => (
                  <div key={category}>
                    <dt>{category}</dt>
                    <dd>
                      {
                        properties.data.filter((p) => p.category === category)
                          .length
                      }
                    </dd>
                  </div>
                ))}
                <div>
                  <dt>Other / uncategorised</dt>
                  <dd>
                    {
                      properties.data.filter(
                        (p) =>
                          !["Residential", "Commercial"].includes(p.category),
                      ).length
                    }
                  </dd>
                </div>
                <div>
                  <dt>Ready for Possession</dt>
                  <dd>
                    {
                      properties.data.filter(
                        (p) => p.property_age === "Ready for Possession",
                      ).length
                    }
                  </dd>
                </div>
                <div>
                  <dt>Under Construction</dt>
                  <dd>
                    {
                      properties.data.filter(
                        (p) => p.property_age === "Under Construction",
                      ).length
                    }
                  </dd>
                </div>
              </dl>
            </Panel>
          </div>
          <Panel
            title="Listing checklist"
            description="Complete these details to help buyers evaluate your properties."
            href="/admin/listings?view=attention"
          >
            {attention.length === 0 ? (
              <EmptyState
                title={
                  properties.data.length
                    ? "Your listing essentials are complete"
                    : "Build your property portfolio"
                }
                description={
                  properties.data.length
                    ? "Every property has a title, photos, description, city, price, and floor area."
                    : "Add your first property to start managing your inventory."
                }
              >
                {!properties.data.length && <AddPropertyLink />}
              </EmptyState>
            ) : (
              <div className="cms-checklist">
                {attention.slice(0, 5).map((property) => (
                  <div key={property.id}>
                    <div>
                      <h3>{property.title || "Untitled property"}</h3>
                      <p>
                        <MapPin size={13} />
                        {property.city || "City not set"}
                      </p>
                    </div>
                    <div className="cms-tags">
                      {propertyIssues(property).map((issue) => (
                        <span
                          key={issue}
                          className="cms-badge cms-badge-warning"
                        >
                          {issue}
                        </span>
                      ))}
                    </div>
                    <Link
                      className="cms-button"
                      href={`/admin/edit/${property.id}`}
                    >
                      Complete listing <ArrowUpRight size={14} />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </>
      )}
    </>
  );
}
