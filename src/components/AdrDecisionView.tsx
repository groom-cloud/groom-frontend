import React, { useState } from 'react';
import {
  FileCode2,
  Check,
  ChevronDown,
  ChevronUp,
  Zap,
  Copy,
  Plus,
  Trash2,
  Edit3,
  PanelRightClose
} from 'lucide-react';
import type { AdrDecision, StepId } from '../mockData';
import { ExportDropdown } from './ExportDropdown';

interface AdrDecisionViewProps {
  decisions: AdrDecision[];
  setDecisions?: React.Dispatch<React.SetStateAction<AdrDecision[]>>;
  onConfirmStep?: (step: StepId) => void;
  onCollapsePane?: () => void;
  isConfirmed?: boolean;
}

export const AdrDecisionView: React.FC<AdrDecisionViewProps> = ({
  decisions,
  setDecisions,
  onConfirmStep,
  onCollapsePane,
  isConfirmed = false
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string>(decisions[0]?.id || '');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New ADR Modal Form State
  const [isAddingAdr, setIsAddingAdr] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<AdrDecision['category']>('Backend');
  const [newSelectedTech, setNewSelectedTech] = useState('');
  const [newRationale, setNewRationale] = useState('');
  const [newAltTech, setNewAltTech] = useState('');
  const [newAltPros, setNewAltPros] = useState('');
  const [newAltCons, setNewAltCons] = useState('');
  const [newAltReason, setNewAltReason] = useState('');
  const [newConsequences, setNewConsequences] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleAddAdr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSelectedTech.trim()) return;

    const created: AdrDecision = {
      id: `adr_${Date.now()}`,
      adrNumber: decisions.length + 1,
      title: newTitle.trim(),
      category: newCategory,
      status: 'Accepted',
      decisionDate: new Date().toISOString().split('T')[0],
      selectedTech: newSelectedTech.trim(),
      chosenTech: newSelectedTech.trim(),
      context: newRationale.trim() || '아키텍처 결정 근거가 기술되었습니다.',
      rationale: newRationale.trim() || '아키텍처 결정 근거가 기술되었습니다.',
      alternatives: newAltTech.trim()
        ? [
            {
              tech: newAltTech.trim(),
              pros: newAltPros.trim() || '성능 우수',
              cons: newAltCons.trim() || '초기 복잡도 증가',
              decisionReason: newAltReason.trim() || '초기 MVP 단순성 우선',
              whyNotChosen: newAltReason.trim() || '초기 MVP 단순성 우선'
            }
          ]
        : [],
      consequences: newConsequences.trim()
        ? newConsequences.split('\n').filter(Boolean)
        : ['시스템 단일 책임 원칙 준수', '인프라 운영 복잡도 최소화']
    };

    if (setDecisions) {
      setDecisions((prev) => [...prev, created]);
    }
    setIsAddingAdr(false);
    setNewTitle('');
    setNewSelectedTech('');
    setNewRationale('');
    setNewAltTech('');
    setExpandedId(created.id);
    showToast(`"[ADR-${created.adrNumber}] ${created.title}" 의사결정이 등록되었습니다.`);
  };

  const handleDeleteAdr = (id: string, title: string) => {
    if (setDecisions) {
      setDecisions((prev) => prev.filter((d) => d.id !== id));
      showToast(`"${title}" ADR 항목이 삭제되었습니다.`);
    }
  };

  const handleUpdateAdrField = <K extends keyof AdrDecision>(
    id: string,
    field: K,
    value: AdrDecision[K]
  ) => {
    if (setDecisions) {
      setDecisions((prev) =>
        prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
      );
    }
  };

  const handleUpdateAlternative = (
    adrId: string,
    altIdx: number,
    field: 'tech' | 'pros' | 'cons' | 'decisionReason',
    value: string
  ) => {
    if (setDecisions) {
      setDecisions((prev) =>
        prev.map((item) => {
          if (item.id !== adrId) return item;
          const nextAlts = [...item.alternatives];
          nextAlts[altIdx] = {
            ...nextAlts[altIdx],
            [field]: value,
            ...(field === 'decisionReason' ? { whyNotChosen: value } : {})
          };
          return { ...item, alternatives: nextAlts };
        })
      );
    }
  };

  const handleAddAlternative = (adrId: string) => {
    if (setDecisions) {
      setDecisions((prev) =>
        prev.map((item) => {
          if (item.id !== adrId) return item;
          return {
            ...item,
            alternatives: [
              ...item.alternatives,
              { tech: '대안 기술명', pros: '주요 장점', cons: '단점 및 리스크', decisionReason: '미선정 사유' }
            ]
          };
        })
      );
    }
  };

  const handleDeleteAlternative = (adrId: string, altIdx: number) => {
    if (setDecisions) {
      setDecisions((prev) =>
        prev.map((item) => {
          if (item.id !== adrId) return item;
          return {
            ...item,
            alternatives: item.alternatives.filter((_, i) => i !== altIdx)
          };
        })
      );
    }
  };

  const buildMarkdown = () => {
    return `# 07. 기술 스택 선정 정의서 (ADR)

총 ${decisions.length}건의 아키텍처 의사결정 기록

${decisions
  .map(
    (adr) => `## [ADR-${String(adr.adrNumber).padStart(2, '0')}] ${adr.title}
- 분류: ${adr.category} | 상태: ${adr.status}
- 선정 기술: ${adr.selectedTech || adr.chosenTech}

### 1. 결정 근거
${adr.context || adr.rationale}

### 2. 대안 기술과의 비교
${adr.alternatives.map((alt) => `- ${alt.tech}: 장점(${alt.pros}) / 단점(${alt.cons}) / 미선정 사유(${alt.decisionReason || alt.whyNotChosen})`).join('\n')}

### 3. 파급 효과 (Consequences)
${(Array.isArray(adr.consequences) ? adr.consequences : [adr.consequences]).map((c) => `- ${c}`).join('\n')}`
  )
  .join('\n\n')}
`;
  };

  const filteredDecisions = decisions.filter((d) => {
    if (selectedCategory === 'all') return true;
    return d.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const getCategoryLabel = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'frontend':
        return '프론트엔드';
      case 'backend':
        return '백엔드';
      case 'database':
        return '데이터베이스';
      case 'infra':
        return '인프라/운영';
      default:
        return cat;
    }
  };

  const handleCopySummary = (adr: AdrDecision) => {
    const consequencesText = Array.isArray(adr.consequences)
      ? adr.consequences.join(', ')
      : adr.consequences;

    const text = `[ADR: ${adr.title}]
- 선택 기술: ${adr.selectedTech || adr.chosenTech} (${adr.status})
- 선정 근거: ${adr.context || adr.rationale}
- 대안 비교:
${adr.alternatives.map((alt) => `  * ${alt.tech}: 미선정 사유 - ${alt.decisionReason || alt.whyNotChosen}`).join('\n')}
- 아키텍처 영향: ${consequencesText}`;

    navigator.clipboard?.writeText(text).catch(() => {});
    showToast(`"${adr.title}" 결정 요약이 복사되었습니다.`);
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
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
            <FileCode2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">07. Tech ADR</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-well text-muted border border-line">
                총 {decisions.length}건 의사결정
              </span>
            </div>
            <h2 className="text-sm font-bold text-ink truncate">기술 스택 선정 정의서 (ADR)</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ExportDropdown
            title="07_기술_스택_선정_정의서_ADR"
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
              onClick={() => onConfirmStep('step8')}
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

      {/* Category Filter Pills */}
      <div className="px-5 py-2.5 bg-well/50 border-b border-line flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
        {[
          { id: 'all', label: '전체 보기' },
          { id: 'database', label: '데이터베이스' },
          { id: 'backend', label: '백엔드' },
          { id: 'frontend', label: '프론트엔드' },
          { id: 'infra', label: '인프라/운영' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === tab.id
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold'
                : 'text-muted hover:text-ink hover:bg-well'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ADR Cards List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {isEditMode && (
          <div className="p-3 bg-well/40 border border-dashed border-accent/40 rounded-xl flex items-center justify-between">
            <span className="text-xs text-muted">편집 모드: 새 기술 스택 의사결정(ADR) 카드를 추가하거나 삭제할 수 있습니다.</span>
            <button
              type="button"
              onClick={() => setIsAddingAdr(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-ink hover:bg-accent-hover text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ 새 기술 ADR 추가</span>
            </button>
          </div>
        )}

        {filteredDecisions.map((adr) => {
          const isExpanded = expandedId === adr.id;
          const consequencesList = Array.isArray(adr.consequences)
            ? adr.consequences
            : [adr.consequences];

          return (
            <div
              key={adr.id}
              className="rounded-xl bg-surface border border-line hover:border-line-strong transition-colors overflow-hidden shadow-sm"
            >
              {/* Card Header (Click to expand/collapse) */}
              <div
                onClick={() => setExpandedId(isExpanded ? '' : adr.id)}
                className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none hover:bg-well/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="px-2 py-1 rounded bg-well border border-line font-mono text-xs font-bold text-accent shrink-0">
                    ADR-{String(adr.adrNumber).padStart(2, '0')}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={adr.title}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleUpdateAdrField(adr.id, 'title', e.target.value)}
                          className="bg-well border border-line rounded px-2 py-1 text-sm font-bold text-ink w-full max-w-sm outline-none focus:border-accent"
                          placeholder="ADR 제목 입력"
                        />
                      ) : (
                        <span className="text-sm font-bold text-ink truncate">{adr.title}</span>
                      )}
                      {isEditMode ? (
                        <select
                          value={adr.category}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleUpdateAdrField(adr.id, 'category', e.target.value as any)}
                          className="px-2 py-0.5 rounded text-[11px] bg-well text-ink border border-line outline-none"
                        >
                          <option value="frontend">프론트엔드</option>
                          <option value="backend">백엔드</option>
                          <option value="database">데이터베이스</option>
                          <option value="infra">인프라/운영</option>
                        </select>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-well text-muted border border-line">
                          {getCategoryLabel(adr.category)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted shrink-0">선택 기술:</span>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={adr.selectedTech || adr.chosenTech}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleUpdateAdrField(adr.id, 'selectedTech', e.target.value)}
                          className="bg-well border border-line rounded px-2 py-0.5 text-xs font-semibold text-accent outline-none focus:border-accent"
                          placeholder="예: PostgreSQL"
                        />
                      ) : (
                        <strong className="text-accent font-semibold">
                          {adr.selectedTech || adr.chosenTech}
                        </strong>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isEditMode ? (
                    <select
                      value={adr.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleUpdateAdrField(adr.id, 'status', e.target.value as any)}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-well text-emerald-400 border border-line outline-none"
                    >
                      <option value="Accepted">Accepted</option>
                      <option value="Proposed">Proposed</option>
                      <option value="Deprecated">Deprecated</option>
                      <option value="Superseded">Superseded</option>
                    </select>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {adr.status}
                    </span>
                  )}
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAdr(adr.id, adr.title);
                      }}
                      className="p-1 rounded text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                      title="ADR 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted" />
                  )}
                </div>
              </div>

              {/* ADR Expanded Details */}
              {isExpanded && (
                <div className="p-5 border-t border-line space-y-5 text-xs bg-canvas/40">
                  {/* Rationale */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-muted block">
                      1. 아키텍처 결정 근거 (Decision Drivers & Rationale)
                    </span>
                    {isEditMode ? (
                      <textarea
                        value={adr.context || adr.rationale}
                        onChange={(e) => handleUpdateAdrField(adr.id, 'context', e.target.value)}
                        rows={3}
                        className="w-full p-3 rounded-lg bg-well border border-line text-ink leading-relaxed outline-none focus:border-accent text-xs"
                      />
                    ) : (
                      <div className="p-3.5 rounded-lg bg-well border border-line text-ink-2 leading-relaxed">
                        {adr.context || adr.rationale}
                      </div>
                    )}
                  </div>

                  {/* Alternative Comparison Table */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-muted block">
                        2. 대안 기술과의 심층 비교 (Alternative Comparisons)
                      </span>
                      {isEditMode && (
                        <button
                          type="button"
                          onClick={() => handleAddAlternative(adr.id)}
                          className="flex items-center gap-1 text-[11px] text-accent font-semibold hover:underline cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>대안 추가</span>
                        </button>
                      )}
                    </div>
                    <div className="rounded-lg border border-line overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-well border-b border-line text-muted">
                          <tr>
                            <th className="px-3.5 py-2 font-medium w-28">검토 대안</th>
                            <th className="px-3.5 py-2 font-medium">장점 (Pros)</th>
                            <th className="px-3.5 py-2 font-medium">단점 (Cons)</th>
                            <th className="px-3.5 py-2 font-medium">미선정 사유 (Rejection Reason)</th>
                            {isEditMode && <th className="px-2 py-2 text-center w-12">삭제</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                          {adr.alternatives.map((alt, aIdx) => (
                            <tr key={aIdx} className="hover:bg-well/40 transition-colors">
                              <td className="px-3 py-2 align-top">
                                {isEditMode ? (
                                  <input
                                    type="text"
                                    value={alt.tech}
                                    onChange={(e) => handleUpdateAlternative(adr.id, aIdx, 'tech', e.target.value)}
                                    className="w-full px-2 py-1 bg-well border border-line rounded text-xs font-semibold text-ink outline-none"
                                  />
                                ) : (
                                  <span className="font-semibold text-ink whitespace-nowrap">{alt.tech}</span>
                                )}
                              </td>
                              <td className="px-3 py-2 align-top">
                                {isEditMode ? (
                                  <input
                                    type="text"
                                    value={alt.pros}
                                    onChange={(e) => handleUpdateAlternative(adr.id, aIdx, 'pros', e.target.value)}
                                    className="w-full px-2 py-1 bg-well border border-line rounded text-xs text-ink-2 outline-none"
                                  />
                                ) : (
                                  <span className="text-ink-2">{alt.pros}</span>
                                )}
                              </td>
                              <td className="px-3 py-2 align-top">
                                {isEditMode ? (
                                  <input
                                    type="text"
                                    value={alt.cons}
                                    onChange={(e) => handleUpdateAlternative(adr.id, aIdx, 'cons', e.target.value)}
                                    className="w-full px-2 py-1 bg-well border border-line rounded text-xs text-muted outline-none"
                                  />
                                ) : (
                                  <span className="text-muted">{alt.cons}</span>
                                )}
                              </td>
                              <td className="px-3 py-2 align-top">
                                {isEditMode ? (
                                  <input
                                    type="text"
                                    value={alt.decisionReason || alt.whyNotChosen}
                                    onChange={(e) => handleUpdateAlternative(adr.id, aIdx, 'decisionReason', e.target.value)}
                                    className="w-full px-2 py-1 bg-well border border-line rounded text-xs text-danger font-medium outline-none"
                                  />
                                ) : (
                                  <span className="text-danger/90 font-medium">
                                    {alt.decisionReason || alt.whyNotChosen}
                                  </span>
                                )}
                              </td>
                              {isEditMode && (
                                <td className="px-2 py-2 text-center align-middle">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteAlternative(adr.id, aIdx)}
                                    className="p-1 text-muted hover:text-danger rounded cursor-pointer"
                                    title="대안 삭제"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Consequences */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-muted block">
                      3. 시스템 파급 효과 및 트레이드오프 (Consequences)
                    </span>
                    {isEditMode ? (
                      <textarea
                        value={consequencesList.join('\n')}
                        onChange={(e) => {
                          const lines = e.target.value.split('\n').filter(Boolean);
                          handleUpdateAdrField(adr.id, 'consequences', lines);
                        }}
                        rows={3}
                        placeholder="줄바꿈으로 각 파급 효과를 입력하세요"
                        className="w-full p-2.5 rounded-lg bg-well border border-line text-ink text-xs outline-none focus:border-accent leading-relaxed"
                      />
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {consequencesList.map((c, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-lg bg-well border border-line text-ink-2 flex items-center gap-2"
                          >
                            <Zap className="w-3.5 h-3.5 text-accent shrink-0" />
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Action */}
                  <div className="pt-2 border-t border-line flex items-center justify-between text-muted">
                    <span>의사결정 일시: {adr.decisionDate || adr.decidedAt || '2026-10-24'}</span>
                    <button
                      type="button"
                      onClick={() => handleCopySummary(adr)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-well border border-line text-ink hover:border-line-strong transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>결정 요약 복사</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add ADR Modal */}
      {isAddingAdr && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-surface border border-line-strong rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="text-sm font-bold text-ink">새 기술 스택 선정 정의서 (ADR) 등록</h3>
              <button
                type="button"
                onClick={() => setIsAddingAdr(false)}
                className="p-1 text-muted hover:text-ink rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAdr} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted font-medium mb-1">분류 영역</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-well border border-line rounded-lg text-ink outline-none"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="Infra">Infra / DevOps</option>
                  </select>
                </div>

                <div>
                  <label className="block text-muted font-medium mb-1">선정 기술명</label>
                  <input
                    type="text"
                    placeholder="예: PostgreSQL 16"
                    value={newSelectedTech}
                    onChange={(e) => setNewSelectedTech(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-well border border-line rounded-lg text-ink outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted font-medium mb-1">의사결정 제목</label>
                <input
                  type="text"
                  placeholder="예: 실시간 재고 락 제어 및 단일 DB 전략"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-well border border-line rounded-lg text-ink font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-muted font-medium mb-1">1. 아키텍처 결정 근거 (Rationale)</label>
                <textarea
                  rows={3}
                  placeholder="왜 이 기술을 선택했는지 배경과 기술적 당위성을 기술하세요."
                  value={newRationale}
                  onChange={(e) => setNewRationale(e.target.value)}
                  className="w-full px-3 py-2 bg-well border border-line rounded-lg text-ink outline-none resize-none"
                />
              </div>

              <div className="p-3 bg-well/50 border border-line rounded-xl space-y-2">
                <span className="font-bold text-ink block">2. 대안 기술 비교 (선택 사항)</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="비교 대안 (예: Redis)"
                    value={newAltTech}
                    onChange={(e) => setNewAltTech(e.target.value)}
                    className="px-2 py-1 bg-surface border border-line rounded text-xs text-ink outline-none"
                  />
                  <input
                    type="text"
                    placeholder="대안 장점 (예: 초고속)"
                    value={newAltPros}
                    onChange={(e) => setNewAltPros(e.target.value)}
                    className="px-2 py-1 bg-surface border border-line rounded text-xs text-ink outline-none"
                  />
                  <input
                    type="text"
                    placeholder="대안 단점 (예: 인프라 복잡도)"
                    value={newAltCons}
                    onChange={(e) => setNewAltCons(e.target.value)}
                    className="px-2 py-1 bg-surface border border-line rounded text-xs text-ink outline-none"
                  />
                  <input
                    type="text"
                    placeholder="미선정 사유 (예: 비용 증가)"
                    value={newAltReason}
                    onChange={(e) => setNewAltReason(e.target.value)}
                    className="px-2 py-1 bg-surface border border-line rounded text-xs text-ink outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted font-medium mb-1">3. 시스템 파급 효과 및 결과 (줄바꿈 구분)</label>
                <textarea
                  rows={2}
                  placeholder="도입 후 예상되는 시스템 효과나 주의할 점을 적으세요."
                  value={newConsequences}
                  onChange={(e) => setNewConsequences(e.target.value)}
                  className="w-full px-3 py-2 bg-well border border-line rounded-lg text-ink outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsAddingAdr(false)}
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
