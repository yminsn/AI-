import React, { useState, useEffect } from 'react';
import { Applicant } from './types';
import {
  getStoredApplicants,
  saveApplicantsToStorage,
  generateApplicationId,
  SAMPLE_APPLICANTS,
  exportToCSV,
  exportToExcel,
  exportSingleApplicantExcel,
} from './utils/storage';
import { ApplicationForm } from './components/ApplicationForm';
import { ApplicantList } from './components/ApplicantList';
import { AdmissionSlipModal } from './components/AdmissionSlipModal';
import { EditApplicantModal } from './components/EditApplicantModal';
import {
  School,
  FileText,
  ListFilter,
  BookOpen,
  Download,
  CheckCircle,
  HelpCircle,
  PhoneCall,
  Calendar,
  Clock,
  ExternalLink
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'form' | 'list' | 'guide'>('form');
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [selectedSlipApplicant, setSelectedSlipApplicant] = useState<Applicant | null>(null);
  const [isNewSubmission, setIsNewSubmission] = useState(false);
  const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize from storage
  useEffect(() => {
    const data = getStoredApplicants();
    setApplicants(data);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handle new submission
  const handleFormSubmit = (
    data: Omit<Applicant, 'id' | 'submittedAt'>,
    autoExcel: boolean = true
  ) => {
    const newId = generateApplicationId(data.department, applicants);
    const newApplicant: Applicant = {
      ...data,
      id: newId,
      submittedAt: new Date().toISOString(),
    };

    const updated = [newApplicant, ...applicants];
    setApplicants(updated);
    saveApplicantsToStorage(updated);

    // If autoExcel is enabled, download updated Excel sheet immediately
    if (autoExcel) {
      try {
        exportToExcel(
          updated,
          `2026학년도_신입생_원서접수대장_${newApplicant.name}_포함_${new Date().toISOString().slice(0, 10)}.xlsx`
        );
      } catch (err) {
        console.error('Excel export failed:', err);
      }
    }

    // Open admission slip modal with new submission indicator
    setSelectedSlipApplicant(newApplicant);
    setIsNewSubmission(true);
    showToast(
      autoExcel
        ? `[${newApplicant.name}] 수험생의 원서가 저장되었으며 엑셀 파일(.xlsx)이 다운로드되었습니다!`
        : `[${newApplicant.name}] 수험생의 원서가 저장되었습니다. (접수번호: ${newId})`
    );
  };

  // Handle edit save
  const handleSaveEdit = (updated: Applicant) => {
    const newList = applicants.map(a => (a.id === updated.id ? updated : a));
    setApplicants(newList);
    saveApplicantsToStorage(newList);
    setEditingApplicant(null);
    showToast(`[${updated.name}] 원서 정보가 성공적으로 수정되었습니다.`);
  };

  // Handle delete
  const handleDeleteApplicant = (id: string) => {
    const newList = applicants.filter(a => a.id !== id);
    setApplicants(newList);
    saveApplicantsToStorage(newList);
    showToast('원서가 성공적으로 삭제되었습니다.');
  };

  // Reset to samples
  const handleResetToSamples = () => {
    if (window.confirm('기존 접수 데이터를 초기 샘플 데이터(4건)로 대체하시겠습니까?')) {
      setApplicants(SAMPLE_APPLICANTS);
      saveApplicantsToStorage(SAMPLE_APPLICANTS);
      showToast('샘플 데이터가 복원되었습니다.');
    }
  };

  // Clear all
  const handleClearAll = () => {
    if (window.confirm('모든 접수 데이터를 영구히 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.')) {
      setApplicants([]);
      saveApplicantsToStorage([]);
      showToast('모든 원서 데이터가 삭제되었습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar following Top Bar Contract: Zone 1 (Brand) - Zone 2 (Nav) - Zone 3 (Actions) */}
      <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-900 text-white flex items-center justify-center font-black text-base shadow-xs">
              <School className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  setCurrentTab('form');
                }}
                className="text-base font-bold tracking-tight text-slate-900 hover:text-blue-900 transition-colors"
              >
                한국대학교 입학처
              </a>
              <span className="hidden sm:inline-block text-[11px] text-slate-500 ml-2 font-medium">
                2026학년도 신입생 정시/수시 원서접수
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setCurrentTab('form')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'form'
                  ? 'bg-blue-50 text-blue-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>원서 작성 양식</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab('list')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 relative ${
                currentTab === 'list'
                  ? 'bg-blue-50 text-blue-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>접수 대장 및 현황</span>
              {applicants.length > 0 && (
                <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded text-[10px] font-mono tabular-nums font-semibold">
                  {applicants.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab('guide')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'guide'
                  ? 'bg-blue-50 text-blue-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>모집요강 안내</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() => exportToCSV(applicants)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
              title="저장된 전체 접수내역을 엑셀 CSV로 다운로드합니다"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>명단 내보내기</span>
            </button>

            {currentTab !== 'form' && (
              <button
                type="button"
                onClick={() => setCurrentTab('form')}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
              >
                신규 원서 쓰기
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'form' && (
          <ApplicationForm
            onSubmit={handleFormSubmit}
            onNavigateToList={() => setCurrentTab('list')}
            totalRegistered={applicants.length}
          />
        )}

        {currentTab === 'list' && (
          <ApplicantList
            applicants={applicants}
            onViewSlip={applicant => {
              setSelectedSlipApplicant(applicant);
              setIsNewSubmission(false);
            }}
            onEditApplicant={applicant => setEditingApplicant(applicant)}
            onDeleteApplicant={handleDeleteApplicant}
            onResetToSamples={handleResetToSamples}
            onClearAll={handleClearAll}
            onNavigateToForm={() => setCurrentTab('form')}
          />
        )}

        {currentTab === 'guide' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-xs">
              <div className="border-b border-slate-200 pb-4 mb-6">
                <span className="text-xs font-bold text-blue-600 tracking-wide">ADMISSIONS GUIDE 2026</span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  2026학년도 신입생 모집요강 및 전형 일정 안내
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  본 온라인 시스템은 대한민국 대학교 신입생 입학원서 표준 접수 시스템 규격을 준수합니다.
                </p>
              </div>

              {/* Schedule Timeline */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>주요 전형 일정</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                    <span className="font-semibold text-blue-900 block">원서 접수 기간</span>
                    <span className="text-slate-600 mt-1 block">2026. 09. 01 ~ 상시</span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">온라인 접수 마감</span>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                    <span className="font-semibold text-blue-900 block">서류 제출 및 검증</span>
                    <span className="text-slate-600 mt-1 block">원서 접수 후 3일 이내</span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">생활기록부 등 온라인 연계</span>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                    <span className="font-semibold text-blue-900 block">면접 및 심층 평가</span>
                    <span className="text-slate-600 mt-1 block">2026. 11. 14 ~ 11. 16</span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">수험표 및 신분증 지참</span>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                    <span className="font-semibold text-blue-900 block">최초 합격자 발표</span>
                    <span className="text-slate-600 mt-1 block">2026. 12. 12 14:00</span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">개별 문자 및 입학처 공지</span>
                  </div>
                </div>
              </div>

              {/* Departments Overview */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                  <School className="w-4 h-4 text-blue-600" />
                  <span>모집 학과 현황 및 선발 인원</span>
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                  <table className="w-full border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3 text-left">단과대학</th>
                        <th className="py-2.5 px-3 text-left">학과명</th>
                        <th className="py-2.5 px-3 text-left">주요 교육 및 연구 분야</th>
                        <th className="py-2.5 px-3 text-right">모집정원</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr>
                        <td className="py-2.5 px-3 font-medium text-slate-900">공과대학</td>
                        <td className="py-2.5 px-3 font-bold text-blue-900">컴퓨터공학과</td>
                        <td className="py-2.5 px-3">소프트웨어 아키텍처, 분산시스템, 알고리즘, 클라우드</td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold">45명</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-medium text-slate-900">소프트웨어융합대학</td>
                        <td className="py-2.5 px-3 font-bold text-blue-900">AI데이터사이언스학과</td>
                        <td className="py-2.5 px-3">딥러닝, 생성형 AI, 거대언어모델(LLM), 데이터 분석</td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold">40명</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-medium text-slate-900">경영대학</td>
                        <td className="py-2.5 px-3 font-bold text-blue-900">글로벌경영학과</td>
                        <td className="py-2.5 px-3">글로벌 금융, 전략 기획, 벤처 창업, 데이터 기반 마케팅</td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold">60명</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-medium text-slate-900">사회과학대학</td>
                        <td className="py-2.5 px-3 font-bold text-blue-900">미디어커뮤니케이션학과</td>
                        <td className="py-2.5 px-3">영상 연출, 디지털 저널리즘, 뉴미디어 콘텐츠 플랫폼 기획</td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold">35명</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Applicant FAQ & Rules */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span>원서 접수 시 수험생 유의사항</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">1.</span>
                    <span>성명, 주민등록상 생년월일, 연락처는 반드시 정확하게 기재해야 하며, 입력 오류로 인한 불이익은 지원자 본인에게 있습니다.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">2.</span>
                    <span>고교 내신 또는 수능 성적은 1차 정량 평가 자료로 활용되며 사실과 다를 경우 합격이 취소될 수 있습니다.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">3.</span>
                    <span>접수가 정상 완료되면 부여되는 <strong>접수번호(수험번호)</strong>는 수험표 조회 및 합격자 발표 확인 시 필수이므로 보관하시기 바랍니다.</span>
                  </li>
                </ul>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentTab('form')}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
                  >
                    지금 입학원서 작성하기 →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white text-xs text-slate-500 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left space-y-1">
              <p className="font-semibold text-slate-700">한국대학교 입학관리본부 입학처</p>
              <p className="text-[11px] text-slate-400">
                서울특별시 종로구 대학로 123 한국대학교 본관 1층 입학처 · 대표전화: 02-1234-5678
              </p>
              <p className="text-[11px] text-slate-400">
                평일 운영시간: 09:00 ~ 18:00 (점심시간 12:00 ~ 13:00 / 토·일 및 공휴일 휴무)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <button
                type="button"
                onClick={() => setCurrentTab('form')}
                className="hover:text-blue-600 transition-colors"
              >
                원서 접수 양식
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setCurrentTab('list')}
                className="hover:text-blue-600 transition-colors"
              >
                접수 대장
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setCurrentTab('guide')}
                className="hover:text-blue-600 transition-colors"
              >
                모집요강
              </button>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© 2026 Hankook University Admissions. All rights reserved.</span>
            <span>데이터는 웹 브라우저 로컬 저장소(localStorage)에 안전하게 보관됩니다.</span>
          </div>
        </div>
      </footer>

      {/* Admission Slip / Result Modal */}
      {selectedSlipApplicant && (
        <AdmissionSlipModal
          applicant={selectedSlipApplicant}
          onClose={() => {
            setSelectedSlipApplicant(null);
            setIsNewSubmission(false);
          }}
          isNewSubmission={isNewSubmission}
        />
      )}

      {/* Edit Applicant Modal */}
      {editingApplicant && (
        <EditApplicantModal
          applicant={editingApplicant}
          onClose={() => setEditingApplicant(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
