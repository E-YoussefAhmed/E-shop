import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Poppins } from "next/font/google";

import "./globals.css";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import CartProvider from "@/providers/cart-provider";
import ClientProvider from "@/providers/session-provider";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "E~Shop",
  description: "E-commerce platform for online shopping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClientProvider>
      <html lang="en">
        <body className={`${poppins.className} text-slate-700`}>
          <Toaster
            toastOptions={{
              style: {
                background: "rgb(51 65 85)",
                color: "#fff",
              },
            }}
          />
          <CartProvider>
            <div className="flex flex-col min-h-dvh">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </CartProvider>
        </body>
      </html>
    </ClientProvider>
  );
}
