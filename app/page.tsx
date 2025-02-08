// "use client";

import Cta from "@/components/common/cta";
import GetinTouchModal from "@/components/common/getintouch";
import Categories from "@/components/home/categories";
import { Faq } from "@/components/home/faq";
import Featured from "@/components/home/featured";
import Header from "@/components/home/header";
import Highlights from "@/components/home/highlights";
import Navbar from "@/components/home/navbar";

export default function Home() {
  return (
    <div className="font-monsterrat">
      <Navbar />
      {/* <GetinTouchModal /> */}
      <Header />
      <Featured />
      <Highlights />
      <Cta />
      <Categories />
      <Faq />
    </div>
  )
}