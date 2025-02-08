"use client";

import { useEffect, useState } from "react";
import { Warehouse } from "lucide-react";
import Link from "next/link";
import GetinTouchModal from "../common/getintouch";

const links = [
  {
    name: "About Us",
    href: "/about"
  },
  {
    name: "Projects",
    href: "/listings?category=Commercial&type=&city=&minPrice=0&maxPrice=100000000&amenities="
  },
  {
    name: "Properties",
    href: "/listings?category=Residential&type=&city=&minPrice=0&maxPrice=100000000&amenities="
  }
]

export default function Navbar() {
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
    <nav className={`fixed top-0 left-0 z-50 w-full flex flex-row items-center justify-between transition-all duration-1000 bg-gradient-to-b from-black/50 to-transparent ${isScrolled ? "py-2 px-3 text-black" : "py-4 px-5 text-white"}`}>
      <div className="fixed top-0 left-0 z-40 flex h-28 w-full bg-transparent backdrop-blur-sm [mask-image:linear-gradient(to_bottom,white,transparent)] transition-all duration-1000"></div>
      <div className="flex z-50 w-full flex-row items-center justify-between">
        <a href="/">
          <div className="flex flex-row items-center gap-2 w-max opacity-100">
            {/* <img src={logo.src} alt="Logo" className="h-8 invert drop-shadow-md" /> */}
            <img src='https://web.archive.org/web/20211205032847im_/http://www.1o1realtor.com/static/img/LogoWhite.png' alt="Logo" className={`h-5 sm:h-10 ${isScrolled ? 'invert' : ''} drop-shadow-md transition-all duration-500`} />
            {/* <div className="flex rounded-md w-12 h-12 aspect-square bg-zinc-900"></div> */}

            <div className={`hidden sm:flex flex-col ${isScrolled ? 'w-0' : 'w-full'} overflow-hidden transition-all duration-1000`}>
              <h1 className="text-xl whitespace-nowrap drop-shadow-md">1o1 Realtor</h1>
              <p className="text-sm whitespace-nowrap drop-shadow-md">Find your perfect home</p>
            </div>
          </div>
        </a>

        <div className="flex items-center gap-4">
          {links.map((link) => (
            <div key={link.name} className="group hidden sm:flex flex-col">
              <Link href={link.href}>
                {link.name}
              </Link>
              <div className={`flex h-[1px] w-0 group-hover:w-full ${isScrolled ? 'bg-black' : 'bg-white'} transition-all duration-500`}></div>
            </div>
          ))}
          {/* <Link href="#" className="flex flex-row gap-2 bg-black rounded-full py-2 px-4 hover:px-6 my-2 text-center text-sm transition-all duration-500 text-white w-max group">
            Get in touch
            <p className="rotate-45 group-hover:rotate-90 transition-all duration-500">&uarr;</p>
          </Link> */}
          <GetinTouchModal />
        </div>
      </div>
    </nav>
  );
}