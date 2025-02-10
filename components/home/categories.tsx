"use client";

import Image from "next/image";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Categories() {
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Commercial");

    const commercialProperties = [
        {
            id: 1,
            name: "Food Courts",
            description: "Discover prime food courts perfect for dining and socializing.",
            image: 'https://images.unsplash.com/photo-1504940892017-d23b9053d5d4?q=80&w=1947&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            gridClass: "col-span-1 sm:col-span-1 row-span-1 sm:row-span-1",
        },
        {
            id: 2,
            name: "Office Spaces",
            description: "Explore modern office spaces designed for productivity and growth.",
            image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            gridClass: "col-span-1 sm:col-span-1 row-span-1 sm:row-span-1",
        },
        {
            id: 3,
            name: "Multiplexes",
            description: "Experience top-notch multiplexes for entertainment and leisure.",
            image: 'https://images.unsplash.com/photo-1652512299040-b170d616eb26?q=80&w=2061&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            gridClass: "col-span-1 sm:col-span-1 row-span-1 sm:row-span-2",
        },
        {
            id: 4,
            name: "Retail Shops",
            description: "Find premium retail shops in bustling commercial areas.",
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            gridClass: "col-span-1 sm:col-span-2 row-span-1 sm:row-span-1",
        },
    ];

    const residentialProperties = [
        {
            id: 1,
            name: "Apartments",
            description: "Find modern apartments with all the amenities you need.",
            image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            gridClass: "col-span-1 sm:col-span-1 row-span-1 sm:row-span-1",
        },
        {
            id: 2,
            name: "Houses",
            description: "Explore spacious houses perfect for families.",
            image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            gridClass: "col-span-1 sm:col-span-1 row-span-1 sm:row-span-1",
        },
        {
            id: 3,
            name: "Villas",
            description: "Experience luxury living in our exclusive villas.",
            image: 'https://images.unsplash.com/photo-1623298317883-6b70254edf31?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            gridClass: "col-span-1 sm:col-span-1 row-span-1 sm:row-span-2",
        },
        {
            id: 4,
            name: "Studios",
            description: "Discover stylish studios perfect for singles and couples.",
            image: 'https://images.unsplash.com/photo-1449247613801-ab06418e2861?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            gridClass: "col-span-1 sm:col-span-2 row-span-1 sm:row-span-1",
        },
    ];

    const handleCategoryChange = (category: string) => {
        setLoading(true);
        setSelectedCategory(category);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="container mx-auto px-5 sm:px-4 py-16">
            <div className="flex flex-col sm:flex-row px-5 sm:px-20">
                <div className="flex flex-col w-full sm:w-1/2 gap-2">
                    <h2 className="text-4xl font-semibold">Discover Stylish Spaces and Inspiring Details</h2>
                    <div className="flex flex-row items-center gap-3">
                        <button
                            onClick={() => handleCategoryChange("Commercial")}
                            className={`group flex flex-row gap-3 ${selectedCategory === 'Commercial' ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/10'} rounded-full my-3 py-2 px-4 hover:px-6 text-center text-sm transition-all duration-500 w-max`}
                        >
                            Commercial
                        </button>
                        <button
                            onClick={() => handleCategoryChange("Residential")}
                            className={`group flex flex-row gap-3 ${selectedCategory === 'Residential' ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/10'} rounded-full my-3 py-2 px-4 hover:px-6 text-center text-sm transition-all duration-500 w-max`}
                        >
                            Residential
                        </button>
                    </div>
                </div>
                <div className="flex w-full sm:w-1/2">
                    <p className="text-zinc-500">
                    Explore a diverse range of property categories to find the perfect match for your needs, from residential to commercial spaces.
                    </p>
                </div>
            </div>

            <Separator className="w-4/5 mx-auto my-10" />

            {loading ? (
                <div className="flex items-center justify-center w-full min-h-96">
                    <LoaderCircle size={20} className="animate-spin" />
                </div>
            ) : (
                <div className="mx-0 sm:mx-40 grid grid-cols-1 sm:grid-cols-3 gap-2 auto-rows-[300px]">
                    {(selectedCategory === "Commercial" ? commercialProperties : residentialProperties).map((property) => (
                    <div key={property.id} className={`group relative overflow-hidden rounded-lg ${property.gridClass}`}>
                        <img
                            src={property.image || "/placeholder.svg"}
                            alt="Modern luxury property"
                            className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-500"
                        />
                        <div className="absolute z-50 top-0 flex flex-col p-3">
                            <p className="text-sm font-semibold text-white opacity-100 translate-y-0 group-hover:opacity-0 group-hover:translate-y-5 transition-all duration-250">{property.name}</p>
                        </div>
                        <div className="absolute z-50 bottom-0 flex flex-col bg-black/40 backdrop-blur-sm w-full py-3.5 px-3 opacity-0 group-hover:opacity-100 transition-all duration-250 border border-white/20">
                            <p className="text-sm font-medium text-white opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-250 delay-200">{property.name}</p>
                            <p className="text-xs text-zinc-400 opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-250 delay-300">{property.description}</p>
                        </div>
                        <Link href="#" className="absolute top-0 right-2 flex flex-row gap-2 bg-black rounded-full py-2 px-4 hover:px-6 my-2 text-center text-sm transition-all duration-500 text-white w-max group opacity-0 translate-y-5 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
                            Explore
                            <p className="rotate-45 group-hover:rotate-90 transition-all duration-500">&uarr;</p>
                        </Link>
                    </div>
                    ))}
                </div>
            )}
        </div>
    );
}

