import React, { useState } from 'react';
import { REGIONS, DEPARTMENTS, APPLICATION_TYPES, Applicant } from '../types';
import { formatPhoneNumber } from '../utils/storage';
import { 
  User, 
  Phone, 
  Calendar, 
  GraduationCap, 
  MapPin, 
  Building2, 
  Sparkles, 
  RotateCcw, 
  FileCheck2,
  Award,
  FileSpreadsheet,
  CheckSquare
} from 'lucide-react';

interface ApplicationFormProps {
  onSubmit: (applicantData: Omit<Applicant, 'id' | 'submittedAt'>, autoExcel?: boolean) => void;
  onNavigateToList: () => void;
  totalRegistered: number;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  onSubmit,
  onNavigateToList,
  totalRegistered,
}) => {
  // Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('2007-03-01');
  const [gradeType, setGradeType] = useState<'gpa' | 'csat' | 'score'>('gpa');
  const [gradeValue, setGradeValue] = useState('');
  const [region, setRegion] = useState('');
  const [highSchool, setHighSchool] = useState('');
  const [department, setDepartment] = useState('');
  const [applicationType, setApplicationType] = useState<string>(APPLICATION_TYPES[0]);
  const [notes, setNotes] = useState('');
  const [autoExcel, setAutoExcel] = useState(true);

  // Validation Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatPhoneNumber(raw);
    setPhone(formatted);
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handleFillSample = () => {
    setName('박하은');
    setPhone('010-4820-9173');
    setBirthDate('2007-06-18');
    setGradeType('gpa');
    setGradeValue('1.65등급');
    setRegion('경기도');
    setHighSchool('수원매원고등학교');
    setDepartment('AI데이터사이언스학과');
    setApplicationType('2026학년도 학생부종합전형');
    setNotes('인공지능 의료 데이터 분석 분야의 연구자가 되고자 지원합니다.');
    setErrors({});
  };

  const handleReset = () => {
    if (window.confirm('입력하신 모든 내용을 초기화하시겠습니까?')) {
      setName('');
      setPhone('');
      setBirthDate('2007-03-01');
      setGradeType('gpa');
      setGradeValue('');
      setRegion('');
      setHighSchool('');
      setDepartment('');
      setApplicationType(APPLICATION_TYPES[0]);
      setNotes('');
      setErrors({});
    }
  };

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};

    if (!name.trim()) {
      errs.name = '지원자 성명을 입력해주세요.';
    } else if (name.trim().length < 2) {
      errs.name = '이름은 최소 2글자 이상 입력해주세요.';
    }

    if (!phone.trim()) {
      errs.phone = '전화번호를 입력해주세요.';
    } else if (phone.length < 11) {
      errs.phone = '올바른 전화번호(10~11자리)를 입력해주세요.';
    }

    if (!birthDate) {
      errs.birthDate = '생년월일을 달력에서 선택해주세요.';
    }

    if (!gradeValue.trim()) {
      errs.gradeValue = '성적을 입력해주세요. (예: 1.5등급 또는 95점)';
    }

    if (!region) {
      errs.region = '거주지역을 목록에서 선택해주세요.';
    }

    if (!highSchool.trim()) {
      errs.highSchool = '출신 고등학교 이름을 입력해주세요.';
    }

    if (!department) {
      errs.department = '지원하실 학과 1개를 반드시 선택해주세요.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // Find first error and scroll up smoothly
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    // Submit with autoExcel parameter
    onSubmit({
      name: name.trim(),
      phone: phone.trim(),
      birthDate,
      gradeType,
      gradeValue: gradeValue.trim(),
      region,
      highSchool: highSchool.trim(),
      department,
      applicationType,
      notes: notes.trim() || undefined,
    }, autoExcel);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Info Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
              <Building2 className="w-4 h-4" />
              <span>2026학년도 대학입학전형</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              신입생 입학원서 접수 양식
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              아래 필수 기재 사항을 정확히 입력하신 후 [원서 접수하기] 버튼을 누르면 실시간으로 저장됩니다.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={handleFillSample}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              title="양식에 테스트용 예시 데이터를 자동으로 채웁니다"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>예시 데이터 채우기</span>
            </button>
            <button
              type="button"
              onClick={onNavigateToList}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <span>접수 대장 보기 ({totalRegistered}명)</span>
            </button>
          </div>
        </div>

        {/* The Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          {/* Section 1: 지원자 기본 인적사항 */}
          <div>
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-4">
              <User className="w-4 h-4 text-blue-600" />
              <h2 className="text-base font-semibold text-slate-800">
                1. 지원자 기본 인적사항
              </h2>
              <span className="text-xs text-red-500 font-medium">* 필수입력</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 이름 */}
              <div>
                <label htmlFor="applicant-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  이름 (성명) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="applicant-name"
                    type="text"
                    value={name}
                    onChange={e => {
                      setName(e.target.value);
                      if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                    }}
                    placeholder="예: 홍길동"
                    className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 transition-all ${
                      errors.name 
                        ? 'border-red-400 focus:ring-red-200' 
                        : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{errors.name}</p>
                )}
              </div>

              {/* 전화번호 */}
              <div>
                <label htmlFor="applicant-phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  전화번호 (휴대전화) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="applicant-phone"
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={13}
                    placeholder="010-0000-0000 (숫자만 입력 시 자동 포맷)"
                    className={`w-full px-3.5 py-2.5 text-sm font-mono bg-white border rounded-lg focus:outline-hidden focus:ring-2 transition-all ${
                      errors.phone 
                        ? 'border-red-400 focus:ring-red-200' 
                        : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
                {errors.phone ? (
                  <p className="text-xs text-red-600 mt-1 font-medium">{errors.phone}</p>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-1">접수 안내 및 합격 통보 문자가 발송될 번호입니다.</p>
                )}
              </div>

              {/* 생년월일 (date로 달력에서 고르게끔) */}
              <div>
                <label htmlFor="applicant-birth" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  생년월일 (달력 선택) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="applicant-birth"
                    type="date"
                    min="1990-01-01"
                    max="2012-12-31"
                    value={birthDate}
                    onChange={e => {
                      setBirthDate(e.target.value);
                      if (errors.birthDate) setErrors(prev => ({ ...prev, birthDate: '' }));
                    }}
                    className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 transition-all ${
                      errors.birthDate 
                        ? 'border-red-400 focus:ring-red-200' 
                        : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                  />
                </div>
                {errors.birthDate ? (
                  <p className="text-xs text-red-600 mt-1 font-medium">{errors.birthDate}</p>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-1">달력 아이콘을 눌러 연도, 월, 일을 선택하세요.</p>
                )}
              </div>

              {/* 거주지역 (select로 서울 경기 이런거 고르도록) */}
              <div>
                <label htmlFor="applicant-region" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  거주지역 (시·도 선택) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="applicant-region"
                    value={region}
                    onChange={e => {
                      setRegion(e.target.value);
                      if (errors.region) setErrors(prev => ({ ...prev, region: '' }));
                    }}
                    className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 transition-all appearance-none cursor-pointer ${
                      errors.region 
                        ? 'border-red-400 focus:ring-red-200' 
                        : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                  >
                    <option value="">시·도를 선택해주세요</option>
                    {REGIONS.map(reg => (
                      <option key={reg} value={reg}>
                        {reg}
                      </option>
                    ))}
                  </select>
                  <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
                {errors.region ? (
                  <p className="text-xs text-red-600 mt-1 font-medium">{errors.region}</p>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-1">주민등록등본상 거주 광역자치단체를 선택합니다.</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: 학력 및 성적 정보 */}
          <div>
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-4">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <h2 className="text-base font-semibold text-slate-800">
                2. 학력 및 전형 성적
              </h2>
              <span className="text-xs text-red-500 font-medium">* 필수입력</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 출신 고등학교 */}
              <div>
                <label htmlFor="applicant-highschool" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  출신 고등학교 <span className="text-red-500">*</span>
                </label>
                <input
                  id="applicant-highschool"
                  type="text"
                  value={highSchool}
                  onChange={e => {
                    setHighSchool(e.target.value);
                    if (errors.highSchool) setErrors(prev => ({ ...prev, highSchool: '' }));
                  }}
                  placeholder="예: 서울고등학교 (또는 검정고시)"
                  className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 transition-all ${
                    errors.highSchool 
                      ? 'border-red-400 focus:ring-red-200' 
                      : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                />
                {errors.highSchool && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{errors.highSchool}</p>
                )}
              </div>

              {/* 전형 구분 */}
              <div>
                <label htmlFor="applicant-type" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  전형 구분
                </label>
                <select
                  id="applicant-type"
                  value={applicationType}
                  onChange={e => setApplicationType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                >
                  {APPLICATION_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* 성적 (하나 입력) */}
              <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <label className="block text-xs font-semibold text-slate-800">
                    성적 입력 (하나) <span className="text-red-500">*</span>
                  </label>

                  {/* 성적 단위 라디오/태그 선택 */}
                  <div className="flex items-center gap-1 p-0.5 bg-slate-200/70 rounded-lg self-start">
                    <button
                      type="button"
                      onClick={() => setGradeType('gpa')}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                        gradeType === 'gpa'
                          ? 'bg-white text-blue-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      고교 내신 등급
                    </button>
                    <button
                      type="button"
                      onClick={() => setGradeType('csat')}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                        gradeType === 'csat'
                          ? 'bg-white text-blue-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      수능 평균 등급
                    </button>
                    <button
                      type="button"
                      onClick={() => setGradeType('score')}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                        gradeType === 'score'
                          ? 'bg-white text-blue-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      환산 점수 (100점 만점)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={gradeValue}
                        onChange={e => {
                          setGradeValue(e.target.value);
                          if (errors.gradeValue) setErrors(prev => ({ ...prev, gradeValue: '' }));
                        }}
                        placeholder={
                          gradeType === 'gpa'
                            ? '예: 1.85등급'
                            : gradeType === 'csat'
                            ? '예: 2등급'
                            : '예: 94.5점'
                        }
                        className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 transition-all ${
                          errors.gradeValue
                            ? 'border-red-400 focus:ring-red-200'
                            : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                        }`}
                      />
                      <Award className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                    {errors.gradeValue && (
                      <p className="text-xs text-red-600 mt-1 font-medium">{errors.gradeValue}</p>
                    )}
                  </div>

                  {/* Quick Preset Buttons for Grades */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {gradeType === 'gpa' && (
                      <>
                        {['1.2등급', '1.8등급', '2.3등급', '2.9등급'].map(val => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => {
                              setGradeValue(val);
                              if (errors.gradeValue) setErrors(prev => ({ ...prev, gradeValue: '' }));
                            }}
                            className="px-2 py-1 text-xs bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-600 transition-colors"
                          >
                            {val}
                          </button>
                        ))}
                      </>
                    )}
                    {gradeType === 'csat' && (
                      <>
                        {['1등급', '2등급', '3등급'].map(val => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => {
                              setGradeValue(val);
                              if (errors.gradeValue) setErrors(prev => ({ ...prev, gradeValue: '' }));
                            }}
                            className="px-2 py-1 text-xs bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-600 transition-colors"
                          >
                            {val}
                          </button>
                        ))}
                      </>
                    )}
                    {gradeType === 'score' && (
                      <>
                        {['98점', '95점', '91점', '87점'].map(val => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => {
                              setGradeValue(val);
                              if (errors.gradeValue) setErrors(prev => ({ ...prev, gradeValue: '' }));
                            }}
                            className="px-2 py-1 text-xs bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-600 transition-colors"
                          >
                            {val}
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: 지원 학과 이름 (3-4개 중 radio로 고르게끔) */}
          <div>
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-4">
              <Building2 className="w-4 h-4 text-blue-600" />
              <h2 className="text-base font-semibold text-slate-800">
                3. 지원 학과 선택 (1개 학과 선택)
              </h2>
              <span className="text-xs text-red-500 font-medium">* 필수입력</span>
            </div>

            {errors.department && (
              <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
                {errors.department}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {DEPARTMENTS.map(dept => {
                const isSelected = department === dept.name;
                return (
                  <label
                    key={dept.id}
                    className={`relative flex items-start p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center h-5 mr-3">
                      <input
                        type="radio"
                        name="department_selection"
                        value={dept.name}
                        checked={isSelected}
                        onChange={() => {
                          setDepartment(dept.name);
                          if (errors.department) {
                            setErrors(prev => ({ ...prev, department: '' }));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-blue-700 font-medium">{dept.college}</span>
                        <span className="font-mono text-[11px] text-slate-400">코드 {dept.code}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">{dept.name}</p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{dept.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section 4: 비고 및 특기사항 (선택) */}
          <div>
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-4">
              <FileCheck2 className="w-4 h-4 text-slate-500" />
              <h2 className="text-base font-semibold text-slate-800">
                4. 비고 및 지원 각오 (선택)
              </h2>
            </div>

            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              maxLength={200}
              placeholder="면접관에게 전하고 싶은 한 줄 지원 동기 또는 수상/동아리 활동 경력을 자유롭게 작성하세요 (선택 사항)"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
              <span>최대 200자 내외</span>
              <span>{notes.length} / 200자</span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-5 border-t border-slate-200 flex flex-col gap-4">
            {/* Auto Excel Save Option Notice */}
            <div className="flex items-center justify-between p-3 bg-emerald-50/80 border border-emerald-200 rounded-lg text-xs text-emerald-900">
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={autoExcel}
                  onChange={e => setAutoExcel(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
                <span>원서 접수 시 엑셀 파일(.xlsx) 자동 저장 및 즉시 다운로드</span>
              </label>
              <span className="hidden sm:inline text-[11px] text-emerald-700">
                한국어 깨짐 없는 표준 Microsoft Excel 서식
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>양식 초기화</span>
              </button>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm hover:shadow transition-all w-full sm:w-auto"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>원서 접수 및 엑셀 저장 (.xlsx)</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
