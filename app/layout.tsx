import "@/app/_styles/globals.css";
import Header from "@/app/_components/Header";
import { Josefin_Sans } from "next/font/google";
import Footer from "./_components/Footer";
const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: { template: "%s / Band Log", default: "Band Log" },
  description: "Log all your favorite bands",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body
        className={`${josefin.className} bg-primary-950 antialiased text-primary-100 min-h-screen m-auto relative flex flex-col sm:grid sm:grid-rows-[auto_1fr_auto] sm:h-screen`}
      >
        <Header />
        <main className='px-8 py-12 flex-1 grid overflow-auto'>
          <div className='mx-auto max-w-7xl w-full'>{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
