"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";

const commercialTypes = ["Food Court", "Office Space", "Retail Shops", "Multiplex"];
const residentialTypes = ["Apartment", "House", "Villa", "Studio"];
const cities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Other"];
const amenitiesList = ["Parking", "Gym", "Swimming Pool", "Security", "Play Area"];

export default function Search() {
    const router = useRouter();
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [city, setCity] = useState("");
    const [priceRange, setPriceRange] = useState([0, 100000000]);
    const [amenities, setAmenities] = useState<string[]>([]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const query = new URLSearchParams({
            category,
            type,
            city,
            minPrice: priceRange[0].toString(),
            maxPrice: priceRange[1].toString(),
            amenities: amenities.join(","),
        }).toString();
        router.push(`/listings?${query}`);
    };

    const toggleAmenity = (amenity: string) => {
        setAmenities((prevAmenities) =>
            prevAmenities.includes(amenity)
                ? prevAmenities.filter((a) => a !== amenity)
                : [...prevAmenities, amenity]
        );
    };

    return (
        <div className="flex p-3 mx-auto bg-white/30 backdrop-blur-md w-full shadow-lg">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-5 mx-auto py-3 px-3 pl-6 bg-white w-full shadow-lg">
                <div className="flex flex-col gap-5 w-full">
                    <div className="flex gap-3 w-full">
                        <select
                            id="category"
                            name="category"
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                setType(""); // Reset type when category changes
                            }}
                            className="block w-full p-2 border border-gray-300 rounded-full shadow-sm focus:ring-black focus:border-black sm:text-sm"
                        >
                            <option value="">Select Category</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Residential">Residential</option>
                        </select>
                        <select
                            id="type"
                            name="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="block w-full p-2 border border-gray-300 rounded-full shadow-sm focus:ring-black focus:border-black sm:text-sm"
                            disabled={!category}
                        >
                            <option value="">Select Type</option>
                            {category === "Commercial"
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
                        <select
                            id="city"
                            name="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="block w-full p-2 border border-gray-300 rounded-full shadow-sm focus:ring-black focus:border-black sm:text-sm"
                        >
                            <option value="">Select City</option>
                            {cities.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-5 w-full">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="amenities" className="block text-sm font-semibold text-gray-700">Amenities</label>
                            <div className="mt-1 flex flex-wrap sm:flex-nowrap gap-1">
                                {amenitiesList.map((amenity) => (
                                    <div
                                        key={amenity}
                                        onClick={() => toggleAmenity(amenity)}
                                        className={`w-max text-xs cursor-pointer px-3 py-1 rounded-full transition-all
                                    ${amenities.includes(amenity) ? "bg-black text-white" : "bg-zinc-100 text-black hover:bg-black/10"}
                                `}
                                    >
                                        {amenity}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="price" className="block text-sm font-semibold text-gray-700">Price Range</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    id="minPrice"
                                    name="minPrice"
                                    value={priceRange[0]}
                                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                    className="block w-full p-2 border border-gray-300 rounded-full shadow-sm focus:ring-black focus:border-black sm:text-sm"
                                    placeholder="Min Price"
                                />
                                <p className="font-semibold text-black/50">-</p>
                                <input
                                    type="number"
                                    id="maxPrice"
                                    name="maxPrice"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                    className="block w-full p-2 border border-gray-300 rounded-full shadow-sm focus:ring-black focus:border-black sm:text-sm"
                                    placeholder="Max Price"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <button type="submit" className="flex items-center justify-center h-full w-max aspect-square bg-black text-white font-semibold shadow-sm hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-500">
                    <SearchIcon size={40} strokeWidth={2} />
                </button>
            </form>
        </div>
    );
}