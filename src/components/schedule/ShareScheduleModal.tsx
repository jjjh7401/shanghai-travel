"use client";

import { useState } from "react";
import { useScheduleStore, type ScheduleMap } from "@/store/useScheduleStore";
import { useGroupStore } from "@/store/useGroupStore";
import { getVenueById } from "@/data/venues";
import type { GroupNumber } from "@/data/groupSchedules";

interface ShareScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "upload" | "import";

interface ImportedSchedule {
  data: ScheduleMap;
  updatedAt: string;
}

// DB 미설정 시 에러 메시지
const DB_NOT_CONFIGURED_MSG = "서비스 준비 중입니다. Neon DB 설정이 필요합니다.";

/** 장소 ID 배열을 장소 이름 문자열로 변환 (최대 limit개, 나머지는 "외 N곳") */
function getVenueNames(ids: string[], limit = 3): string {
  const names = ids.slice(0, limit).map((id) => {
    const v = getVenueById(id);
    return v?.name.ko ?? id;
  });
  const suffix = ids.length > limit ? ` 외 ${ids.length - limit}곳` : "";
  return names.join(", ") + suffix;
}

/** Day별 장소 요약 렌더링 */
function ScheduleSummary({ map }: { map: ScheduleMap }) {
  return (
    <div className="space-y-2 text-sm">
      {([1, 2, 3] as const).map((day) => {
        const ids = map[day];
        return (
          <div key={day} className="flex items-start gap-2">
            <span className="flex-shrink-0 w-12 text-gray-500 font-medium">Day {day}</span>
            <span className="text-gray-700 leading-snug">
              {ids.length === 0 ? "장소 없음" : getVenueNames(ids)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function ShareScheduleModal({ isOpen, onClose }: ShareScheduleModalProps) {
  const { schedules, applySharedSchedule } = useScheduleStore();
  const { selectedGroup } = useGroupStore();
  const [activeTab, setActiveTab] = useState<Tab>("upload");

  // 업로드 탭 상태
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // 가져오기 탭 상태
  const [importGroupId, setImportGroupId] = useState<GroupNumber | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importedData, setImportedData] = useState<ImportedSchedule | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState(false);

  if (!isOpen) return null;

  // 탭 전환 시 상태 초기화
  function switchTab(tab: Tab) {
    setActiveTab(tab);
    if (tab === "upload") {
      setUploadSuccess(false);
      setUploadError(null);
    } else {
      setImportedData(null);
      setImportError(null);
      setApplySuccess(false);
    }
  }

  // 업로드 핸들러
  async function handleUpload() {
    if (!selectedGroup) {
      setUploadError("조가 선택되지 않았습니다. 먼저 조를 선택해주세요.");
      return;
    }

    setUploadLoading(true);
    setUploadSuccess(false);
    setUploadError(null);

    try {
      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId: selectedGroup, data: schedules }),
      });

      const result = (await response.json()) as {
        success?: boolean;
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        setUploadError(
          response.status === 503 ? DB_NOT_CONFIGURED_MSG : (result.error ?? "업로드에 실패했습니다.")
        );
        return;
      }

      setUploadSuccess(true);
    } catch {
      setUploadError("네트워크 오류가 발생했습니다.");
    } finally {
      setUploadLoading(false);
    }
  }

  // 가져오기 핸들러
  async function handleImport() {
    if (!importGroupId) {
      setImportError("조를 선택해주세요.");
      return;
    }

    setImportLoading(true);
    setImportedData(null);
    setImportError(null);
    setApplySuccess(false);

    try {
      const response = await fetch(`/api/schedule?groupId=${importGroupId}`);
      const result = (await response.json()) as {
        data: ScheduleMap | null;
        updatedAt?: string;
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        setImportError(
          response.status === 503 ? DB_NOT_CONFIGURED_MSG : (result.error ?? "가져오기에 실패했습니다.")
        );
        return;
      }

      if (!result.data) {
        setImportError(`${importGroupId}조의 저장된 일정이 없습니다.`);
        return;
      }

      setImportedData({
        data: result.data,
        updatedAt: result.updatedAt ?? "",
      });
    } catch {
      setImportError("네트워크 오류가 발생했습니다.");
    } finally {
      setImportLoading(false);
    }
  }

  // 일정 적용 핸들러
  function handleApply() {
    if (!importedData) return;
    applySharedSchedule(importedData.data);
    setApplySuccess(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-800">일정 공유</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 탭 */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => switchTab("upload")}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === "upload"
                ? "text-indigo-600 border-b-2 border-indigo-500"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            업로드
          </button>
          <button
            onClick={() => switchTab("import")}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === "import"
                ? "text-indigo-600 border-b-2 border-indigo-500"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            가져오기
          </button>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* 업로드 탭 */}
          {activeTab === "upload" && (
            <>
              {/* 현재 조 배지 */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">현재:</span>
                <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                  {selectedGroup != null ? `${selectedGroup}조` : "조 미선택"}
                </span>
              </div>

              {/* 일정 요약 */}
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-2 font-medium">현재 일정 요약</p>
                <ScheduleSummary map={schedules} />
              </div>

              {/* 성공 메시지 */}
              {uploadSuccess && (
                <div className="flex items-start gap-2 p-3 bg-green-50 rounded-xl text-sm text-green-700">
                  <span className="flex-shrink-0 font-bold">✓</span>
                  <span>업로드 완료! 조원들이 &apos;가져오기&apos;로 확인할 수 있습니다.</span>
                </div>
              )}

              {/* 에러 메시지 */}
              {uploadError && (
                <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2">{uploadError}</p>
              )}

              {/* 업로드 버튼 */}
              <button
                onClick={() => void handleUpload()}
                disabled={uploadLoading || selectedGroup == null}
                className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-200 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {uploadLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    업로드 중...
                  </>
                ) : (
                  "현재 일정 업로드"
                )}
              </button>
            </>
          )}

          {/* 가져오기 탭 */}
          {activeTab === "import" && (
            <>
              <p className="text-sm text-gray-600 font-medium text-center">
                어느 조의 일정을 가져올까요?
              </p>

              {/* 조 선택 그리드 */}
              <div className="grid grid-cols-2 gap-2">
                {([1, 2, 3, 4] as GroupNumber[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setImportGroupId(g);
                      setImportedData(null);
                      setImportError(null);
                      setApplySuccess(false);
                    }}
                    className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                      importGroupId === g
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-indigo-200"
                    }`}
                  >
                    {g}조
                  </button>
                ))}
              </div>

              {/* 에러 메시지 */}
              {importError && (
                <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2">{importError}</p>
              )}

              {/* 가져온 일정 미리보기 */}
              {importedData && (
                <div className="bg-gray-50 rounded-xl p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400 font-medium">
                      {importGroupId}조 일정 미리보기
                    </p>
                    {importedData.updatedAt && (
                      <p className="text-xs text-gray-400">
                        {new Date(importedData.updatedAt).toLocaleDateString("ko-KR")}
                      </p>
                    )}
                  </div>
                  <ScheduleSummary map={importedData.data} />

                  {applySuccess ? (
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg text-sm text-green-700">
                      <span className="font-bold">✓</span>
                      <span>일정이 적용되었습니다.</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleApply}
                      className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-colors"
                    >
                      이 일정으로 적용
                    </button>
                  )}
                </div>
              )}

              {/* 가져오기 버튼 */}
              <button
                onClick={() => void handleImport()}
                disabled={importLoading || importGroupId == null}
                className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-200 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {importLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    가져오는 중...
                  </>
                ) : (
                  "가져오기"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
