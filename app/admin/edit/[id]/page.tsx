"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";

const commercialTypes = ["Food Court", "Office Space", "Retail Shops", "Multiplex", "Service Apartment", "Restaurant"];
const residentialTypes = ["Apartment", "House", "Villa", "Studio"];
const cities = ["Gurgaon", "Sohna", "Dwarka", "Delhi", "Jhajjar", "Kharkhoda"];
const furnishedOptions = ["Fully Furnished", "Semi-Furnished", "Unfurnished"];
const amenitiesList = ["Parking", "Gym", "Swimming Pool", "Security", "Play Area"];

export default function EditListing() {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState({
    title: "",
    category: "Residential",
    type: residentialTypes[0],
    price: 0,
    description: "",
    city: cities[0],
    builder: "",
    bedrooms: 1,
    bathrooms: 1,
    square_feet: 0,
    furnished_status: furnishedOptions[0],
    amenities: [] as string[],
    property_age: 0,
    image_urls: [] as string[],
    is_featured: false,
  });
  const [newImages, setNewImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const { data } = await supabase.from("listings").select("*").eq("id", id).single();
      if (data) setListing(data);
    };
    fetchListing();
  }, [id]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setListing((prevListing) => ({
      ...prevListing,
      category,
      type: category === "Commercial" ? commercialTypes[0] : residentialTypes[0],
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setListing((prevListing) => ({
      ...prevListing,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let uploadedImages: string[] = [...listing.image_urls];

    if (newImages && newImages.length > 0) {
      const imageUploads = await Promise.all(
        Array.from(newImages).map(async (file) => {
          const { data, error } = await supabase.storage
            .from("property-images")
            .upload(`properties/${id}/${file.name}`, file, { upsert: true });

          return data ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/property-images/${data.path}` : null;
        })
      );
      uploadedImages = [...imageUploads.filter((img): img is string => img !== null), ...uploadedImages];
    }

    const { error } = await supabase
      .from("listings")
      .update({ ...listing, image_urls: uploadedImages.slice(0, 10) }) // Limit to 10 images
      .eq("id", id);

    if (error) {
      console.error("Error updating listing:", error);
    } else {
      router.push("/admin/listings");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen justify-center items-center">
      <form onSubmit={handleUpdate} className="p-6 bg-white shadow-md rounded w-full max-w-lg text-black">
        <h2 className="text-xl font-bold mb-4">Edit Listing</h2>

        <label>Title</label>
        <input type="text" name="title" value={listing.title} onChange={handleInputChange} className="w-full p-2 border rounded mb-3" required />

        <label>Category</label>
        <select name="category" value={listing.category} onChange={handleCategoryChange} className="w-full p-2 border rounded mb-3">
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
        </select>

        <label>Property Type</label>
        <select name="type" value={listing.type} onChange={handleInputChange} className="w-full p-2 border rounded mb-3">
          {listing.category === "Commercial"
            ? commercialTypes.map((type) => <option key={type} value={type}>{type}</option>)
            : residentialTypes.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>

        <label>City</label>
        <select name="city" value={listing.city} onChange={handleInputChange} className="w-full p-2 border rounded mb-3">
          {cities.map((city) => <option key={city} value={city}>{city}</option>)}
        </select>

        <label>Builder</label>
        <input type="text" name="builder" value={listing.builder} onChange={handleInputChange} className="w-full p-2 border rounded mb-3" required />

        <label>Price</label>
        <input type="number" name="price" value={listing.price} onChange={handleInputChange} className="w-full p-2 border rounded mb-3" required />

        <label>Bedrooms</label>
        <input type="number" name="bedrooms" value={listing.bedrooms} onChange={handleInputChange} className="w-full p-2 border rounded mb-3" required />

        <label>Bathrooms</label>
        <input type="number" name="bathrooms" value={listing.bathrooms} onChange={handleInputChange} className="w-full p-2 border rounded mb-3" required />

        <label>Square Feet</label>
        <input type="number" name="square_feet" value={listing.square_feet} onChange={handleInputChange} className="w-full p-2 border rounded mb-3" required />

        <label>Furnished Status</label>
        <select name="furnished_status" value={listing.furnished_status} onChange={handleInputChange} className="w-full p-2 border rounded mb-3">
          {furnishedOptions.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>

        <label>Amenities</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {amenitiesList.map((amenity) => (
            <label key={amenity} className="flex items-center space-x-2">
              <input type="checkbox" checked={listing.amenities.includes(amenity)} onChange={() => {
                const updatedAmenities = listing.amenities.includes(amenity)
                  ? listing.amenities.filter((a) => a !== amenity)
                  : [...listing.amenities, amenity];
                setListing({ ...listing, amenities: updatedAmenities });
              }} />
              <span>{amenity}</span>
            </label>
          ))}
        </div>

        <label>Property Age (Years)</label>
        <input type="number" name="property_age" value={listing.property_age} onChange={handleInputChange} className="w-full p-2 border rounded mb-3" required />

        <label>Featured Property</label>
        <input type="checkbox" name="is_featured" checked={listing.is_featured} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mb-3" />

        <label>Description</label>
        <textarea name="description" value={listing.description} onChange={handleInputChange} className="w-full p-2 border rounded mb-3" required />

        <label>Images</label>
        <input type="file" multiple onChange={(e) => setNewImages(e.target.files)} className="w-full p-2 border rounded mb-3" />

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
}
