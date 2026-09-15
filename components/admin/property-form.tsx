"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ImagePlus,
  LoaderCircle,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { PropertyRecord } from "@/lib/admin-data";
import {
  amenitiesList,
  cities,
  commercialTypes,
  furnishedOptions,
  propertyAgeOptions,
  residentialTypes,
} from "@/lib/property-options";
import { ErrorState, LoadingState, PageHeading } from "./ui";

type Draft = Omit<PropertyRecord, "id">;
const initial: Draft = {
  title: "",
  category: "Residential",
  type: "Apartment",
  price: 0,
  description: "",
  city: "",
  builder: "",
  bedrooms: 1,
  bathrooms: 1,
  square_feet: 0,
  furnished_status: "Unfurnished",
  amenities: [],
  property_age: "Under Construction",
  image_urls: [],
  is_featured: false,
};
const allowedImages = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export default function PropertyForm({ id }: { id?: string }) {
  const router = useRouter();
  const [listing, setListing] = useState<Draft>(initial);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(!!id);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setLoadError("");
    (async () => {
      try {
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .eq("id", id)
          .single();
        if (error || !data) throw error;
        const draft = { ...initial };
        for (const key of Object.keys(initial) as (keyof Draft)[]) {
          if (data[key] !== null && data[key] !== undefined)
            Object.assign(draft, { [key]: data[key] });
        }
        if (active) setListing(draft);
      } catch {
        if (active)
          setLoadError(
            "This property couldn't be loaded. It may have been removed, or your connection may be unavailable.",
          );
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id, loadAttempt]);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  function change(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const input = event.target as HTMLInputElement;
    setListing((previous) => ({
      ...previous,
      [input.name]:
        input.type === "checkbox"
          ? input.checked
          : input.type === "number"
            ? Number(input.value)
            : input.value,
    }));
  }

  function selectImages(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []);
    event.target.value = "";
    if (listing.image_urls.length + files.length + selected.length > 10) {
      setError(
        "You can include up to 10 photos. Remove a photo before adding more.",
      );
      return;
    }
    if (
      selected.some(
        (file) =>
          !allowedImages.includes(file.type) || file.size > 10 * 1024 * 1024,
      )
    ) {
      setError("Choose JPG, PNG, WebP, or AVIF images up to 10 MB each.");
      return;
    }
    setError("");
    setFiles((previous) => [...previous, ...selected]);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (saving) return;
    if (
      !listing.title.trim() ||
      !listing.description.trim() ||
      !listing.city.trim() ||
      !(listing.price > 0) ||
      !(listing.square_feet > 0)
    ) {
      setError(
        "Add a title, description, city, positive asking price, and floor area before saving.",
      );
      return;
    }
    setSaving(true);
    setError("");
    try {
      const imageUrls = [...listing.image_urls];
      for (let index = 0; index < files.length; index++) {
        setProgress(`Uploading photo ${index + 1} of ${files.length}…`);
        const file = files[index];
        const extension =
          file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
        const path = `properties/${crypto.randomUUID()}.${extension}`;
        const { data, error } = await supabase.storage
          .from("property-images")
          .upload(path, file);
        if (error || !data)
          throw new Error(
            "A photo couldn't be uploaded. Check your connection and try again.",
          );
        const { data: url } = supabase.storage
          .from("property-images")
          .getPublicUrl(data.path);
        imageUrls.push(url.publicUrl);
        // Keep successful uploads in the draft, so retrying does not upload them again.
        setListing((previous) => ({
          ...previous,
          image_urls: [...previous.image_urls, url.publicUrl],
        }));
        setFiles((previous) => previous.slice(1));
      }
      setProgress("Saving property…");
      const payload: Draft = {
        ...listing,
        title: listing.title.trim(),
        city: listing.city.trim(),
        builder: listing.builder.trim(),
        description: listing.description.trim(),
        image_urls: imageUrls,
        price: Number(listing.price),
        bedrooms: Number(listing.bedrooms),
        bathrooms: Number(listing.bathrooms),
        square_feet: Number(listing.square_feet),
      };
      const result = id
        ? await supabase
            .from("listings")
            .update(payload)
            .eq("id", id)
            .select("id")
            .single()
        : await supabase
            .from("listings")
            .insert([payload])
            .select("id")
            .single();
      if (result.error || !result.data)
        throw new Error(
          "The property couldn't be saved. Your entries are still here; please try again.",
        );
      toast.success(id ? "Property updated" : "Property added");
      router.push("/admin/listings");
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSaving(false);
      setProgress("");
    }
  }

  const options =
    listing.category === "Commercial" ? commercialTypes : residentialTypes;
  const select = (
    name: "type" | "city" | "furnished_status" | "property_age",
    label: string,
    values: string[],
    required = false,
  ) => (
    <div className="cms-field">
      <label htmlFor={name}>{label}</label>
      <select
        id={name}
        name={name}
        value={listing[name]}
        onChange={change}
        required={required}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {listing[name] && !values.includes(listing[name]) && (
          <option value={listing[name]}>{listing[name]}</option>
        )}
        {values.map((value) => (
          <option key={value}>{value}</option>
        ))}
      </select>
    </div>
  );
  const textField = (
    name: "title" | "builder",
    label: string,
    required = false,
  ) => (
    <div className="cms-field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        value={listing[name]}
        onChange={change}
        required={required}
      />
    </div>
  );
  const numberField = (
    name: "price" | "bedrooms" | "bathrooms" | "square_feet",
    label: string,
    min = 0,
  ) => (
    <div className="cms-field">
      <label htmlFor={name}>{label}</label>
      <input
        type="number"
        id={name}
        name={name}
        value={listing[name]}
        min={min}
        step={name === "price" || name === "square_feet" ? "0.01" : "1"}
        onChange={change}
        required
      />
    </div>
  );

  return (
    <>
      <PageHeading
        title={id ? "Edit property" : "Add property"}
        description={
          id
            ? "Keep property details, pricing, and photos up to date."
            : "Create a property listing for your website."
        }
        action={
          <Link href="/admin/listings" className="cms-button">
            <ArrowLeft size={15} />
            Back to listings
          </Link>
        }
      />
      {loading ? (
        <LoadingState label="Loading property details…" />
      ) : loadError ? (
        <ErrorState
          message={loadError}
          retry={() => setLoadAttempt((value) => value + 1)}
        />
      ) : (
        <form onSubmit={save} className="cms-property-form">
          <fieldset disabled={saving}>
            <section className="cms-panel cms-form-section">
              <div className="cms-section-intro">
                <h2>Property details</h2>
                <p>Essential information buyers see on the listing.</p>
              </div>
              <div className="cms-form-fields">
                {textField("title", "Property title *", true)}
                <div className="cms-field">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={listing.category}
                    onChange={(event) =>
                      setListing((previous) => ({
                        ...previous,
                        category: event.target.value,
                        type:
                          event.target.value === "Commercial"
                            ? commercialTypes[0]
                            : residentialTypes[0],
                      }))
                    }
                  >
                    <option>Residential</option>
                    <option>Commercial</option>
                  </select>
                </div>
                {select("type", "Property type", options, true)}
                {numberField("price", "Asking price (₹) *", 0.01)}
                <div className="cms-field">
                  <label htmlFor="description">Description *</label>
                  <textarea
                    aria-describedby="description-help"
                    id="description"
                    name="description"
                    rows={5}
                    value={listing.description}
                    onChange={change}
                    required
                  />
                  <span id="description-help" className="cms-help">
                    Describe the location, key features, and what makes this
                    property distinctive.
                  </span>
                </div>
                {select("city", "City *", cities, true)}
                {textField("builder", "Builder / developer")}
              </div>
            </section>
            <section className="cms-panel cms-form-section">
              <div className="cms-section-intro">
                <h2>Specifications</h2>
                <p>Space, amenities, and possession details.</p>
              </div>
              <div className="cms-form-fields">
                {numberField("bedrooms", "Bedrooms")}
                {numberField("bathrooms", "Bathrooms")}
                {numberField("square_feet", "Floor area (sq. ft.) *", 0.01)}
                {select(
                  "furnished_status",
                  "Furnished status",
                  furnishedOptions,
                )}
                <fieldset className="cms-amenities">
                  <legend>Amenities</legend>
                  <div>
                    {Array.from(
                      new Set([...amenitiesList, ...listing.amenities]),
                    ).map((amenity) => (
                      <label key={amenity}>
                        <input
                          type="checkbox"
                          name="amenities"
                          value={amenity}
                          checked={listing.amenities.includes(amenity)}
                          onChange={(event) =>
                            setListing((previous) => ({
                              ...previous,
                              amenities: event.target.checked
                                ? [...previous.amenities, amenity]
                                : previous.amenities.filter(
                                    (value) => value !== amenity,
                                  ),
                            }))
                          }
                        />
                        <span>{amenity}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                {select(
                  "property_age",
                  "Property age / possession",
                  propertyAgeOptions,
                )}
              </div>
            </section>
            <section className="cms-panel cms-form-section">
              <div className="cms-section-intro">
                <h2>Website presentation</h2>
                <p>Choose the photos and homepage visibility.</p>
              </div>
              <div className="cms-form-fields">
                <label className="cms-feature-field">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={listing.is_featured}
                    onChange={change}
                  />
                  <span>
                    <strong>Feature this property</strong>
                    <span>
                      Show this listing in Popular Properties on the homepage.
                    </span>
                  </span>
                </label>
                <div className="cms-field">
                  <label htmlFor="images">Property photos</label>
                  <p className="cms-help">
                    Up to 10 photos, 10 MB each. The first photo is the cover
                    image.
                  </p>
                  <label className="cms-upload" htmlFor="images">
                    <ImagePlus size={24} />
                    <strong>Add property photos</strong>
                    <span>JPG, PNG, WebP or AVIF</span>
                    <input
                      id="images"
                      type="file"
                      accept={allowedImages.join(",")}
                      multiple
                      onChange={selectImages}
                    />
                  </label>
                  {(listing.image_urls.length > 0 || files.length > 0) && (
                    <div className="cms-photo-grid">
                      {listing.image_urls.map((url, index) => (
                        <div key={`${url}-${index}`}>
                          <img src={url} alt={`Property photo ${index + 1}`} />
                          <span>
                            {index === 0 ? "Cover photo" : `Photo ${index + 1}`}
                          </span>
                          <button
                            type="button"
                            aria-label={`Remove photo ${index + 1}`}
                            onClick={() =>
                              setListing((previous) => ({
                                ...previous,
                                image_urls: previous.image_urls.filter(
                                  (_, imageIndex) => index !== imageIndex,
                                ),
                              }))
                            }
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      {files.map((file, index) => (
                        <div key={`${file.name}-${index}`}>
                          <img
                            src={previews[index]}
                            alt={`New photo: ${file.name}`}
                          />
                          <span>
                            {listing.image_urls.length === 0 && index === 0
                              ? "Cover photo · New"
                              : "New photo"}
                          </span>
                          <button
                            type="button"
                            aria-label={`Remove new photo ${file.name}`}
                            onClick={() =>
                              setFiles((previous) =>
                                previous.filter(
                                  (_, fileIndex) => fileIndex !== index,
                                ),
                              )
                            }
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </fieldset>
          {error && (
            <p className="cms-inline-error" role="alert">
              {error}
            </p>
          )}
          <div className="cms-save-bar">
            <p>
              <Check size={15} />
              Changes appear on the website after saving.
            </p>
            <button
              className="cms-button cms-primary"
              type="submit"
              disabled={saving}
            >
              {saving ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {saving
                ? progress || "Saving…"
                : id
                  ? "Save changes"
                  : "Add property"}
            </button>
          </div>
        </form>
      )}
    </>
  );
}
