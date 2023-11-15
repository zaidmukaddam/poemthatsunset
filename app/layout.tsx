import "./globals.css";
import cx from "classnames";
import { sfPro, inter } from "./fonts";
import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import { Suspense } from "react";

export const metadata = {
  title: "PoemThatSunset",
  description:
    "PoemThatSunset is a tool that will help you generate a beautiful poem based on the sunset and read it to you!",
  metadataBase: new URL("https://poemthatsunset.za16.co"),
  themeColor: "#FFF",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cx(sfPro.variable, inter.variable)}>
        <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100" />
        <Suspense fallback="...">
          <Nav />
        </Suspense>
        <main className="flex min-h-screen w-full flex-col items-center justify-center pt-32 pb-10">
          {children}
        </main>
        <Footer />
        <script async src="https://cdn.splitbee.io/sb.js" />
      </body>
    </html>
  );
}
