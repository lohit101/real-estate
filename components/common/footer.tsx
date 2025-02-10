import { Facebook, Instagram, Mail, Phone, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <div className="flex flex-col bg-black px-10 py-16 pb-5 text-white">
            <div className="grid grid-cols-5">
                <div className="flex col-span-2">
                    <img src='https://web.archive.org/web/20211205032847im_/http://www.1o1realtor.com/static/img/LogoWhite.png' alt="Logo" className={`h-5 sm:h-10 drop-shadow-md transition-all duration-500`} />
                </div>
                <div className="flex flex-col gap-1 text-zinc-500 text-xs">
                    <p className="text-white mb-1 font-semibold w-max">Quick Access</p>
                    <a href="/" className="w-max hover:text-zinc-300 transition-all">Home</a>
                    <a href="/" className="w-max hover:text-zinc-300 transition-all">Featured Properties</a>
                </div>
                <div className="flex flex-col gap-1 text-zinc-500 text-xs">
                    <p className="text-white mb-1 font-semibold w-max">Properties</p>
                    <a href="/" className="w-max hover:text-zinc-300 transition-all">Commercial</a>
                    <a href="/" className="w-max hover:text-zinc-300 transition-all">Residential</a>
                    <a href="/" className="w-max hover:text-zinc-300 transition-all">Other</a>
                </div>
                <div className="flex flex-col gap-3">
                    <a href="/" className="flex flex-row items-center gap-1">
                        <Phone size={12} />
                        <p className="text-xs">+91 912-345-6789</p>
                    </a>
                    <a href="/" className="flex flex-row items-center gap-1">
                        <Mail size={12} />
                        <p className="text-xs">email@test.com</p>
                    </a>
                    <div className="flex flex-row items-center gap-2">
                        <a href="/" className="group">
                            <Instagram size={18} className="text-zinc-500 group-hover:text-white transition-all" />
                        </a>
                        <a href="/" className="group">
                            <Facebook size={18} className="text-zinc-500 group-hover:text-white transition-all" />
                        </a>
                        <a href="/" className="group">
                            <Twitter size={18} className="text-zinc-500 group-hover:text-white transition-all" />
                        </a>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center border-t border-gray-500 pt-5 mt-5">
                <p className="text-xs">&copy; 2025 1o1 Realtor Pvt. Ltd. All Rights Reserved</p>
            </div>
        </div>
    )
}