import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const vazirmatn = localFont({
  src: "./fonts/Vazirmatn-Variable.woff2",
  variable: "--font-vazirmatn",
  weight: "100 900",
  display: "swap",
});

const title =
  "کشتی‌بان | تأمین کالا و ملزومات کشتی‌های تجاری (Ship Chandlery) در بنادر ایران";
const description =
  "کشتی‌بان، تأمین‌کننده کالا و ملزومات کشتی‌های تجاری در بنادر شمال و جنوب ایران: روغن و رنگ دریایی، مواد شیمیایی، آذوقه، پوشاک کار و تجهیزات ایمنی (LSA و FFA). درخواست استعلام قیمت. Ship Chandlery Iran.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: "%s | کشتی‌بان" },
  description,
  applicationName: "کشتی‌بان",
  keywords: [
    "کشتی‌بان",
    "تأمین ملزومات کشتی",
    "فروش ملزومات دریایی",
    "روغن دریایی",
    "رنگ دریایی",
    "مواد شیمیایی دریایی",
    "تجهیزات ایمنی کشتی",
    "تأمین مواد غذایی کشتی",
    "Ship Chandlery Iran",
    "Marine Supplier Iran",
    "Ship Supply Iran",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "/",
    siteName: "کشتی‌بان",
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
  category: "Marine supplies",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#071730",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body>{children}</body>
    </html>
  );
}
