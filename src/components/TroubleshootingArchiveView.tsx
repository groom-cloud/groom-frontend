import React, { useState } from 'react';
import {
  Wrench,
  AlertTriangle,
  TrendingDown,
  Check,
  Zap,
  BarChart2,
  PanelRightClose,
  Edit3,
  Plus,
  Trash2,
  X
} from 'lucide-react';
import type { TroubleshootingItem, StepId } from '../mockData';
import { ExportDropdown } from './ExportDropdown';

interface TroubleshootingArchiveViewProps {
  items: TroubleshootingItem[];
  setItems?: React.Dispatch<React.SetStateAction<TroubleshootingItem[]>>;
  onConfirmStep?: (step: StepId) => void;
  onCollapsePane?: () => void;
  isConfirmed?: boolean;
}

export const TroubleshootingArchiveView: React.FC<TroubleshootingArchiveViewProps> = ({
  items,
  setItems,
  onConfirmStep,
  onCollapsePane,
  isConfirmed = false
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSeverity, setNewSeverity] = useState<TroubleshootingItem['severity']>('High');
  const [newVersion, setNewVersion] = useState('v1.5.0');
  const [newTags, setNewTags] = useState('PostgreSQL, Redis');
  const [newProblem, setNewProblem] = useState('');
  const [newSolution, setNewSolution] = useState('');
  const [newMetricLabel, setNewMetricLabel] = useState('P95 응답 시간');
  const [newBeforeVal, setNewBeforeVal] = useState('120ms');
  const [newBeforeNum, setNewBeforeNum] = useState<number>(120);
  const [newAfterVal, setNewAfterVal] = useState('15ms');
  const [newAfterNum, setNewAfterNum] = useState<number>(15);

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

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newProblem.trim() || !newSolution.trim()) return;

    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const created: TroubleshootingItem = {
      id: `ts_${Date.now()}`,
      issueNumber: items.length + 1,
      title: newTitle.trim(),
      resolvedInVersion: newVersion.trim(),
      resolvedAt: new Date().toISOString().slice(0, 10),
      severity: newSeverity,
      tags: tagsArray.length > 0 ? tagsArray : ['성능개선'],
      problemSymptom: newProblem.trim(),
      rootCause: newProblem.trim(),
      solutionMechanisms: [newSolution.trim()],
      metricsBefore: {
        metricName: newMetricLabel.trim(),
        value: newBeforeVal.trim(),
        numericValue: newBeforeNum || 100
      },
      metricsAfter: {
        value: newAfterVal.trim(),
        numericValue: newAfterNum || 20
      },
      symptomAndCause: newProblem.trim(),
      resolutionProcess: newSolution.trim(),
      beforeMetric: newBeforeVal.trim(),
      afterMetric: newAfterVal.trim(),
      improvementSummary: newSolution.trim(),
      metricComparison: {
        label: newMetricLabel.trim(),
        beforeVal: newBeforeNum || 100,
        afterVal: newAfterNum || 20,
        unit: 'ms'
      }
    };

    if (setItems) {
      setItems((prev) => [created, ...prev]);
    }
    setIsAddingItem(false);
    setNewTitle('');
    setNewProblem('');
    setNewSolution('');
    showToast(`"${created.title}" 트러블슈팅 사례가 등록되었습니다.`);
  };

  const handleDeleteItem = (id: string, title: string) => {
    if (setItems) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      showToast(`"${title}" 트러블슈팅 일지가 삭제되었습니다.`);
    }
  };

  const handleUpdateItemField = <K extends keyof TroubleshootingItem>(
    id: string,
    field: K,
    value: TroubleshootingItem[K]
  ) => {
    if (setItems) {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
      );
    }
  };

  const buildMarkdown = () => {
    return `# 16. 트러블슈팅 아카이빙 (Troubleshooting & Post-Mortem)

총 ${items.length}건의 장애 대응 및 성능 병목 개선 기록

${items
  .map(
    (item) => `## [${item.severity}] ${item.title}
- **해결 버전**: ${item.resolvedInVersion} | **해결 일자**: ${item.resolvedAt}
- **태그**: ${item.tags.map((t) => `#${t}`).join(' ')}

### 1. 문제 현상 및 원인
${item.rootCause || item.symptomAndCause || item.problemSymptom}

### 2. 해결 과정 및 아키텍처 개선
${item.improvementSummary || item.resolutionProcess || item.solutionMechanisms?.join('\n')}

### 3. 정량적 개선 지표
- **개선 전**: ${item.metricsBefore?.value || item.beforeMetric}
- **개선 후**: ${item.metricsAfter?.value || item.afterMetric}
`
  )
  .join('\n---\n\n')}
`;
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
          <ExportDropdown
            title="16_트러블슈팅_아카이빙"
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
        {isEditMode && (
          <div className="p-3 bg-well/40 border border-dashed border-accent/40 rounded-xl flex items-center justify-between">
            <span className="text-xs text-muted">편집 모드: 신규 트러블슈팅 일지를 등록하거나 이전 항목을 삭제할 수 있습니다.</span>
            <button
              type="button"
              onClick={() => setIsAddingItem(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-ink hover:bg-accent-hover text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ 새 트러블슈팅 일지 등록</span>
            </button>
          </div>
        )}

        {filteredItems.map((item) => {
          const bVal = item.metricsBefore?.numericValue;
          const aVal = item.metricsAfter?.numericValue;
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
                  {isEditMode ? (
                    <select
                      value={item.severity}
                      onChange={(e) => handleUpdateItemField(item.id, 'severity', e.target.value as any)}
                      className="px-2 py-0.5 rounded text-[10px] font-bold bg-well border border-line text-ink outline-none"
                    >
                      <option value="Critical">Critical 장애</option>
                      <option value="High">High 병목</option>
                      <option value="Medium">Medium 개선</option>
                    </select>
                  ) : (
                    getSeverityBadge(item.severity)
                  )}

                  {isEditMode ? (
                    <input
                      type="text"
                      value={item.resolvedInVersion}
                      onChange={(e) => handleUpdateItemField(item.id, 'resolvedInVersion', e.target.value)}
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-well text-emerald-400 border border-line outline-none w-20"
                      placeholder="v1.5.0"
                    />
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Resolved in {item.resolvedInVersion}
                    </span>
                  )}
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
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id, item.title)}
                      className="p-1 rounded text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer ml-1"
                      title="일지 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                {isEditMode ? (
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleUpdateItemField(item.id, 'title', e.target.value)}
                    className="w-full max-w-lg px-2.5 py-1 rounded-lg bg-well border border-line text-sm font-bold text-ink outline-none focus:border-accent"
                    placeholder="트러블슈팅 제목"
                  />
                ) : (
                  <h3 className="text-sm font-bold text-ink">{item.title}</h3>
                )}
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(
                      `[트러블슈팅] ${item.title}\n- 원인: ${item.rootCause || item.problemSymptom}\n- 해결: ${item.improvementSummary || item.resolutionProcess}`
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
                    {isEditMode ? (
                      <textarea
                        value={item.rootCause || item.symptomAndCause || item.problemSymptom}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleUpdateItemField(item.id, 'rootCause', val);
                          handleUpdateItemField(item.id, 'problemSymptom', val);
                          handleUpdateItemField(item.id, 'symptomAndCause', val);
                        }}
                        rows={3}
                        className="w-full p-2 bg-well border border-line rounded text-xs text-ink leading-relaxed outline-none focus:border-accent"
                      />
                    ) : (
                      <p className="text-xs text-ink-2 leading-relaxed">
                        {item.rootCause || item.symptomAndCause || item.problemSymptom}
                      </p>
                    )}
                  </div>
                </div>

                {/* 2. Resolution & Architecture */}
                <div className="p-3.5 rounded-xl bg-accent-soft/40 border border-accent/20 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-accent flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" />
                      2. 해결 과정 및 적용 기술
                    </span>
                    {isEditMode ? (
                      <textarea
                        value={item.improvementSummary || item.resolutionProcess || item.solutionMechanisms?.[0] || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleUpdateItemField(item.id, 'improvementSummary', val);
                          handleUpdateItemField(item.id, 'resolutionProcess', val);
                          handleUpdateItemField(item.id, 'solutionMechanisms', [val]);
                        }}
                        rows={3}
                        className="w-full p-2 bg-well border border-line rounded text-xs text-ink leading-relaxed outline-none focus:border-accent"
                      />
                    ) : (
                      <p className="text-xs text-ink-2 leading-relaxed">
                        {item.improvementSummary || item.resolutionProcess || item.solutionMechanisms?.[0]}
                      </p>
                    )}
                  </div>
                </div>

                {/* 3. Quantified Improvement Metric */}
                <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                      <BarChart2 className="w-3.5 h-3.5" />
                      3. 정량적 개선 지표
                    </span>
                    <div className="pt-2 flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[10px] text-muted">개선 전 (Before)</div>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={item.metricsBefore?.value || item.beforeMetric || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              const num = parseFloat(val.replace(/[^0-9.]/g, '')) || 0;
                              handleUpdateItemField(item.id, 'beforeMetric', val);
                              handleUpdateItemField(item.id, 'metricsBefore', {
                                metricName: item.metricsBefore?.metricName || '응답 지연',
                                value: val,
                                numericValue: num
                              });
                            }}
                            className="w-20 px-1.5 py-0.5 bg-well border border-line rounded font-mono font-bold text-danger text-xs outline-none"
                          />
                        ) : (
                          <div className="font-mono font-bold text-danger mt-0.5 line-through">
                            {item.metricsBefore?.value || item.beforeMetric}
                          </div>
                        )}
                      </div>

                      <div className="text-center px-2">
                        <TrendingDown className="w-4 h-4 text-emerald-400 mx-auto" />
                        {reduction && (
                          <span className="text-[10px] font-bold text-emerald-400">
                            {reduction}% 단축
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-muted">개선 후 (After)</div>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={item.metricsAfter?.value || item.afterMetric || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              const num = parseFloat(val.replace(/[^0-9.]/g, '')) || 0;
                              handleUpdateItemField(item.id, 'afterMetric', val);
                              handleUpdateItemField(item.id, 'metricsAfter', {
                                value: val,
                                numericValue: num
                              });
                            }}
                            className="w-20 px-1.5 py-0.5 bg-well border border-line rounded font-mono font-bold text-emerald-400 text-xs outline-none text-right"
                          />
                        ) : (
                          <div className="font-mono font-bold text-emerald-400 mt-0.5">
                            {item.metricsAfter?.value || item.afterMetric}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Troubleshooting Item */}
      {isAddingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface border border-line-strong rounded-2xl w-full max-w-lg shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-line flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-rose-400" />
                </div>
                <h3 className="text-sm font-bold text-ink">새 트러블슈팅 일지 등록</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingItem(false)}
                className="p-1 rounded-lg text-muted hover:text-ink hover:bg-well transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">이슈 / 개선 제목</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="예: 마감 정각 동시 예약 트래픽에 따른 DB 데드락 방지"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-muted mb-1">심각도</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent"
                  >
                    <option value="Critical">Critical 장애</option>
                    <option value="High">High 병목</option>
                    <option value="Medium">Medium 개선</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted mb-1">해결 버전</label>
                  <input
                    type="text"
                    value={newVersion}
                    onChange={(e) => setNewVersion(e.target.value)}
                    placeholder="v1.5.0"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink font-mono text-xs focus:outline-none focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted mb-1">태그 (쉼표 구분)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="PostgreSQL, Redis"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink font-mono text-xs focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">
                  1. 문제 현상 및 원인 분석
                </label>
                <textarea
                  value={newProblem}
                  onChange={(e) => setNewProblem(e.target.value)}
                  rows={2}
                  placeholder="예: 20:00 재고 오픈 시 동일 행에 대한 비관적 락(Pessimistic Lock) 경쟁으로 Connection Pool 고갈 및 데드락 발생."
                  className="w-full p-2.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">
                  2. 해결 과정 및 적용 기술
                </label>
                <textarea
                  value={newSolution}
                  onChange={(e) => setNewSolution(e.target.value)}
                  rows={2}
                  placeholder="예: Redisson 기반 Redis 분산 락을 적용하여 트랜잭션 진입 전 대기열 순차 처리 및 JPA @Version 낙관적 락 복합 적용."
                  className="w-full p-2.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-muted mb-1">지표명</label>
                  <input
                    type="text"
                    value={newMetricLabel}
                    onChange={(e) => setNewMetricLabel(e.target.value)}
                    placeholder="P95 응답 지연"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted mb-1">개선 전 (Before)</label>
                  <input
                    type="text"
                    value={newBeforeVal}
                    onChange={(e) => {
                      setNewBeforeVal(e.target.value);
                      const num = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                      if (!isNaN(num)) setNewBeforeNum(num);
                    }}
                    placeholder="120ms"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink font-mono text-xs focus:outline-none focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted mb-1">개선 후 (After)</label>
                  <input
                    type="text"
                    value={newAfterVal}
                    onChange={(e) => {
                      setNewAfterVal(e.target.value);
                      const num = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                      if (!isNaN(num)) setNewAfterNum(num);
                    }}
                    placeholder="15ms"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink font-mono text-xs focus:outline-none focus:border-accent"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsAddingItem(false)}
                  className="px-3 py-1.5 rounded-lg bg-well text-muted hover:text-ink text-xs font-medium cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-accent text-accent-ink hover:bg-accent-hover text-xs font-semibold cursor-pointer"
                >
                  일지 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
