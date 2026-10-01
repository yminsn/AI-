import React from 'react';
import { Applicant } from '../types';
import { exportSingleApplicantExcel } from '../utils/storage';
import { Printer, X, CheckCircle2, Copy, Check, School, ShieldCheck, FileSpreadsheet } from 'lucide-react';

interface AdmissionSlipModalProps {
  applicant: Applicant | null;
  onClose: () => void;
  isNewSubmission?: boolean;
}

export const AdmissionSlipModal: React.FC<AdmissionSlipModalProps> = ({
  applicant,
  onClose,
  isNewSubmission = false,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!applicant) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(applicant.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Top Header - Not printed */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-base">
              {isNewSubmission ? '원서 접수가 정상적으로 저장되었습니다' : '수험표 및 접수증 조회'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Banner for New Submissions */}
        {isNewSubmission && (
          <div className="no-print mx-6 mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-emerald-800 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-medium">신입생 입학원서가 로컬 스토리지에 성공적으로 등록되었습니다.</p>
              <p className="text-xs text-emerald-600 mt-0.5">
                접수번호 <strong className="font-mono">{applicant.id}</strong>로 보관되며, 언제든 접수 대장에서 확인 및 수정할 수 있습니다.
              </p>
            </div>
          </div>
        )}

        {/* The Printable Admission Slip Container */}
        <div className="p-6 md:p-8 print-container" id="printable-admission-slip">
          {/* Slip Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
            <div className="text-xs tracking-wider text-slate-500 font-medium mb-1">
              HANKOOK UNIVERSITY ADMISSIONS 2026
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              2026학년도 신입생 입학원서 접수증 (수험표)
            </h2>
            <div className="flex items-center justify-center gap-2 mt-2 text-xs text-slate-600">
              <span>한국대학교 입학관리본부</span>
              <span>·</span>
              <span className="font-mono">접수번호: {applicant.id}</span>
            </div>
          </div>

          {/* Slip Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Applicant Photo Box (Korean examination photo size standard) */}
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="w-32 h-40 bg-slate-100 border border-slate-300 rounded flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 mb-2 font-bold text-lg">
                  {applicant.name.slice(0, 1)}
                </div>
                <span className="text-xs font-medium text-slate-500">반명함판 사진</span>
                <span className="text-[10px] text-slate-400 mt-0.5">(3cm × 4cm)</span>
              </div>
              <div className="mt-2 text-center">
                <span className="text-xs text-slate-500 block">수험자</span>
                <span className="text-base font-bold text-slate-900">{applicant.name}</span>
              </div>
            </div>

            {/* Application Data Table */}
            <div className="md:col-span-3">
              <div className="border border-slate-200 rounded-lg overflow-hidden text-sm">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <th className="bg-slate-50 py-2.5 px-3 text-left font-medium text-slate-600 w-28 text-xs border-r border-slate-200">
                        접수번호
                      </th>
                      <td className="py-2.5 px-3 font-mono font-semibold text-blue-900">
                        {applicant.id}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <th className="bg-slate-50 py-2.5 px-3 text-left font-medium text-slate-600 text-xs border-r border-slate-200">
                        지원 학과
                      </th>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {applicant.department}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <th className="bg-slate-50 py-2.5 px-3 text-left font-medium text-slate-600 text-xs border-r border-slate-200">
                        전형 구분
                      </th>
                      <td className="py-2.5 px-3 text-slate-700">
                        {applicant.applicationType}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <th className="bg-slate-50 py-2.5 px-3 text-left font-medium text-slate-600 text-xs border-r border-slate-200">
                        생년월일
                      </th>
                      <td className="py-2.5 px-3 text-slate-700 font-mono">
                        {applicant.birthDate}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <th className="bg-slate-50 py-2.5 px-3 text-left font-medium text-slate-600 text-xs border-r border-slate-200">
                        연락처
                      </th>
                      <td className="py-2.5 px-3 text-slate-700 font-mono">
                        {applicant.phone}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <th className="bg-slate-50 py-2.5 px-3 text-left font-medium text-slate-600 text-xs border-r border-slate-200">
                        거주 지역
                      </th>
                      <td className="py-2.5 px-3 text-slate-700">
                        {applicant.region}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <th className="bg-slate-50 py-2.5 px-3 text-left font-medium text-slate-600 text-xs border-r border-slate-200">
                        출신 고교
                      </th>
                      <td className="py-2.5 px-3 text-slate-700">
                        {applicant.highSchool}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <th className="bg-slate-50 py-2.5 px-3 text-left font-medium text-slate-600 text-xs border-r border-slate-200">
                        제출 성적
                      </th>
                      <td className="py-2.5 px-3 text-slate-900 font-medium">
                        <span className="text-xs text-slate-500 mr-2">
                          [{applicant.gradeType === 'gpa' ? '고교 내신' : applicant.gradeType === 'csat' ? '수능' : '환산점수'}]
                        </span>
                        {applicant.gradeValue}
                      </td>
                    </tr>
                    {applicant.notes && (
                      <tr>
                        <th className="bg-slate-50 py-2.5 px-3 text-left font-medium text-slate-600 text-xs border-r border-slate-200">
                          지원 메모
                        </th>
                        <td className="py-2.5 px-3 text-slate-600 text-xs leading-relaxed">
                          {applicant.notes}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Verification Stamp & Notice */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 space-y-1">
                <p>• 면접 및 논술고사 당일 본 수험표와 신분증을 반드시 지참하십시오.</p>
                <p>• 접수 완료 후 전형 구분 및 지원 학과는 임의로 변경할 수 없습니다.</p>
                <p>• 접수일시: {new Date(applicant.submittedAt).toLocaleString('ko-KR')}</p>
              </div>

              {/* Official Seal simulation */}
              <div className="relative border-2 border-red-700 rounded-lg p-2 text-center text-red-700 font-bold select-none shrink-0 w-36">
                <div className="text-[10px] tracking-widest text-red-600">한국대학교</div>
                <div className="text-sm tracking-wider my-0.5">입학처장 직인</div>
                <div className="text-[9px] text-red-600 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-red-700" />
                  <span>정식 접수 승인</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions (Hidden when printing) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
          <button
            type="button"
            onClick={handleCopyId}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '접수번호 복사됨' : '접수번호 복사'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => exportSingleApplicantExcel(applicant)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors"
              title="이 원서를 엑셀 서식(.xlsx) 파일로 다운로드합니다"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>원서 엑셀 저장 (.xlsx)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              닫기
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>수험표 인쇄 / PDF 저장</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
