"use client"

import React from 'react';
import Image from "next/image"
import Link from 'next/link';
import useInView from '@/hooks/useInView';

const CTA: React.FC = () => {
  const [ctaRef, isVisible] = useInView(0.1, 500); // Adjust the delay as needed

  return (
    <div className="container mx-auto p-5 sm:p-10">
      <div className="relative w-full bg-red-500 h-[40rem] max-h-[100rem] sm:h-[27.5rem] sm:max-h-[27.5rem] overflow-hidden rounded-3xl aspect-[2/1]">
        <img
          src="https://images.unsplash.com/photo-1567428485548-c499e4931c10?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Luxury modern property with electric vehicle"
          className="object-cover sm:-translate-y-1/3 h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />

        <div
          ref={ctaRef}
          className={`absolute m-3 sm:m-0 sm:right-5 bottom-0 sm:bottom-5 flex flex-col gap-2 max-w-[600px] bg-white/70 backdrop-blur-md p-7 rounded-2xl transition-opacity duration-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h2 className="text-2xl leading-tight font-bold text-black">
            What Makes Us Your Ideal Real Estate Partner?
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Our knowledgeable team provides trusted expertise for informed real estate decisions, offering tailored
            support to meet your unique needs and demonstrating proven success through a strong track record of client
            satisfaction.
          </p>
          <Link href="#" className="flex flex-row gap-2 bg-black rounded-full py-2 px-4 hover:px-6 my-2 text-center text-sm transition-all duration-500 text-white w-max group">
            Get in touch
            <p className="rotate-45 group-hover:rotate-90 transition-all duration-500">&uarr;</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CTA;
