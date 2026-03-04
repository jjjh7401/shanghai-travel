import Link from "next/link";
import { travelTips, getImportantTips } from "@/data/tips";

const CATEGORY_INFO = {
  payment: { label: "결제 방법", icon: "💳", href: "/tips/payment" },
  transport: { label: "교통", icon: "🚌", href: null },
  communication: { label: "통신", icon: "📱", href: null },
  safety: { label: "안전", icon: "🛡️", href: null },
  etiquette: { label: "에티켓", icon: "🙏", href: null },
  airport: { label: "공항 정보", icon: "✈️", href: "/tips/airport" },
};

/**
 * 여행 팁 메인 페이지
 */
export default function TipsPage() {
  const importantTips = getImportantTips();
  const categories = Object.entries(CATEGORY_INFO) as [
    keyof typeof CATEGORY_INFO,
    (typeof CATEGORY_INFO)[keyof typeof CATEGORY_INFO]
  ][];

  return (
    <div className="px-4 pt-6 space-y-6">
      {/* 헤더 */}
      <header>
        <h1 className="text-2xl font-bold text-gray-900">여행 팁</h1>
        <p className="text-gray-500 text-sm mt-1">
          상하이 여행 필수 정보 {travelTips.length}가지
        </p>
      </header>

      {/* 카테고리 링크 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">카테고리</h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map(([key, info]) => (
            <div key={key}>
              {info.href ? (
                <Link
                  href={info.href}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <span className="text-2xl">{info.icon}</span>
                  <span className="font-medium text-gray-800">{info.label}</span>
                  <span className="ml-auto text-gray-400">→</span>
                </Link>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <span className="text-2xl">{info.icon}</span>
                  <span className="font-medium text-gray-800">{info.label}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 중요 팁 */}
      <section className="pb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          ⚡ 중요 팁
        </h2>
        <div className="space-y-3">
          {importantTips.map((tip) => (
            <div
              key={tip.id}
              className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">{CATEGORY_INFO[tip.category]?.icon}</span>
                <h3 className="font-semibold text-gray-900 text-sm">
                  {tip.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600">{tip.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
