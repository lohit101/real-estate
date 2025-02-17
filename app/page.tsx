// "use client";

import Cta from "@/components/common/cta";
import Footer from "@/components/common/footer";
import GetinTouchModal from "@/components/common/getintouch";
import WhatsappBtn from "@/components/common/whatsappBtn";
import Categories from "@/components/home/categories";
import { Faq } from "@/components/home/faq";
import Featured from "@/components/home/featured";
import Header from "@/components/home/header";
import Highlights from "@/components/home/highlights";
import Navbar from "@/components/home/navbar";

export default function Home() {
  return (
    <div className="font-monsterrat">
      <WhatsappBtn />
      <Navbar />
      {/* <GetinTouchModal /> */}
      <Header />
      <div className="flex sm:px-20">
        <Featured />
      </div>
      <Highlights />
      <Cta />
      <Categories />
      <Faq />
      <Footer />
    </div>
  )
}