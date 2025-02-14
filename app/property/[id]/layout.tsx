import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../../globals.css";
import Navbar from "@/components/home/navbar";
import Footer from "@/components/common/footer";

const montserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "1o1 Realtor - Find Your Dream Property",
  description: "Discover your dream property with 1o1 Realtor. Explore a wide range of residential and commercial properties tailored to your needs.",
  keywords: "real estate, property, buy property, sell property, residential, commercial, realtor, 1o1 Realtor",
  openGraph: {
    title: "1o1 Realtor - Find Your Dream Property",
    description: "Discover your dream property with 1o1 Realtor. Explore a wide range of residential and commercial properties tailored to your needs.",
    url: "https://www.1o1realtor.com",
    type: "website",
    images: [
      {
        url: "https://www.1o1realtor.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "1o1 Realtor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@1o1Realtor",
    title: "1o1 Realtor - Find Your Dream Property",
    description: "Discover your dream property with 1o1 Realtor. Explore a wide range of residential and commercial properties tailored to your needs.",
    images: "https://www.1o1realtor.com/og-image.png",
  },
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}