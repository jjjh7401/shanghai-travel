import Link from "next/link";
import { airportInfo } from "@/data/tips";

/**
 * 공항 정보 페이지
 */
export default function AirportPage() {
  return (
    <div>
      {/* 헤더 */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/tips"
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100"
          >
            ←
          </Link>
          <h1 className="font-semibold text-gray-900">공항 정보</h1>
        </div>
      </header>

      <div className="px-4 py-4 space-y-6">
        {airportInfo.map((airport) => (
          <div
            key={airport.code}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            {/* 공항 헤더 */}
            <div className="bg-blue-500 px-4 py-3 text-white">
              <h2 className="font-bold text-lg">{airport.name}</h2>
              <p className="text-blue-100 text-sm">{airport.code}</p>
            </div>

            <div className="p-4 space-y-4">
              {/* 터미널 정보 */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">터미널 정보</h3>
                <p className="text-sm text-gray-600">{airport.terminalInfo}</p>
              </div>

              {/* 교통 수단 */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">시내 교통 수단</h3>
                <div className="space-y-3">
                  {airport.transportOptions.map((option, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">
                          {option.method}
                        </span>
                        <div className="flex gap-2 text-xs">
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {option.duration}
                          </span>
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            {option.cost}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{option.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
