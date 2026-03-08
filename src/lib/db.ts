// Neon 데이터베이스 연결 설정
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

// 공유 타입: neon() 반환값
export type NeonDb = NeonQueryFunction<false, false>;

// DATABASE_URL 환경변수가 없으면 null 반환 (로컬 개발 시 DB 없이도 앱 실행 가능)
export function getDb(): NeonDb | null {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  return neon(process.env.DATABASE_URL);
}

// 스케줄 테이블 초기화 함수 (tagged template literal 방식으로 실행)
export async function ensureTable(db: NeonDb): Promise<void> {
  await db`
    CREATE TABLE IF NOT EXISTS schedules (
      group_id   INTEGER UNIQUE NOT NULL,
      data       JSONB NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    )
  `;
}
