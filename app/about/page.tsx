import Image from "next/image"
import Link from "next/link"
import { Play, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/home/navbar"
import Footer from "@/components/common/footer"

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-white text-black">
                {/* Hero Section with Wave Background */}
                <div className="relative h-[300px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1575041051612-323e644ca1b8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center" />
                    <div className="relative z-10 text-center space-y-4">
                        <h1 className="text-5xl font-bold text-white">About Us</h1>
                        <nav className="flex items-center justify-center gap-2 text-sm text-white">
                            <Link href="/" className="hover:text-gray-300">
                                Home
                            </Link>
                            <span>/</span>
                            <span>About Us</span>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-5 sm:px-20 py-16">
                    <div className="grid lg:grid-cols-2 gap-16">
                        {/* Left Column */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-6 bg-red-500" />
                                    <span className="text-sm tracking-wider">OUR STORY</span>
                                </div>
                                <h2 className="text-4xl font-bold leading-tight">
                                    Your Vision. Our Expertise.{" "}
                                    <span className="text-red-500">Your Success.</span>
                                </h2>
                            </div>

                            <div className="relative aspect-video overflow-hidden rounded-lg">
                                <img
                                    src="https://images.unsplash.com/photo-1561223369-6e4b5e790972?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    alt="Display"
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative aspect-video rounded-lg overflow-hidden group">
                                    <img
                                        src="https://images.unsplash.com/photo-1516259657995-80d1e36154b5?q=80&w=1838&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt="Tech workspace"
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40" />
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <Badge variant="secondary">Residential</Badge>
                                    </div>
                                </div>
                                <div className="relative aspect-video rounded-lg overflow-hidden group">
                                    <img
                                        src="https://images.unsplash.com/photo-1618423771880-2bcfa6b67c89?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt="Team meeting"
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40" />
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <Badge variant="secondary">Commercial</Badge>
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-400">
                                With our extensive knowledge of the real estate market and expertise across numerous projects, 1O1 Realtor is your go-to solution for all real estate investment decisions. Embark on a journey with us, full of endless possibilities. We offer a wide range of investment options to match your financial goals, whether you're looking for growth, stability, or a diverse portfolio. We're dedicated to helping you shape your financial future just the way you envision it. Your goals, dreams, and choices matter to us – we’re here to make them a reality. We have a proven track record of selecting top-notch projects, ensuring seamless transactions, providing post-sales support, and delivering projects at competitive rates.
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                {[
                                    { number: "10", accent: "K+", label: "Completed Projects" },
                                    { number: "15", accent: "K", label: "Satisfied Customers" },
                                    { number: "10", accent: "+", label: "Years Of Mastery" },
                                    { number: "45", accent: "+", label: "Worldwide Honors" },
                                ].map((stat) => (
                                    <div key={stat.label} className="text-center">
                                        <div className="text-3xl font-bold mb-2 text-gray-800">{stat.number}<span className="text-red-500">{stat.accent}</span></div>
                                        <div className="text-sm text-gray-400">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Team and Watch Intro */}
                            <div className="flex flex-row items-center gap-3">
                                <div className="flex -space-x-4">
                                    {["https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?q=80&w=2053&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"].map((img) => (
                                        <div key={img} className="w-10 h-10 rounded-full border-2 border-black overflow-hidden">
                                            <img
                                                src={img}
                                                alt={`Our member`}
                                                className="h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex flex-col">
                                        <div className="flex">
                                            <Star className="text-yellow-500" fill="gold" size={12} />
                                            <Star className="text-yellow-500" fill="gold" size={12} />
                                            <Star className="text-yellow-500" fill="gold" size={12} />
                                            <Star className="text-yellow-500" fill="gold" size={12} />
                                            <Star className="text-yellow-500" fill="gold" size={12} />
                                        </div>
                                        <p className="text-xs font-medium">4.5 Stars</p>
                                    </div>
                                    <p className="text-xs text-gray-600">32k+ Ratings</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

