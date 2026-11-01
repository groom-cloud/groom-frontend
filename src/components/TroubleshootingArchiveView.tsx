import React, { useState } from 'react';
import {
  Wrench,
  AlertTriangle,
  TrendingDown,
  Check,
  Zap,
  BarChart2,
  PanelRightClose
} from 'lucide-react';
import type { TroubleshootingItem, StepId } from '../mockData';

interface TroubleshootingArchiveViewProps {
  items: TroubleshootingItem[];
  setItems?: React.Dispatch<React.SetStateAction<TroubleshootingItem[]>>;
  onConfirmStep?: (step: StepId) => void;
  onCollapsePane?: () => void;
  isConfirmed?: boolean;
}

export const TroubleshootingArchiveView: React.FC<TroubleshootingArchiveViewProps> = ({
  items,
  onConfirmStep,
  onCollapsePane,
  isConfirmed = false
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const allTags = Array.from(new Set(items.flatMap((i) => i.tags || [])));

  const filteredItems = items.filter((item) => {
    if (selectedTag === 'all') return true;
    return (item.tags || []).includes(selectedTag);
  });

  const getSeverityBadge = (s: TroubleshootingItem['severity']) => {
    switch (s) {
      case 'Critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-danger/10 text-danger border border-danger/20">Critical 장애</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">High 병목</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">Medium 개선</span>;
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
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
            <Wrench className="w-4 h-4 text-rose-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">16. Troubleshooting</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-well text-muted border border-line">
                총 {items.length}건 포스트모템
              </span>
            </div>
            <h2 className="text-sm font-bold text-ink truncate">트러블슈팅 아카이빙</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onConfirmStep && (
            <button
              type="button"
              onClick={() => onConfirmStep('step16')}
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

      {/* Filter Tag Bar */}
      <div className="px-5 py-2.5 bg-well/50 border-b border-line flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
        <button
          type="button"
          onClick={() => setSelectedTag('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            selectedTag === 'all'
              ? 'bg-ink text-paper font-semibold shadow-sm'
              : 'bg-surface text-muted hover:text-ink border border-line'
          }`}
        >
          전체 아카이브 ({items.length})
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              selectedTag === tag
                ? 'bg-ink text-paper font-semibold shadow-sm'
                : 'bg-surface text-muted hover:text-ink border border-line'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Cards List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {filteredItems.map((item) => {
          // Calculate reduction percentage if numeric values are available
          const bVal = item.metricsBefore.numericValue;
          const aVal = item.metricsAfter.numericValue;
          const reduction =
            bVal && aVal && bVal > aVal
              ? Math.round(((bVal - aVal) / bVal) * 100)
              : null;

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-surface border border-line hover:border-line-strong transition-colors space-y-4 shadow-sm"
            >
              {/* Card Top: Badges & Title */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  {getSeverityBadge(item.severity)}
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Resolved in {item.resolvedInVersion}
                  </span>
                  <span className="text-[11px] text-muted">{item.resolvedAt}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded text-[10px] bg-well text-muted border border-line font-mono"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-ink">{item.title}</h3>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(
                      `[트러블슈팅] ${item.title}\n- 원인: ${item.rootCause}\n- 해결: ${item.improvementSummary}`
                    );
                    showToast('트러블슈팅 요약이 복사되었습니다.');
                  }}
                  className="text-[11px] text-muted hover:text-ink transition-colors cursor-pointer shrink-0"
                >
                  요약 복사
                </button>
              </div>

              {/* 3-Step Flow: Problem -> Resolution -> Quantified Metric */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 items-stretch">
                {/* 1. Problem & Root Cause */}
                <div className="p-3.5 rounded-xl bg-danger/5 border border-danger/20 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-danger flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      1. 문제 현상 및 원인
                    </span>
                    <p className="text-xs text-ink-2 font-medium">{item.problemSymptom}</p>
                  </div>
                  <div className="text-[11px] text-muted bg-surface/60 p-2 rounded-lg border border-danger/10">
                    <strong>근본 원인:</strong> {item.rootCause}
                  </div>
                </div>

                {/* 2. Resolution Mechanism */}
                <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-blue-400 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" />
                      2. 해결 과정 및 아키텍처 개선
                    </span>
                    <ul className="space-y-1 text-xs text-ink-2 pl-1">
                      {item.solutionMechanisms.map((sol, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-blue-400">✓</span>
                          <span>{sol}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-[11px] text-muted bg-surface/60 p-2 rounded-lg border border-blue-500/10">
                    인프라 및 스키마 수준에서 원천 방지 완료
                  </div>
                </div>

                {/* 3. Quantified Metric (Before vs After) */}
                <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                      <BarChart2 className="w-3.5 h-3.5" />
                      3. 정량적 개선 지표
                    </span>
                    <div className="text-xs text-muted mt-0.5">
                      지표명: {item.metricsBefore.metricName}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {/* Before Bar */}
                    <div>
                      <div className="flex justify-between text-[11px] text-muted mb-0.5">
                        <span>개선 전 (Before)</span>
                        <span className="font-mono text-danger font-semibold">{item.metricsBefore.value}</span>
                      </div>
                      <div className="h-2 w-full bg-line rounded-full overflow-hidden">
                        <div className="h-full bg-danger rounded-full w-full" />
                      </div>
                    </div>

                    {/* After Bar */}
                    <div>
                      <div className="flex justify-between text-[11px] text-muted mb-0.5">
                        <span className="text-emerald-400 font-semibold">개선 후 (After)</span>
                        <span className="font-mono text-emerald-400 font-bold">{item.metricsAfter.value}</span>
                      </div>
                      <div className="h-2 w-full bg-line rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 rounded-full"
                          style={{
                            width: reduction ? `${Math.max(10, 100 - reduction)}%` : '20%'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {reduction && (
                    <div className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-center text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>{reduction}% 성능 개선 달성</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
