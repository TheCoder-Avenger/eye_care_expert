import Header from "@components/Header";
import { UserProvider } from "@/context/UserContext";

export const metadata = {
  title: "EyeCare Expert Portal - Your Vision, Our Mission",
  description:
    "Professional eyecare portal offering eyeglasses, sunglasses, and comprehensive eye care services.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <Header />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
