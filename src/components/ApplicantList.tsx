import React, { useState, useMemo } from 'react';
import { Applicant, DEPARTMENTS, REGIONS } from '../types';
import { exportToCSV, exportToExcel, exportSingleApplicantExcel } from '../utils/storage';
import {
  Search,
  Download,
  Filter,
  Eye,
  Trash2,
  Edit3,
  RotateCcw,
  Users,
  Building2,
  PlusCircle,
  FileSpreadsheet
} from 'lucide-react';

interface ApplicantListProps {
  applicants: Applicant[];
  onViewSlip: (applicant: Applicant) => void;
  onEditApplicant: (applicant: Applicant) => void;
  onDeleteApplicant: (id: string) => void;
  onResetToSamples: () => void;
  onClearAll: () => void;
  onNavigateToForm: () => void;
}

export const ApplicantList: React.FC<ApplicantListProps> = ({
  applicants,
  onViewSlip,
  onEditApplicant,
  onDeleteApplicant,
  onResetToSamples,
  onClearAll,
  onNavigateToForm,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // Filtered applicants
  const filteredApplicants = useMemo(() => {
    return applicants.filter(app => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        app.name.toLowerCase().includes(q) ||
        app.phone.includes(q) ||
        app.highSchool.toLowerCase().includes(q) ||
        app.id.toLowerCase().includes(q);

      const matchesDept = selectedDept === 'all' || app.department === selectedDept;
      const matchesRegion = selectedRegion === 'all' || app.region === selectedRegion;

      return matchesSearch && matchesDept && matchesRegion;
    });
  }, [applicants, searchQuery, selectedDept, selectedRegion]);

  // Dept statistics
  const deptStats = useMemo(() => {
    const counts: { [deptName: string]: number } = {};
    DEPARTMENTS.forEach(d => {
      counts[d.name] = 0;
    });
    applicants.forEach(a => {
      if (counts[a.department] !== undefined) {
        counts[a.department] += 1;
      } else {
        counts[a.department] = 1;
      }
    });
    return counts;
  }, [applicants]);

  const handleDelete = (applicant: Applicant) => {
    if (window.confirm(`[${applicant.id}] ${applicant.name} 지원자의 원서를 정말 삭제하시겠습니까?`)) {
      onDeleteApplicant(applicant.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Metric Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>총 접수 인원</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {applicants.length}
            <span className="text-xs font-normal text-slate-500 ml-1">명</span>
          </div>
        </div>

        {DEPARTMENTS.map(dept => {
          const count = deptStats[dept.name] || 0;
          return (
            <div
              key={dept.id}
              onClick={() => setSelectedDept(selectedDept === dept.name ? 'all' : dept.name)}
              className={`bg-white border rounded-xl p-4 shadow-xs cursor-pointer transition-all ${
                selectedDept === dept.name
                  ? 'border-blue-500 ring-2 ring-blue-100 bg-blue-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-xs text-slate-500 truncate mb-1" title={dept.name}>
                {dept.name}
              </div>
              <div className="text-xl font-bold text-slate-900 tabular-nums">
                {count}
                <span className="text-xs font-normal text-slate-500 ml-1">명</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Table Top Controls */}
        <div className="p-4 md:p-6 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              신입생 원서 접수 대장
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              실시간으로 저장된 모든 신입생 입학원서 목록입니다. (총 {filteredApplicants.length}건 검색됨)
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={onNavigateToForm}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>새 원서 접수</span>
            </button>

            <button
              type="button"
              onClick={() => exportToExcel(filteredApplicants.length > 0 ? filteredApplicants : applicants)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 rounded-lg transition-colors shadow-2xs"
              title="현재 목록을 정식 엑셀(.xlsx) 파일로 즉시 다운로드합니다"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>엑셀 대장 다운로드 (.xlsx)</span>
            </button>

            <button
              type="button"
              onClick={() => exportToCSV(filteredApplicants.length > 0 ? filteredApplicants : applicants)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
              title="CSV 형식으로 백업 다운로드합니다"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>CSV 내보내기</span>
            </button>

            <button
              type="button"
              onClick={onResetToSamples}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              title="샘플 접수자 데이터 4건으로 복원"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span>샘플 복원</span>
            </button>

            {applicants.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="inline-flex items-center gap-1 px-2 py-2 text-xs font-medium text-red-600 hover:text-red-700 bg-white border border-red-200 hover:bg-red-50 rounded-lg transition-colors"
                title="모든 저장된 데이터를 삭제합니다"
              >
                <Trash2 className="w-3 h-3 text-red-500" />
                <span>전체 비우기</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="이름, 출신고교, 전화번호, 접수번호 검색..."
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
            />
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-slate-500 shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              학과:
            </span>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-2 focus:outline-hidden focus:border-blue-500"
            >
              <option value="all">전체 학과</option>
              {DEPARTMENTS.map(d => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Region Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-slate-500 shrink-0">지역:</span>
            <select
              value={selectedRegion}
              onChange={e => setSelectedRegion(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-2 focus:outline-hidden focus:border-blue-500"
            >
              <option value="all">전체 지역</option>
              {REGIONS.map(reg => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>
          </div>

          {(searchQuery || selectedDept !== 'all' || selectedRegion !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedDept('all');
                setSelectedRegion('all');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 underline underline-offset-2 shrink-0 py-1"
            >
              필터 초기화
            </button>
          )}
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          {filteredApplicants.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-600 font-semibold select-none">
                  <th className="py-3 px-4 w-32">접수번호</th>
                  <th className="py-3 px-4">성명</th>
                  <th className="py-3 px-4">지원학과</th>
                  <th className="py-3 px-4">성적</th>
                  <th className="py-3 px-4">거주지역</th>
                  <th className="py-3 px-4">출신고교</th>
                  <th className="py-3 px-4">생년월일</th>
                  <th className="py-3 px-4">전화번호</th>
                  <th className="py-3 px-4 text-center w-28">관리/출력</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredApplicants.map(applicant => (
                  <tr
                    key={applicant.id}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-blue-900 whitespace-nowrap">
                      {applicant.id}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {applicant.name}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-medium text-slate-800">{applicant.department}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-900 tabular-nums">
                        {applicant.gradeValue}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {applicant.gradeType === 'gpa' ? '내신' : applicant.gradeType === 'csat' ? '수능' : '환산'}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                      {applicant.region}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                      {applicant.highSchool}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap tabular-nums">
                      {applicant.birthDate}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap tabular-nums">
                      {applicant.phone}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => exportSingleApplicantExcel(applicant)}
                          className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                          title="이 지원자의 원서 엑셀(.xlsx) 다운로드"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onViewSlip(applicant)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="수험표 및 접수증 보기"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditApplicant(applicant)}
                          className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                          title="원서 정보 수정"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(applicant)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="원서 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-16 px-4 text-center">
              <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-700">
                {searchQuery || selectedDept !== 'all' || selectedRegion !== 'all'
                  ? '검색 조건에 일치하는 지원자가 없습니다.'
                  : '등록된 신입생 입학원서가 없습니다.'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {searchQuery || selectedDept !== 'all' || selectedRegion !== 'all'
                  ? '검색어 또는 필터를 변경해보시거나 초기화 버튼을 눌러주세요.'
                  : '상단의 [새 원서 접수] 버튼을 눌러 첫 신입생 입학원서를 작성해보세요.'}
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={onNavigateToForm}
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  원서 접수 양식으로 이동
                </button>
                <button
                  type="button"
                  onClick={onResetToSamples}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  샘플 데이터 채우기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
