import { Applicant, DEPARTMENTS } from '../types';
import * as XLSX from 'xlsx';

const STORAGE_KEY = 'univ_freshman_applicants_v1';

export const SAMPLE_APPLICANTS: Applicant[] = [
  {
    id: '2026-CS-0001',
    name: '김민준',
    phone: '010-3849-1928',
    birthDate: '2007-03-15',
    gradeType: 'gpa',
    gradeValue: '1.45등급',
    region: '서울특별시',
    highSchool: '서울과학고등학교',
    department: '컴퓨터공학과',
    applicationType: '2026학년도 학생부종합전형',
    notes: '전국 청소년 알고리즘 경시대회 은상 수상, 오픈소스 프로젝트 기여 경험 있음',
    submittedAt: '2026-09-28T14:20:00.000Z',
  },
  {
    id: '2026-AI-0002',
    name: '이지원',
    phone: '010-8291-4471',
    birthDate: '2007-08-22',
    gradeType: 'score',
    gradeValue: '96.5점 (환산)',
    region: '경기도',
    highSchool: '경기고등학교',
    department: 'AI데이터사이언스학과',
    applicationType: '2026학년도 수시 일반전형',
    notes: '고교 동아리에서 기후 변화 예측 데이터 모델링 연구 진행',
    submittedAt: '2026-09-29T10:15:00.000Z',
  },
  {
    id: '2026-BM-0003',
    name: '박서현',
    phone: '010-5120-7734',
    birthDate: '2007-11-04',
    gradeType: 'gpa',
    gradeValue: '2.10등급',
    region: '부산광역시',
    highSchool: '부산외국어고등학교',
    department: '글로벌경영학과',
    applicationType: '2026학년도 정시 일반전형',
    notes: '토플(TOEFL) 112점 취득, 청소년 모의유엔 최우수상',
    submittedAt: '2026-09-29T16:45:00.000Z',
  },
  {
    id: '2026-MC-0004',
    name: '최도윤',
    phone: '010-9943-3122',
    birthDate: '2007-05-19',
    gradeType: 'csat',
    gradeValue: '수능 1등급',
    region: '대구광역시',
    highSchool: '대구경북고등학교',
    department: '미디어커뮤니케이션학과',
    applicationType: '2026학년도 수시 일반전형',
    notes: '단편 다큐멘터리 연출 및 청소년 영상제 대상 수상',
    submittedAt: '2026-09-30T09:10:00.000Z',
  },
];

export function getStoredApplicants(): Applicant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed initial samples on first launch so the dashboard is immediately rich and testable
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_APPLICANTS));
      return SAMPLE_APPLICANTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to parse applicants from localStorage:', e);
    return [];
  }
}

export function saveApplicantsToStorage(applicants: Applicant[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applicants));
  } catch (e) {
    console.error('Failed to save applicants to localStorage:', e);
  }
}

export function generateApplicationId(departmentName: string, existingApplicants: Applicant[]): string {
  const dept = DEPARTMENTS.find(d => d.name === departmentName);
  const code = dept ? dept.code : 'UN';
  const year = '2026';
  
  // Count existing with this dept
  const deptCount = existingApplicants.filter(a => a.id.includes(`-${code}-`)).length + 1;
  const seq = String(deptCount).padStart(4, '0');
  
  return `${year}-${code}-${seq}`;
}

/**
 * Generates and downloads a real Excel (.xlsx) file containing applicants list
 */
export function exportToExcel(applicants: Applicant[], filename?: string): void {
  if (applicants.length === 0) {
    alert('내보낼 접수 내역이 없습니다.');
    return;
  }

  const data = applicants.map(app => ({
    '접수번호': app.id,
    '이름': app.name,
    '전화번호': app.phone,
    '생년월일': app.birthDate,
    '지원학과': app.department,
    '성적구분': app.gradeType === 'gpa' ? '고교 내신' : app.gradeType === 'csat' ? '수능 등급' : '환산 점수',
    '성적': app.gradeValue,
    '거주지역': app.region,
    '출신고등학교': app.highSchool,
    '전형구분': app.applicationType,
    '비고/특기사항': app.notes || '',
    '접수일시': new Date(app.submittedAt).toLocaleString('ko-KR'),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths for Korean Excel readability
  worksheet['!cols'] = [
    { wch: 16 }, // 접수번호
    { wch: 12 }, // 이름
    { wch: 16 }, // 전화번호
    { wch: 14 }, // 생년월일
    { wch: 24 }, // 지원학과
    { wch: 12 }, // 성적구분
    { wch: 14 }, // 성적
    { wch: 14 }, // 거주지역
    { wch: 22 }, // 출신고등학교
    { wch: 26 }, // 전형구분
    { wch: 32 }, // 비고
    { wch: 24 }, // 접수일시
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '신입생접수대장');

  const defaultFilename = filename || `2026학년도_신입생_원서접수대장_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, defaultFilename);
}

/**
 * Downloads a single applicant's formal application form as an official Excel (.xlsx) file
 */
export function exportSingleApplicantExcel(app: Applicant): void {
  const metaData = [
    ['2026학년도 대학교 신입생 입학원서 (접수증)'],
    ['한국대학교 입학관리본부'],
    [],
    ['항목', '입력 내용'],
    ['접수번호', app.id],
    ['지원자 성명', app.name],
    ['전화번호', app.phone],
    ['생년월일', app.birthDate],
    ['지원 학과', app.department],
    ['전형 구분', app.applicationType],
    ['거주 지역', app.region],
    ['출신 고등학교', app.highSchool],
    ['제출 성적', `${app.gradeType === 'gpa' ? '[내신] ' : app.gradeType === 'csat' ? '[수능] ' : '[환산] '}${app.gradeValue}`],
    ['비고 / 지원각오', app.notes || '없음'],
    ['원서 접수 일시', new Date(app.submittedAt).toLocaleString('ko-KR')],
    [],
    ['* 본 원서는 정상 접수되어 입학처 데이터베이스에 등록되었습니다.']
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(metaData);
  worksheet['!cols'] = [{ wch: 18 }, { wch: 42 }];
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '입학원서');
  
  const filename = `신입생입학원서_${app.name}_${app.id}.xlsx`;
  XLSX.writeFile(workbook, filename);
}

/**
 * Generates and downloads a clean CSV file encoded with UTF-8 BOM
 * ensuring MS Excel & Hangul open without character encoding issues.
 */
export function exportToCSV(applicants: Applicant[]): void {
  if (applicants.length === 0) {
    alert('내보낼 접수 내역이 없습니다.');
    return;
  }

  const headers = [
    '접수번호',
    '이름',
    '전화번호',
    '생년월일',
    '지원학과',
    '성적구분',
    '성적',
    '거주지역',
    '출신고등학교',
    '전형구분',
    '비고/특기사항',
    '접수일시',
  ];

  const rows = applicants.map(app => [
    `"${app.id}"`,
    `"${app.name.replace(/"/g, '""')}"`,
    `"${app.phone}"`,
    `"${app.birthDate}"`,
    `"${app.department.replace(/"/g, '""')}"`,
    `"${app.gradeType === 'gpa' ? '내신등급' : app.gradeType === 'csat' ? '수능등급' : '환산점수'}"`,
    `"${app.gradeValue.replace(/"/g, '""')}"`,
    `"${app.region.replace(/"/g, '""')}"`,
    `"${app.highSchool.replace(/"/g, '""')}"`,
    `"${app.applicationType.replace(/"/g, '""')}"`,
    `"${(app.notes || '').replace(/"/g, '""')}"`,
    `"${new Date(app.submittedAt).toLocaleString('ko-KR')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `2026학년도_신입생_원서접수대장_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format Korean phone numbers automatically (e.g. 01012345678 -> 010-1234-5678)
 */
export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/[^0-9]/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}
