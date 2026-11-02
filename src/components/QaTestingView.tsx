import React, { useState } from 'react';
import {
  ShieldCheck,
  XCircle,
  Activity,
  Check,
  ChevronDown,
  ChevronUp,
  PanelRightClose,
  Edit3,
  Plus,
  Trash2,
  X
} from 'lucide-react';
import type { QaTestCase, QaLoadTestMetric, StepId } from '../mockData';
import { ExportDropdown } from './ExportDropdown';

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
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'functional' | 'load_test'>('functional');
  const [filterType, setFilterType] = useState<string>('all');
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add Test Case Modal State
  const [isAddingCase, setIsAddingCase] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'기능 테스트' | '예외 처리' | '동시성 검증' | '보안/인증'>('기능 테스트');
  const [newScenarioType, setNewScenarioType] = useState<'NORMAL' | 'EXCEPTION' | 'EDGE_CASE'>('NORMAL');
  const [newSeverity, setNewSeverity] = useState<'Critical' | 'Major' | 'Minor'>('Major');
  const [newPrecondition, setNewPrecondition] = useState('');
  const [newSteps, setNewSteps] = useState('');
  const [newExpected, setNewExpected] = useState('');

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

  const handleAddCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newExpected.trim()) return;

    const stepsArray = newSteps
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const created: QaTestCase = {
      id: `TC-${String(testCases.length + 1).padStart(3, '0')}`,
      category: newCategory,
      scenarioType: newScenarioType,
      testTitle: newTitle.trim(),
      title: newTitle.trim(),
      precondition: newPrecondition.trim() || '테스트 환경 세션 초기화 완료',
      testSteps: stepsArray.length > 0 ? stepsArray : ['시나리오 액션 수행'],
      steps: stepsArray.length > 0 ? stepsArray : ['시나리오 액션 수행'],
      expectedResult: newExpected.trim(),
      isPassed: true,
      status: 'PASSED',
      severity: newSeverity
    };

    setTestCases((prev) => [created, ...prev]);
    setIsAddingCase(false);
    setNewTitle('');
    setNewPrecondition('');
    setNewSteps('');
    setNewExpected('');
    showToast(`"${created.testTitle}" 테스트 케이스가 등록되었습니다.`);
  };

  const handleDeleteCase = (id: string, title: string) => {
    setTestCases((prev) => prev.filter((tc) => tc.id !== id));
    showToast(`[${id}] "${title}" 케이스가 삭제되었습니다.`);
  };

  const handleUpdateCaseField = <K extends keyof QaTestCase>(
    id: string,
    field: K,
    value: QaTestCase[K]
  ) => {
    setTestCases((prev) =>
      prev.map((tc) =>
        tc.id === id
          ? {
              ...tc,
              [field]: value,
              ...(field === 'testTitle' || field === 'title'
                ? { testTitle: value as string, title: value as string }
                : {})
            }
          : tc
      )
    );
  };

  const passedCount = testCases.filter((tc) => tc.isPassed || tc.status === 'PASSED').length;
  const passRate = Math.round((passedCount / (testCases.length || 1)) * 100);

  const filteredCases = testCases.filter((tc) => {
    if (filterType === 'all') return true;
    return (tc.scenarioType || tc.category) === filterType;
  });

  const buildMarkdown = () => {
    return `# 13. 테스트 케이스 & QA 검증 (QA & Test Cases)

- **전체 통과율**: ${passRate}% (${passedCount}/${testCases.length})

## 기능 및 예외 검증 체크리스트
| ID | 구분 | 시나리오 유형 | 중요도 | 테스트 제목 | 결과 |
|---|---|---|---|---|---|
${testCases
  .map(
    (tc) =>
      `| \`${tc.id}\` | ${tc.category} | ${tc.scenarioType || '-'} | ${tc.severity} | ${tc.testTitle || tc.title} | ${
        tc.isPassed || tc.status === 'PASSED' ? 'PASSED ✅' : 'FAILED ❌'
      } |`
  )
  .join('\n')}

### 세부 검증 절차 및 기대 결과
${testCases
  .map(
    (tc) => `### [${tc.id}] ${tc.testTitle || tc.title}
- **사전 조건**: ${tc.precondition}
- **재현 절차**:
${(tc.steps || tc.testSteps || []).map((s, idx) => `  ${idx + 1}. ${s}`).join('\n')}
- **기대 결과**: ${tc.expectedResult}
- **상태**: ${tc.isPassed || tc.status === 'PASSED' ? 'PASSED' : 'FAILED'}`
  )
  .join('\n\n')}

## 부하 테스트 (k6 / JMeter) SLA 지표
| 시나리오 | 목표 TPS | 달성 TPS | P95 지연시간 | 에러율 | 상태 |
|---|---|---|---|---|---|
${loadMetrics
  .map(
    (m) =>
      `| ${m.scenarioName} | ${m.targetTps} | ${m.actualTps ?? m.targetTps} | ${m.p95LatencyMs}ms | ${m.errorRatePercent}% | ${m.status} |`
  )
  .join('\n')}
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
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">13. QA & Testing</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-well text-muted border border-line">
                통과율 {passRate}% ({passedCount}/{testCases.length})
              </span>
            </div>
            <h2 className="text-sm font-bold text-ink truncate">테스트 케이스 & QA 검증</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ExportDropdown
            title="13_테스트_케이스_및_QA_검증"
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
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
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
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'load_test'
              ? 'bg-ink text-paper font-semibold shadow-sm'
              : 'bg-surface text-muted hover:text-ink border border-line'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span className="whitespace-nowrap">부하 테스트 (k6 / JMeter) 대시보드</span>
        </button>
      </div>

      {/* Main Tab Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* TAB 1: Functional / Exception Test Cases */}
        {activeTab === 'functional' && (
          <div className="space-y-4">
            {/* Header controls: Filter Pills and Add Button */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs flex-wrap">
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

              {isEditMode && (
                <button
                  type="button"
                  onClick={() => setIsAddingCase(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-ink hover:bg-accent-hover text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>새 테스트 케이스 등록</span>
                </button>
              )}
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
                          title="클릭하여 통과/실패 토글"
                        >
                          {isPassed && <Check className="w-3.5 h-3.5" />}
                          {isFailed && <XCircle className="w-3.5 h-3.5" />}
                        </button>

                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-[10px] text-muted">{tc.id}</span>
                            {isEditMode ? (
                              <select
                                value={tc.category}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => handleUpdateCaseField(tc.id, 'category', e.target.value as any)}
                                className="px-1.5 py-0.5 rounded text-[10px] bg-well text-ink-2 border border-line outline-none"
                              >
                                <option value="기능 테스트">기능 테스트</option>
                                <option value="예외 처리">예외 처리</option>
                                <option value="동시성 검증">동시성 검증</option>
                                <option value="보안/인증">보안/인증</option>
                              </select>
                            ) : (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-well text-ink-2 border border-line">
                                {tc.category}
                              </span>
                            )}

                            {isEditMode ? (
                              <select
                                value={tc.scenarioType || 'NORMAL'}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => handleUpdateCaseField(tc.id, 'scenarioType', e.target.value as any)}
                                className="px-1.5 py-0.5 rounded text-[10px] bg-well text-ink border border-line outline-none"
                              >
                                <option value="NORMAL">NORMAL</option>
                                <option value="EXCEPTION">EXCEPTION</option>
                                <option value="EDGE_CASE">EDGE_CASE</option>
                              </select>
                            ) : (
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
                            )}

                            {isEditMode ? (
                              <select
                                value={tc.severity}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => handleUpdateCaseField(tc.id, 'severity', e.target.value as any)}
                                className="px-1.5 py-0.5 rounded text-[10px] bg-well text-muted border border-line outline-none"
                              >
                                <option value="Critical">Critical</option>
                                <option value="Major">Major</option>
                                <option value="Minor">Minor</option>
                              </select>
                            ) : (
                              <span className="text-[10px] text-muted">
                                중요도: {tc.severity}
                              </span>
                            )}
                          </div>

                          {isEditMode ? (
                            <input
                              type="text"
                              value={tc.title || tc.testTitle}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => handleUpdateCaseField(tc.id, 'title', e.target.value)}
                              className="w-full px-2 py-1 bg-well border border-line rounded text-xs font-bold text-ink outline-none focus:border-accent"
                              placeholder="테스트 시나리오 제목 입력"
                            />
                          ) : (
                            <h4 className="text-xs font-bold text-ink mt-0.5 truncate">
                              {tc.title || tc.testTitle}
                            </h4>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isEditMode && (
                          <button
                            type="button"
                            onClick={() => handleDeleteCase(tc.id, tc.title || tc.testTitle)}
                            className="p-1 text-muted hover:text-danger rounded transition-colors cursor-pointer"
                            title="테스트 케이스 삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
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
                          <span className="text-[11px] font-semibold text-muted block mb-0.5">
                            사전 조건 (Precondition)
                          </span>
                          {isEditMode ? (
                            <input
                              type="text"
                              value={tc.precondition}
                              onChange={(e) => handleUpdateCaseField(tc.id, 'precondition', e.target.value)}
                              className="w-full px-2.5 py-1 bg-well border border-line rounded text-ink-2 font-mono text-[11px] outline-none focus:border-accent"
                              placeholder="사전 조건 기술"
                            />
                          ) : (
                            <p className="p-2 rounded bg-well border border-line text-ink-2 font-mono text-[11px]">
                              {tc.precondition}
                            </p>
                          )}
                        </div>
                        <div>
                          <span className="text-[11px] font-semibold text-muted block mb-1">
                            재현 절차 (Steps to Reproduce - 줄바꿈으로 단계 구분)
                          </span>
                          {isEditMode ? (
                            <textarea
                              value={(tc.steps || tc.testSteps || []).join('\n')}
                              onChange={(e) => {
                                const nextSteps = e.target.value.split('\n').filter(Boolean);
                                handleUpdateCaseField(tc.id, 'steps', nextSteps);
                                handleUpdateCaseField(tc.id, 'testSteps', nextSteps);
                              }}
                              rows={3}
                              className="w-full p-2.5 rounded-lg bg-well border border-line text-ink-2 text-xs leading-relaxed outline-none focus:border-accent"
                            />
                          ) : (
                            <ol className="list-decimal list-inside space-y-1 text-ink-2 pl-1">
                              {(tc.steps || tc.testSteps || []).map((step, idx) => (
                                <li key={idx}>{step}</li>
                              ))}
                            </ol>
                          )}
                        </div>
                        <div>
                          <span className="text-[11px] font-semibold text-emerald-400 block mb-0.5">
                            기대 결과 (Expected Outcome)
                          </span>
                          {isEditMode ? (
                            <textarea
                              value={tc.expectedResult}
                              onChange={(e) => handleUpdateCaseField(tc.id, 'expectedResult', e.target.value)}
                              rows={2}
                              className="w-full p-2.5 rounded-lg bg-well border border-line text-ink-2 text-xs outline-none focus:border-accent"
                            />
                          ) : (
                            <p className="p-2.5 rounded-lg bg-well border border-line text-ink-2">
                              {tc.expectedResult}
                            </p>
                          )}
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

      {/* Modal: Add Test Case */}
      {isAddingCase && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface border border-line-strong rounded-2xl w-full max-w-lg shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-line flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-sm font-bold text-ink">새 테스트 케이스 등록</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingCase(false)}
                className="p-1 rounded-lg text-muted hover:text-ink hover:bg-well transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCase} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">테스트 시나리오 제목</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="예: 마감 할인 빵 잔여 수량 0개 시 품절 배지 갱신 및 결제 차단"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-muted mb-1">도메인 카테고리</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent"
                  >
                    <option value="기능 테스트">기능 테스트</option>
                    <option value="예외 처리">예외 처리</option>
                    <option value="동시성 검증">동시성 검증</option>
                    <option value="보안/인증">보안/인증</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted mb-1">시나리오 유형</label>
                  <select
                    value={newScenarioType}
                    onChange={(e) => setNewScenarioType(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent"
                  >
                    <option value="NORMAL">NORMAL (정상)</option>
                    <option value="EXCEPTION">EXCEPTION (예외)</option>
                    <option value="EDGE_CASE">EDGE_CASE (엣지)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted mb-1">심각도 (Severity)</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent"
                  >
                    <option value="Critical">Critical</option>
                    <option value="Major">Major</option>
                    <option value="Minor">Minor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">사전 조건 (Precondition)</label>
                <input
                  type="text"
                  value={newPrecondition}
                  onChange={(e) => setNewPrecondition(e.target.value)}
                  placeholder="예: 로그인된 사용자, 해당 매장 마감 상품 재고 1개 잔여 상태"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">재현 절차 (줄바꿈으로 단계 구분)</label>
                <textarea
                  value={newSteps}
                  onChange={(e) => setNewSteps(e.target.value)}
                  rows={3}
                  placeholder={`1. 사용자 A와 B가 동시에 해당 상품 예약 버튼 클릭\n2. 사용자 A의 결제 보증금 트랜잭션이 먼저 커밋됨\n3. 사용자 B의 트랜잭션 롤백 및 알림 검증`}
                  className="w-full p-2.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">기대 결과 (Expected Result)</label>
                <textarea
                  value={newExpected}
                  onChange={(e) => setNewExpected(e.target.value)}
                  rows={2}
                  placeholder="예: 사용자 B에게 409 Conflict 및 '이미 품절된 상품입니다' 토스트가 노출되고 초과 결제가 발생하지 않음."
                  className="w-full p-2.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsAddingCase(false)}
                  className="px-3 py-1.5 rounded-lg bg-well text-muted hover:text-ink text-xs font-medium cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-accent text-accent-ink hover:bg-accent-hover text-xs font-semibold cursor-pointer"
                >
                  케이스 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
