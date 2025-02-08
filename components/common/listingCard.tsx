import React from 'react';
import Link from 'next/link';
import { MapPinHouse, Bed, ShowerHead, Scaling } from 'lucide-react';

type Listing = {
    id: number;
    title: string;
    city: string;
    price: number;
    image_urls: string[];
    bedrooms: number;
    bathrooms: number;
    square_feet: number;
};

type ListingCardProps = {
    listing: Listing;
};

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
    return (
        <div key={listing.id} className="group bg-white min-w-96 max-w-96 border transition-all hover:shadow-xl">
            <img src={listing.image_urls[0]} alt={listing.title} className="w-full h-40 object-cover rounded" />
            <div className="flex flex-row items-start justify-between gap-4 p-3 w-full">
                <div className="flex flex-1 flex-col">
                    <h2 className="w-full text-xl font-bold overflow-hidden text-ellipsis whitespace-nowrap">
                        {listing.title}
                    </h2>
                    <div className="flex flex-row items-center gap-1">
                        <MapPinHouse size={10} className="text-zinc-500" />
                        <p className="text-xs text-zinc-500">{listing.city}</p>
                    </div>
                </div>
                <div className="flex flex-col">
                    <p className="text-xs text-zinc-500">Starting from</p>
                    <p className="text-black font-semibold">&#8377;{listing.price}</p>
                </div>
            </div>
            <div className="flex flex-row gap-2 py-1 px-3">
                <div className="flex flex-col">
                    <div className="flex flex-row items-center gap-1">
                        <Bed size={14} strokeWidth={3} />
                        <p className="text-sm font-semibold">{listing.bedrooms}</p>
                    </div>
                    <p className="text-xs text-zinc-600 font-medium">{listing.bedrooms > 1 ? 'Bedrooms' : 'Bedroom'}</p>
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-row items-center gap-1">
                        <ShowerHead size={14} strokeWidth={3} />
                        <p className="text-sm font-semibold">{listing.bathrooms}</p>
                    </div>
                    <p className="text-xs text-zinc-600 font-medium">{listing.bathrooms > 1 ? 'Bathrooms' : 'Bathroom'}</p>
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-row items-center gap-1">
                        <Scaling size={14} strokeWidth={3} />
                        <p className="text-sm font-semibold">{listing.square_feet}</p>
                    </div>
                    <p className="text-xs text-zinc-600 font-medium">Sq. Ft.</p>
                </div>
            </div>
            <Link href={`property/${listing.id}`} className="group flex flex-row gap-3 bg-black my-3 mx-3 py-2 px-4 hover:px-6 text-center text-sm transition-all duration-500 text-white w-max translate-y-5 opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
                Explore Property
                <p className="rotate-45 group-hover:rotate-90 transition-all duration-500">&uarr;</p>
            </Link>
        </div>
    );
};

export default ListingCard;