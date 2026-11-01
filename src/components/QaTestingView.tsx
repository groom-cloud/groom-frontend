import React, { useState } from 'react';
import {
  ShieldCheck,
  XCircle,
  Activity,
  Check,
  ChevronDown,
  ChevronUp,
  PanelRightClose
} from 'lucide-react';
import type { QaTestCase, QaLoadTestMetric, StepId } from '../mockData';

interface QaTestingViewProps {
  testCases: QaTestCase[];
  setTestCases: React.Dispatch<React.SetStateAction<QaTestCase[]>>;
  loadMetrics: QaLoadTestMetric[];
  onConfirmStep?: (step: StepId) => void;
  onCollapsePane?: () => void;
  isConfirmed?: boolean;
}

export const QaTestingView: React.FC<QaTestingViewProps> = ({
  testCases,
  setTestCases,
  loadMetrics,
  onConfirmStep,
  onCollapsePane,
  isConfirmed = false
}) => {
  const [activeTab, setActiveTab] = useState<'functional' | 'load_test'>('functional');
  const [filterType, setFilterType] = useState<string>('all');
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleToggleStatus = (id: string) => {
    setTestCases((prev) =>
      prev.map((tc) => {
        if (tc.id !== id) return tc;
        const currentPassed = tc.isPassed ?? (tc.status === 'PASSED');
        const nextPassed = !currentPassed;
        return {
          ...tc,
          isPassed: nextPassed,
          status: nextPassed ? 'PASSED' : 'FAILED'
        };
      })
    );
    showToast('테스트 케이스 결과가 갱신되었습니다.');
  };

  const passedCount = testCases.filter((tc) => tc.isPassed || tc.status === 'PASSED').length;
  const passRate = Math.round((passedCount / (testCases.length || 1)) * 100);

  const filteredCases = testCases.filter((tc) => {
    if (filterType === 'all') return true;
    return (tc.scenarioType || tc.category) === filterType;
  });

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
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">14. QA & Testing</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-well text-muted border border-line">
                통과율 {passRate}% ({passedCount}/{testCases.length})
              </span>
            </div>
            <h2 className="text-sm font-bold text-ink truncate">테스트 케이스 & QA 검증</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onConfirmStep && (
            <button
              type="button"
              onClick={() => onConfirmStep('step14')}
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

      {/* Sub Tabs */}
      <div className="px-5 py-2.5 bg-well/50 border-b border-line flex items-center gap-2 text-xs shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('functional')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'functional'
              ? 'bg-ink text-paper font-semibold shadow-sm'
              : 'bg-surface text-muted hover:text-ink border border-line'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>기능/예외 검증 체크리스트 ({testCases.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('load_test')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'load_test'
              ? 'bg-ink text-paper font-semibold shadow-sm'
              : 'bg-surface text-muted hover:text-ink border border-line'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>부하 테스트 (k6 / JMeter) 대시보드</span>
        </button>
      </div>

      {/* Main Tab Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* TAB 1: Functional / Exception Test Cases */}
        {activeTab === 'functional' && (
          <div className="space-y-4">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 text-xs">
              {[
                { id: 'all', label: '전체 시나리오' },
                { id: 'NORMAL', label: '정상 동작 (Happy Path)' },
                { id: 'EXCEPTION', label: '예외/에러 케이스' },
                { id: 'EDGE_CASE', label: '동시성 엣지 케이스' }
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setFilterType(pill.id)}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    filterType === pill.id
                      ? 'bg-accent text-accent-ink font-semibold'
                      : 'bg-well text-muted hover:text-ink border border-line'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Test Case Cards List */}
            <div className="space-y-2.5">
              {filteredCases.map((tc) => {
                const isPassed = tc.status === 'PASSED';
                const isFailed = tc.status === 'FAILED';
                const isExpanded = expandedCaseId === tc.id;

                return (
                  <div
                    key={tc.id}
                    className={`rounded-xl border transition-colors ${
                      isPassed
                        ? 'bg-surface/80 border-line'
                        : isFailed
                        ? 'bg-danger/5 border-danger/30'
                        : 'bg-surface border-line'
                    }`}
                  >
                    <div className="p-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Interactive Checkbox */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(tc.id)}
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                            isPassed
                              ? 'bg-emerald-500 text-white'
                              : isFailed
                              ? 'bg-danger text-white'
                              : 'border-2 border-line hover:border-accent'
                          }`}
                          title="클릭하여 통과/실패/대기 토글"
                        >
                          {isPassed && <Check className="w-3.5 h-3.5" />}
                          {isFailed && <XCircle className="w-3.5 h-3.5" />}
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-[10px] text-muted">{tc.id}</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-well text-ink-2 border border-line">
                              {tc.category}
                            </span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[10px] font-medium ${
                                (tc.scenarioType || tc.category) === 'NORMAL' || (tc.scenarioType || tc.category) === '기능 테스트'
                                  ? 'bg-blue-500/10 text-blue-400'
                                  : (tc.scenarioType || tc.category) === 'EXCEPTION' || (tc.scenarioType || tc.category) === '예외 처리'
                                  ? 'bg-amber-500/10 text-amber-400'
                                  : 'bg-purple-500/10 text-purple-400'
                              }`}
                            >
                              {tc.scenarioType || tc.category}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-ink mt-0.5 truncate">
                            {tc.title || tc.testTitle}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setExpandedCaseId(isExpanded ? null : tc.id)}
                          className="p-1 text-muted hover:text-ink cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Detail */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 border-t border-line/60 text-xs space-y-2.5 bg-canvas/30">
                        <div>
                          <span className="text-[11px] font-semibold text-muted block mb-1">
                            재현 절차 (Steps to Reproduce)
                          </span>
                          <ol className="list-decimal list-inside space-y-1 text-ink-2 pl-1">
                            {(tc.steps || tc.testSteps || []).map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ol>
                        </div>
                        <div>
                          <span className="text-[11px] font-semibold text-emerald-400 block mb-0.5">
                            기대 결과 (Expected Outcome)
                          </span>
                          <p className="p-2.5 rounded-lg bg-well border border-line text-ink-2">
                            {tc.expectedResult}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: k6 / JMeter Load Testing Dashboard */}
        {activeTab === 'load_test' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface border border-line space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink flex items-center gap-2">
                  <Activity className="w-4 h-4 text-accent" />
                  부하 테스트 시나리오 및 SLA 지표 요약
                </span>
                <span className="text-[11px] font-mono text-emerald-400">Tool: k6 Cloud / JMeter</span>
              </div>
              <p className="text-xs text-ink-2 leading-relaxed">
                마감 정각(20:00) 잉여 재고 오픈 시 발생하는 순간 트래픽(Spike Traffic)을 가정한 1,000 VU(가상 사용자) 동시 인입 테스트 결과입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loadMetrics.map((metric, idx) => {
                const isPass = metric.status === 'PASSED' || (metric.status as string) === 'PASS';
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-surface border border-line hover:border-line-strong transition-colors space-y-3.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-ink truncate">{metric.scenarioName}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isPass
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {metric.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2.5 rounded-lg bg-well border border-line">
                        <div className="text-[10px] text-muted">목표 TPS</div>
                        <div className="text-sm font-bold font-mono text-ink mt-0.5">
                          {metric.targetTps}
                        </div>
                        <div className="text-[10px] text-accent mt-0.5">
                          달성: {metric.actualTps ?? metric.targetTps}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-well border border-line">
                        <div className="text-[10px] text-muted">P95 응답시간</div>
                        <div className="text-sm font-bold font-mono text-ink mt-0.5">
                          {metric.p95LatencyMs}ms
                        </div>
                        <div className="text-[10px] text-muted mt-0.5">
                          SLA: &lt; 50ms
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-well border border-line">
                        <div className="text-[10px] text-muted">에러율</div>
                        <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                          {metric.errorRatePercent}%
                        </div>
                        <div className="text-[10px] text-muted mt-0.5">SLA: &lt; 0.1%</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
