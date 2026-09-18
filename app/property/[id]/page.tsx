"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Bed,
  Building2,
  Check,
  Clock,
  ImageOff,
  MapPin,
  Scaling,
  Share2,
  ShowerHead,
  Star,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatIndianPrice } from "@/lib/formatIndianPrice";
import type { PropertyRecord } from "@/lib/admin-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import styles from "./property.module.css";

function PropertyPhoto({
  src,
  title,
  primary = false,
}: {
  src: string;
  title: string;
  primary?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return src && !failed ? (
    <Image
      src={src}
      alt={title}
      fill
      unoptimized
      sizes={primary ? "(max-width: 767px) 100vw, 65vw" : "80px"}
      loading={primary ? "eager" : "lazy"}
      fetchPriority={primary ? "high" : "auto"}
      onError={() => setFailed(true)}
    />
  ) : (
    <div className={styles.photoFallback}>
      <ImageOff size={28} aria-hidden="true" />
      <span>Photo unavailable</span>
    </div>
  );
}

export default function PropertyListing() {
  const { id } = useParams<{ id: string }>();
  return <PropertyDetails key={id} id={id} />;
}

function PropertyDetails({ id }: { id: string }) {
  const [property, setProperty] = useState<PropertyRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [photo, setPhoto] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [formStatus, setFormStatus] = useState<"" | "success" | "error">("");
  const [shareStatus, setShareStatus] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setLoadError(false);
    async function load() {
      try {
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .eq("id", id)
          .abortSignal(controller.signal)
          .maybeSingle();
        if (controller.signal.aborted) return;
        if (error) throw error;
        setProperty(data);
      } catch {
        if (!controller.signal.aborted) setLoadError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [id, attempt]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending || !property) return;
    setSending(true);
    setFormStatus("");
    try {
      const { error } = await supabase.from("messages").insert([
        {
          name: name.trim(),
          email: email.trim(),
          message: `Property enquiry: ${property.title} (ID: ${property.id})\n\n${message.trim()}`,
        },
      ]);
      if (error) throw error;
      setFormStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setFormStatus("error");
    } finally {
      setSending(false);
    }
  }

  async function handleShare() {
    setShareStatus("");
    try {
      if (navigator.share) {
        await navigator.share({
          url: window.location.href,
          title: property?.title || "Property listing",
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareStatus("Link copied");
      }
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError"))
        setShareStatus("Couldn't share. Copy the address from your browser.");
    }
  }

  if (loading)
    return (
      <main
        className={styles.page}
        aria-busy="true"
        aria-label="Loading property"
      >
        <div className={styles.toolbar} aria-hidden="true">
          <div className={`${styles.skeleton} ${styles.loadingBreadcrumb}`} />
        </div>
        <div className={styles.grid}>
          <div>
            <div className={`${styles.skeleton} ${styles.gallery}`} />
            <div className={`${styles.skeleton} ${styles.loadingSummary}`} />
            <div className={`${styles.skeleton} ${styles.loadingDetails}`} />
          </div>
          <div className={`${styles.skeleton} ${styles.loadingEnquiry}`} />
        </div>
        <span className="sr-only" role="status">
          Loading property details
        </span>
      </main>
    );
  if (loadError || !property)
    return (
      <main className={styles.page}>
        <div className={styles.empty}>
          <Building2 size={36} aria-hidden="true" />
          <h1>
            {loadError
              ? "We couldn't load this property"
              : "Property not found"}
          </h1>
          <p>
            {loadError
              ? "Please try again in a moment."
              : "This listing may no longer be available. Explore our other properties."}
          </p>
          {loadError && (
            <button
              className={styles.primaryButton}
              onClick={() => setAttempt((value) => value + 1)}
            >
              Try again
            </button>
          )}
          <Link className={styles.backLink} href="/listings">
            <ArrowLeft size={16} />
            Back to properties
          </Link>
        </div>
      </main>
    );

  const images = Array.isArray(property.image_urls)
    ? property.image_urls.filter((url) => typeof url === "string" && url.trim())
    : [];
  const amenities = Array.isArray(property.amenities)
    ? property.amenities.filter(Boolean)
    : [];
  const price = Number(property.price);
  const rawAge = String(property.property_age ?? "").trim();
  const age = /^\d+(\.\d+)?$/.test(rawAge)
    ? `${rawAge} ${Number(rawAge) === 1 ? "year" : "years"} old`
    : rawAge;
  const facts = [
    { label: "Property type", value: property.type },
    { label: "Location", value: property.city },
    { label: "Developer", value: property.builder },
    { label: "Furnishing", value: property.furnished_status },
  ].filter((fact) => fact.value);

  return (
    <main className={styles.page}>
      <div
        className={styles.backdrop}
        aria-hidden="true"
        style={{
          backgroundImage: images[0]
            ? `url(${JSON.stringify(images[0])})`
            : undefined,
        }}
      />
      <div className={styles.toolbar}>
        <Link className={styles.backLink} href="/listings">
          <ArrowLeft size={16} aria-hidden="true" />
          All properties
        </Link>
        <span className={styles.reference}>Property #{property.id}</span>
      </div>
      <div className={styles.grid}>
        <div className={styles.mainColumn}>
          <section aria-label="Property photos">
            <div className={styles.gallery}>
              <PropertyPhoto
                key={images[photo] || "empty"}
                src={images[photo] || ""}
                title={`${property.title}, photo ${photo + 1}`}
                primary
              />
            </div>
            {images.length > 1 && (
              <div
                className={styles.thumbnails}
                aria-label="Choose a property photo"
              >
                {images.map((src, index) => (
                  <button
                    key={`${src}-${index}`}
                    type="button"
                    aria-label={`View photo ${index + 1}`}
                    aria-pressed={photo === index}
                    onClick={() => setPhoto(index)}
                    className={styles.thumbnail}
                  >
                    <PropertyPhoto src={src} title="" />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className={styles.summary} aria-labelledby="property-title">
            <div className={styles.titleRow}>
              <div>
                {property.is_featured && (
                  <span className={styles.featured}>
                    <Star size={13} aria-hidden="true" />
                    Featured property
                  </span>
                )}
                <h1 id="property-title">
                  {property.title || "Property details"}
                </h1>
                <p className={styles.location}>
                  <MapPin size={16} aria-hidden="true" />
                  {[property.city, property.type].filter(Boolean).join(" · ") ||
                    "Contact us for location details"}
                </p>
              </div>
              <button
                type="button"
                onClick={handleShare}
                className={styles.shareButton}
                aria-label="Share property"
              >
                <Share2 size={18} />
              </button>
            </div>
            <p className={styles.shareStatus} role="status">
              {shareStatus}
            </p>
            <div className={styles.stats}>
              {Number(property.bedrooms) > 0 && (
                <div>
                  <Bed size={21} aria-hidden="true" />
                  <span>
                    <strong>{property.bedrooms}</strong>
                    <small>
                      {Number(property.bedrooms) === 1 ? "Bedroom" : "Bedrooms"}
                    </small>
                  </span>
                </div>
              )}
              {Number(property.bathrooms) > 0 && (
                <div>
                  <ShowerHead size={21} aria-hidden="true" />
                  <span>
                    <strong>{property.bathrooms}</strong>
                    <small>
                      {Number(property.bathrooms) === 1
                        ? "Bathroom"
                        : "Bathrooms"}
                    </small>
                  </span>
                </div>
              )}
              {Number(property.square_feet) > 0 && (
                <div>
                  <Scaling size={21} aria-hidden="true" />
                  <span>
                    <strong>
                      {Number(property.square_feet).toLocaleString("en-IN")}
                    </strong>
                    <small>Sq. ft.</small>
                  </span>
                </div>
              )}
              {age && (
                <div>
                  <Clock size={21} aria-hidden="true" />
                  <span>
                    <strong>{age}</strong>
                    <small>Property age / status</small>
                  </span>
                </div>
              )}
            </div>
          </section>

          <Tabs defaultValue="overview" className={styles.details}>
            <TabsList
              className={styles.tabList}
              aria-label="Property information"
            >
              <TabsTrigger className={styles.tab} value="overview">
                Overview
              </TabsTrigger>
              <TabsTrigger className={styles.tab} value="amenities">
                Amenities
                {amenities.length > 0 && <span>{amenities.length}</span>}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className={styles.tabPanel}>
              <h2>About this property</h2>
              <p className={styles.description}>
                {property.description?.trim() ||
                  "Contact our team for more information about this property."}
              </p>
              {facts.length > 0 && (
                <div className={styles.factsSection}>
                  <h3>Property details</h3>
                  <dl className={styles.facts}>
                    {facts.map((fact) => (
                      <div key={fact.label}>
                        <dt>{fact.label}</dt>
                        <dd>{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </TabsContent>
            <TabsContent value="amenities" className={styles.tabPanel}>
              <h2>Amenities &amp; features</h2>
              {amenities.length ? (
                <ul className={styles.amenities}>
                  {amenities.map((amenity, index) => (
                    <li key={`${amenity}-${index}`}>
                      <Check size={17} aria-hidden="true" />
                      {amenity}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.description}>
                  Amenities haven’t been added yet. Ask our team for the full
                  details.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <aside className={styles.enquiry} aria-label="Property enquiry">
          <div className={styles.priceBlock}>
            <span>Asking price</span>
            <p>
              {Number.isFinite(price) && price > 0
                ? `₹${formatIndianPrice(price)}`
                : "Price on request"}
            </p>
          </div>
          <h2>Interested in this property?</h2>
          <p className={styles.enquiryIntro}>
            Ask for more details or arrange a viewing with our team.
          </p>
          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                required
                maxLength={120}
                pattern=".*\S.*"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                autoComplete="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                maxLength={254}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="I'd like to know more about this property…"
                required
                maxLength={5000}
                rows={4}
              />
            </div>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={sending}
            >
              {sending ? "Sending…" : "Send message"}
              <ArrowUpRight size={18} aria-hidden="true" />
            </button>
            {formStatus === "success" && (
              <p role="status" className={styles.formFeedback}>
                <Check size={18} aria-hidden="true" />
                Message sent. Our team will be in touch.
              </p>
            )}
            {formStatus === "error" && (
              <p role="alert" className={styles.formError}>
                Your message couldn’t be sent. Please try again. Your details
                are still here.
              </p>
            )}
          </form>
        </aside>
      </div>
    </main>
  );
}
