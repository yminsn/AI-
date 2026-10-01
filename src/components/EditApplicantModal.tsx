import React, { useState } from 'react';
import { Applicant, DEPARTMENTS, REGIONS, APPLICATION_TYPES } from '../types';
import { formatPhoneNumber } from '../utils/storage';
import { X, Save, Edit } from 'lucide-react';

interface EditApplicantModalProps {
  applicant: Applicant | null;
  onClose: () => void;
  onSave: (updated: Applicant) => void;
}

export const EditApplicantModal: React.FC<EditApplicantModalProps> = ({
  applicant,
  onClose,
  onSave,
}) => {
  if (!applicant) return null;

  const [name, setName] = useState(applicant.name);
  const [phone, setPhone] = useState(applicant.phone);
  const [birthDate, setBirthDate] = useState(applicant.birthDate);
  const [gradeType, setGradeType] = useState(applicant.gradeType);
  const [gradeValue, setGradeValue] = useState(applicant.gradeValue);
  const [region, setRegion] = useState(applicant.region);
  const [highSchool, setHighSchool] = useState(applicant.highSchool);
  const [department, setDepartment] = useState(applicant.department);
  const [applicationType, setApplicationType] = useState(applicant.applicationType);
  const [notes, setNotes] = useState(applicant.notes || '');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneNumber(e.target.value));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !birthDate || !gradeValue.trim() || !region || !highSchool.trim() || !department) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    onSave({
      ...applicant,
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
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Edit className="w-4 h-4 text-blue-400" />
            <h3 className="font-semibold text-sm">
              원서 정보 수정 ({applicant.id} - {applicant.name})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                전화번호 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={13}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                생년월일 (달력) <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={e => setBirthDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                거주지역 <span className="text-red-500">*</span>
              </label>
              <select
                value={region}
                onChange={e => setRegion(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                required
              >
                {REGIONS.map(reg => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                출신 고등학교 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={highSchool}
                onChange={e => setHighSchool(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                전형 구분
              </label>
              <select
                value={applicationType}
                onChange={e => setApplicationType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
              >
                {APPLICATION_TYPES.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              성적 (하나) <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <select
                value={gradeType}
                onChange={e => setGradeType(e.target.value as any)}
                className="w-1/3 px-2 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:outline-hidden"
              >
                <option value="gpa">내신 등급</option>
                <option value="csat">수능 등급</option>
                <option value="score">환산 점수</option>
              </select>
              <input
                type="text"
                value={gradeValue}
                onChange={e => setGradeValue(e.target.value)}
                placeholder="예: 1.8등급 / 95점"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              지원 학과 (라디오 선택) <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DEPARTMENTS.map(dept => (
                <label
                  key={dept.id}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer text-xs ${
                    department === dept.name
                      ? 'border-blue-500 bg-blue-50 font-bold text-blue-900'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="edit_department"
                    value={dept.name}
                    checked={department === dept.name}
                    onChange={() => setDepartment(dept.name)}
                    className="text-blue-600"
                  />
                  <span>{dept.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              비고 / 지원 각오 (선택)
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>수정 사항 저장</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
