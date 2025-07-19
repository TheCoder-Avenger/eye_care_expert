import { Nunito_Sans } from "next/font/google";
import Header from "@components/Header";
import { UserProvider } from "@/context/UserContext";
import ComingSoonToast from "@components/ComingSoonToast";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito-sans",
});

export const metadata = {
  title: "EyeCare Expert Portal",
  description: "High-quality eyewear and professional eye care products",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={nunitoSans.variable}>
      <body>
        <UserProvider>
          <Header />
          <main>{children}</main>
          <ComingSoonToast />
        </UserProvider>
      </body>
    </html>
  );
}
