"use client"

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import { Suspense, useEffect, useState } from "react";
import Search from "./search";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <>
            <div className="absolute z-10 top-1/4 flex sm:flex w-full">
                <div className="flex flex-col gap-5 sm:gap-10 mx-5 sm:mx-auto w-full sm:w-2/3">
                    <h1 className="text-white text-3xl sm:text-[3rem] font-medium drop-shadow-lg text-center sm:text-start">Find your dream property today</h1>
                    <Suspense>
                        <Search />
                    </Suspense>
                </div>
            </div>

            <div className={`relative flex h-[100vh] w-[100vw] bg-black overflow-hidden box-border transition-all ${isScrolled ? "p-10 pt-0 duration-1000" : "p-0 duration-500"}`}>
                <img
                    src="https://images.unsplash.com/photo-1465804575741-338df8554e02?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Background Image"
                    className={`w-full object-cover object-center transition-all duration-1000 ${isScrolled ? 'rounded-xl' : 'rounded-none'}`}
                />


                {/* <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="absolute bottom-5 right-16 w-full max-w-sm"
                >
                    <CarouselContent>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                                <Card className="bg-white/30 backdrop-blur-md border-white">
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                        <span className="text-3xl font-semibold text-white">{index + 1}</span>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel> */}
            </div>

            <div className="flex flex-row flex-wrap items-center justify-center gap-10 sm:gap-28 p-10 pb-20 bg-black">
                <div className="flex flex-col gap-1">
                    <p className="text-5xl font-semibold text-white">18<span className="text-red-500">K</span></p>
                    <p className="text-white/60 text-sm">Renters</p>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-5xl font-semibold text-white">100<span className="text-red-500">+</span></p>
                    <p className="text-white/60 text-sm">Specialists</p>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-5xl font-semibold text-white">78<span className="text-red-500">%</span></p>
                    <p className="text-white/60 text-sm">Yearly Growth</p>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-5xl font-semibold text-white">10<span className="text-red-500">K+</span></p>
                    <p className="text-white/60 text-sm">Properties</p>
                </div>
            </div>
        </>
    );
}