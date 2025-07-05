import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// 데이터베이스 파일 경로 설정
const DB_DIR = path.resolve(process.cwd(), 'db');
const DB_PATH = path.join(DB_DIR, 'lego_events.db');

// db 디렉토리가 없으면 생성
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// 데이터베이스 인스턴스 생성 (싱글톤처럼 사용 가능)
// Next.js 개발 환경에서는 hot-reloading으로 인해 여러 인스턴스가 생성될 수 있으므로 주의.
// 프로덕션에서는 보통 한 번만 초기화됩니다.
/** @type {import('better-sqlite3').Database} */
let db;

try {
  db = new Database(DB_PATH, { verbose: console.log }); // 개발 중 쿼리 로깅
} catch (error) {
  console.error('Failed to connect to SQLite database:', error);
  // 실제 프로덕션에서는 이 오류를 더 견고하게 처리해야 합니다.
  // 예를 들어, 애플리케이션 시작을 중단하거나, 대체 로직을 수행할 수 있습니다.
  // 여기서는 db가 undefined 상태로 남아있게 됩니다.
}


/**
 * 테이블을 생성하는 함수
 * @param {import('better-sqlite3').Database} dbInstance
 */
function createTables(dbInstance) {
  if (!dbInstance) {
    console.error('Database instance is not available. Cannot create tables.');
    return;
  }

  const createSitesTable = `
    CREATE TABLE IF NOT EXISTS sites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
  `;

  const createEventsTable = `
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      site_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      description TEXT,
      benefit TEXT,
      url TEXT,
      event_type TEXT CHECK(event_type IN ('할인', '신제품', '사은품', '체험', '한정판')),
      FOREIGN KEY (site_id) REFERENCES sites (id) ON DELETE CASCADE
    );
  `;

  try {
    dbInstance.exec(createSitesTable);
    dbInstance.exec(createEventsTable);
    console.log('Tables "sites" and "events" created or already exist.');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

// 애플리케이션 시작 시 또는 필요할 때 테이블 생성 함수 호출
if (db) {
  createTables(db);
}

// 데이터베이스 인스턴스 내보내기
export default db;

// 필요시 테이블 생성 함수도 내보낼 수 있습니다.
export { createTables };
