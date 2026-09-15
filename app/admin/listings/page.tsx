"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  ExternalLink,
  Pencil,
  RefreshCw,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import {
  filterProperties,
  PropertyRecord,
  propertyIssues,
} from "@/lib/admin-data";
import { formatIndianPrice } from "@/lib/formatIndianPrice";
import { useAdminData } from "@/components/admin/use-admin-data";
import {
  AddPropertyLink,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeading,
  Pagination,
} from "@/components/admin/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ListingsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <Inventory />
    </Suspense>
  );
}

function Inventory() {
  const params = useSearchParams();
  const { data, setData, loading, error, reload } =
    useAdminData<PropertyRecord>("listings");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [visibility, setVisibility] = useState(params.get("view") || "");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<PropertyRecord | null>(null);
  const [mutationError, setMutationError] = useState("");
  useEffect(() => {
    setVisibility(params.get("view") || "");
  }, [params]);
  useEffect(() => {
    setPage(1);
  }, [query, category, city, visibility, sort]);
  const filtered = filterProperties(data, {
    query,
    category,
    city,
    visibility,
  }).sort((a, b) =>
    sort === "price-low"
      ? Number(a.price) - Number(b.price)
      : sort === "price-high"
        ? Number(b.price) - Number(a.price)
        : sort === "title"
          ? (a.title || "").localeCompare(b.title || "")
          : b.id - a.id,
  );
  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(filtered.length / 12)),
  );
  const visible = filtered.slice((currentPage - 1) * 12, currentPage * 12);

  async function toggleFeatured(property: PropertyRecord) {
    setPending(property.id);
    setMutationError("");
    try {
      const { data: updated, error } = await supabase
        .from("listings")
        .update({ is_featured: !property.is_featured })
        .eq("id", property.id)
        .select("id")
        .maybeSingle();
      if (error || !updated)
        throw error || new Error("Property was not updated.");
      setData((previous) =>
        previous.map((item) =>
          item.id === property.id
            ? { ...item, is_featured: !property.is_featured }
            : item,
        ),
      );
      toast.success(
        property.is_featured
          ? "Removed from homepage features"
          : "Property featured on homepage",
      );
    } catch {
      setMutationError(
        "The featured setting couldn't be saved. Please try again.",
      );
    } finally {
      setPending(null);
    }
  }

  async function deleteProperty() {
    if (!deleting) return;
    setPending(deleting.id);
    setMutationError("");
    try {
      const { data: removed, error } = await supabase
        .from("listings")
        .delete()
        .eq("id", deleting.id)
        .select("id")
        .maybeSingle();
      if (error || !removed)
        throw error || new Error("Property was not deleted.");
      setData((previous) => previous.filter((item) => item.id !== deleting.id));
      setDeleting(null);
      toast.success("Property deleted");
    } catch {
      setMutationError(
        "The property couldn't be deleted. Nothing has been removed from this view. Please try again.",
      );
    } finally {
      setPending(null);
    }
  }

  return (
    <>
      <PageHeading
        title="Property inventory"
        description="Manage every listing and choose what appears on your homepage."
        action={<AddPropertyLink />}
      />
      <section className="cms-panel">
        <div className="cms-toolbar">
          <label className="cms-search">
            <Search size={17} />
            <input
              aria-label="Search properties"
              placeholder="Search title, city, builder or ID…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <button
            className="cms-button"
            disabled={loading || pending !== null}
            onClick={reload}
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>
        <div className="cms-filters">
          <label>
            Category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All categories</option>
              <option>Residential</option>
              <option>Commercial</option>
            </select>
          </label>
          <label>
            City
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">All cities</option>
              {Array.from(new Set(data.map((p) => p.city).filter(Boolean)))
                .sort()
                .map((city) => (
                  <option key={city}>{city}</option>
                ))}
            </select>
          </label>
          <label>
            Listing view
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
            >
              <option value="">All properties</option>
              <option value="featured">Featured</option>
              <option value="standard">Not featured</option>
              <option value="attention">Needs attention</option>
            </select>
          </label>
          <label>
            Sort by
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Newest added</option>
              <option value="title">Title A–Z</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>
        </div>
        {mutationError && !deleting && (
          <p className="cms-inline-error" role="alert">
            {mutationError}
          </p>
        )}
        {loading ? (
          <LoadingState label="Loading properties…" />
        ) : error ? (
          <ErrorState message={error} retry={reload} />
        ) : !filtered.length ? (
          <EmptyState
            title={data.length ? "No matching properties" : "No properties yet"}
            description={
              data.length
                ? "Try another search or clear the filters."
                : "Your complete property inventory will appear here."
            }
          >
            {data.length ? (
              <button
                className="cms-button"
                onClick={() => {
                  setQuery("");
                  setCategory("");
                  setCity("");
                  setVisibility("");
                }}
              >
                Clear filters
              </button>
            ) : (
              <AddPropertyLink />
            )}
          </EmptyState>
        ) : (
          <>
            <div className="cms-table-scroll">
              <table className="cms-table">
                <caption className="sr-only">
                  Property inventory with pricing, homepage visibility, and
                  management actions
                </caption>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Category / type</th>
                    <th>Asking price</th>
                    <th>Homepage</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((property) => (
                    <tr key={property.id}>
                      <td>
                        <div className="cms-property-cell">
                          {property.image_urls?.[0] ? (
                            <img
                              src={property.image_urls[0]}
                              alt=""
                              loading="lazy"
                            />
                          ) : (
                            <div className="cms-image-empty">
                              <Building2 size={20} />
                            </div>
                          )}
                          <div>
                            <Link
                              className="cms-property-title"
                              href={`/admin/edit/${property.id}`}
                            >
                              {property.title || "Untitled property"}
                            </Link>
                            <p>
                              {property.city || "City not set"} · #{property.id}
                            </p>
                            {propertyIssues(property).length > 0 && (
                              <span className="cms-badge cms-badge-warning">
                                {propertyIssues(property).length} missing
                                details
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span>{property.category || "Uncategorised"}</span>
                        <p>{property.type || "Type not set"}</p>
                      </td>
                      <td className="cms-price">
                        {Number(property.price) > 0
                          ? `₹${formatIndianPrice(Number(property.price))}`
                          : "Not set"}
                      </td>
                      <td>
                        <button
                          className={`cms-feature-toggle ${property.is_featured ? "is-featured" : ""}`}
                          aria-pressed={property.is_featured}
                          aria-label={`${property.is_featured ? "Unfeature" : "Feature"} ${property.title}`}
                          disabled={pending !== null}
                          onClick={() => toggleFeatured(property)}
                        >
                          <Star
                            size={14}
                            fill={
                              property.is_featured ? "currentColor" : "none"
                            }
                          />
                          {pending === property.id
                            ? "Saving…"
                            : property.is_featured
                              ? "Featured"
                              : "Feature"}
                        </button>
                      </td>
                      <td>
                        <div className="cms-actions">
                          <Link
                            className="cms-icon-button"
                            href={`/admin/edit/${property.id}`}
                            aria-label={`Edit ${property.title}`}
                            title="Edit property"
                          >
                            <Pencil size={16} />
                          </Link>
                          <Link
                            className="cms-icon-button"
                            href={`/property/${property.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View ${property.title} on website`}
                            title="View on website"
                          >
                            <ExternalLink size={16} />
                          </Link>
                          <button
                            className="cms-icon-button cms-danger-text"
                            aria-label={`Delete ${property.title}`}
                            title="Delete property"
                            disabled={pending !== null}
                            onClick={() => {
                              setMutationError("");
                              setDeleting(property);
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={currentPage}
              total={filtered.length}
              pageSize={12}
              onChange={setPage}
            />
          </>
        )}
      </section>
      <Dialog
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open && pending === null) {
            setDeleting(null);
            setMutationError("");
          }
        }}
      >
        <DialogContent className="cms-root cms-confirm">
          <DialogTitle>Delete this property?</DialogTitle>
          <DialogDescription>
            “{deleting?.title || "Untitled property"}” will be removed from the
            inventory and public website. This cannot be undone.
          </DialogDescription>
          {mutationError && (
            <p role="alert" className="cms-error-text">
              {mutationError}
            </p>
          )}
          <div className="cms-actions cms-justify-end">
            <button
              className="cms-button"
              disabled={pending !== null}
              onClick={() => {
                setDeleting(null);
                setMutationError("");
              }}
            >
              Cancel
            </button>
            <button
              className="cms-button cms-danger"
              disabled={pending !== null}
              onClick={deleteProperty}
            >
              {pending !== null ? "Deleting…" : "Delete property"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
