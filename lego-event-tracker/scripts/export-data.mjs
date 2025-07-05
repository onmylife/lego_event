import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.resolve(process.cwd(), 'db', 'lego_events.db');
const OUTPUT_DIR = path.resolve(process.cwd(), 'public', 'data');
const SITES_JSON_PATH = path.join(OUTPUT_DIR, 'sites.json');
const EVENTS_JSON_PATH = path.join(OUTPUT_DIR, 'events.json');

function exportData() {
  // 데이터베이스 파일 존재 확인
  if (!fs.existsSync(DB_PATH)) {
    console.error(`Database file not found at ${DB_PATH}.`);
    console.error('Please initialize the database first using "npm run db:init" and ensure it contains data.');
    process.exit(1); // 오류 발생 시 스크립트 종료
  }

  let db;
  try {
    db = new Database(DB_PATH, { readonly: true }); // 읽기 전용으로 DB 열기
  } catch (error) {
    console.error(`Failed to connect to database at ${DB_PATH}:`, error);
    process.exit(1);
  }

  console.log('Successfully connected to the database.');

  // 출력 디렉토리 생성 (없으면)
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created directory: ${OUTPUT_DIR}`);
  }

  try {
    // sites 데이터 가져오기
    const sitesStmt = db.prepare('SELECT * FROM sites');
    const sitesData = sitesStmt.all();
    fs.writeFileSync(SITES_JSON_PATH, JSON.stringify(sitesData, null, 2));
    console.log(`Successfully exported ${sitesData.length} sites to ${SITES_JSON_PATH}`);

    // events 데이터 가져오기 (site_name을 JOIN 해서 가져올 수도 있지만, 여기서는 기본 테이블 구조만 export)
    // API 라우트에서 했던 것처럼 site_name을 JOIN 하려면 쿼리 수정 필요.
    // 여기서는 page.tsx 에서 site_id를 이용해 site_name을 매핑한다고 가정하고 기본 event 데이터만 export.
    // 또는, events 테이블에 site_name을 중복 저장하는 방법도 있으나 정규화 위배.
    // 가장 좋은 방법은 API에서 했던 것처럼 JOIN된 데이터를 export 하는 것입니다.
    const eventsQuery = `
      SELECT
        e.id,
        e.site_id,
        e.name,
        e.start_date,
        e.end_date,
        e.description,
        e.benefit,
        e.url,
        e.event_type,
        s.name as site_name
      FROM events e
      JOIN sites s ON e.site_id = s.id;
    `;
    const eventsStmt = db.prepare(eventsQuery);
    const eventsData = eventsStmt.all();
    fs.writeFileSync(EVENTS_JSON_PATH, JSON.stringify(eventsData, null, 2));
    console.log(`Successfully exported ${eventsData.length} events to ${EVENTS_JSON_PATH}`);

  } catch (error) {
    console.error('Error during data export:', error);
    process.exit(1);
  } finally {
    if (db) {
      db.close();
      console.log('Database connection closed.');
    }
  }
}

exportData();
