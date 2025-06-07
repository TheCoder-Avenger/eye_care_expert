import { Geist, Geist_Mono } from "next/font/google";
import "@/assets/stylesheets/_variables.scss";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EyeCare Expert Portal - Your Vision, Our Mission",
  description:
    "Professional eyecare portal offering eyeglasses, sunglasses, and comprehensive eye care services.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
