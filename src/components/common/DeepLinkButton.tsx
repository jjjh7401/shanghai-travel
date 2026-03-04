"use client";

import { generateDeepLink } from "@/lib/deeplink";

interface DeepLinkButtonProps {
  platform: string;
  label: string;
  searchQuery?: string;
  lat?: number;
  lng?: number;
  venueName?: string;
  className?: string;
}

/**
 * 앱 딥링크 버튼 컴포넌트
 */
export function DeepLinkButton({
  platform,
  label,
  searchQuery,
  lat,
  lng,
  venueName,
  className = "",
}: DeepLinkButtonProps) {
  const handleClick = () => {
    const url = generateDeepLink(platform, {
      searchQuery,
      lat,
      lng,
      name: venueName,
    });
    if (url) {
      window.location.href = url;
    }
  };

  const platformIcons: Record<string, string> = {
    wechat: "💬",
    dianping: "🍴",
    amap: "🗺️",
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 active:bg-green-700 transition-colors ${className}`}
    >
      <span>{platformIcons[platform] || "🔗"}</span>
      <span>{label}</span>
    </button>
  );
}
