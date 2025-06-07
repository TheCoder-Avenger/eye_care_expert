/**
 * Internal dependencies
 */
import Header from "@components/Header";

export const metadata = {
  title: "EyeCare Expert Portal - Your Vision, Our Mission",
  description:
    "Professional eyecare portal offering eyeglasses, sunglasses, and comprehensive eye care services.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
