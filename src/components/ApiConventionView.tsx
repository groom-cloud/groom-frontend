import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Download,
  Edit3,
  FileCode2,
  Plus,
  Send,
  Terminal,
  Trash2,
  X,
  RotateCcw,
  PanelRightClose
} from 'lucide-react';
import type { ApiEndpointSpec, IdePromptItem, StepId } from '../mockData';

interface ApiConventionViewProps {
  endpoints: ApiEndpointSpec[];
  setEndpoints: React.Dispatch<React.SetStateAction<ApiEndpointSpec[]>>;
  idePrompts: IdePromptItem[];
  setIdePrompts: React.Dispatch<React.SetStateAction<IdePromptItem[]>>;
  onConfirmStep: (step: StepId) => void;
  onCollapsePane?: () => void;
  isConfirmed?: boolean;
}

export const ApiConventionView: React.FC<ApiConventionViewProps> = ({
  endpoints,
  setEndpoints,
  idePrompts,
  setIdePrompts,
  onConfirmStep,
  onCollapsePane,
  isConfirmed = false
}) => {
  const [subTab, setSubTab] = useState<'api_spec' | 'ide_prompt'>('api_spec');
  const [selectedPromptId, setSelectedPromptId] = useState<string>(idePrompts[0]?.id || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddingApi, setIsAddingApi] = useState(false);
  const [vsCodeBridgePrompt, setVsCodeBridgePrompt] = useState<IdePromptItem | null>(null);
  const [isAddingPrompt, setIsAddingPrompt] = useState(false);
  const [newPromptTitle, setNewPromptTitle] = useState('');
  const [newPromptTicket, setNewPromptTicket] = useState('GRM-106');
  const [newPromptCode, setNewPromptCode] = useState('');

  const handleAddIdePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromptTitle.trim()) return;
    const created: IdePromptItem = {
      id: `p_${Date.now()}`,
      title: newPromptTitle.trim(),
      ticketRef: newPromptTicket.trim() || 'GRM-CUSTOM',
      targetIde: 'Cursor / Copilot',
      promptCode:
        newPromptCode.trim() ||
        `// [시스템 지시사항: ${newPromptTitle.trim()}]\n// 요구사항에 맞춰 기능 구현을 수행하세요.`,
      linkedSteps: ['Step 02 PRD', 'Step 04 ERD', 'Step 07 API']
    };
    setIdePrompts((prev) => [created, ...prev]);
    setSelectedPromptId(created.id);
    setIsAddingPrompt(false);
    setNewPromptTitle('');
    setNewPromptCode('');
    showToast(`"${created.title}" 지시서가 추가되었습니다`);
  };

  // New API form state
  const [newMethod, setNewMethod] = useState<ApiEndpointSpec['method']>('GET');
  const [newPath, setNewPath] = useState('/v1/bakeries/nearby');
  const [newSummary, setNewSummary] = useState('반경 1.5km 이내 마감 할인 진행 중인 빵집 목록 조회');
  const [newAuth, setNewAuth] = useState('Public / Guest 허용');
  const [newReqRef, setNewReqRef] = useState('REQ-STORE-02');

  // Editable Git & Team Convention state
  const [gitStrategyDoc, setGitStrategyDoc] = useState(
    `1. 브랜치 구조 (GitHub Flow + Release Tag)\n` +
      `   - main: 운영(Production) 배포 기준 브랜치 (태그 예: v1.0.0, v1.5.0)\n` +
      `   - develop: 스프린트 통합 검증 브랜치 (CI 빌드 및 테스트 필수 통과)\n` +
      `   - feat/GRM-{티켓번호}-{요약}: 기능 구현 브랜치 (예: feat/GRM-104-optimistic-lock)\n` +
      `   - fix/{이슈요약}: 운영 긴급 패치 브랜치 (예: fix/erd-cascade)\n\n` +
      `2. 커밋 메시지 규격 (Conventional Commits)\n` +
      `   - feat: 신규 기능 추가 / fix: 버그 및 장애 수정 / perf: 성능 및 쿼리 최적화 / docs: 문서 갱신\n\n` +
      `3. 백엔드 및 프론트엔드 공통 응답 규격\n` +
      `   - 모든 REST 응답은 ApiResponse<T> { success: boolean, data: T, errorCode?: string } 봉투 포맷을 준수합니다.\n` +
      `   - 동시성 충돌 시 HTTP 409 Conflict, RBAC 권한 미달 시 HTTP 403 Forbidden을 명시적으로 반환합니다.`
  );

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2400);
  };

  const handleCopyText = (id: string, text: string, label: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedId(id);
    showToast(`${label} 클립보드에 복사되었습니다`);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleUpdateEndpoint = (
    id: string,
    field: keyof ApiEndpointSpec,
    value: string
  ) => {
    setEndpoints((prev) =>
      prev.map((ep) => (ep.id === id ? { ...ep, [field]: value } : ep))
    );
  };

  const handleAddEndpoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPath.trim()) return;
    const created: ApiEndpointSpec = {
      id: `api_${Date.now()}`,
      method: newMethod,
      path: newPath.trim(),
      summary: newSummary.trim() || '신규 API 엔드포인트',
      authScope: newAuth.trim() || 'Bearer JWT',
      reqRef: newReqRef.trim() || 'REQ-API-01',
      requestJson: `{\n  "lat": 37.5665,\n  "lng": 126.978,\n  "radiusKm": 1.5\n}`,
      responseJson: `{\n  "success": true,\n  "data": {\n    "count": 4,\n    "items": []\n  }\n}`
    };
    setEndpoints((prev) => [created, ...prev]);
    setIsAddingApi(false);
    showToast(`${created.method} ${created.path} 명세가 추가되었습니다`);
  };

  const handleDownloadOpenApi = () => {
    const specObj = {
      openapi: '3.0.3',
      info: { title: 'Groom Service API Specification', version: '1.5.0' },
      endpoints: endpoints.map((ep) => ({
        method: ep.method,
        path: ep.path,
        summary: ep.summary,
        authScope: ep.authScope,
        requirementRef: ep.reqRef
      }))
    };
    const blob = new Blob([JSON.stringify(specObj, null, 2)], {
      type: 'application/json;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '07_OPENAPI_SPECIFICATION.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('OpenAPI JSON 명세서 파일이 다운로드되었습니다');
  };

  const getMethodBadgeStyle = (method: ApiEndpointSpec['method']) => {
    switch (method) {
      case 'POST':
        return 'bg-accent-soft text-accent border border-accent-line';
      case 'GET':
        return 'bg-ok-soft text-ok border border-ok-line';
      case 'PATCH':
      case 'PUT':
        return 'bg-warn-soft text-warn border border-warn-line';
      case 'DELETE':
        return 'bg-danger-soft text-danger';
    }
  };

  const activePrompt =
    idePrompts.find((p) => p.id === selectedPromptId) || idePrompts[0] || null;

  return (
    <div className="@container relative flex-1 flex flex-col h-full bg-paper overflow-hidden">
      {/* Floating Toast */}
      {toastMsg && (
        <div
          role="status"
          className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-ink text-paper px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 whitespace-nowrap"
        >
          <Check className="w-3.5 h-3.5 text-ok shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Toolbar with Required 2 Sub-Tabs (Container-Query Adaptive) */}
      <div className="h-12 px-3 @xl:px-4 bg-surface border-b border-line flex items-center justify-between gap-2 overflow-x-auto shrink-0">
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden @2xl:flex items-center gap-1.5 text-xs">
            <FileCode2 className="w-3.5 h-3.5 text-muted shrink-0" />
            <span className="font-semibold text-ink whitespace-nowrap">
              개발 컨벤션 & API 명세
            </span>
          </div>

          {/* 2 Sub-Tabs */}
          <div className="flex items-center bg-well p-0.5 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setSubTab('api_spec')}
              className={`px-2.5 @xl:px-3 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                subTab === 'api_spec'
                  ? 'bg-surface text-ink font-semibold'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>API 명세서 & 컨벤션</span>
            </button>
            <button
              type="button"
              onClick={() => setSubTab('ide_prompt')}
              className={`px-2.5 @xl:px-3 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                subTab === 'ide_prompt'
                  ? 'bg-surface text-ink font-semibold'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>AI 코딩 지시서</span>
              <span className="hidden @xl:inline">(IDE Prompt)</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleDownloadOpenApi}
            className="px-2.5 py-1.5 rounded-lg bg-well hover:bg-control text-ink text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-muted" />
            <span className="hidden @2xl:inline">OpenAPI 내보내기</span>
            <span className="@2xl:hidden">내보내기</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              isEditMode
                ? 'bg-accent text-accent-ink'
                : 'bg-well hover:bg-control text-ink'
            }`}
            title={isEditMode ? '편집을 완료하고 읽기 모드로 전환' : '명세서 및 프롬프트 편집 모드 전환'}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden @2xl:inline">
              {isEditMode ? '편집 완료' : '명세서 편집'}
            </span>
            <span className="@2xl:hidden">{isEditMode ? '완료' : '편집'}</span>
          </button>

          

          {isConfirmed ? (
            <button
              type="button"
              onClick={() => onConfirmStep('step7')}
              className="group bg-ok-soft text-ok border border-ok/30 hover:bg-danger-soft hover:text-danger hover:border-danger/30 text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5"
              title="클릭하여 단계 확정을 취소하고 작업 중으로 되돌립니다"
            >
              <CheckCircle2 className="w-3.5 h-3.5 group-hover:hidden" />
              <span className="group-hover:hidden">확정 완료</span>
              <RotateCcw className="w-3.5 h-3.5 hidden group-hover:inline" />
              <span className="hidden group-hover:inline">확정 취소</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onConfirmStep('step7')}
              className="px-3 py-1.5 rounded-lg bg-ink hover:opacity-90 text-paper text-xs font-medium flex items-center gap-1.5 transition-opacity cursor-pointer whitespace-nowrap"
              title="현재 단계의 산출물을 확정합니다"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>단계 확정</span>
            </button>
          )}

          {onCollapsePane && (
            <button
              type="button"
              aria-label="문서 영역 접기"
              title="문서 영역 접기"
              onClick={onCollapsePane}
              className="hidden lg:inline-flex p-1.5 rounded-lg bg-well hover:bg-control text-muted hover:text-ink transition-colors cursor-pointer"
            >
              <PanelRightClose className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: API 명세서 & 컨벤션 */}
      {/* ============================================================== */}
      {subTab === 'api_spec' ? (
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-paper">
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Section 1: RESTful API Endpoints */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-line">
                <div>
                  <h2 className="text-base font-bold text-ink">
                    1. RESTful API 엔드포인트 명세 ({endpoints.length})
                  </h2>
                  <p className="text-xs text-muted mt-0.5">
                    Step 02 요구사항 ID 및 Step 04 데이터베이스 스키마와 매핑된 인터페이스 규격입니다.
                  </p>
                </div>

                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => setIsAddingApi(!isAddingApi)}
                    className="px-3 py-1.5 rounded-lg bg-well hover:bg-control text-ink text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>엔드포인트 추가</span>
                  </button>
                )}
              </div>

              

              {/* Endpoint Cards */}
              <div className="space-y-4">
                {endpoints.map((ep) => (
                  <div
                    key={ep.id}
                    className="rounded-xl bg-surface border border-line overflow-hidden transition-colors shadow-subtle"
                  >
                    {/* Endpoint Header */}
                    <div className="px-4 py-3 bg-well border-b border-line flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                      {isEditMode ? (
                        <div className="flex flex-1 flex-wrap items-center gap-2">
                          <select
                            aria-label={`${ep.path} HTTP 메서드`}
                            value={ep.method}
                            onChange={(e) =>
                              handleUpdateEndpoint(ep.id, 'method', e.target.value as ApiEndpointSpec['method'])
                            }
                            className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getMethodBadgeStyle(
                              ep.method
                            )}`}
                          >
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="DELETE">DELETE</option>
                          </select>
                          <input
                            type="text"
                            aria-label="엔드포인트 경로"
                            value={ep.path}
                            onChange={(e) => handleUpdateEndpoint(ep.id, 'path', e.target.value)}
                            className="bg-surface border border-line rounded px-2.5 py-1 font-mono text-xs text-ink font-semibold flex-1 min-w-[160px]"
                            placeholder="/v1/..."
                          />
                          <input
                            type="text"
                            aria-label="엔드포인트 요약 설명"
                            value={ep.summary}
                            onChange={(e) => handleUpdateEndpoint(ep.id, 'summary', e.target.value)}
                            className="bg-surface border border-line rounded px-2.5 py-1 text-xs text-ink flex-1 min-w-[200px]"
                            placeholder="기능 요약 설명"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getMethodBadgeStyle(
                              ep.method
                            )}`}
                          >
                            {ep.method}
                          </span>
                          <code className="font-mono text-xs font-bold text-ink">{ep.path}</code>
                          <span className="text-xs text-ink-2">{ep.summary}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs shrink-0">
                        {isEditMode ? (
                          <>
                            <input
                              type="text"
                              aria-label="연계 요구사항 ID"
                              value={ep.reqRef}
                              onChange={(e) => handleUpdateEndpoint(ep.id, 'reqRef', e.target.value)}
                              className="w-28 bg-surface border border-line rounded px-2 py-1 font-mono text-xs text-muted"
                              placeholder="REQ-ID"
                            />
                            <input
                              type="text"
                              aria-label="인증 권한 범위"
                              value={ep.authScope}
                              onChange={(e) => handleUpdateEndpoint(ep.id, 'authScope', e.target.value)}
                              className="w-32 bg-surface border border-line rounded px-2 py-1 text-xs text-muted"
                              placeholder="인증 권한"
                            />
                            <button
                              type="button"
                              aria-label={`${ep.path} 엔드포인트 삭제`}
                              onClick={() => {
                                setEndpoints((prev) => prev.filter((item) => item.id !== ep.id));
                                showToast(`${ep.path} 명세가 삭제되었습니다`);
                              }}
                              className="p-1.5 text-muted hover:text-danger rounded hover:bg-surface cursor-pointer"
                              title="엔드포인트 삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <code className="px-2 py-0.5 rounded bg-surface border border-line font-mono text-muted">
                              {ep.reqRef}
                            </code>
                            <span className="text-muted hidden md:inline">{ep.authScope}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Request / Response JSON Split */}
                    <div className="grid grid-cols-1 @2xl:grid-cols-2 divide-y @2xl:divide-y-0 @2xl:divide-x divide-line text-xs">
                      {/* Request Payload */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between text-muted">
                          <span className="font-semibold text-ink-2">Request Example (JSON)</span>
                          {!isEditMode && (
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyText(
                                  `${ep.id}_req`,
                                  ep.requestJson,
                                  `${ep.path} Request JSON이`
                                )
                              }
                              className="flex items-center gap-1 hover:text-ink cursor-pointer"
                            >
                              {copiedId === `${ep.id}_req` ? (
                                <Check className="w-3 h-3 text-ok" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              <span>복사</span>
                            </button>
                          )}
                        </div>

                        {isEditMode ? (
                          <textarea
                            aria-label={`${ep.path} Request JSON 수정`}
                            rows={6}
                            value={ep.requestJson}
                            onChange={(e) => handleUpdateEndpoint(ep.id, 'requestJson', e.target.value)}
                            className="w-full p-3 rounded-lg bg-surface border border-accent-line font-mono text-xs text-ink leading-relaxed"
                            placeholder="Request JSON 예시를 입력하세요..."
                          />
                        ) : (
                          <pre className="p-3 rounded-lg bg-well font-mono text-xs text-ink overflow-x-auto leading-relaxed">
                            {ep.requestJson}
                          </pre>
                        )}
                      </div>

                      {/* Response Payload */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between text-muted">
                          <span className="font-semibold text-ink-2">Response Example (200 OK)</span>
                          {!isEditMode && (
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyText(
                                  `${ep.id}_res`,
                                  ep.responseJson,
                                  `${ep.path} Response JSON이`
                                )
                              }
                              className="flex items-center gap-1 hover:text-ink cursor-pointer"
                            >
                              {copiedId === `${ep.id}_res` ? (
                                <Check className="w-3 h-3 text-ok" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              <span>복사</span>
                            </button>
                          )}
                        </div>

                        {isEditMode ? (
                          <textarea
                            aria-label={`${ep.path} Response JSON 수정`}
                            rows={6}
                            value={ep.responseJson}
                            onChange={(e) => handleUpdateEndpoint(ep.id, 'responseJson', e.target.value)}
                            className="w-full p-3 rounded-lg bg-surface border border-accent-line font-mono text-xs text-ink leading-relaxed"
                            placeholder="Response JSON 예시를 입력하세요..."
                          />
                        ) : (
                          <pre className="p-3 rounded-lg bg-well font-mono text-xs text-ink overflow-x-auto leading-relaxed">
                            {ep.responseJson}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 2: Git Branch Strategy & Team Convention Document */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-line">
                <div>
                  <h2 className="text-base font-bold text-ink">
                    2. Git 브랜치 전략 및 팀 개발 컨벤션
                  </h2>
                  <p className="text-xs text-muted mt-0.5">
                    {isEditMode
                      ? '내용을 직접 수정할 수 있습니다. 상단 [편집 완료] 시 저장됩니다.'
                      : '모든 PR과 커밋에 강제되는 워크플로 및 표준 응답 래퍼 규칙입니다.'}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-surface border border-line p-5">
                {isEditMode ? (
                  <textarea
                    aria-label="Git 브랜치 전략 및 코딩 컨벤션 편집기"
                    rows={11}
                    value={gitStrategyDoc}
                    onChange={(e) => setGitStrategyDoc(e.target.value)}
                    className="w-full bg-well border border-accent-line rounded-lg p-3.5 font-mono text-xs text-ink leading-relaxed"
                    placeholder="Git 브랜치 전략 및 컨벤션 내용을 입력하세요..."
                  />
                ) : (
                  <pre className="whitespace-pre-wrap font-mono text-xs text-ink-2 leading-relaxed">
                    {gitStrategyDoc}
                  </pre>
                )}
              </div>
            </section>
          </div>
        </div>
      ) : (
                /* ============================================================== */
        /* TAB 2: AI 코딩 지시서 (IDE Prompt) */
        /* ============================================================== */
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-paper">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-line">
              <div>
                <h2 className="text-base font-bold text-ink">
                  태스크별 AI 코딩 지시서 (Cursor / GitHub Copilot / IntelliJ AI)
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  앞선 기획·스키마·API 명세 컨텍스트가 압축 주입된 개발 지시서입니다. 복사하여 IDE 에이전트에 바로 붙여넣으세요.
                </p>
              </div>

              {isEditMode && (
                <button
                  type="button"
                  onClick={() => setIsAddingPrompt(!isAddingPrompt)}
                  className="px-3 py-1.5 rounded-lg bg-well hover:bg-control text-ink text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5 text-accent" />
                  <span>지시서 추가</span>
                </button>
              )}
            </div>

            

            {/* Task Selector Pills */}
            <div className="grid grid-cols-1 @2xl:grid-cols-3 gap-2.5">
              {idePrompts.map((prm) => {
                const isSelected = activePrompt?.id === prm.id;
                return (
                  <button
                    key={prm.id}
                    type="button"
                    onClick={() => setSelectedPromptId(prm.id)}
                    className={`text-left p-3.5 rounded-xl border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-accent-soft border-accent-line'
                        : 'bg-surface border-line hover:bg-well'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <code className="font-mono text-xs font-bold text-accent">
                        {prm.ticketRef}
                      </code>
                      <span className="text-[11px] text-muted truncate">{prm.targetIde}</span>
                    </div>
                    <div className="text-xs font-semibold text-ink line-clamp-2 leading-snug">
                      {prm.title}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active IDE Prompt Card */}
            {activePrompt && (
              <div className="rounded-xl bg-surface border border-line overflow-hidden">
                {/* Prompt Header + Action Buttons */}
                <div className="px-4 py-3.5 bg-well border-b border-line flex flex-col @xl:flex-row @xl:items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0">
{isEditMode ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          aria-label="티켓 번호 수정"
                          value={activePrompt.ticketRef}
                          onChange={(e) => {
                            const val = e.target.value;
                            setIdePrompts((prev) =>
                              prev.map((item) =>
                                item.id === activePrompt.id ? { ...item, ticketRef: val } : item
                              )
                            );
                          }}
                          className="font-mono text-xs font-bold px-2 py-1 rounded bg-surface border border-accent-line text-ink w-28"
                        />
                        <input
                          type="text"
                          aria-label="지시서 제목 수정"
                          value={activePrompt.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setIdePrompts((prev) =>
                              prev.map((item) =>
                                item.id === activePrompt.id ? { ...item, title: val } : item
                              )
                            );
                          }}
                          className="text-xs sm:text-sm font-semibold text-ink bg-surface border border-accent-line rounded px-2.5 py-1 flex-1 min-w-[200px]"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-surface border border-line text-ink">
                          {activePrompt.ticketRef}
                        </code>
                        <h3 className="text-xs sm:text-sm font-semibold text-ink truncate">
                          {activePrompt.title}
                        </h3>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
                      <span>주입된 상위 컨텍스트:</span>
                      {activePrompt.linkedSteps.map((ls) => (
                        <span
                          key={ls}
                          className="px-2 py-0.5 rounded bg-surface border border-line text-ink-2"
                        >
                          {ls}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Required Action Buttons: [프롬프트 복사] & [VS Code로 전송 (V3.0)] */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyText(
                          activePrompt.id,
                          activePrompt.promptCode,
                          `[${activePrompt.ticketRef}] AI 코딩 프롬프트가`
                        )
                      }
                      className="px-3.5 py-2 rounded-lg bg-ink hover:opacity-90 text-paper text-xs font-medium flex items-center gap-1.5 transition-opacity cursor-pointer whitespace-nowrap"
                    >
                      {copiedId === activePrompt.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-ok" />
                          <span>복사 완료</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>프롬프트 복사</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(activePrompt.promptCode).catch(() => {});
                        setVsCodeBridgePrompt(activePrompt);
                      }}
                      className="px-3.5 py-2 rounded-lg bg-accent hover:bg-accent-strong text-accent-ink text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>VS Code로 전송 (V3.0)</span>
                    </button>
                  </div>
                </div>

                {/* Editable Prompt Code Block */}
                <div className="p-4 bg-surface space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>프롬프트 원문 (직접 수정하여 복사할 수 있습니다)</span>
                    <code className="font-mono">{activePrompt.promptCode.length} chars</code>
                  </div>
                  <textarea
                    aria-label="AI 코딩 지시서 프롬프트 편집기"
                    rows={16}
                    value={activePrompt.promptCode}
                    onChange={(e) => {
                      const nextVal = e.target.value;
                      setIdePrompts((prev) =>
                        prev.map((item) =>
                          item.id === activePrompt.id ? { ...item, promptCode: nextVal } : item
                        )
                      );
                    }}
                    className="w-full p-4 rounded-xl bg-well border border-line font-mono text-xs text-ink leading-relaxed focus:outline-none resize-y"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VS Code Bridge V3.0 Preview Modal */}
      {vsCodeBridgePrompt && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="vscode-bridge-title"
          className="fixed inset-0 z-50 bg-overlay flex items-center justify-center p-4"
        >
          <div className="bg-surface border border-line rounded-2xl w-full max-w-md overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-line flex items-center justify-between">
              <h3 id="vscode-bridge-title" className="text-sm font-semibold text-ink">
                VS Code IDE 브릿지 전송 (V3.0 로드맵)
              </h3>
              <button
                type="button"
                aria-label="VS Code 안내 모달 닫기"
                onClick={() => setVsCodeBridgePrompt(null)}
                className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-well cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 leading-relaxed text-ink-2">
              <p>
                로컬 IDE로 컨텍스트를 직접 주입하는{' '}
                <code className="font-mono text-ink">vscode://groom.bridge/inject</code> 확장 플러그인은{' '}
                <strong className="text-ink">V3.0 릴리즈</strong>에서 정식 제공됩니다.
              </p>
              <div className="p-3 rounded-xl bg-ok-soft border border-ok-line text-ok font-medium">
                지금 바로 붙여넣어 사용하실 수 있도록 [{vsCodeBridgePrompt.ticketRef}] 프롬프트 전문을 클립보드에 자동 복사해 두었습니다.
              </div>
            </div>
            <div className="px-5 py-3 bg-well border-t border-line flex justify-end">
              <button
                type="button"
                onClick={() => setVsCodeBridgePrompt(null)}
                className="px-4 py-1.5 rounded-lg bg-ink text-paper font-medium cursor-pointer"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    
      {/* ============================================================== */}
      {/* 1. REST API ENDPOINT CREATION MODAL */}
      {/* ============================================================== */}
      {isAddingApi && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-overlay flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddingApi(false);
          }}
        >
          <div className="bg-surface border border-line rounded-2xl shadow-floating max-w-lg w-full overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-well/70 border-b border-line flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-ink">새 RESTful API 엔드포인트 등록</h3>
                <p className="text-xs text-muted mt-0.5">시스템 인터페이스 규격과 요청/응답 스펙을 명세서에 추가합니다.</p>
              </div>
              <button
                type="button"
                aria-label="닫기"
                onClick={() => setIsAddingApi(false)}
                className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-well transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddEndpoint} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                <div className="sm:col-span-3 space-y-1.5">
                  <label className="font-semibold text-ink block">메서드</label>
                  <select
                    aria-label="HTTP 메서드 선택"
                    value={newMethod}
                    onChange={(e) => setNewMethod(e.target.value as ApiEndpointSpec['method'])}
                    className="w-full bg-well border border-line rounded-lg px-2.5 py-2 font-bold text-ink"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PATCH">PATCH</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
                <div className="sm:col-span-9 space-y-1.5">
                  <label className="font-semibold text-ink block">엔드포인트 경로 <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    aria-label="엔드포인트 경로 입력"
                    value={newPath}
                    onChange={(e) => setNewPath(e.target.value)}
                    placeholder="/v1/bakeries/nearby"
                    className="w-full bg-well border border-line rounded-lg px-3 py-2 font-mono text-ink font-semibold focus:outline-none focus:border-ink/40"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-ink block">기능 요약 설명 <span className="text-danger">*</span></label>
                <input
                  type="text"
                  aria-label="엔드포인트 설명 입력"
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="예: 반경 1.5km 이내 마감 할인 진행 중인 베이커리 목록 조회"
                  className="w-full bg-well border border-line rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-ink/40"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-ink block">인증 및 접근 권한</label>
                  <input
                    type="text"
                    aria-label="권한 범위 입력"
                    value={newAuth}
                    onChange={(e) => setNewAuth(e.target.value)}
                    placeholder="예: Public / Guest 허용"
                    className="w-full bg-well border border-line rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-ink/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-ink block">연결 요구사항 ID</label>
                  <input
                    type="text"
                    aria-label="연결 요구사항 코드 입력"
                    value={newReqRef}
                    onChange={(e) => setNewReqRef(e.target.value)}
                    placeholder="REQ-STORE-02"
                    className="w-full bg-well border border-line rounded-lg px-3 py-2 font-mono text-ink focus:outline-none focus:border-ink/40"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsAddingApi(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-well hover:bg-control text-muted hover:text-ink transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-ink hover:opacity-90 text-paper font-medium transition-opacity cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>엔드포인트 등록</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. IDE AI PROMPT CREATION MODAL */}
      {/* ============================================================== */}
      {isAddingPrompt && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-overlay flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddingPrompt(false);
          }}
        >
          <div className="bg-surface border border-line rounded-2xl shadow-floating max-w-lg w-full overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-well/70 border-b border-line flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-ink">새 AI 코딩 지시서(Prompt) 등록</h3>
                <p className="text-xs text-muted mt-0.5">IDE 에이전트(Cursor, Copilot)에 즉시 주입할 컨텍스트 프롬프트를 등록합니다.</p>
              </div>
              <button
                type="button"
                aria-label="닫기"
                onClick={() => setIsAddingPrompt(false)}
                className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-well transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddIdePrompt} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-4 space-y-1.5">
                  <label className="font-semibold text-ink block">연계 티켓 번호</label>
                  <input
                    aria-label="연계 티켓 번호"
                    type="text"
                    value={newPromptTicket}
                    onChange={(e) => setNewPromptTicket(e.target.value)}
                    placeholder="GRM-106"
                    className="w-full bg-well border border-line rounded-lg px-3 py-2 text-ink font-mono focus:outline-none focus:border-ink/40"
                  />
                </div>
                <div className="sm:col-span-8 space-y-1.5">
                  <label className="font-semibold text-ink block">지시서 제목 <span className="text-danger">*</span></label>
                  <input
                    aria-label="지시서 제목"
                    type="text"
                    value={newPromptTitle}
                    onChange={(e) => setNewPromptTitle(e.target.value)}
                    placeholder="예: 인근 베이커리 목록 반경 필터링 API 구현"
                    className="w-full bg-well border border-line rounded-lg px-3 py-2 text-ink font-semibold focus:outline-none focus:border-ink/40"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-ink block">지시서 프롬프트 본문</label>
                <textarea
                  aria-label="지시서 프롬프트 본문"
                  rows={6}
                  value={newPromptCode}
                  onChange={(e) => setNewPromptCode(e.target.value)}
                  placeholder="IDE AI 에이전트에 전달할 기술 지시사항 원문 내용을 작성하세요..."
                  className="w-full bg-well border border-line rounded-lg p-3 text-ink font-mono text-xs leading-relaxed focus:outline-none focus:border-ink/40"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsAddingPrompt(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-well hover:bg-control text-muted hover:text-ink transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-ink hover:opacity-90 text-paper font-medium transition-opacity cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>지시서 등록</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
</div>
  );
};
