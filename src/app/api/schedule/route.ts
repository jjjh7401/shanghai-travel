import { NextRequest, NextResponse } from "next/server";
import { getDb, ensureTable } from "@/lib/db";

export async function GET(request: NextRequest) {
  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: "데이터베이스가 설정되지 않았습니다. DATABASE_URL 환경변수를 확인해주세요." },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const groupId = searchParams.get("groupId");

  if (!groupId || !["1", "2", "3", "4"].includes(groupId)) {
    return NextResponse.json({ error: "올바른 groupId를 입력하세요 (1-4)" }, { status: 400 });
  }

  const parsedGroupId = parseInt(groupId, 10);

  try {
    await ensureTable(db);
    const rows = await db`
      SELECT data, updated_at FROM schedules WHERE group_id = ${parsedGroupId}
    `;

    if (rows.length === 0) {
      return NextResponse.json({ data: null, message: "저장된 일정이 없습니다." });
    }

    return NextResponse.json({
      data: rows[0].data,
      updatedAt: rows[0].updated_at,
    });
  } catch (error) {
    console.error("일정 조회 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: "데이터베이스가 설정되지 않았습니다. DATABASE_URL 환경변수를 확인해주세요." },
      { status: 503 }
    );
  }

  let body: { groupId: number; data: unknown };
  try {
    body = (await request.json()) as { groupId: number; data: unknown };
  } catch {
    return NextResponse.json({ error: "올바른 JSON 형식이 아닙니다." }, { status: 400 });
  }

  const { groupId, data } = body;

  if (!groupId || ![1, 2, 3, 4].includes(groupId)) {
    return NextResponse.json({ error: "올바른 groupId를 입력하세요 (1-4)" }, { status: 400 });
  }

  // ScheduleMap 기본 검증
  if (!data || typeof data !== "object") {
    return NextResponse.json({ error: "올바른 일정 데이터가 아닙니다." }, { status: 400 });
  }

  const dataJson = JSON.stringify(data);

  try {
    await ensureTable(db);
    await db`
      INSERT INTO schedules (group_id, data, updated_at)
      VALUES (${groupId}, ${dataJson}::jsonb, now())
      ON CONFLICT (group_id) DO UPDATE
        SET data = EXCLUDED.data,
            updated_at = now()
    `;

    return NextResponse.json({ success: true, message: "일정이 업로드되었습니다." });
  } catch (error) {
    console.error("일정 저장 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
