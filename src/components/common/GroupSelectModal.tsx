"use client";

import { useState, useEffect } from "react";
import { useGroupStore } from "@/store/useGroupStore";
import { useScheduleStore } from "@/store/useScheduleStore";
import { groupSchedules } from "@/data/groupSchedules";
import type { GroupNumber } from "@/data/groupSchedules";

const GROUP_COLORS: Record<GroupNumber, string> = {
  1: "bg-blue-500 hover:bg-blue-600 border-blue-600",
  2: "bg-green-500 hover:bg-green-600 border-green-600",
  3: "bg-orange-500 hover:bg-orange-600 border-orange-600",
  4: "bg-purple-500 hover:bg-purple-600 border-purple-600",
};

const GROUP_LIGHT_COLORS: Record<GroupNumber, string> = {
  1: "bg-blue-50 border-blue-200",
  2: "bg-green-50 border-green-200",
  3: "bg-orange-50 border-orange-200",
  4: "bg-purple-50 border-purple-200",
};

const GROUP_TEXT_COLORS: Record<GroupNumber, string> = {
  1: "text-blue-700",
  2: "text-green-700",
  3: "text-orange-700",
  4: "text-purple-700",
};

export function GroupSelectModal() {
  const { hasSelectedGroup, setGroup } = useGroupStore();
  const { initializeForGroup } = useScheduleStore();
  const [mounted, setMounted] = useState(false);
  const [selecting, setSelecting] = useState<GroupNumber | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // hydration mismatch 방지
  if (!mounted) return null;
  // 이미 조를 선택한 경우 표시 안 함
  if (hasSelectedGroup) return null;

  const handleSelect = (group: GroupNumber) => {
    setSelecting(group);
    setGroup(group);
    initializeForGroup(group);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5 text-white text-center">
          <div className="text-2xl mb-1">🇨🇳</div>
          <h2 className="text-xl font-bold">상하이 IBT</h2>
          <p className="text-red-100 text-sm mt-1">내 조를 선택해주세요</p>
        </div>

        {/* 설명 */}
        <div className="px-6 pt-4 pb-2">
          <p className="text-sm text-gray-500 text-center">
            조를 선택하면 내 조 일정으로 자동 설정됩니다.
            <br />
            설정에서 언제든지 변경 가능합니다.
          </p>
        </div>

        {/* 조 선택 버튼 */}
        <div className="px-6 py-4 grid grid-cols-2 gap-3">
          {groupSchedules.map((gs) => (
            <button
              key={gs.group}
              onClick={() => handleSelect(gs.group)}
              disabled={selecting !== null}
              className={`
                relative flex flex-col items-center justify-center
                rounded-xl p-4 border-2 transition-all
                ${GROUP_LIGHT_COLORS[gs.group]}
                ${selecting === gs.group ? "scale-95 opacity-70" : "active:scale-95"}
                ${selecting !== null && selecting !== gs.group ? "opacity-40" : ""}
              `}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold mb-2 ${GROUP_COLORS[gs.group].split(" ")[0]}`}
              >
                {gs.group}
              </div>
              <span className={`font-bold text-base ${GROUP_TEXT_COLORS[gs.group]}`}>
                {gs.name}
              </span>
              <span className="text-xs text-gray-400 mt-1 text-center leading-tight">
                {gs.days[2].label.split("—")[0].trim()}
              </span>
              {selecting === gs.group && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/50">
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* 하단 안내 */}
        <div className="px-6 pb-5">
          <p className="text-xs text-gray-400 text-center">
            GS SHOP × 상하이 IBT 2025 하반기
          </p>
        </div>
      </div>
    </div>
  );
}
