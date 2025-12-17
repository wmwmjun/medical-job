import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "MedJobs India - Medical Job Listings for Doctors",
  description: "Find the best medical job opportunities across India. Browse positions in top hospitals for doctors, specialists, and healthcare professionals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gray-50">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200 py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-gray-500 text-sm">
              <p>&copy; {new Date().getFullYear()} MedJobs India. All rights reserved.</p>
              <p className="mt-2">Connecting healthcare professionals with opportunities across India.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
