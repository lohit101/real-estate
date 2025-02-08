"use client";
import { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/home/navbar";
import ListingsComponent from "@/components/listings/listingsComponent";

export default function Listings() {

  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <ListingsComponent />
      </Suspense>
    </>
  );
}