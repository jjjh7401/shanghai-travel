import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/navigation/BottomNav";
import { OfflineIndicator } from "@/components/common/OfflineIndicator";
import { ProximityAlert } from "@/components/common/ProximityAlert";
import { ServiceWorkerRegister } from "@/components/common/ServiceWorkerRegister";
import { GroupSelectModal } from "@/components/common/GroupSelectModal";

export const metadata: Metadata = {
  title: "상하이 여행 가이드",
  description: "3박 4일 상하이 여행 가이드 - 25개 장소, 한중 이중 표시",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "상하이 가이드",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <ServiceWorkerRegister />
        <OfflineIndicator />
        <GroupSelectModal />
        <main className="min-h-screen pb-nav">{children}</main>
        <ProximityAlert />
        <BottomNav />
      </body>
    </html>
  );
}
