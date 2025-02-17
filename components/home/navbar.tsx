"use client";

import { useEffect, useState } from "react";
import { Warehouse, X } from "lucide-react";
import Link from "next/link";
import GetinTouchModal from "../common/getintouch";
import { Separator } from "../ui/separator";

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
  const [menuOpen, setMenuOpen] = useState(false);

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
    <nav className={`fixed top-0 left-0 z-40 w-full flex flex-row items-center justify-between transition-all duration-1000 bg-gradient-to-b from-black/50 to-transparent ${isScrolled ? "py-4 px-3" : "py-4 px-5"}`}>
      <div className="fixed top-0 left-0 z-30 flex h-28 w-full bg-transparent backdrop-blur-sm [mask-image:linear-gradient(to_bottom,white,transparent)] transition-all duration-1000"></div>
      <div className="flex z-50 w-full flex-row items-center justify-between">
        <a href="/">
          <div className="flex flex-row items-center gap-2 w-max opacity-100">
            {/* <img src={logo.src} alt="Logo" className="h-8 invert drop-shadow-md" /> */}
            <img src='https://web.archive.org/web/20211205032847im_/http://www.1o1realtor.com/static/img/LogoWhite.png' alt="Logo" className={`h-5 sm:h-10 ${isScrolled ? 'invert' : ''} drop-shadow-md transition-all duration-500`} />
            {/* <div className="flex rounded-md w-12 h-12 aspect-square bg-zinc-900"></div> */}

            <div className={`hidden sm:flex flex-col ${isScrolled ? 'w-[0%]' : 'w-[100%]'} overflow-hidden transition-all duration-1000 text-white`}>
              <h1 className="text-xl whitespace-nowrap drop-shadow-md font-semibold">1o1 Realtor</h1>
              <p className="text-xs whitespace-nowrap drop-shadow-md opacity-50">Find your perfect home</p>
            </div>
          </div>
        </a>

        <div className="flex items-center gap-4">
          {links.map((link) => (
            <div key={link.name} className="group hidden sm:flex flex-col">
              <Link href={link.href} className={`text-sm drop-shadow-lg font-medium ${isScrolled ? 'text-black' : 'text-white'}`}>
                {link.name}
              </Link>
              <div className={`flex h-[1px] w-0 group-hover:w-full ${isScrolled ? 'bg-black' : 'bg-white'} transition-all duration-500`}></div>
            </div>
          ))}

          <div className="hidden sm:flex">
            <GetinTouchModal />
          </div>

          {/* MOBILE MENU */}
          <div className={`sm:hidden fixed top-0 left-0 w-screen h-screen flex bg-red-500/50 backdrop-blur-sm z-50 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-all duration-300`}>
            <div className={`flex flex-col w-full ${menuOpen ? 'h-96' : 'h-0'} bg-white gap-10 p-5 transition-all duration-500 delay-300`}>
              <div className={`flex flex-row items-start justify-between ${menuOpen ? 'opacity-100' : 'opacity-0'} transition-all duration-300 delay-500`}>
                <a href="/">
                  <div className="flex flex-row items-center gap-2 w-max opacity-100">
                    <img src='https://web.archive.org/web/20211205032847im_/http://www.1o1realtor.com/static/img/LogoWhite.png' alt="Logo" className={`h-6 invert drop-shadow-md transition-all duration-500`} />

                    <div className={`flex flex-col w-full overflow-hidden transition-all duration-1000 text-black`}>
                      <h1 className="text-xl whitespace-nowrap drop-shadow-md font-semibold">1o1 Realtor</h1>
                      <p className="text-xs whitespace-nowrap drop-shadow-md opacity-50">Find your perfect home</p>
                    </div>
                  </div>
                </a>

                <X size={20} className="text-black" onClick={() => setMenuOpen(false)} />
              </div>

              <div className={`${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-500 delay-500`}>
                <GetinTouchModal />
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                {links.map((link, key) => (
                  <div key={key} className="group flex flex-col">
                    <Link href={link.href} className={`text-xl drop-shadow-lg font-medium text-zinc-500 hover:text-black ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-500`} style={{ transitionDelay: `${(key + 7) * 100}ms` }}>
                      {link.name}
                    </Link>
                    <div className={`flex h-[1px] w-0 group-hover:w-full bg-black transition-all duration-500`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="flex sm:hidden flex-col gap-3" onClick={() => setMenuOpen(true)}>
            <div className={`flex h-[2px] w-10 rounded-full ${isScrolled ? 'bg-black' : 'bg-white'}`}></div>
            <div className={`flex h-[2px] w-8 rounded-full ${isScrolled ? 'bg-black' : 'bg-white'}`}></div>
          </div>

        </div>
      </div>
    </nav>
  );
}