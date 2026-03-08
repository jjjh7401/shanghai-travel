"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useGroupStore } from "@/store/useGroupStore";

const GROUP_COLORS: Record<number, string> = {
  1: "bg-blue-100 text-blue-700 border-blue-200",
  2: "bg-green-100 text-green-700 border-green-200",
  3: "bg-orange-100 text-orange-700 border-orange-200",
  4: "bg-purple-100 text-purple-700 border-purple-200",
};

export function GroupBadge() {
  const { selectedGroup, hasSelectedGroup } = useGroupStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !hasSelectedGroup || !selectedGroup) return null;

  return (
    <Link
      href="/settings"
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-medium ${GROUP_COLORS[selectedGroup]}`}
    >
      <span className="font-bold">{selectedGroup}조</span>
      <span className="text-xs opacity-70">일정 보기 중</span>
    </Link>
  );
}
