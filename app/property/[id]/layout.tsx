import styles from "./property.module.css";
import Navbar from "@/components/home/navbar";
import Footer from "@/components/common/footer";
import Featured from "@/components/home/featured";

export default function PropertyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <Navbar />
      {children}
      <div className={`site-surface ${styles.related}`}>
        <div className="sm:w-[90%] mx-auto">
          <Featured />
        </div>
      </div>
      <Footer />
    </div>
  );
}
