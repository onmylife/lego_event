// scripts/initialize-db.mjs
import db from '../db/db.mjs'; // createTables는 db.mjs에서 이미 호출됨

function initializeDatabase() {
  if (!db) {
    console.error('Database connection failed. Cannot initialize.');
    process.exit(1);
  }

  console.log('Initializing database and seeding sample data...');

  // 테이블 생성은 db.mjs 임포트 시 자동으로 처리됨
  console.log('Database schema ensured (tables created if they did not exist).');

  // 샘플 데이터 삽입
  try {
    // Sample Sites
    const sites = [
      { name: '레고 공식몰' },
      { name: '롯데ON' },
      { name: '이마트' },
      { name: '토이저러스' },
      { name: '네이버 레고 스토어' }
    ];

    const insertSite = db.prepare("INSERT OR IGNORE INTO sites (name) VALUES (@name)");
    sites.forEach(site => {
      insertSite.run(site);
    });
    console.log('Sample sites seeded.');

    // site_id를 가져오기 위해 먼저 사이트 조회
    const siteNameToIdMap = new Map();
    const allSites = db.prepare("SELECT id, name FROM sites").all();
    allSites.forEach(site => siteNameToIdMap.set(site.name, site.id));

    // Sample Events
    const events = [
      { name: '7월 여름맞이 세일', site_name: '레고 공식몰', start_date: '2024-07-01', end_date: '2024-07-15', description: '일부 품목 최대 30% 할인!', benefit: '30% 할인', event_type: '할인', url: 'https://www.lego.com/ko-kr' },
      { name: '신제품 출시 기념 프로모션', site_name: '레고 공식몰', start_date: '2024-07-20', end_date: '2024-07-31', description: '새로운 테크닉 시리즈 구매 시 특별 사은품 증정.', benefit: '특별 사은품', event_type: '신제품', url: 'https://www.lego.com/ko-kr' },
      { name: '롯데ON 레고 브랜드 위크', site_name: '롯데ON', start_date: '2024-07-05', end_date: '2024-07-12', description: '롯데ON 단독 할인 및 쿠폰 제공', benefit: '15% 쿠폰', event_type: '할인', url: 'https://www.lotteon.com' },
      { name: '이마트 레고 체험존 오픈', site_name: '이마트', start_date: '2024-08-01', end_date: '2024-08-15', description: '주요 이마트 매장 레고 체험존 운영 및 현장 할인', benefit: '현장 10% 할인', event_type: '체험', url: 'https://www.emart.com' },
      { name: '토이저러스 한정판 발매', site_name: '토이저러스', start_date: '2024-08-10', end_date: '2024-08-20', description: '온라인몰 단독 한정판 레고 세트 판매', benefit: '한정판 세트', event_type: '한정판', url: 'https://www.toysrus.co.kr' },
      { name: '네이버 레고 스토어 8월 쿠폰', site_name: '네이버 레고 스토어', start_date: '2024-08-01', end_date: '2024-08-31', description: '스토어찜 고객 대상 5% 할인 쿠폰', benefit: '5% 할인', event_type: '할인', url: 'https://brand.naver.com/legokorea' },
      { name: '레고 공식몰 9월 더블 포인트', site_name: '레고 공식몰', start_date: '2024-09-01', end_date: '2024-09-07', description: 'VIP 회원 대상 더블 포인트 적립', benefit: 'VIP 더블 포인트', event_type: '사은품' }, // URL 없는 경우 테스트
    ];

    const insertEvent = db.prepare(`
      INSERT OR IGNORE INTO events (name, site_id, start_date, end_date, description, benefit, url, event_type)
      VALUES (@name, @site_id, @start_date, @end_date, @description, @benefit, @url, @event_type)
    `);

    events.forEach(event => {
      const site_id = siteNameToIdMap.get(event.site_name);
      if (site_id) {
        insertEvent.run({ ...event, site_id });
      } else {
        console.warn(`Site_id not found for site: ${event.site_name}. Event "${event.name}" not seeded.`);
      }
    });
    console.log('Sample events seeded.');

  } catch (error) {
    console.error('Error seeding sample data:', error);
  } finally {
    if (db) {
      // 스크립트 실행 후에는 연결을 닫아주는 것이 좋음
      db.close((err) => {
        if (err) {
          return console.error('Failed to close the database connection:', err.message);
        }
        console.log('Database connection closed after seeding.');
      });
    }
  }
}

initializeDatabase();
