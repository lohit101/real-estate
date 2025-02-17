"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Share2, Heart, Scaling, ShowerHead, Bed, MapPinHouse, LoaderCircle, Star, Clock } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import Featured from "@/components/home/featured";
import { Separator } from "@/components/ui/separator";

type Listing = {
  id: number;
  title: string;
  type: string;
  price: number;
  description: string;
  image_urls: string[];
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  city: string;
  property_age: string;
  is_featured: boolean;
};

export default function PropertyListing() {
  const { id } = useParams();
  const [property, setProperty] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("messages").insert([{ name, email, message }]);

    if (error) {
      console.error("Error submitting message:", error);
    } else {
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!id) return;
    const fetchProperty = async () => {
      let { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();
      if (!error) setProperty(data as Listing);
      setLoading(false);
    };
    fetchProperty();
  }, [id]);

  const handleShare = async () => {
    const url = window.location.href;
    const title = property?.title || "Property Listing";
    const text = `Check out this property: ${title}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      } catch (error) {
        console.error("Error copying to clipboard:", error);
      }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <LoaderCircle size={20} className="animate-spin" />
    </div>
  );
  if (!property) return <p className="text-center text-red-500">Property not found.</p>;

  return (
    <>
      <div className="container mx-auto p-4 md:p-6 mt-16 sm:mt-20 sm:w-[90%]">
        <img
          src={property.image_urls[0]}
          alt="Property exterior"
          className="absolute z-10 left-0 top-0 w-full h-full object-cover rounded-lg blur-xl opacity-40"
        />
        <div className="relative z-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-5">
            {/* Image Gallery */}
            <div className="relative rounded-lg overflow-hidden">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-3">
                  <img
                    src={property.image_urls[0]}
                    alt="Property exterior"
                    className="w-full h-[400px] object-cover rounded-lg"
                  />
                  <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded-full text-sm flex flex-row items-center gap-1">
                    <MapPinHouse size={14} strokeWidth={2} className="text-black" />
                    <p>{property.city}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col bg-white rounded-xl py-3 px-5 gap-3">
              {/* Property Title and Stats */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-semibold">{property.title}</h1>
                  {property.is_featured && (
                    <div className="flex items-center gap-1 bg-gradient-to-br from-purple-600 to-purple-700 rounded-md py-1 px-2 text-white w-max">
                      <Star size={10} fill="white" />
                      <p className="text-white text-[0.55rem] font-medium uppercase">This is a featured property</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-4">
                  <button onClick={handleShare} className="p-2 hover:bg-gray-100 rounded-full">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Property Stats */}
              <div className="flex flex-row gap-10 py-1">
                <div className="flex flex-col opacity-100 transition-all">
                  <div className="flex flex-row items-center gap-1">
                    <Bed size={14} strokeWidth={3} />
                    <p className="text-sm font-semibold">{property.bedrooms}</p>
                  </div>
                  <p className="text-xs text-zinc-600 font-medium">{property.bedrooms > 1 ? 'Bedrooms' : 'Bedroom'}</p>
                </div>
                <div className="flex flex-col opacity-100 transition-all duration-500 delay-200">
                  <div className="flex flex-row items-center gap-1">
                    <ShowerHead size={14} strokeWidth={3} />
                    <p className="text-sm font-semibold">{property.bathrooms}</p>
                  </div>
                  <p className="text-xs text-zinc-600 font-medium">{property.bathrooms > 1 ? 'Bathrooms' : 'Bathroom'}</p>
                </div>
                <div className="flex flex-col opacity-100 transition-all duration-500 delay-300">
                  <div className="flex flex-row items-center gap-1">
                    <Scaling size={14} strokeWidth={3} />
                    <p className="text-sm font-semibold">{property.square_feet}</p>
                  </div>
                  <p className="text-xs text-zinc-600 font-medium">Sq. Ft.</p>
                </div>
              </div>

              {/* Property Age */}
              <div className="flex flex-row items-center gap-2 bg-zinc-200 py-1 px-2 pr-10 rounded-full w-max">
                <Clock size={30} strokeWidth={2} className="text-zinc-600" />
                <div className="flex flex-col">
                  <p className="text-zinc-600 text-[0.55rem]">This property is</p>
                  <p className="text-black font-semibold">{property.property_age}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="border-b w-full justify-start rounded-none h-auto p-0 bg-transparent">
                <div className="flex bg-white w-max rounded-t-xl py-1 px-2 pb-0">
                  <TabsTrigger
                    value="overview"
                    className="drop-shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent"
                  >
                    OVERVIEW
                  </TabsTrigger>
                  <TabsTrigger
                    value="amenities"
                    className="drop-shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent"
                  >
                    AMENITIES
                  </TabsTrigger>
                </div>
              </TabsList>

              <div className="flex bg-white rounded-b-xl rounded-tr-xl px-5 pb-4">
                <TabsContent value="overview" className="mt-6">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Description</h2>
                      <p className="text-gray-600">{property.description}</p>
                    </div>

                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Property Age</h2>
                      <div className="flex items-center gap-2 bg-zinc-200 w-max py-2 px-3 rounded-full">
                        <span className="text-xs font-semibold text-gray-600">{property.property_age}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Everything you need for a perfect stay</h2>
                      <div className="flex flex-wrap gap-4">
                        {property.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center gap-2 bg-zinc-200 w-max py-2 px-3 rounded-full">
                            <span className="text-xs font-semibold text-gray-600">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="amenities" className="mt-6">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Amenities</h2>
                      <div className="flex flex-wrap gap-4">
                        {property.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center gap-2 bg-zinc-200 w-max py-2 px-3 rounded-full">
                            <span className="text-xs font-semibold text-gray-600">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Contact Form */}
          <div className="sm:sticky sm:top-20 flex flex-col border border-black/10 rounded-xl p-5 h-max shadow-lg mt-16 sm:mt-0 bg-white">
            <div className="flex flex-col gap-1">
              <p className="text-xl font-semibold">Have more questions about this property?</p>
              <p className="text-md font-semibold text-zinc-500">Get in touch with us.</p>
            </div>
            <Separator className="my-4" />
            <form className="w-full" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-full"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor="email" className="text-right">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-full"
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Label htmlFor="message" className="text-right">
                    Message
                  </Label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="col-span-3 border border-gray-200 rounded-2xl text-sm p-2 w-full"
                    placeholder="Your message here"
                    required
                    rows={5}
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} className="cursor-pointer flex flex-row gap-2 bg-black rounded-full py-2 px-4 hover:px-6 my-2 text-center text-sm transition-all duration-500 text-white w-max group">
                {loading ? "Sending..." : "Send Message"}
                <p className="rotate-45 group-hover:rotate-90 transition-all duration-500">&uarr;</p>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}