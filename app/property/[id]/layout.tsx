import Navbar from "@/components/home/navbar";
import Footer from "@/components/common/footer";
import Featured from "@/components/home/featured";

export default function PropertyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-200">
      <Navbar />
      {children}
      <div className="bg-white">
        <div className="sm:w-[90%] mx-auto">
          <Featured />
        </div>
      </div>
      <Footer />
    </div>
  );
}
