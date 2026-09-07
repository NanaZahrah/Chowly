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
          backgroundColor: '#15130F', borderBottom: '1px solid #2A2620',
          padding: '20px 32px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <a href="/" style={{
            color: '#EDE8DE', textDecoration: 'none', fontFamily: 'Georgia, serif',
            fontSize: '19px', letterSpacing: '0.02em', fontWeight: 'normal'
          }}>
            Chowly
          </a>
          <div style={{ display: 'flex', gap: '28px' }}>
            <a href="/menu" style={{ color: '#8A8378', textDecoration: 'none', fontSize: '13px', letterSpacing: '0.03em' }}>MENU</a>
            <a href="/waiter" style={{ color: '#8A8378', textDecoration: 'none', fontSize: '13px', letterSpacing: '0.03em' }}>WAITER</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}