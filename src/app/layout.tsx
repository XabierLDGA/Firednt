import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { APP_NAME } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s · ${APP_NAME}` },
  description: "Gestor personal de proyectos desarrollados con IA",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        <div className="flex min-h-screen flex-col md:flex-row">
          <SiteHeader />
          {/* Content panel: white with a border on the grey app background. */}
          <div className="flex min-w-0 flex-1 flex-col md:py-2 md:pr-2">
            <div className="flex min-w-0 flex-1 flex-col bg-page md:rounded-md md:border md:border-line">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
