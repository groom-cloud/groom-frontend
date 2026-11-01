import React, { useState } from 'react';
import {
  FileCode2,
  Check,
  ChevronDown,
  ChevronUp,
  Zap,
  Copy,
  PanelRightClose
} from 'lucide-react';
import type { AdrDecision, StepId } from '../mockData';

interface AdrDecisionViewProps {
  decisions: AdrDecision[];
  setDecisions?: React.Dispatch<React.SetStateAction<AdrDecision[]>>;
  onConfirmStep?: (step: StepId) => void;
  onCollapsePane?: () => void;
  isConfirmed?: boolean;
}

export const AdrDecisionView: React.FC<AdrDecisionViewProps> = ({
  decisions,
  onConfirmStep,
  onCollapsePane,
  isConfirmed = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string>(decisions[0]?.id || '');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
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
              <span className="text-xs text-muted">08. Tech ADR</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-well text-muted border border-line">
                총 {decisions.length}건 의사결정
              </span>
            </div>
            <h2 className="text-sm font-bold text-ink truncate">기술 스택 선정 정의서 (ADR)</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
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
                <div className="flex items-center gap-3 min-w-0">
                  <div className="px-2 py-1 rounded bg-well border border-line font-mono text-xs font-bold text-accent shrink-0">
                    ADR-{String(adr.adrNumber).padStart(2, '0')}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-ink truncate">{adr.title}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-well text-muted border border-line">
                        {getCategoryLabel(adr.category)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs mt-0.5">
                      <span className="text-muted">선택 기술:</span>
                      <strong className="text-accent font-semibold">
                        {adr.selectedTech || adr.chosenTech}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {adr.status}
                  </span>
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
                    <div className="p-3.5 rounded-lg bg-well border border-line text-ink-2 leading-relaxed">
                      {adr.context || adr.rationale}
                    </div>
                  </div>

                  {/* Alternative Comparison Table */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-muted block">
                      2. 대안 기술과의 심층 비교 (Alternative Comparisons)
                    </span>
                    <div className="rounded-lg border border-line overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-well border-b border-line text-muted">
                          <tr>
                            <th className="px-3.5 py-2 font-medium">검토 대안</th>
                            <th className="px-3.5 py-2 font-medium">장점 (Pros)</th>
                            <th className="px-3.5 py-2 font-medium">단점 (Cons)</th>
                            <th className="px-3.5 py-2 font-medium">미선정 사유 (Rejection Reason)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                          {adr.alternatives.map((alt) => (
                            <tr key={alt.tech} className="hover:bg-well/40 transition-colors">
                              <td className="px-3.5 py-2.5 font-semibold text-ink whitespace-nowrap">
                                {alt.tech}
                              </td>
                              <td className="px-3.5 py-2.5 text-ink-2">{alt.pros}</td>
                              <td className="px-3.5 py-2.5 text-muted">{alt.cons}</td>
                              <td className="px-3.5 py-2.5 text-danger/90 font-medium">
                                {alt.decisionReason || alt.whyNotChosen}
                              </td>
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
    </div>
  );
};
