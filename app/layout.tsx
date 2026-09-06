import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Chowly",
  description: "Order, dine, and pay — all from your table.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
            <body className="min-h-full flex flex-col">
        <nav style={{
          backgroundColor: '#1A1512', borderBottom: '1px solid #3A332C',
          padding: '16px 24px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <a href="/" style={{ color: '#F2EDE4', textDecoration: 'none', fontFamily: 'Georgia, serif', fontSize: '20px' }}>
            Chowly
          </a>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="/menu" style={{ color: '#C9C0B2', textDecoration: 'none', fontSize: '14px' }}>Menu</a>
            <a href="/waiter" style={{ color: '#C9C0B2', textDecoration: 'none', fontSize: '14px' }}>Waiter</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
