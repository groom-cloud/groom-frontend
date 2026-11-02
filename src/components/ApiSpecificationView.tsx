import React, { useState } from 'react';
import {
  Code2,
  ChevronDown,
  ChevronUp,
  Check,
  Terminal,
  Plus,
  Trash2,
  Edit3,
  PanelRightClose,
  X
} from 'lucide-react';
import type { ApiEndpointSpec, StepId } from '../mockData';
import { ExportDropdown } from './ExportDropdown';

interface ApiSpecificationViewProps {
  endpoints: ApiEndpointSpec[];
  setEndpoints?: React.Dispatch<React.SetStateAction<ApiEndpointSpec[]>>;
  onConfirmStep?: (step: StepId) => void;
  onCollapsePane?: () => void;
  isConfirmed?: boolean;
}

export const ApiSpecificationView: React.FC<ApiSpecificationViewProps> = ({
  endpoints,
  setEndpoints,
  onConfirmStep,
  onCollapsePane,
  isConfirmed = false
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [expandedEndpointId, setExpandedEndpointId] = useState<string>(endpoints[0]?.id || '');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Endpoint Form State
  const [isAddingEndpoint, setIsAddingEndpoint] = useState(false);
  const [newMethod, setNewMethod] = useState<'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'>('GET');
  const [newPath, setNewPath] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newDomain, setNewDomain] = useState<ApiEndpointSpec['domainGroup']>('인증 및 세션');
  const [newAuth, setNewAuth] = useState<ApiEndpointSpec['authScope']>('Public');
  const [newReqJson, setNewReqJson] = useState('{\n  "query": "string"\n}');
  const [newResJson, setNewResJson] = useState('{\n  "code": "SUCCESS",\n  "data": {}\n}');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleAddEndpoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPath.trim() || !newSummary.trim()) return;

    const created: ApiEndpointSpec = {
      id: `api_${Date.now()}`,
      method: newMethod,
      path: newPath.startsWith('/') ? newPath.trim() : `/${newPath.trim()}`,
      summary: newSummary.trim(),
      domainGroup: newDomain,
      authScope: newAuth,
      reqRef: 'REQ-NEW',
      requestJson: newReqJson,
      responseJson: newResJson,
      rfc7807ErrorJson: JSON.stringify(
        {
          type: 'https://api.groom.dev/errors/bad-request',
          title: 'Invalid Request Body',
          status: 400,
          detail: '필수 요청 파라미터가 누락되었거나 유효하지 않습니다.',
          instance: newPath.trim()
        },
        null,
        2
      )
    };

    if (setEndpoints) {
      setEndpoints((prev) => [...prev, created]);
    }
    setIsAddingEndpoint(false);
    setNewPath('');
    setNewSummary('');
    setExpandedEndpointId(created.id);
    showToast(`"${created.method} ${created.path}" 엔드포인트가 등록되었습니다.`);
  };

  const handleDeleteEndpoint = (id: string, path: string) => {
    if (setEndpoints) {
      setEndpoints((prev) => prev.filter((ep) => ep.id !== id));
      showToast(`"${path}" 엔드포인트가 삭제되었습니다.`);
    }
  };

  const handleUpdateEndpointField = <K extends keyof ApiEndpointSpec>(
    id: string,
    field: K,
    value: ApiEndpointSpec[K]
  ) => {
    if (setEndpoints) {
      setEndpoints((prev) =>
        prev.map((ep) => (ep.id === id ? { ...ep, [field]: value } : ep))
      );
    }
  };

  const buildMarkdown = () => {
    return `# 12. 백엔드 API 명세서 (REST API Spec)

표준 규격: OpenAPI 3.1 & RFC 7807 Problem Details

${endpoints
  .map(
    (ep) => `## [${ep.method}] ${ep.path}
- 도메인: ${ep.domainGroup} | 인증: ${ep.authScope} | 요약: ${ep.summary}

### Request Schema (JSON)
\`\`\`json
${ep.requestJson}
\`\`\`

### Response 200 OK (JSON)
\`\`\`json
${ep.responseJson}
\`\`\`

${
  ep.rfc7807ErrorJson
    ? `### RFC 7807 Problem Details
\`\`\`json
${ep.rfc7807ErrorJson}
\`\`\``
    : ''
}`
  )
  .join('\n\n')}
`;
  };

  const domains = Array.from(new Set(endpoints.map((e) => e.domainGroup)));

  const filteredEndpoints = endpoints.filter((ep) => {
    if (selectedDomain === 'all') return true;
    return ep.domainGroup === selectedDomain;
  });

  const getMethodBadge = (m: ApiEndpointSpec['method']) => {
    switch (m) {
      case 'GET':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">GET</span>;
      case 'POST':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">POST</span>;
      case 'PUT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">PUT</span>;
      case 'PATCH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">PATCH</span>;
      case 'DELETE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">DELETE</span>;
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    showToast(`${label} 클립보드에 복사되었습니다.`);
  };

  const handleCopyCurl = (ep: ApiEndpointSpec) => {
    const hasBody = ep.requestJson && ep.requestJson.trim() !== '{}';
    const curl = `curl -X ${ep.method} "https://api.groom.cloud${ep.path}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN"${hasBody ? ` \\\n  -d '${ep.requestJson}'` : ''}`;
    handleCopy(curl, 'cURL 명령어가');
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
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <Code2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">12. REST API Spec</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-well text-muted border border-line">
                OpenAPI 3.1 / RFC 7807
              </span>
            </div>
            <h2 className="text-sm font-bold text-ink truncate">백엔드 API 명세서</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ExportDropdown
            title="12_백엔드_API_명세서"
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
              onClick={() => onConfirmStep('step12')}
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

      {/* Domain Category Filter Tabs */}
      <div className="px-5 py-2.5 bg-well/50 border-b border-line flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
        <button
          type="button"
          onClick={() => setSelectedDomain('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            selectedDomain === 'all'
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold'
              : 'text-muted hover:text-ink hover:bg-well'
          }`}
        >
          전체 보기 ({endpoints.length})
        </button>
        {domains.map((dom) => (
          <button
            key={dom}
            type="button"
            onClick={() => setSelectedDomain(dom)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedDomain === dom
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold'
                : 'text-muted hover:text-ink hover:bg-well'
            }`}
          >
            {dom}
          </button>
        ))}
      </div>

      {/* API Endpoints List (Swagger-Style Accordion) */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
        {isEditMode && (
          <div className="p-3 bg-well/40 border border-dashed border-accent/40 rounded-xl flex items-center justify-between">
            <span className="text-xs text-muted">편집 모드: 새 REST API 엔드포인트를 추가하거나 스펙을 수정/삭제할 수 있습니다.</span>
            <button
              type="button"
              onClick={() => setIsAddingEndpoint(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-ink hover:bg-accent-hover text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ 새 엔드포인트 추가</span>
            </button>
          </div>
        )}

        {filteredEndpoints.map((ep) => {
          const isExpanded = expandedEndpointId === ep.id;

          return (
            <div
              key={ep.id}
              className="rounded-xl bg-surface border border-line hover:border-line-strong transition-colors overflow-hidden shadow-sm"
            >
              {/* Endpoint Header Row */}
              <div
                onClick={() => setExpandedEndpointId(isExpanded ? '' : ep.id)}
                className="p-3.5 cursor-pointer flex items-center justify-between gap-3 bg-well/30 hover:bg-well/60 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {isEditMode ? (
                    <select
                      value={ep.method}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleUpdateEndpointField(ep.id, 'method', e.target.value as any)}
                      className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-well border border-line text-ink outline-none"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PATCH">PATCH</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  ) : (
                    getMethodBadge(ep.method)
                  )}

                  {isEditMode ? (
                    <input
                      type="text"
                      value={ep.path}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleUpdateEndpointField(ep.id, 'path', e.target.value)}
                      className="font-mono text-xs font-bold text-ink bg-well border border-line rounded px-2 py-1 outline-none focus:border-accent w-56"
                      placeholder="/api/v1/resource"
                    />
                  ) : (
                    <span className="font-mono text-xs font-bold text-ink truncate">
                      {ep.path}
                    </span>
                  )}

                  {isEditMode ? (
                    <input
                      type="text"
                      value={ep.summary}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleUpdateEndpointField(ep.id, 'summary', e.target.value)}
                      className="text-xs text-ink bg-well border border-line rounded px-2 py-1 outline-none focus:border-accent flex-1 min-w-[140px]"
                      placeholder="기능 요약 설명"
                    />
                  ) : (
                    <span className="text-xs text-muted hidden md:inline truncate">
                      - {ep.summary}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isEditMode ? (
                    <select
                      value={ep.authScope}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleUpdateEndpointField(ep.id, 'authScope', e.target.value as any)}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-well text-ink border border-line outline-none"
                    >
                      <option value="Public">Public</option>
                      <option value="Guest">Guest</option>
                      <option value="Member">Member</option>
                      <option value="StoreOwner">StoreOwner</option>
                    </select>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-well text-muted border border-line font-medium">
                      {ep.authScope}
                    </span>
                  )}

                  {isEditMode ? (
                    <select
                      value={ep.domainGroup}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleUpdateEndpointField(ep.id, 'domainGroup', e.target.value as any)}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-well text-accent border border-accent/20 outline-none"
                    >
                      <option value="인증 및 세션">인증 및 세션</option>
                      <option value="점주 마감 등록">점주 마감 등록</option>
                      <option value="픽업 예약/결제">픽업 예약/결제</option>
                      <option value="실시간 알림">실시간 알림</option>
                    </select>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-accent-soft text-accent border border-accent/20">
                      {ep.domainGroup}
                    </span>
                  )}

                  {isEditMode && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEndpoint(ep.id, ep.path);
                      }}
                      className="p-1 rounded text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                      title="엔드포인트 삭제"
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

              {/* Endpoint Expanded Details (Swagger Style) */}
              {isExpanded && (
                <div className="p-5 border-t border-line space-y-5 text-xs bg-canvas/40">
                  <div className="flex items-center justify-between gap-3">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={ep.summary}
                        onChange={(e) => handleUpdateEndpointField(ep.id, 'summary', e.target.value)}
                        className="text-xs text-ink-2 font-medium bg-well border border-line rounded px-2.5 py-1.5 w-full max-w-md outline-none focus:border-accent"
                        placeholder="상세 설명 입력"
                      />
                    ) : (
                      <p className="text-xs text-ink-2 font-medium">{ep.summary}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => handleCopyCurl(ep)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-well border border-line text-ink hover:border-line-strong transition-colors cursor-pointer shrink-0"
                    >
                      <Terminal className="w-3.5 h-3.5 text-accent" />
                      <span>cURL 복사</span>
                    </button>
                  </div>

                  {/* Request & Response Schemas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Request Body */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-muted">Request Body (JSON)</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(ep.requestJson, 'Request Schema가')}
                          className="text-[10px] text-accent hover:underline cursor-pointer"
                        >
                          복사
                        </button>
                      </div>
                      {isEditMode ? (
                        <textarea
                          value={ep.requestJson}
                          onChange={(e) => handleUpdateEndpointField(ep.id, 'requestJson', e.target.value)}
                          rows={6}
                          className="w-full p-3 rounded-lg bg-well font-mono text-xs text-ink-2 border border-line leading-relaxed outline-none focus:border-accent"
                        />
                      ) : (
                        <pre className="p-3 rounded-lg bg-well font-mono text-xs text-ink-2 overflow-x-auto border border-line leading-relaxed max-h-56">
                          {ep.requestJson}
                        </pre>
                      )}
                    </div>

                    {/* Response Body (200 OK) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-emerald-400">Response 200 OK (JSON)</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(ep.responseJson, 'Response Schema가')}
                          className="text-[10px] text-accent hover:underline cursor-pointer"
                        >
                          복사
                        </button>
                      </div>
                      {isEditMode ? (
                        <textarea
                          value={ep.responseJson}
                          onChange={(e) => handleUpdateEndpointField(ep.id, 'responseJson', e.target.value)}
                          rows={6}
                          className="w-full p-3 rounded-lg bg-well font-mono text-xs text-ink-2 border border-line leading-relaxed outline-none focus:border-accent"
                        />
                      ) : (
                        <pre className="p-3 rounded-lg bg-well font-mono text-xs text-ink-2 overflow-x-auto border border-line leading-relaxed max-h-56">
                          {ep.responseJson}
                        </pre>
                      )}
                    </div>
                  </div>

                  {/* RFC 7807 Problem Details */}
                  {ep.rfc7807ErrorJson && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-rose-400">
                          표준 에러 규약 (RFC 7807 Problem Details)
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(ep.rfc7807ErrorJson, 'RFC 7807 Error 스펙이')}
                          className="text-[10px] text-accent hover:underline cursor-pointer"
                        >
                          복사
                        </button>
                      </div>
                      {isEditMode ? (
                        <textarea
                          value={ep.rfc7807ErrorJson}
                          onChange={(e) => handleUpdateEndpointField(ep.id, 'rfc7807ErrorJson', e.target.value)}
                          rows={5}
                          className="w-full p-3 rounded-lg bg-well font-mono text-xs text-rose-300 border border-rose-500/20 leading-relaxed outline-none focus:border-accent"
                        />
                      ) : (
                        <pre className="p-3 rounded-lg bg-well font-mono text-xs text-rose-300/90 overflow-x-auto border border-rose-500/20 leading-relaxed max-h-48">
                          {ep.rfc7807ErrorJson}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Endpoint Modal */}
      {isAddingEndpoint && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface border border-line-strong rounded-2xl w-full max-w-lg shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-line flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-sm font-bold text-ink">새 REST API 엔드포인트 등록</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingEndpoint(false)}
                className="p-1 rounded-lg text-muted hover:text-ink hover:bg-well transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEndpoint} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-muted mb-1">HTTP Method</label>
                  <select
                    value={newMethod}
                    onChange={(e) => setNewMethod(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink font-mono text-xs focus:outline-none focus:border-accent"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PATCH">PATCH</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-muted mb-1">API URI 경로</label>
                  <input
                    type="text"
                    value={newPath}
                    onChange={(e) => setNewPath(e.target.value)}
                    placeholder="/api/v1/resource"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink font-mono text-xs focus:outline-none focus:border-accent placeholder:text-muted/60"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">기능 요약 및 설명</label>
                <input
                  type="text"
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="예: 신규 매장 당일 마감 타임세일 상품 일괄 등록"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent placeholder:text-muted/60"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-muted mb-1">도메인 그룹</label>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent"
                  >
                    <option value="인증 및 세션">인증 및 세션</option>
                    <option value="점주 마감 등록">점주 마감 등록</option>
                    <option value="픽업 예약/결제">픽업 예약/결제</option>
                    <option value="실시간 알림">실시간 알림</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted mb-1">인증 권한 범위</label>
                  <select
                    value={newAuth}
                    onChange={(e) => setNewAuth(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent"
                  >
                    <option value="Public">Public (비로그인)</option>
                    <option value="Guest">Guest (게스트)</option>
                    <option value="Member">Member (일반 회원)</option>
                    <option value="StoreOwner">StoreOwner (입점 점주)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">Request Body Schema (JSON)</label>
                <textarea
                  value={newReqJson}
                  onChange={(e) => setNewReqJson(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-lg bg-well border border-line font-mono text-xs text-ink focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">Response 200 OK Schema (JSON)</label>
                <textarea
                  value={newResJson}
                  onChange={(e) => setNewResJson(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-lg bg-well border border-line font-mono text-xs text-ink focus:outline-none focus:border-accent"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsAddingEndpoint(false)}
                  className="px-3 py-1.5 rounded-lg bg-well text-muted hover:text-ink text-xs font-medium transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-accent text-accent-ink hover:bg-accent-hover text-xs font-semibold transition-colors cursor-pointer"
                >
                  엔드포인트 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
