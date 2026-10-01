export interface Applicant {
  id: string; // 예: "2026-CS-0104"
  name: string; // 이름
  phone: string; // 전화번호
  birthDate: string; // 생년월일 (YYYY-MM-DD)
  gradeType: 'gpa' | 'csat' | 'score'; // 성적 구분 (내신 등급 / 수능 등급 / 환산 점수)
  gradeValue: string; // 성적 (하나)
  region: string; // 거주지역
  highSchool: string; // 출신 고등학교
  department: string; // 지원 학과 이름
  applicationType: string; // 전형 구분
  notes?: string; // 추가 메모/지원각오
  submittedAt: string; // 접수일시
}

export const REGIONS = [
  '서울특별시',
  '경기도',
  '인천광역시',
  '부산광역시',
  '대구광역시',
  '광주광역시',
  '대전광역시',
  '울산광역시',
  '세종특별자치시',
  '강원특별자치도',
  '충청북도',
  '충청남도',
  '전북특별자치도',
  '전라남도',
  '경상북도',
  '경상남도',
  '제주특별자치도',
] as const;

export interface DepartmentOption {
  id: string;
  name: string;
  college: string;
  code: string;
  description: string;
}

export const DEPARTMENTS: DepartmentOption[] = [
  {
    id: 'cs',
    name: '컴퓨터공학과',
    college: '공과대학',
    code: 'CS',
    description: '소프트웨어 공학, 시스템 설계 및 미래 지능형 컴퓨팅 인재 양성',
  },
  {
    id: 'ai',
    name: 'AI데이터사이언스학과',
    college: '소프트웨어융합대학',
    code: 'AI',
    description: '인공지능, 머신러닝, 딥러닝 및 빅데이터 분석 특성화 학과',
  },
  {
    id: 'biz',
    name: '글로벌경영학과',
    college: '경영대학',
    code: 'BM',
    description: '글로벌 전략, 혁신 마케팅 및 핀테크를 아우르는 미래 비즈니스 리더',
  },
  {
    id: 'media',
    name: '미디어커뮤니케이션학과',
    college: '사회과학대학',
    code: 'MC',
    description: '디지털 영상 미디어, 콘텐츠 크리에이티브 및 저널리즘 연구',
  },
];

export const APPLICATION_TYPES = [
  '2026학년도 수시 일반전형',
  '2026학년도 학생부종합전형',
  '2026학년도 정시 일반전형',
  '2026학년도 농어촌/기회균형전형',
] as const;
