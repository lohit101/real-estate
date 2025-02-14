"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, SearchIcon } from "lucide-react";

const commercialTypes = ["Food Court", "Office Space", "Retail Shops", "Multiplex", "Service Apartment", "Restaurant"];
const residentialTypes = ["Apartment", "House", "Villa", "Studio"];
const cities = ["Gurgaon", "Sohna", "Dwarka", "Delhi", "Jhajjar", "Kharkhoda", "Mumbai", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivli", "Vasai-Virar", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur", "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh", "Solapur", "Hubli-Dharwad", "Mysore", "Tiruchirappalli", "Bareilly", "Aligarh", "Tiruppur", "Moradabad", "Jalandhar", "Bhubaneswar", "Salem", "Warangal", "Guntur", "Bhiwandi", "Saharanpur", "Gorakhpur", "Bikaner", "Amravati", "Noida", "Jamshedpur", "Bhilai", "Cuttack", "Firozabad", "Kochi", "Nellore", "Bhavnagar", "Dehradun", "Durgapur", "Asansol", "Rourkela", "Nanded", "Kolhapur", "Ajmer", "Akola", "Gulbarga", "Jamnagar", "Ujjain", "Loni", "Siliguri", "Jhansi", "Ulhasnagar", "Jammu", "Sangli-Miraj & Kupwad", "Mangalore", "Erode", "Belgaum", "Ambattur", "Tirunelveli", "Malegaon", "Gaya", "Jalgaon", "Udaipur", "Maheshtala", "Davanagere", "Kozhikode", "Kurnool", "Rajpur Sonarpur", "Bokaro", "South Dumdum", "Bellary", "Patiala", "Gopalpur", "Agartala", "Bhagalpur", "Muzaffarnagar", "Bhatpara", "Panihati", "Latur", "Dhule", "Rohtak", "Korba", "Bhilwara", "Brahmapur", "Muzaffarpur", "Ahmednagar", "Mathura", "Kollam", "Avadi", "Kadapa", "Kamarhati", "Sambalpur", "Bilaspur", "Shahjahanpur", "Satara", "Bijapur", "Rampur", "Shimoga", "Chandrapur", "Junagadh", "Thrissur", "Alwar", "Bardhaman", "Kulti", "Kakinada", "Nizamabad", "Parbhani", "Tumkur", "Khammam", "Ozhukarai", "Bihar Sharif", "Panipat", "Darbhanga", "Bally", "Aizawl", "Dewas", "Ichalkaranji", "Tirupati", "Karnal", "Bathinda", "Jalna", "Eluru", "Barasat", "Kirari Suleman Nagar", "Purnia", "Satna", "Mau", "Sonipat", "Farrukhabad", "Sagar", "Rourkela Industrial Township", "Durg", "Imphal", "Ratlam", "Hapur", "Arrah", "Karimnagar", "Anantapur", "Etawah", "Ambarnath", "North Dumdum", "Bharatpur", "Begusarai", "New Delhi", "Gandhidham", "Baranagar", "Tiruvottiyur", "Pondicherry", "Sikar", "Thoothukudi", "Rewa", "Mirzapur", "Raichur", "Pali", "Ramagundam", "Silchar", "Haridwar", "Vijayanagaram", "Tenali", "Nagercoil", "Sri Ganganagar", "Karawal Nagar", "Mango", "Thanjavur", "Bulandshahr", "Uluberia", "Katni", "Sambhal", "Singrauli", "Nadiad", "Secunderabad", "Naihati", "Yamunanagar", "Bidhannagar", "Pallavaram", "Bidar", "Munger", "Panchkula", "Burhanpur", "Raurkela", "Kharagpur", "Dindigul", "Gandhinagar", "Hospet", "Nangloi Jat", "Malda", "Ongole", "Deoghar", "Chapra", "Haldia", "Khandwa", "Nandyal", "Morena", "Amroha", "Anand", "Bhind", "Bhalswa Jahangir Pur", "Madhyamgram", "Bhiwani", "Berhampur", "Ambala", "Morbi", "Fatehpur", "Raebareli", "Khora", "Chittoor", "Bhusawal", "Orai", "Bahraich", "Phusro", "Vellore", "Mehsana", "Raiganj", "Sirsa", "Danapur", "Serampore", "Sultan Pur Majra", "Guna", "Jaunpur", "Panvel", "Shivpuri", "Surendranagar Dudhrej", "Unnao", "Chinsurah", "Alappuzha", "Kottayam", "Machilipatnam", "Shimla", "Adoni", "Udupi", "Katihar", "Proddatur", "Mahbubnagar", "Saharsa", "Dibrugarh", "Jorhat", "Hazaribagh", "Hindupur", "Nagaon", "Sasaram", "Hajipur", "Giridih", "Bhimavaram", "Kumbakonam", "Dehri", "Madanapalle", "Siwan", "Bettiah", "Guntakal", "Srikakulam", "Motihari", "Dharmavaram", "Medininagar", "Gudivada", "Phagwara", "Pudukkottai", "Chittoor", "Suryapet", "Miryalaguda", "Tadipatri", "Karaikudi", "Kishanganj", "Jamalpur", "Ballia", "Kavali", "Tadepalligudem", "Amalapuram", "Buxar", "Tezpur", "Jehanabad", "Aurangabad", "Gangtok", "Karaikal", "Hosur", "Nagapattinam", "Port Blair", "Neyveli", "Kavaratti", "Kagaznagar", "Kandukur", "Mandapeta", "Tanuku", "Rayachoti", "Kavali", "Tadepalligudem", "Amalapuram", "Buxar", "Tezpur", "Jehanabad", "Aurangabad", "Gangtok", "Karaikal", "Hosur", "Nagapattinam", "Port Blair", "Neyveli", "Kavaratti", "Kagaznagar", "Kandukur", "Mandapeta", "Tanuku", "Rayachoti"];
const amenitiesList = ["Parking", "Gym", "Swimming Pool", "Security", "Play Area"];
const priceRanges = [
    { label: "40Lacs - 1Cr", value: [4000000, 10000000] },
    { label: "1Cr - 2Cr", value: [10000000, 20000000] },
    { label: "2Cr - 5Cr", value: [20000000, 50000000] },
    { label: "5Cr - 10Cr", value: [50000000, 100000000] },
];

export default function Search() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [city, setCity] = useState("");
    const [priceRange, setPriceRange] = useState<number[]>([0, 100000000]);
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
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-5 mx-auto py-3 px-3 sm:pl-6 bg-white w-full shadow-lg">
                <div className="flex flex-col gap-5 w-full">
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
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
                    <div className="flex flex-col-reverse sm:flex-row gap-5 w-full">
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

                        <div className="flex flex-col gap-2 w-full">
                            <label htmlFor="price" className="block text-sm font-semibold text-gray-700">Price Range</label>
                            <select
                                id="price"
                                name="price"
                                value={priceRange.join("-")}
                                onChange={(e) => setPriceRange(priceRanges.find(range => range.label === e.target.value)?.value || [0, 100000000])}
                                className="block w-full p-2 border border-gray-300 rounded-full shadow-sm focus:ring-black focus:border-black sm:text-sm"
                            >
                                <option value="">Select Price Range</option>
                                {priceRanges.map((range) => (
                                    <option key={range.label} value={range.label}>
                                        {range.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <button onClick={() => setLoading(true)} type="submit" className="flex items-center justify-center h-max sm:h-full w-full sm:w-max sm:aspect-square bg-black text-white font-semibold p-3 sm:p-0 shadow-sm hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-500">
                    {/* Button for desktop */}
                    <div className="hidden sm:flex">
                        {loading ?
                            <LoaderCircle size={40} strokeWidth={2} className="animate-spin" />
                            :
                            <SearchIcon size={40} strokeWidth={2} />
                        }
                    </div>

                    {/* Button for mobile */}
                    <div className="flex sm:hidden gap-2">
                        {loading ?
                            <LoaderCircle size={25} strokeWidth={2.5} className="animate-spin" />
                            :
                            <SearchIcon size={25} strokeWidth={2.5} />
                        }
                        {loading ?
                            <p className="text-xl font-medium">Searching...</p>
                            :
                            <p className="text-xl font-medium">Search</p>
                        }
                    </div>
                </button>
            </form>
        </div>
    );
}