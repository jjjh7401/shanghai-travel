"use client";

import { useAppStore } from "@/store/useAppStore";
import { DEFAULT_CNY_TO_KRW_RATE } from "@/data/constants";

/**
 * 설정 페이지
 */
export default function SettingsPage() {
  const { settings, updateExchangeRate, toggleChineseNames, resetSettings } =
    useAppStore();

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rate = parseFloat(e.target.value);
    if (!isNaN(rate) && rate > 0) {
      updateExchangeRate(rate);
    }
  };

  return (
    <div className="px-4 pt-6 space-y-6">
      {/* 헤더 */}
      <header>
        <h1 className="text-2xl font-bold text-gray-900">설정</h1>
      </header>

      {/* 환율 설정 */}
      <section className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">환율 설정</h2>
        </div>
        <div className="p-4">
          <label className="block">
            <span className="text-sm text-gray-600">
              1 CNY = ? KRW (현재: {settings.exchangeRate} KRW)
            </span>
            <input
              type="number"
              value={settings.exchangeRate}
              onChange={handleRateChange}
              min="100"
              max="300"
              step="1"
              className="mt-2 w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <p className="text-xs text-gray-400 mt-1">
            기본값: {DEFAULT_CNY_TO_KRW_RATE} KRW/CNY
          </p>
          <button
            onClick={() => updateExchangeRate(DEFAULT_CNY_TO_KRW_RATE)}
            className="mt-2 text-xs text-blue-500 hover:text-blue-700"
          >
            기본값으로 초기화
          </button>
        </div>
      </section>

      {/* 표시 설정 */}
      <section className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">표시 설정</h2>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <div className="font-medium text-gray-900">중국어 이름 표시</div>
              <div className="text-xs text-gray-400">
                장소명 옆에 중국어 표기 표시
              </div>
            </div>
            <button
              onClick={toggleChineseNames}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.showChineseNames ? "bg-blue-500" : "bg-gray-300"
              }`}
              role="switch"
              aria-checked={settings.showChineseNames}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  settings.showChineseNames ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* 앱 정보 */}
      <section className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="font-semibold text-gray-800 mb-3">앱 정보</h2>
        <div className="space-y-1 text-sm text-gray-600">
          <div>버전: 0.1.0</div>
          <div>장소 수: 25개</div>
          <div>여행 기간: 3일</div>
          <div>데이터 업데이트: 2025년 기준</div>
        </div>
      </section>

      {/* 초기화 */}
      <section className="pb-4">
        <button
          onClick={resetSettings}
          className="w-full py-3 px-4 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
        >
          모든 설정 초기화
        </button>
      </section>
    </div>
  );
}
