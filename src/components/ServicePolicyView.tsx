import React, { useState } from 'react';
import {
  ShieldAlert,
  Scale,
  Plus,
  Trash2,
  Check,
  Filter,
  PanelRightClose,
  Edit3,
  AlertTriangle,
  Lock,
  Globe
} from 'lucide-react';
import type { ServicePolicyItem, StepId } from '../mockData';
import { ExportDropdown } from './ExportDropdown';

interface ServicePolicyViewProps {
  policies: ServicePolicyItem[];
  setPolicies: React.Dispatch<React.SetStateAction<ServicePolicyItem[]>>;
  onConfirmStep?: (step: StepId) => void;
  onCollapsePane?: () => void;
  isConfirmed?: boolean;
}

export const ServicePolicyView: React.FC<ServicePolicyViewProps> = ({
  policies,
  setPolicies,
  onConfirmStep,
  onCollapsePane,
  isConfirmed = false
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [filterImpact, setFilterImpact] = useState<string>('all');
  const [isAddingPolicy, setIsAddingPolicy] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Policy Form State
  const [newCode, setNewCode] = useState('');
  const [newCategory, setNewCategory] = useState<'비즈니스 운영 정책' | '법적 및 보안 제약' | '외부 연동 제약'>('비즈니스 운영 정책');
  const [newTitle, setNewTitle] = useState('');
  const [newRuleSummary, setNewRuleSummary] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [newEnforcementMethod, setNewEnforcementMethod] = useState('');
  const [newImpactLevel, setNewImpactLevel] = useState<'High' | 'Medium' | 'Low'>('High');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  const handleAddPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const autoCode = newCode.trim() || `POL-${Date.now().toString().slice(-4)}`;
    const newPolicy: ServicePolicyItem = {
      id: `pol_${Date.now()}`,
      policyCode: autoCode,
      category: newCategory,
      title: newTitle.trim(),
      ruleSummary: newRuleSummary.trim() || '정책 핵심 요약을 입력하세요.',
      details: newDetails.trim() || '상세 배경 및 예외 조항을 서술하세요.',
      enforcementMethod: newEnforcementMethod.trim() || '시스템 검증 인터셉터 및 정책 핸들러',
      impactLevel: newImpactLevel,
      status: 'Active'
    };

    setPolicies((prev) => [newPolicy, ...prev]);
    setIsAddingPolicy(false);
    setNewCode('');
    setNewTitle('');
    setNewRuleSummary('');
    setNewDetails('');
    setNewEnforcementMethod('');
    showToast(`[${autoCode}] 신규 서비스 정책이 등록되었습니다.`);
  };

  const handleDeletePolicy = (id: string, code: string) => {
    setPolicies((prev) => prev.filter((p) => p.id !== id));
    showToast(`[${code}] 정책이 삭제되었습니다.`);
  };

  const filteredPolicies = policies.filter((p) => {
    if (activeCategory !== 'all' && p.category !== activeCategory) return false;
    if (filterImpact !== 'all' && p.impactLevel !== filterImpact) return false;
    return true;
  });

  const categoryCounts = {
    all: policies.length,
    biz: policies.filter((p) => p.category === '비즈니스 운영 정책').length,
    legal: policies.filter((p) => p.category === '법적 및 보안 제약').length,
    external: policies.filter((p) => p.category === '외부 연동 제약').length
  };

  const buildMarkdown = () => {
    return `# 06. 서비스 정책 및 제약사항 명세서 (Service Policies & Constraints)

총 규정 항목: ${policies.length}건
확정 일자: 2026-10-30

${policies
  .map(
    (p) => `### [${p.policyCode}] ${p.title} (${p.category})
- 영향도: ${p.impactLevel} | 상태: ${p.status}
- 핵심 규칙: ${p.ruleSummary}
- 상세 규정 및 예외: ${p.details}
- 시스템 강제 방식: ${p.enforcementMethod}`
  )
  .join('\n\n')}
`;
  };

  const getImpactBadge = (level: 'High' | 'Medium' | 'Low') => {
    switch (level) {
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-danger/10 text-danger border border-danger/25">
            High · 위반 시 즉시 차단
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/25">
            Medium · 경고 및 재시도
          </span>
        );
      case 'Low':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/25">
            Low · 가이드 권고
          </span>
        );
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case '비즈니스 운영 정책':
        return <Scale className="w-3.5 h-3.5 text-accent" />;
      case '법적 및 보안 제약':
        return <Lock className="w-3.5 h-3.5 text-danger" />;
      case '외부 연동 제약':
        return <Globe className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <ShieldAlert className="w-3.5 h-3.5 text-muted" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-canvas text-ink overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 right-4 z-50 bg-ink text-paper px-3.5 py-2 rounded-lg text-xs font-medium shadow-lg border border-line-strong flex items-center gap-2">
          <Check className="w-4 h-4 text-accent" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="px-5 py-3.5 bg-surface border-b border-line flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
            <Scale className="w-4 h-4 text-accent" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">06. Service Policies</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-well text-muted border border-line">
                총 {policies.length}개 정책 확정
              </span>
            </div>
            <h2 className="text-sm font-bold text-ink truncate">서비스 정책 및 제약사항</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ExportDropdown
            title="06_서비스_정책_및_제약사항"
            getMarkdown={buildMarkdown}
            onShowToast={showToast}
          />

          <button
            type="button"
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              isEditMode
                ? 'bg-accent text-accent-ink font-semibold'
                : 'bg-well hover:bg-control text-ink border border-line'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditMode ? '편집 완료' : '편집하기'}</span>
          </button>

          {onConfirmStep && (
            <button
              type="button"
              onClick={() => onConfirmStep('step6')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                isConfirmed
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-surface border border-line hover:border-line-strong text-ink'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isConfirmed ? '확정 완료' : '산출물 확정'}</span>
            </button>
          )}

          {onCollapsePane && (
            <button
              type="button"
              onClick={onCollapsePane}
              className="p-1.5 text-muted hover:text-ink rounded-lg hover:bg-well transition-colors cursor-pointer"
              title="패널 접기"
            >
              <PanelRightClose className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Overview Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-well/40 border-b border-line shrink-0">
        <div className="p-3 bg-surface border border-line rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="flex items-center gap-1.5 font-medium">
              <Scale className="w-3.5 h-3.5 text-accent" />
              비즈니스 운영 정책
            </span>
            <span className="font-bold text-accent">{categoryCounts.biz}건</span>
          </div>
          <p className="text-[11px] text-muted">10분 전 취소 100% 환불, 노쇼 보증금 몰수, 할인율 30~70%</p>
        </div>

        <div className="p-3 bg-surface border border-line rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="flex items-center gap-1.5 font-medium">
              <Lock className="w-3.5 h-3.5 text-danger" />
              법적 및 보안 제약
            </span>
            <span className="font-bold text-danger">{categoryCounts.legal}건</span>
          </div>
          <p className="text-[11px] text-muted">위치정보법 준수(좌표 비식별화), 당일 베이커리 위생/소비기한</p>
        </div>

        <div className="p-3 bg-surface border border-line rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="flex items-center gap-1.5 font-medium">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              외부 연동 제약
            </span>
            <span className="font-bold text-amber-400">{categoryCounts.external}건</span>
          </div>
          <p className="text-[11px] text-muted">21시 이후 야간 푸시 발송 금지, 네이버 지도 10만건 쿼터 방어</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="px-5 py-2.5 bg-well/60 border-b border-line flex items-center justify-between gap-3 flex-wrap text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-muted flex items-center gap-1 font-medium">
            <Filter className="w-3.5 h-3.5" />
            카테고리:
          </span>
          <div className="flex items-center gap-1">
            {[
              { id: 'all', label: `전체 (${categoryCounts.all})` },
              { id: '비즈니스 운영 정책', label: `운영 정책 (${categoryCounts.biz})` },
              { id: '법적 및 보안 제약', label: `법적/보안 (${categoryCounts.legal})` },
              { id: '외부 연동 제약', label: `외부 연동 (${categoryCounts.external})` }
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategory(c.id)}
                className={`px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                  activeCategory === c.id
                    ? 'bg-accent text-accent-ink font-semibold'
                    : 'bg-surface text-muted hover:text-ink border border-line'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted font-medium">영향도:</span>
          <div className="flex items-center gap-1">
            {['all', 'High', 'Medium', 'Low'].map((imp) => (
              <button
                key={imp}
                type="button"
                onClick={() => setFilterImpact(imp)}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                  filterImpact === imp
                    ? 'bg-ink text-paper font-semibold'
                    : 'bg-surface text-muted hover:text-ink border border-line'
                }`}
              >
                {imp === 'all' ? '전체' : imp}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Policy List Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {isEditMode && (
          <div className="p-3 bg-well/40 border border-dashed border-accent/40 rounded-xl flex items-center justify-between">
            <span className="text-xs text-muted">
              편집 모드: 각 정책 카드의 내용과 강제 방식을 수정하거나 새 정책을 추가할 수 있습니다.
            </span>
            <button
              type="button"
              onClick={() => setIsAddingPolicy(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-ink hover:bg-accent-hover text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ 새 정책/제약 추가</span>
            </button>
          </div>
        )}

        <div className="space-y-3.5">
          {filteredPolicies.map((policy) => (
            <div
              key={policy.id}
              className="p-4 bg-surface border border-line hover:border-line-strong rounded-xl shadow-sm transition-colors space-y-3"
            >
              {/* Header Row */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-well text-accent rounded border border-line">
                    {policy.policyCode}
                  </span>
                  {isEditMode ? (
                    <select
                      value={policy.category}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setPolicies((prev) =>
                          prev.map((p) => (p.id === policy.id ? { ...p, category: val } : p))
                        );
                      }}
                      className="text-[11px] font-semibold text-ink bg-well px-2 py-0.5 rounded border border-line outline-none"
                    >
                      <option value="비즈니스 운영 정책">비즈니스 운영 정책</option>
                      <option value="법적 및 보안 제약">법적 및 보안 제약</option>
                      <option value="외부 연동 제약">외부 연동 제약</option>
                    </select>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-muted bg-well px-2 py-0.5 rounded border border-line">
                      {getCategoryIcon(policy.category)}
                      {policy.category}
                    </span>
                  )}
                  {isEditMode ? (
                    <select
                      value={policy.impactLevel}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setPolicies((prev) =>
                          prev.map((p) => (p.id === policy.id ? { ...p, impactLevel: val } : p))
                        );
                      }}
                      className="text-[10px] font-bold text-ink bg-well px-2 py-0.5 rounded border border-line outline-none"
                    >
                      <option value="CRITICAL">CRITICAL (필수)</option>
                      <option value="HIGH">HIGH (중요)</option>
                      <option value="MEDIUM">MEDIUM (권장)</option>
                    </select>
                  ) : (
                    getImpactBadge(policy.impactLevel)
                  )}
                </div>

                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => handleDeletePolicy(policy.id, policy.policyCode)}
                    className="p-1 text-muted hover:text-danger rounded transition-colors cursor-pointer"
                    title="정책 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Title & Core Rule */}
              {isEditMode ? (
                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] text-muted mb-1 font-medium">정책 제목</label>
                    <input
                      type="text"
                      value={policy.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPolicies((prev) =>
                          prev.map((p) => (p.id === policy.id ? { ...p, title: val } : p))
                        );
                      }}
                      className="w-full bg-well border border-line rounded px-2.5 py-1.5 text-xs font-bold text-ink outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-muted mb-1 font-medium">핵심 규칙 요약</label>
                    <input
                      type="text"
                      value={policy.ruleSummary}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPolicies((prev) =>
                          prev.map((p) => (p.id === policy.id ? { ...p, ruleSummary: val } : p))
                        );
                      }}
                      className="w-full bg-well border border-line rounded px-2.5 py-1.5 text-xs text-ink outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-muted mb-1 font-medium">상세 규정 및 예외 사항</label>
                    <textarea
                      rows={2}
                      value={policy.details}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPolicies((prev) =>
                          prev.map((p) => (p.id === policy.id ? { ...p, details: val } : p))
                        );
                      }}
                      className="w-full bg-well border border-line rounded px-2.5 py-1.5 text-xs text-ink-2 outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-muted mb-1 font-medium">시스템 강제 구현 방식</label>
                    <input
                      type="text"
                      value={policy.enforcementMethod}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPolicies((prev) =>
                          prev.map((p) => (p.id === policy.id ? { ...p, enforcementMethod: val } : p))
                        );
                      }}
                      className="w-full bg-well border border-line rounded px-2.5 py-1.5 text-xs text-ink-2 outline-none font-mono"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-ink">{policy.title}</h3>
                    <div className="p-2.5 bg-well/60 rounded-lg border border-line/60">
                      <p className="text-xs font-semibold text-accent leading-relaxed">
                        규칙: {policy.ruleSummary}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-muted leading-relaxed">
                    {policy.details}
                  </p>

                  <div className="pt-2 border-t border-line/60 flex items-start gap-2 text-xs">
                    <span className="font-semibold text-ink shrink-0 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      시스템 강제 방식:
                    </span>
                    <span className="text-ink-2 font-mono text-[11px]">
                      {policy.enforcementMethod}
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {filteredPolicies.length === 0 && (
          <div className="py-16 text-center text-muted text-xs space-y-2">
            <Scale className="w-8 h-8 text-muted/40 mx-auto" />
            <p>선택한 조건에 해당하는 서비스 정책이 없습니다.</p>
          </div>
        )}
      </div>

      {/* Add Policy Modal */}
      {isAddingPolicy && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-surface border border-line-strong rounded-xl max-w-lg w-full p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="text-sm font-bold text-ink">새 서비스 정책 및 제약사항 등록</h3>
              <button
                type="button"
                onClick={() => setIsAddingPolicy(false)}
                className="p-1 text-muted hover:text-ink rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPolicy} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-muted font-medium mb-1">식별 코드</label>
                  <input
                    type="text"
                    placeholder="예: POL-DISC-04"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-well border border-line rounded-lg text-ink font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-muted font-medium mb-1">카테고리</label>
                  <select
                    value={newCategory}
                    onChange={(e) =>
                      setNewCategory(
                        e.target.value as '비즈니스 운영 정책' | '법적 및 보안 제약' | '외부 연동 제약'
                      )
                    }
                    className="w-full px-2.5 py-1.5 bg-well border border-line rounded-lg text-ink outline-none"
                  >
                    <option value="비즈니스 운영 정책">비즈니스 운영 정책</option>
                    <option value="법적 및 보안 제약">법적 및 보안 제약</option>
                    <option value="외부 연동 제약">외부 연동 제약</option>
                  </select>
                </div>
                <div>
                  <label className="block text-muted font-medium mb-1">영향도</label>
                  <select
                    value={newImpactLevel}
                    onChange={(e) =>
                      setNewImpactLevel(e.target.value as 'High' | 'Medium' | 'Low')
                    }
                    className="w-full px-2.5 py-1.5 bg-well border border-line rounded-lg text-ink outline-none"
                  >
                    <option value="High">High (즉시 차단)</option>
                    <option value="Medium">Medium (경고)</option>
                    <option value="Low">Low (권고)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-muted font-medium mb-1">정책 제목</label>
                <input
                  type="text"
                  required
                  placeholder="예: 마감 할인 빵 품목 당일 생산 증빙 의무화"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-well border border-line rounded-lg text-ink focus:border-accent outline-none"
                />
              </div>

              <div>
                <label className="block text-muted font-medium mb-1">규칙 요약 (단문)</label>
                <input
                  type="text"
                  required
                  placeholder="예: 당일 06:00 이후 구운 빵만 등록 가능, 적발 시 30일 계정 정지"
                  value={newRuleSummary}
                  onChange={(e) => setNewRuleSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-well border border-line rounded-lg text-ink focus:border-accent outline-none"
                />
              </div>

              <div>
                <label className="block text-muted font-medium mb-1">상세 규정 및 예외 배경</label>
                <textarea
                  rows={2}
                  placeholder="고객 신뢰 보호를 위한 필수 규정이며 위반 시 점주 제재 조항입니다."
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  className="w-full px-3 py-2 bg-well border border-line rounded-lg text-ink outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-muted font-medium mb-1">시스템 강제 구현 방식</label>
                <input
                  type="text"
                  placeholder="예: 상품 등록 시 제조 시각 타임스탬프 검증 인터셉터"
                  value={newEnforcementMethod}
                  onChange={(e) => setNewEnforcementMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-well border border-line rounded-lg text-ink font-mono outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsAddingPolicy(false)}
                  className="px-3 py-1.5 rounded-lg bg-well text-muted hover:text-ink text-xs font-medium cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-accent text-accent-ink hover:bg-accent-hover text-xs font-semibold cursor-pointer"
                >
                  등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

