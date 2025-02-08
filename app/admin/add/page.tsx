"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const commercialTypes = ["Food Court", "Office Space", "Retail Shops", "Multiplex"];
const residentialTypes = ["Apartment", "House", "Villa", "Studio"];
const cities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Other"];
const furnishedOptions = ["Fully Furnished", "Semi-Furnished", "Unfurnished"];
const amenitiesList = ["Parking", "Gym", "Swimming Pool", "Security", "Play Area"];

export default function AddProperty() {
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
    is_featured: false, // New field for featured property
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setListing((prevListing) => ({
      ...prevListing,
      category,
      type: category === "Commercial" ? commercialTypes[0] : residentialTypes[0],
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setListing((prevListing) => ({
      ...prevListing,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async () => {
    const imageUrls: string[] = [];
    for (const file of imageFiles) {
      const { data, error } = await supabase.storage
        .from("property-images")
        .upload(`${Date.now()}-${file.name}`, file);
      if (data) {
        console.log(data);
        const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/property-images/${data.path}`;
        imageUrls.push(publicUrl);
      }
    }
    return imageUrls.slice(0, 10); // Limit to 10 images
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const imageUrls = await handleImageUpload();
    const { error } = await supabase.from("listings").insert([{
      ...listing,
      image_urls: imageUrls,
    }]);

    if (error) {
      console.error("Error adding property:", error);
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={listing.title}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <select
          id="category"
          name="category"
          value={listing.category}
          onChange={handleCategoryChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
        <select
          id="type"
          name="type"
          value={listing.type}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {listing.category === "Commercial"
            ? commercialTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))
            : residentialTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          id="price"
          name="price"
          value={listing.price}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          value={listing.description}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
        <select
          id="city"
          name="city"
          value={listing.city}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="builder" className="block text-sm font-medium text-gray-700">Builder</label>
        <input
          type="text"
          id="builder"
          name="builder"
          value={listing.builder}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Bedrooms</label>
        <input
          type="number"
          id="bedrooms"
          name="bedrooms"
          value={listing.bedrooms}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Bathrooms</label>
        <input
          type="number"
          id="bathrooms"
          name="bathrooms"
          value={listing.bathrooms}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="square_feet" className="block text-sm font-medium text-gray-700">Square Feet</label>
        <input
          type="number"
          id="square_feet"
          name="square_feet"
          value={listing.square_feet}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="furnished_status" className="block text-sm font-medium text-gray-700">Furnished Status</label>
        <select
          id="furnished_status"
          name="furnished_status"
          value={listing.furnished_status}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {furnishedOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="amenities" className="block text-sm font-medium text-gray-700">Amenities</label>
        <div className="mt-1 grid grid-cols-2 gap-2">
          {amenitiesList.map((amenity) => (
            <div key={amenity} className="flex items-center">
              <input
                type="checkbox"
                id={amenity}
                name="amenities"
                value={amenity}
                checked={listing.amenities.includes(amenity)}
                onChange={(e) => {
                  const { checked, value } = e.target;
                  setListing((prevListing) => ({
                    ...prevListing,
                    amenities: checked
                      ? [...prevListing.amenities, value]
                      : prevListing.amenities.filter((amenity) => amenity !== value),
                  }));
                }}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor={amenity} className="ml-2 block text-sm text-gray-700">
                {amenity}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="property_age" className="block text-sm font-medium text-gray-700">Property Age</label>
        <input
          type="number"
          id="property_age"
          name="property_age"
          value={listing.property_age}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="is_featured" className="block text-sm font-medium text-gray-700">Featured Property</label>
        <input
          type="checkbox"
          id="is_featured"
          name="is_featured"
          checked={listing.is_featured}
          onChange={handleInputChange}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="images" className="block text-sm font-medium text-gray-700">Images</label>
        <input
          type="file"
          id="images"
          multiple
          onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Add Property
      </button>
    </form>
  );
}