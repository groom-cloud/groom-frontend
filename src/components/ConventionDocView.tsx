import React, { useState } from 'react';
import {
  GitBranch,
  GitCommit,
  FolderTree,
  Check,
  CheckCircle2,
  Copy,
  Terminal,
  PanelRightClose
} from 'lucide-react';
import type { DevConventionInfo, StepId } from '../mockData';

interface ConventionDocViewProps {
  conventions: DevConventionInfo;
  setConventions?: React.Dispatch<React.SetStateAction<DevConventionInfo>>;
  onConfirmStep?: (step: StepId) => void;
  onCollapsePane?: () => void;
  isConfirmed?: boolean;
}

export const ConventionDocView: React.FC<ConventionDocViewProps> = ({
  conventions,
  onConfirmStep,
  onCollapsePane,
  isConfirmed = false
}) => {
  const [activeTab, setActiveTab] = useState<'git' | 'commit' | 'tree' | 'rules'>('git');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    showToast(`${label} 복사되었습니다.`);
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
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
            <GitBranch className="w-4 h-4 text-teal-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">11. Conventions</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-well text-muted border border-line">
                Git & Code Standards
              </span>
            </div>
            <h2 className="text-sm font-bold text-ink truncate">개발 컨벤션 정의서</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onConfirmStep && (
            <button
              type="button"
              onClick={() => onConfirmStep('step11')}
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

      {/* Tab Switcher */}
      <div className="px-5 py-2.5 bg-well/50 border-b border-line flex items-center gap-2 text-xs shrink-0 overflow-x-auto">
        {[
          { id: 'git', label: 'Git 브랜치 전략', icon: GitBranch },
          { id: 'commit', label: '커밋 메시지 규약', icon: GitCommit },
          { id: 'tree', label: '디렉토리 구조 트리', icon: FolderTree },
          { id: 'rules', label: '린팅 & 코드 원칙', icon: Terminal }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-ink text-paper font-semibold shadow-sm'
                  : 'bg-surface text-muted hover:text-ink border border-line'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* TAB 1: Git Branch Strategy */}
        {activeTab === 'git' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface border border-line space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                  <GitBranch className="w-4 h-4 text-accent" />
                  브랜치 워크플로우 모델: {conventions.gitStrategy.model}
                </span>
                <span className="text-[11px] text-muted">Trunk-Based / Protected main</span>
              </div>
              <p className="text-xs text-ink-2 leading-relaxed">
                모든 배포는 `main` 브랜치에 병합(Squash & Merge)될 때 자동으로 프로덕션 CI/CD가 구동됩니다. 기능 구현 시 반드시 티켓 번호를 접두사로 붙인 단기 feature 브랜치를 생성하고 1인 이상의 코드 리뷰(PR Approval)를 거쳐야 합니다.
              </p>
            </div>

            <div className="rounded-xl border border-line overflow-hidden bg-surface">
              <table className="w-full text-left text-xs">
                <thead className="bg-well border-b border-line text-muted">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">브랜치명</th>
                    <th className="px-4 py-2.5 font-medium">역할 및 목적</th>
                    <th className="px-4 py-2.5 font-medium">네이밍 규칙 & 예시</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {conventions.gitStrategy.branches.map((b) => (
                    <tr key={b.name} className="hover:bg-well/40 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-accent whitespace-nowrap">
                        {b.name}
                      </td>
                      <td className="px-4 py-3 text-ink-2">{b.purpose}</td>
                      <td className="px-4 py-3 font-mono text-muted">{b.namingConvention}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Commit Message Convention */}
        {activeTab === 'commit' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface border border-line space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink">커밋 메시지 표준 포맷 (Conventional Commits)</span>
                <button
                  type="button"
                  onClick={() => handleCopy(conventions.commitConvention.format, '커밋 포맷이')}
                  className="flex items-center gap-1 text-[11px] text-accent hover:underline cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>포맷 복사</span>
                </button>
              </div>
              <div className="p-3 rounded-lg bg-well font-mono text-xs text-accent border border-line">
                {conventions.commitConvention.format}
              </div>
            </div>

            <div className="rounded-xl border border-line overflow-hidden bg-surface">
              <table className="w-full text-left text-xs">
                <thead className="bg-well border-b border-line text-muted">
                  <tr>
                    <th className="px-4 py-2.5 font-medium w-24">타입 (Type)</th>
                    <th className="px-4 py-2.5 font-medium">설명</th>
                    <th className="px-4 py-2.5 font-medium">실제 커밋 예시</th>
                    <th className="px-4 py-2.5 text-center w-16">복사</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {conventions.commitConvention.types.map((t) => (
                    <tr key={t.type} className="hover:bg-well/40 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-teal-400">{t.type}</td>
                      <td className="px-4 py-3 text-ink-2">{t.description}</td>
                      <td className="px-4 py-3 font-mono text-muted">{t.example}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleCopy(t.example, `"${t.example}"가`)}
                          className="p-1 text-muted hover:text-ink rounded transition-colors cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Folder Structure Tree */}
        {activeTab === 'tree' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Frontend Tree */}
            <div className="p-4 rounded-xl bg-surface border border-line space-y-3">
              <div className="flex items-center justify-between border-b border-line pb-2.5">
                <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                  <FolderTree className="w-4 h-4 text-accent" />
                  프론트엔드 구조 (React / Vite)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(conventions.folderStructure.frontendTree, '프론트엔드 트리 구조가')}
                  className="text-[11px] text-muted hover:text-ink cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <pre className="p-3 rounded-lg bg-well text-xs font-mono text-ink-2 overflow-x-auto leading-relaxed border border-line">
                {conventions.folderStructure.frontendTree}
              </pre>
            </div>

            {/* Backend Tree */}
            <div className="p-4 rounded-xl bg-surface border border-line space-y-3">
              <div className="flex items-center justify-between border-b border-line pb-2.5">
                <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                  <FolderTree className="w-4 h-4 text-accent" />
                  백엔드 구조 (Node / Nest / Express)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(conventions.folderStructure.backendTree, '백엔드 트리 구조가')}
                  className="text-[11px] text-muted hover:text-ink cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <pre className="p-3 rounded-lg bg-well text-xs font-mono text-ink-2 overflow-x-auto leading-relaxed border border-line">
                {conventions.folderStructure.backendTree}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 4: Rules & Linting */}
        {activeTab === 'rules' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface border border-line space-y-3">
              <h3 className="text-xs font-bold text-ink flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-accent" />
                공통 코딩 스타일 및 품질 검증 원칙
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {conventions.codeRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-well border border-line text-xs text-ink-2 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
