/**
 * 상하이 IBT 여행 가이드 앱 - 사용자 매뉴얼 PDF 생성 스크립트
 * Requires: npx playwright (auto-installed)
 * Usage: node scripts/generate-manual.mjs
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'http://localhost:3000';
const OUT_DIR = path.join(__dirname, '..', 'manual-output');
const IMG_DIR = path.join(OUT_DIR, 'images');

// Ensure output directories exist
fs.mkdirSync(IMG_DIR, { recursive: true });

const MOBILE_VIEWPORT = { width: 390, height: 844 }; // iPhone 14 Pro

async function takeScreenshot(page, filename, description) {
  const filepath = path.join(IMG_DIR, filename);
  await page.screenshot({ path: filepath, fullPage: false });
  console.log(`  ✓ ${description} → ${filename}`);
  return filepath;
}

async function main() {
  const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({
    headless: true,
    executablePath: CHROME_PATH,
  });
  const context = await browser.newContext({
    viewport: MOBILE_VIEWPORT,
    deviceScaleFactor: 2,
    locale: 'ko-KR',
  });
  const page = await context.newPage();

  console.log('📸 스크린샷 캡처 시작...\n');

  const screenshots = {};

  // ── 1. 그룹 선택 모달 (첫 실행 화면) ──────────────────────────────────────
  console.log('[1] 그룹 선택 화면');
  // Clear localStorage to trigger the group selection modal
  await page.goto(BASE_URL);
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  screenshots.groupModal = await takeScreenshot(page, '01-group-select-modal.png', '조 선택 모달');

  // ── 2. 조 선택 후 홈 (Day1) ───────────────────────────────────────────────
  console.log('\n[2] 홈 화면 - Day 1');
  // Select group 1
  const groupBtn = page.locator('text=1조').first();
  if (await groupBtn.count() > 0) {
    await groupBtn.click();
    await page.waitForTimeout(800);
  } else {
    // Try clicking first button in modal
    await page.locator('button').first().click();
    await page.waitForTimeout(800);
  }
  await page.goto(`${BASE_URL}/day/1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  screenshots.day1 = await takeScreenshot(page, '02-day1-schedule.png', 'Day 1 일정');

  // ── 3. Day 2 ──────────────────────────────────────────────────────────────
  console.log('\n[3] Day 2 일정');
  await page.goto(`${BASE_URL}/day/2`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  screenshots.day2 = await takeScreenshot(page, '03-day2-schedule.png', 'Day 2 일정');

  // ── 4. Day 3 ──────────────────────────────────────────────────────────────
  console.log('\n[4] Day 3 일정');
  await page.goto(`${BASE_URL}/day/3`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  screenshots.day3 = await takeScreenshot(page, '04-day3-schedule.png', 'Day 3 일정');

  // ── 5. 장소 추가 모달 ─────────────────────────────────────────────────────
  console.log('\n[5] 장소 추가 모달');
  await page.goto(`${BASE_URL}/day/1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  // Click "장소 추가" button
  const addBtn = page.locator('text=장소 추가').first();
  if (await addBtn.count() > 0) {
    await addBtn.click();
    await page.waitForTimeout(800);
    screenshots.addVenue = await takeScreenshot(page, '05-add-venue-modal.png', '장소 추가 모달');
    await page.keyboard.press('Escape');
  } else {
    screenshots.addVenue = await takeScreenshot(page, '05-add-venue-modal.png', '장소 추가 버튼 영역');
  }

  // ── 6. 장소 상세 페이지 ───────────────────────────────────────────────────
  console.log('\n[6] 장소 상세 페이지');
  await page.goto(`${BASE_URL}/venue/day1-jidao`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  screenshots.venueDetail = await takeScreenshot(page, '06-venue-detail.png', '장소 상세 (지다오)');

  // ── 7. 지도 페이지 ────────────────────────────────────────────────────────
  console.log('\n[7] 지도 페이지');
  await page.goto(`${BASE_URL}/map`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500); // Wait for Leaflet map to load
  screenshots.map = await takeScreenshot(page, '07-map-page.png', '지도 전체');

  // ── 8. 지도 - Day 필터 ────────────────────────────────────────────────────
  console.log('\n[8] 지도 Day 필터');
  // Click Day 1 filter button
  const day1Filter = page.locator('[role="tablist"] button, button').filter({ hasText: 'Day 1' }).first();
  if (await day1Filter.count() > 0) {
    await day1Filter.click();
    await page.waitForTimeout(1000);
  }
  screenshots.mapFiltered = await takeScreenshot(page, '08-map-day1-filter.png', '지도 Day 1 필터');

  // ── 9. 여행 팁 페이지 ─────────────────────────────────────────────────────
  console.log('\n[9] 여행 팁 페이지');
  await page.goto(`${BASE_URL}/tips`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  screenshots.tips = await takeScreenshot(page, '09-tips-page.png', '여행 팁 메인');

  // ── 10. 공항 팁 ───────────────────────────────────────────────────────────
  console.log('\n[10] 공항 교통 팁');
  await page.goto(`${BASE_URL}/tips/airport`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  screenshots.airport = await takeScreenshot(page, '10-tips-airport.png', '공항 교통 안내');

  // ── 11. 결제 팁 ───────────────────────────────────────────────────────────
  console.log('\n[11] 결제 안내');
  await page.goto(`${BASE_URL}/tips/payment`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  screenshots.payment = await takeScreenshot(page, '11-tips-payment.png', '결제 방법 안내');

  // ── 12. 설정 페이지 (조 변경) ─────────────────────────────────────────────
  console.log('\n[12] 설정 - 조 변경');
  await page.goto(`${BASE_URL}/settings`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  screenshots.settings = await takeScreenshot(page, '12-settings-group.png', '설정 - 조 변경');

  // ── 13. 최단경로 정렬 버튼 (강조) ────────────────────────────────────────
  console.log('\n[13] 최단경로 버튼 영역');
  await page.goto(`${BASE_URL}/day/2`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  // Scroll to bottom to show action buttons
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  screenshots.shortestPath = await takeScreenshot(page, '13-shortest-path-btn.png', '최단경로 버튼');

  await browser.close();
  console.log('\n✅ 모든 스크린샷 캡처 완료!\n');

  // ── HTML 매뉴얼 생성 ──────────────────────────────────────────────────────
  console.log('📄 HTML 매뉴얼 생성 중...');

  function imgSrc(filename) {
    const filepath = path.join(IMG_DIR, filename);
    if (fs.existsSync(filepath)) {
      const data = fs.readFileSync(filepath).toString('base64');
      return `data:image/png;base64,${data}`;
    }
    return '';
  }

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>상하이 IBT 여행 가이드 앱 사용 매뉴얼</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; color: #1a1a2e; background: #fff; }

  /* 표지 */
  .cover {
    height: 100vh;
    background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 60%, #0ea5e9 100%);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; color: white;
    page-break-after: always;
    padding: 40px;
  }
  .cover .app-icon { font-size: 80px; margin-bottom: 24px; }
  .cover h1 { font-size: 36px; font-weight: 800; margin-bottom: 12px; line-height: 1.3; }
  .cover .subtitle { font-size: 18px; opacity: 0.85; margin-bottom: 32px; }
  .cover .badge { background: rgba(255,255,255,0.2); border-radius: 20px; padding: 8px 20px; font-size: 14px; margin: 4px; display: inline-block; }
  .cover .url { margin-top: 40px; font-size: 16px; background: rgba(255,255,255,0.15); padding: 12px 24px; border-radius: 10px; }

  /* 목차 */
  .toc {
    padding: 60px 50px;
    page-break-after: always;
  }
  .toc h2 { font-size: 28px; color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 12px; margin-bottom: 32px; }
  .toc-item { display: flex; align-items: center; padding: 14px 0; border-bottom: 1px dotted #ddd; font-size: 16px; }
  .toc-num { width: 36px; height: 36px; background: #2563eb; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; margin-right: 16px; flex-shrink: 0; }
  .toc-title { flex: 1; }
  .toc-desc { font-size: 13px; color: #666; margin-top: 2px; }

  /* 섹션 공통 */
  .section {
    padding: 50px 50px 40px;
    page-break-before: always;
  }
  .section-header {
    display: flex; align-items: center;
    margin-bottom: 28px;
    padding-bottom: 16px;
    border-bottom: 2px solid #e2e8f0;
  }
  .section-num {
    width: 48px; height: 48px;
    background: #2563eb; color: white;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; font-weight: 800;
    margin-right: 16px; flex-shrink: 0;
  }
  .section h2 { font-size: 26px; color: #1e3a5f; }
  .section h3 { font-size: 18px; color: #2563eb; margin: 24px 0 12px; }

  /* 2열 레이아웃 */
  .two-col { display: flex; gap: 32px; align-items: flex-start; margin: 20px 0; }
  .two-col .text { flex: 1; }
  .two-col .img-wrap { flex: 0 0 200px; }

  /* 스크린샷 */
  .screenshot {
    width: 200px;
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);
    display: block;
  }
  .screenshot-full {
    width: 100%;
    max-width: 240px;
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    display: block;
    margin: 0 auto;
  }
  .img-caption { text-align: center; font-size: 12px; color: #888; margin-top: 8px; }

  /* 3열 스크린샷 */
  .three-col { display: flex; gap: 20px; justify-content: center; margin: 24px 0; }
  .three-col .item { flex: 1; max-width: 180px; text-align: center; }

  /* 단계 박스 */
  .step { display: flex; gap: 16px; margin: 16px 0; align-items: flex-start; }
  .step-num { width: 28px; height: 28px; background: #2563eb; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; margin-top: 2px; }
  .step-content { flex: 1; }
  .step-content strong { display: block; font-size: 15px; margin-bottom: 4px; }
  .step-content p { font-size: 14px; color: #555; line-height: 1.6; }

  /* 팁 박스 */
  .tip-box { background: #eff6ff; border-left: 4px solid #2563eb; border-radius: 8px; padding: 16px 20px; margin: 16px 0; font-size: 14px; line-height: 1.7; }
  .tip-box strong { color: #1e40af; }
  .warn-box { background: #fff7ed; border-left: 4px solid #f97316; border-radius: 8px; padding: 16px 20px; margin: 16px 0; font-size: 14px; line-height: 1.7; }
  .warn-box strong { color: #c2410c; }

  /* 조별 일정 표 */
  table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 16px 0; }
  th { background: #2563eb; color: white; padding: 10px 12px; text-align: left; }
  td { padding: 9px 12px; border-bottom: 1px solid #e5e7eb; }
  tr:nth-child(even) td { background: #f8fafc; }

  /* 네비게이션 설명 */
  .nav-item { display: flex; gap: 12px; align-items: center; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
  .nav-icon { font-size: 24px; width: 40px; text-align: center; }
  .nav-info strong { display: block; font-size: 15px; }
  .nav-info span { font-size: 13px; color: #666; }

  /* QR 코드 자리 */
  .qr-area { text-align: center; padding: 30px; background: #f8fafc; border-radius: 16px; margin: 20px 0; }
  .qr-placeholder { width: 120px; height: 120px; background: #e2e8f0; border-radius: 12px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; font-size: 40px; }

  @media print {
    .section { page-break-before: always; }
    .cover { height: 297mm; }
  }
</style>
</head>
<body>

<!-- ══════════════════════════════════════════════ 표지 -->
<div class="cover">
  <div class="app-icon">✈️</div>
  <h1>상하이 IBT 여행 가이드<br>앱 사용 매뉴얼</h1>
  <p class="subtitle">2026 상반기 IBT 참가자를 위한 공식 안내서</p>
  <div>
    <span class="badge">📅 Day 1–3 일정 관리</span>
    <span class="badge">🗺️ 지도 & Amap 연동</span>
    <span class="badge">👥 4개 조별 맞춤 일정</span>
    <span class="badge">📍 최단경로 자동 정렬</span>
  </div>
</div>

<!-- ══════════════════════════════════════════════ 목차 -->
<div class="toc">
  <h2>목차</h2>
  <div class="toc-item"><div class="toc-num">1</div><div><div class="toc-title"><strong>앱 개요 및 접속 방법</strong></div><div class="toc-desc">웹앱 소개, URL 접속, PWA 설치 방법</div></div></div>
  <div class="toc-item"><div class="toc-num">2</div><div><div class="toc-title"><strong>조 선택하기</strong></div><div class="toc-desc">첫 실행 시 조 선택 및 나중에 변경하는 방법</div></div></div>
  <div class="toc-item"><div class="toc-num">3</div><div><div class="toc-title"><strong>일정 보기 (Day 1~3)</strong></div><div class="toc-desc">날짜별 일정 탭 전환, 장소 카드 읽는 법</div></div></div>
  <div class="toc-item"><div class="toc-num">4</div><div><div class="toc-title"><strong>일정 커스터마이징</strong></div><div class="toc-desc">장소 추가·삭제·순서 변경, 최단경로 정렬, 초기화</div></div></div>
  <div class="toc-item"><div class="toc-num">5</div><div><div class="toc-title"><strong>장소 상세 정보</strong></div><div class="toc-desc">영업시간, 메뉴, 비용, 주소 확인 방법</div></div></div>
  <div class="toc-item"><div class="toc-num">6</div><div><div class="toc-title"><strong>지도에서 위치 확인</strong></div><div class="toc-desc">Day별 마커 필터, 현재 위치 버튼, 맛집 탭</div></div></div>
  <div class="toc-item"><div class="toc-num">7</div><div><div class="toc-title"><strong>Amap(高德地图) 길찾기 연동</strong></div><div class="toc-desc">앱 연동으로 현재 위치 기반 길찾기 실행</div></div></div>
  <div class="toc-item"><div class="toc-num">8</div><div><div class="toc-title"><strong>여행 팁</strong></div><div class="toc-desc">공항 교통편, 중국 결제 방법 (위챗페이·알리페이)</div></div></div>
</div>

<!-- ══════════════════════════════════════════════ 섹션 1: 앱 개요 -->
<div class="section">
  <div class="section-header">
    <div class="section-num">1</div>
    <h2>앱 개요 및 접속 방법</h2>
  </div>

  <h3>📱 이 앱은 무엇인가요?</h3>
  <p style="font-size:15px;line-height:1.8;color:#444;">
    상하이 IBT 3일 여행 일정을 스마트폰에서 편리하게 관리할 수 있는 웹앱입니다.
    인터넷 연결 없이도 저장된 정보를 확인할 수 있으며, 4개 조별로 맞춤화된 Day 2 일정을 제공합니다.
  </p>

  <div class="tip-box">
    <strong>💡 주요 특징</strong><br>
    • 인터넷 없이도 작동하는 <strong>오프라인 지원 PWA</strong><br>
    • 4개 조별 맞춤 Day 2 일정 / Day 1&3은 공통<br>
    • 38개 상하이 명소 정보 (영업시간, 메뉴, 비용 포함)<br>
    • Amap(高德地图) 길찾기 직접 연동<br>
    • 장소 순서 변경 및 최단경로 자동 정렬 기능
  </div>

  <h3>🌐 접속 방법</h3>
  <div class="step">
    <div class="step-num">1</div>
    <div class="step-content">
      <strong>스마트폰 브라우저 열기</strong>
      <p>Safari(iPhone) 또는 Chrome(Android) 앱을 실행합니다.</p>
    </div>
  </div>
  <div class="step">
    <div class="step-num">2</div>
    <div class="step-content">
      <strong>아래 주소로 접속</strong>
      <p style="font-family:monospace;font-size:15px;background:#f1f5f9;padding:8px 12px;border-radius:6px;margin-top:6px;">
        https://shanghai-travel.vercel.app
      </p>
    </div>
  </div>
  <div class="step">
    <div class="step-num">3</div>
    <div class="step-content">
      <strong>홈 화면에 추가 (선택)</strong>
      <p>iPhone: Safari → 공유 버튼(↑) → "홈 화면에 추가"<br>
         Android: Chrome → 메뉴(⋮) → "앱 설치" 또는 "홈 화면에 추가"</p>
    </div>
  </div>

  <h3>📱 하단 메뉴 구성</h3>
  <div class="nav-item"><div class="nav-icon">🏠</div><div class="nav-info"><strong>일정 (Day 1~3)</strong><span>날짜별 여행 일정 관리 및 장소 추가/변경</span></div></div>
  <div class="nav-item"><div class="nav-icon">🗺️</div><div class="nav-info"><strong>지도</strong><span>전체 명소 위치를 지도에서 확인</span></div></div>
  <div class="nav-item"><div class="nav-icon">💡</div><div class="nav-info"><strong>팁</strong><span>공항 교통편, 결제 방법 등 여행 필수 정보</span></div></div>
  <div class="nav-item"><div class="nav-icon">⚙️</div><div class="nav-info"><strong>설정</strong><span>조 변경, 앱 정보 확인</span></div></div>
</div>

<!-- ══════════════════════════════════════════════ 섹션 2: 조 선택 -->
<div class="section">
  <div class="section-header">
    <div class="section-num">2</div>
    <h2>조 선택하기</h2>
  </div>

  <div class="two-col">
    <div class="text">
      <h3>🚀 첫 실행 시 조 선택</h3>
      <p style="font-size:14px;line-height:1.8;color:#444;margin-bottom:16px;">
        앱을 처음 실행하면 <strong>조 선택 화면</strong>이 자동으로 나타납니다.
        본인이 속한 조를 선택하면 Day 2 일정이 해당 조 순서로 자동 설정됩니다.
      </p>
      <div class="step"><div class="step-num">1</div><div class="step-content"><strong>1조~4조 중 본인 조 선택</strong><p>조 이름이 적힌 버튼을 탭합니다.</p></div></div>
      <div class="step"><div class="step-num">2</div><div class="step-content"><strong>확인 버튼 탭</strong><p>선택 완료 버튼을 누르면 홈 화면으로 이동합니다.</p></div></div>
      <div class="tip-box" style="margin-top:16px;">
        <strong>💡 Day 1과 Day 3은 모든 조 동일</strong><br>
        조별로 다른 것은 <strong>Day 2 방문 순서</strong>입니다.
        방문하는 장소는 같지만 동선 순서가 다릅니다.
      </div>
    </div>
    <div class="img-wrap">
      <img src="${imgSrc('01-group-select-modal.png')}" class="screenshot" alt="조 선택 화면">
      <p class="img-caption">첫 실행 시 조 선택 화면</p>
    </div>
  </div>

  <h3>🔄 조 변경 방법</h3>
  <div class="two-col">
    <div class="text">
      <div class="step"><div class="step-num">1</div><div class="step-content"><strong>하단 메뉴 "⚙️ 설정" 탭</strong><p>화면 하단의 설정 아이콘을 탭합니다.</p></div></div>
      <div class="step"><div class="step-num">2</div><div class="step-content"><strong>"조 변경" 섹션에서 원하는 조 선택</strong><p>1~4조 버튼 중 변경할 조를 탭합니다.</p></div></div>
      <div class="warn-box" style="margin-top:16px;">
        <strong>⚠️ 주의: 커스텀 일정 저장됨</strong><br>
        각 조에서 변경한 일정(장소 추가·삭제·순서)은 조별로 따로 저장됩니다.
        다른 조로 전환했다가 돌아와도 <strong>내가 변경한 일정이 그대로 유지</strong>됩니다.
      </div>
    </div>
    <div class="img-wrap">
      <img src="${imgSrc('12-settings-group.png')}" class="screenshot" alt="설정 화면">
      <p class="img-caption">설정 화면 - 조 변경</p>
    </div>
  </div>

  <h3>📋 조별 Day 2 방문 순서</h3>
  <table>
    <tr><th>조</th><th>오전</th><th>점심 전후</th><th>오후</th><th>저녁</th></tr>
    <tr><td><strong>1조</strong></td><td>허마셴성</td><td>콜롬비아 → 월항조루 → HARMAY</td><td>우캉루 → 신천지 → 팝마트</td><td>전취덕</td></tr>
    <tr><td><strong>2조</strong></td><td>콜롬비아</td><td>허마셴성 → 월항조루 → 신천지</td><td>팝마트 → HARMAY → 빙고박스</td><td>전취덕</td></tr>
    <tr><td><strong>3조</strong></td><td>HARMAY</td><td>우캉루 → 월항조루 → 허마셴성</td><td>빙고박스 → 콜롬비아 → 신천지</td><td>전취덕</td></tr>
    <tr><td><strong>4조</strong></td><td>신천지</td><td>팝마트 → 월항조루 → 콜롬비아</td><td>허마셴성 → 우캉루 → HARMAY</td><td>전취덕</td></tr>
  </table>
</div>

<!-- ══════════════════════════════════════════════ 섹션 3: 일정 보기 -->
<div class="section">
  <div class="section-header">
    <div class="section-num">3</div>
    <h2>일정 보기 (Day 1~3)</h2>
  </div>

  <div class="three-col">
    <div class="item">
      <img src="${imgSrc('02-day1-schedule.png')}" class="screenshot-full" alt="Day 1">
      <p class="img-caption">Day 1 일정</p>
    </div>
    <div class="item">
      <img src="${imgSrc('03-day2-schedule.png')}" class="screenshot-full" alt="Day 2">
      <p class="img-caption">Day 2 일정</p>
    </div>
    <div class="item">
      <img src="${imgSrc('04-day3-schedule.png')}" class="screenshot-full" alt="Day 3">
      <p class="img-caption">Day 3 일정</p>
    </div>
  </div>

  <h3>📅 날짜 전환 방법</h3>
  <p style="font-size:14px;line-height:1.8;color:#444;">
    화면 상단의 <strong>Day 1 / Day 2 / Day 3</strong> 탭을 탭하면 해당 날짜의 일정으로 전환됩니다.
    현재 선택된 날짜는 파란색 밑줄로 표시됩니다.
  </p>

  <h3>📌 장소 카드 읽는 법</h3>
  <div class="tip-box">
    <strong>카드 좌측 숫자</strong>: 방문 순서 번호 (▲▼ 버튼으로 순서 변경 가능)<br>
    <strong>장소 이름 (한국어/중국어)</strong>: 탭하면 상세 정보 페이지로 이동<br>
    <strong>카테고리 배지</strong>: 🍜 음식점 / 🏛️ 관광지 / 🛍️ 쇼핑 / ☕ 카페<br>
    <strong>우측 상단 ✕ 버튼</strong>: 해당 장소를 일정에서 제거
  </div>
</div>

<!-- ══════════════════════════════════════════════ 섹션 4: 일정 커스터마이징 -->
<div class="section">
  <div class="section-header">
    <div class="section-num">4</div>
    <h2>일정 커스터마이징</h2>
  </div>

  <h3>➕ 장소 추가하기</h3>
  <div class="two-col">
    <div class="text">
      <div class="step"><div class="step-num">1</div><div class="step-content"><strong>하단 "장소 추가" 버튼 탭</strong><p>파란색 "＋ 장소 추가" 버튼을 탭합니다.</p></div></div>
      <div class="step"><div class="step-num">2</div><div class="step-content"><strong>검색창에 장소 이름 입력</strong><p>한국어 또는 중국어로 검색합니다.<br>예: "성황묘", "블루보틀", "와이탄"</p></div></div>
      <div class="step"><div class="step-num">3</div><div class="step-content"><strong>결과에서 원하는 장소 선택</strong><p>장소 이름 옆 "+" 버튼 또는 장소명을 탭합니다.</p></div></div>
    </div>
    <div class="img-wrap">
      <img src="${imgSrc('05-add-venue-modal.png')}" class="screenshot" alt="장소 추가">
      <p class="img-caption">장소 추가 모달</p>
    </div>
  </div>

  <h3>↕️ 순서 변경하기</h3>
  <p style="font-size:14px;line-height:1.8;color:#444;margin-bottom:12px;">
    각 장소 카드 좌측의 <strong>▲ (위로)</strong> / <strong>▼ (아래로)</strong> 버튼을 탭하여 방문 순서를 변경합니다.
    첫 번째 장소의 ▲ 버튼과 마지막 장소의 ▼ 버튼은 비활성화됩니다.
  </p>

  <h3>📍 최단경로 자동 정렬</h3>
  <div class="two-col">
    <div class="text">
      <p style="font-size:14px;line-height:1.8;color:#444;margin-bottom:12px;">
        장소들을 지도상 <strong>최단 이동거리 순서</strong>로 자동 재배열하는 기능입니다.
        직접 순서를 정하기 어려울 때 유용합니다.
      </p>
      <div class="step"><div class="step-num">1</div><div class="step-content"><strong>하단 "📍 최단경로" 버튼 탭</strong><p>장소가 2개 이상일 때 활성화됩니다.</p></div></div>
      <div class="step"><div class="step-num">2</div><div class="step-content"><strong>자동으로 순서 재배열됨</strong><p>현재 목록에서 시작해 가장 가까운 장소 순서로 정렬됩니다.</p></div></div>
      <div class="tip-box" style="margin-top:12px;">
        <strong>💡 Nearest Neighbor 알고리즘 사용</strong><br>
        현재 위치에서 가장 가까운 미방문 장소를 순서대로 연결하는 방식으로 최적 경로를 계산합니다.
      </div>
    </div>
    <div class="img-wrap">
      <img src="${imgSrc('13-shortest-path-btn.png')}" class="screenshot" alt="최단경로 버튼">
      <p class="img-caption">하단 액션 버튼 영역</p>
    </div>
  </div>

  <h3>🔄 일정 초기화</h3>
  <p style="font-size:14px;line-height:1.8;color:#444;">
    "초기화" 버튼을 탭하면 해당 조의 <strong>기본 일정으로 되돌릴 수 있습니다</strong>.
    확인 팝업이 나타나며, 취소도 가능합니다.
  </p>
</div>

<!-- ══════════════════════════════════════════════ 섹션 5: 장소 상세 -->
<div class="section">
  <div class="section-header">
    <div class="section-num">5</div>
    <h2>장소 상세 정보</h2>
  </div>

  <div class="two-col">
    <div class="text">
      <p style="font-size:14px;line-height:1.8;color:#444;margin-bottom:16px;">
        일정의 장소 카드를 탭하면 해당 장소의 상세 정보를 확인할 수 있습니다.
      </p>
      <div class="tip-box">
        <strong>📋 상세 페이지에서 확인 가능한 정보</strong><br>
        • <strong>장소명</strong> (한국어 / 중국어 병기)<br>
        • <strong>카테고리</strong> (음식점, 관광지, 쇼핑, 카페 등)<br>
        • <strong>영업시간</strong><br>
        • <strong>주소</strong> (중국어 주소 포함)<br>
        • <strong>대표 메뉴 & 추천 아이템</strong><br>
        • <strong>예상 비용</strong> (CNY / KRW 환산)<br>
        • <strong>알리페이 한도 경고</strong> (¥1,000 초과 시)<br>
        • <strong>길찾기 버튼</strong> → Amap 연동
      </div>
    </div>
    <div class="img-wrap">
      <img src="${imgSrc('06-venue-detail.png')}" class="screenshot" alt="장소 상세">
      <p class="img-caption">장소 상세 페이지</p>
    </div>
  </div>
</div>

<!-- ══════════════════════════════════════════════ 섹션 6: 지도 -->
<div class="section">
  <div class="section-header">
    <div class="section-num">6</div>
    <h2>지도에서 위치 확인</h2>
  </div>

  <div class="two-col">
    <div class="text">
      <h3>🗺️ 지도 화면 구성</h3>
      <p style="font-size:14px;line-height:1.8;color:#444;margin-bottom:16px;">
        하단 메뉴의 "지도" 탭을 탭하면 OpenStreetMap 기반 지도가 나타납니다.
        선택한 Day의 모든 방문 장소에 번호 마커가 표시됩니다.
      </p>
      <div class="tip-box">
        <strong>📌 지도 마커 색상</strong><br>
        • <strong>파란 번호 마커</strong>: 일정 순서대로 표시<br>
        • <strong>초록 마커</strong>: 내 현재 위치 (GPS 허용 시)<br>
        • <strong>파란 선</strong>: 방문 예정 경로
      </div>
    </div>
    <div class="img-wrap">
      <img src="${imgSrc('07-map-page.png')}" class="screenshot" alt="지도">
      <p class="img-caption">지도 화면</p>
    </div>
  </div>

  <h3>🔍 Day 필터 사용법</h3>
  <div class="two-col">
    <div class="text">
      <p style="font-size:14px;line-height:1.8;color:#444;margin-bottom:12px;">
        지도 상단의 <strong>Day 1 / Day 2 / Day 3</strong> 탭을 탭하면
        해당 날짜의 장소만 지도에 표시됩니다.
      </p>
      <div class="step"><div class="step-num">1</div><div class="step-content"><strong>상단 탭에서 날짜 선택</strong><p>Day 1, Day 2, Day 3 중 확인하고 싶은 날짜를 탭합니다.</p></div></div>
      <div class="step"><div class="step-num">2</div><div class="step-content"><strong>🍜 맛집 탭</strong><p>모든 날짜의 음식점·카페만 모아서 볼 수 있습니다.</p></div></div>
      <div class="step"><div class="step-num">3</div><div class="step-content"><strong>📍 현재 위치 버튼</strong><p>지도 우하단 버튼을 탭하면 내 GPS 위치로 지도가 이동합니다.</p></div></div>
    </div>
    <div class="img-wrap">
      <img src="${imgSrc('08-map-day1-filter.png')}" class="screenshot" alt="지도 필터">
      <p class="img-caption">Day 1 필터 적용된 지도</p>
    </div>
  </div>

  <div class="warn-box">
    <strong>⚠️ GPS 사용 안내</strong><br>
    앱이 현재 위치를 요청할 수 있습니다. 허용하면 내 위치가 초록 마커로 표시되고
    우하단 위치 버튼이 활성화됩니다. 위치 정보는 기기에서만 처리되며 서버로 전송되지 않습니다.
  </div>
</div>

<!-- ══════════════════════════════════════════════ 섹션 7: Amap 연동 -->
<div class="section">
  <div class="section-header">
    <div class="section-num">7</div>
    <h2>Amap(高德地图) 길찾기 연동</h2>
  </div>

  <p style="font-size:15px;line-height:1.8;color:#444;margin-bottom:20px;">
    Amap(高德地图, 가오더 지도)은 중국에서 가장 널리 사용되는 내비게이션 앱입니다.
    상하이 여행 가이드 앱과 직접 연동되어 탭 한 번으로 길찾기를 시작할 수 있습니다.
  </p>

  <div class="tip-box">
    <strong>📱 Amap 사전 설치 권장</strong><br>
    중국에서는 Google Maps 사용이 제한되므로, 출발 전 Amap(高德地图)을 미리 스마트폰에 설치해 두세요.<br>
    • App Store / Google Play에서 "高德地图" 또는 "Amap" 검색
  </div>

  <h3>📍 길찾기 실행 방법</h3>

  <div class="step"><div class="step-num">1</div><div class="step-content"><strong>일정에서 장소 카드 탭</strong><p>가고 싶은 장소의 카드를 탭하여 상세 페이지로 이동합니다.</p></div></div>
  <div class="step"><div class="step-num">2</div><div class="step-content"><strong>"길찾기" 버튼 탭</strong><p>상세 페이지에서 <strong>"🗺️ 길찾기 (Amap)"</strong> 버튼을 탭합니다.</p></div></div>
  <div class="step"><div class="step-num">3</div><div class="step-content"><strong>Amap 앱이 자동으로 열림</strong><p>현재 위치 → 목적지로 경로가 자동으로 설정됩니다.<br>지하철, 도보, 택시 등 이동 수단 선택 후 안내를 시작하세요.</p></div></div>

  <div class="warn-box" style="margin-top: 20px;">
    <strong>⚠️ Amap이 설치되어 있지 않다면</strong><br>
    앱이 없는 경우 Amap 웹사이트로 연결됩니다. 웹에서도 길찾기를 사용할 수 있지만,
    앱 설치 시 더 정확한 실시간 내비게이션을 이용할 수 있습니다.
  </div>

  <h3>💳 기타 연동 서비스</h3>
  <div class="tip-box">
    <strong>대중교통 이용 팁</strong><br>
    • 상하이 지하철: Amap에서 "地铁" 탭 선택<br>
    • 택시(滴滴): Amap에서 "打车" 탭 선택<br>
    • 도보 이동 예상 시간은 Amap의 "步行" 탭에서 확인
  </div>
</div>

<!-- ══════════════════════════════════════════════ 섹션 8: 여행 팁 -->
<div class="section">
  <div class="section-header">
    <div class="section-num">8</div>
    <h2>여행 팁</h2>
  </div>

  <div class="two-col">
    <div class="text">
      <h3>✈️ 공항 교통 안내</h3>
      <p style="font-size:14px;line-height:1.8;color:#444;margin-bottom:12px;">
        하단 메뉴 → 팁 → "공항 안내" 탭에서 상세 정보를 확인하세요.
      </p>
      <div class="tip-box">
        <strong>푸동 공항 → 시내</strong><br>
        • <strong>지하철 2호선</strong>: 약 70분, ¥7~10<br>
        • <strong>마그레브</strong>: 약 8분, ¥50/¥100 (급행)<br>
        • <strong>택시</strong>: 약 40~60분, ¥120~200
      </div>
    </div>
    <div class="img-wrap">
      <img src="${imgSrc('09-tips-page.png')}" class="screenshot" alt="팁 페이지">
      <p class="img-caption">여행 팁 메인 페이지</p>
    </div>
  </div>

  <h3>💳 중국 결제 방법</h3>
  <div class="two-col">
    <div class="text">
      <div class="tip-box">
        <strong>위챗페이 (微信支付)</strong><br>
        • 한도: 제한 없음 (설정에 따라 다름)<br>
        • 방법: 위챗앱 → 지갑 → QR 코드 스캔<br>
        • 외국인도 여권 인증 후 사용 가능
      </div>
      <div class="tip-box" style="margin-top:12px;">
        <strong>알리페이 (支付宝)</strong><br>
        • <strong>한도: 1회 ¥1,000</strong> (외국인 계정 기준)<br>
        • 방법: 알리페이앱 → 결제 → QR 코드<br>
        • ¥1,000 초과 결제 항목은 앱에서 경고 표시
      </div>
    </div>
    <div class="img-wrap">
      <img src="${imgSrc('11-tips-payment.png')}" class="screenshot" alt="결제 안내">
      <p class="img-caption">결제 방법 안내</p>
    </div>
  </div>
</div>

</body>
</html>`;

  const htmlPath = path.join(OUT_DIR, 'manual.html');
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log(`✅ HTML 매뉴얼 저장: ${htmlPath}`);

  // ── PDF 생성 ──────────────────────────────────────────────────────────────
  console.log('\n📄 PDF 생성 중...');
  const browser2 = await chromium.launch({ headless: true, executablePath: CHROME_PATH });
  const page2 = await browser2.newPage();
  await page2.setContent(html, { waitUntil: 'networkidle' });
  await page2.waitForTimeout(2000);

  const pdfPath = path.join(OUT_DIR, '상하이IBT여행가이드_사용매뉴얼.pdf');
  await page2.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
  });

  await browser2.close();
  console.log(`\n✅ PDF 생성 완료: ${pdfPath}`);
  console.log('\n🎉 매뉴얼 생성이 완료되었습니다!');
}

main().catch(err => {
  console.error('❌ 오류:', err.message);
  process.exit(1);
});
