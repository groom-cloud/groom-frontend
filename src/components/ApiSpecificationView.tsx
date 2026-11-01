import React, { useState } from 'react';
import {
  Code2,
  ChevronDown,
  ChevronUp,
  Check,
  Terminal,
  PanelRightClose
} from 'lucide-react';
import type { ApiEndpointSpec, StepId } from '../mockData';

interface ApiSpecificationViewProps {
  endpoints: ApiEndpointSpec[];
  setEndpoints?: React.Dispatch<React.SetStateAction<ApiEndpointSpec[]>>;
  onConfirmStep?: (step: StepId) => void;
  onCollapsePane?: () => void;
  isConfirmed?: boolean;
}

export const ApiSpecificationView: React.FC<ApiSpecificationViewProps> = ({
  endpoints,
  onConfirmStep,
  onCollapsePane,
  isConfirmed = false
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [expandedEndpointId, setExpandedEndpointId] = useState<string>(endpoints[0]?.id || '');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
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
                <div className="flex items-center gap-3 min-w-0">
                  {getMethodBadge(ep.method)}
                  <span className="font-mono text-xs font-bold text-ink truncate">
                    {ep.path}
                  </span>
                  <span className="text-xs text-muted hidden md:inline truncate">
                    - {ep.summary}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-well text-muted border border-line font-medium">
                    {ep.authScope}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-accent-soft text-accent border border-accent/20">
                    {ep.domainGroup}
                  </span>
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
                    <p className="text-xs text-ink-2 font-medium">{ep.summary}</p>
                    <button
                      type="button"
                      onClick={() => handleCopyCurl(ep)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-well border border-line text-ink hover:border-line-strong transition-colors cursor-pointer"
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
                      <pre className="p-3 rounded-lg bg-well font-mono text-xs text-ink-2 overflow-x-auto border border-line leading-relaxed max-h-56">
                        {ep.requestJson}
                      </pre>
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
                      <pre className="p-3 rounded-lg bg-well font-mono text-xs text-ink-2 overflow-x-auto border border-line leading-relaxed max-h-56">
                        {ep.responseJson}
                      </pre>
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
                      <pre className="p-3 rounded-lg bg-well font-mono text-xs text-rose-300/90 overflow-x-auto border border-rose-500/20 leading-relaxed max-h-48">
                        {ep.rfc7807ErrorJson}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
