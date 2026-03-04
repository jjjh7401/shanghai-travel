import Link from "next/link";
import { getTipsByCategory } from "@/data/tips";
import { ALIPAY_FEE_THRESHOLD, ALIPAY_FEE_RATE } from "@/lib/currency";

/**
 * 결제 방법 팁 페이지
 */
export default function PaymentTipsPage() {
  const paymentTips = getTipsByCategory("payment");

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
          <h1 className="font-semibold text-gray-900">결제 방법</h1>
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* AliPay 경고 배너 */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <h2 className="font-bold text-orange-800 flex items-center gap-2">
            <span>⚠️</span>
            <span>AliPay 수수료 주의</span>
          </h2>
          <p className="text-sm text-orange-700 mt-2">
            {ALIPAY_FEE_THRESHOLD}위안 초과 결제 시{" "}
            <strong>{ALIPAY_FEE_RATE * 100}% 수수료</strong>가 발생합니다.
            가능하면 {ALIPAY_FEE_THRESHOLD}위안 이하로 분할 결제하세요.
          </p>
        </div>

        {/* 결제 팁 목록 */}
        <div className="space-y-3">
          {paymentTips.map((tip) => (
            <div
              key={tip.id}
              className={`bg-white rounded-xl p-4 shadow-sm ${
                tip.important ? "border-l-4 border-orange-400" : ""
              }`}
            >
              <h3 className="font-semibold text-gray-900">{tip.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{tip.content}</p>
            </div>
          ))}
        </div>

        {/* 결제 방법 비교 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">결제 방법 비교</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              {
                method: "AliPay",
                pros: "가장 널리 사용됨",
                cons: "200위안 초과 시 3% 수수료",
              },
              {
                method: "WeChat Pay",
                pros: "많은 곳에서 사용 가능",
                cons: "외국인 연동 복잡",
              },
              {
                method: "현금 (CNY)",
                pros: "항상 사용 가능",
                cons: "노점 외 불편",
              },
              {
                method: "해외 신용카드",
                pros: "한국 카드 사용 가능",
                cons: "일부 장소 미지원",
              },
            ].map((item) => (
              <div key={item.method} className="px-4 py-3">
                <div className="font-medium text-gray-900">{item.method}</div>
                <div className="flex gap-4 mt-1 text-xs">
                  <span className="text-green-600">✓ {item.pros}</span>
                  <span className="text-red-500">✗ {item.cons}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
