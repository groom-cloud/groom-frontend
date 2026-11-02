import React, { useState } from 'react';
import {
  GitBranch,
  GitCommit,
  FolderTree,
  Check,
  CheckCircle2,
  Copy,
  Terminal,
  PanelRightClose,
  Edit3,
  Plus,
  Trash2,
  X
} from 'lucide-react';
import type { DevConventionInfo, StepId } from '../mockData';
import { ExportDropdown } from './ExportDropdown';

interface ConventionDocViewProps {
  conventions: DevConventionInfo;
  setConventions?: React.Dispatch<React.SetStateAction<DevConventionInfo>>;
  onConfirmStep?: (step: StepId) => void;
  onCollapsePane?: () => void;
  isConfirmed?: boolean;
}

export const ConventionDocView: React.FC<ConventionDocViewProps> = ({
  conventions,
  setConventions,
  onConfirmStep,
  onCollapsePane,
  isConfirmed = false
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'git' | 'commit' | 'tree' | 'rules'>('git');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchPurpose, setNewBranchPurpose] = useState('');
  const [newBranchNaming, setNewBranchNaming] = useState('');

  const [isAddingCommitType, setIsAddingCommitType] = useState(false);
  const [newCommitType, setNewCommitType] = useState('');
  const [newCommitDesc, setNewCommitDesc] = useState('');
  const [newCommitExample, setNewCommitExample] = useState('');

  const [isAddingRule, setIsAddingRule] = useState(false);
  const [newRuleText, setNewRuleText] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    showToast(`${label} 복사되었습니다.`);
  };

  // Branch handlers
  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim() || !newBranchPurpose.trim()) return;

    if (setConventions) {
      setConventions((prev) => ({
        ...prev,
        gitStrategy: {
          ...prev.gitStrategy,
          branches: [
            ...prev.gitStrategy.branches,
            {
              name: newBranchName.trim(),
              purpose: newBranchPurpose.trim(),
              namingConvention: newBranchNaming.trim() || newBranchName.trim()
            }
          ]
        }
      }));
    }
    setIsAddingBranch(false);
    setNewBranchName('');
    setNewBranchPurpose('');
    setNewBranchNaming('');
    showToast(`"${newBranchName}" 브랜치 규칙이 추가되었습니다.`);
  };

  const handleDeleteBranch = (name: string) => {
    if (setConventions) {
      setConventions((prev) => ({
        ...prev,
        gitStrategy: {
          ...prev.gitStrategy,
          branches: prev.gitStrategy.branches.filter((b) => b.name !== name)
        }
      }));
      showToast(`"${name}" 브랜치 규칙이 삭제되었습니다.`);
    }
  };

  const handleUpdateBranch = (
    bIdx: number,
    field: 'name' | 'purpose' | 'namingConvention',
    value: string
  ) => {
    if (setConventions) {
      setConventions((prev) => {
        const nextBranches = [...prev.gitStrategy.branches];
        nextBranches[bIdx] = { ...nextBranches[bIdx], [field]: value };
        return {
          ...prev,
          gitStrategy: { ...prev.gitStrategy, branches: nextBranches }
        };
      });
    }
  };

  const handleUpdateCommitType = (
    tIdx: number,
    field: 'type' | 'description' | 'example',
    value: string
  ) => {
    if (setConventions) {
      setConventions((prev) => {
        const nextTypes = [...prev.commitConvention.types];
        nextTypes[tIdx] = { ...nextTypes[tIdx], [field]: value };
        return {
          ...prev,
          commitConvention: { ...prev.commitConvention, types: nextTypes }
        };
      });
    }
  };

  const handleUpdateRule = (rIdx: number, value: string) => {
    if (setConventions) {
      setConventions((prev) => {
        const nextRules = [...prev.codeRules];
        nextRules[rIdx] = value;
        return { ...prev, codeRules: nextRules };
      });
    }
  };

  // Commit type handlers
  const handleAddCommitType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommitType.trim() || !newCommitDesc.trim()) return;

    if (setConventions) {
      setConventions((prev) => ({
        ...prev,
        commitConvention: {
          ...prev.commitConvention,
          types: [
            ...prev.commitConvention.types,
            {
              type: newCommitType.trim(),
              description: newCommitDesc.trim(),
              example: newCommitExample.trim() || `${newCommitType.trim()}: 작업 내용 요약`
            }
          ]
        }
      }));
    }
    setIsAddingCommitType(false);
    setNewCommitType('');
    setNewCommitDesc('');
    setNewCommitExample('');
    showToast(`"${newCommitType}" 커밋 타입이 추가되었습니다.`);
  };

  const handleDeleteCommitType = (type: string) => {
    if (setConventions) {
      setConventions((prev) => ({
        ...prev,
        commitConvention: {
          ...prev.commitConvention,
          types: prev.commitConvention.types.filter((t) => t.type !== type)
        }
      }));
      showToast(`"${type}" 커밋 타입이 삭제되었습니다.`);
    }
  };

  // Rule handlers
  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleText.trim()) return;

    if (setConventions) {
      setConventions((prev) => ({
        ...prev,
        codeRules: [...prev.codeRules, newRuleText.trim()]
      }));
    }
    setIsAddingRule(false);
    setNewRuleText('');
    showToast('새 코딩 규칙이 추가되었습니다.');
  };

  const handleDeleteRule = (idx: number) => {
    if (setConventions) {
      setConventions((prev) => ({
        ...prev,
        codeRules: prev.codeRules.filter((_, i) => i !== idx)
      }));
      showToast('코딩 규칙이 삭제되었습니다.');
    }
  };

  const buildMarkdown = () => {
    return `# 10. 개발 컨벤션 정의서 (Dev Conventions)

## 1. Git 브랜치 전략 (${conventions.gitStrategy.model})
| 브랜치명 | 역할 및 목적 | 네이밍 규칙 |
|---|---|---|
${conventions.gitStrategy.branches.map((b) => `| \`${b.name}\` | ${b.purpose} | \`${b.namingConvention}\` |`).join('\n')}

## 2. 커밋 메시지 규약
표준 포맷: \`${conventions.commitConvention.format}\`

| 타입 | 설명 | 커밋 예시 |
|---|---|---|
${conventions.commitConvention.types.map((t) => `| \`${t.type}\` | ${t.description} | \`${t.example}\` |`).join('\n')}

## 3. 디렉토리 구조 트리

### 프론트엔드 (React / Vite)
\`\`\`
${conventions.folderStructure.frontendTree}
\`\`\`

### 백엔드 (Node / Nest / Express)
\`\`\`
${conventions.folderStructure.backendTree}
\`\`\`

## 4. 공통 코딩 및 린팅 원칙
${conventions.codeRules.map((r, i) => `${i + 1}. ${r}`).join('\n')}
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
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
            <GitBranch className="w-4 h-4 text-teal-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">10. Conventions</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-well text-muted border border-line">
                Git & Code Standards
              </span>
            </div>
            <h2 className="text-sm font-bold text-ink truncate">개발 컨벤션 정의서</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ExportDropdown
            title="10_개발_컨벤션_정의서"
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
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="text-xs font-bold text-ink flex items-center gap-1.5 flex-1 min-w-[200px]">
                  <GitBranch className="w-4 h-4 text-accent shrink-0" />
                  <span>브랜치 워크플로우 모델:</span>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={conventions.gitStrategy.model}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (setConventions) {
                          setConventions((prev) => ({
                            ...prev,
                            gitStrategy: { ...prev.gitStrategy, model: val }
                          }));
                        }
                      }}
                      className="px-2 py-0.5 rounded bg-well border border-line text-xs font-bold text-ink outline-none focus:border-accent flex-1 max-w-sm"
                    />
                  ) : (
                    <span>{conventions.gitStrategy.model}</span>
                  )}
                </span>
                <span className="text-[11px] text-muted">Trunk-Based / Protected main</span>
              </div>
              <p className="text-xs text-ink-2 leading-relaxed">
                모든 배포는 `main` 브랜치에 병합(Squash & Merge)될 때 자동으로 프로덕션 CI/CD가 구동됩니다. 기능 구현 시 반드시 티켓 번호를 접두사로 붙인 단기 feature 브랜치를 생성하고 1인 이상의 코드 리뷰(PR Approval)를 거쳐야 합니다.
              </p>
            </div>

            <div className="rounded-xl border border-line overflow-hidden bg-surface">
              <div className="p-3 bg-well/30 border-b border-line flex items-center justify-between">
                <span className="text-xs font-semibold text-ink">표준 브랜치 구성 규칙</span>
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => setIsAddingBranch(true)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent text-accent-ink text-xs font-semibold hover:bg-accent-hover transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>브랜치 규칙 추가</span>
                  </button>
                )}
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-well border-b border-line text-muted">
                  <tr>
                    <th className="px-4 py-2.5 font-medium w-36">브랜치명</th>
                    <th className="px-4 py-2.5 font-medium">역할 및 목적</th>
                    <th className="px-4 py-2.5 font-medium">네이밍 규칙 & 예시</th>
                    {isEditMode && <th className="px-4 py-2.5 text-center w-14">삭제</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {conventions.gitStrategy.branches.map((b, bIdx) => (
                    <tr key={b.name} className="hover:bg-well/40 transition-colors">
                      <td className="px-4 py-2.5 align-middle">
                        {isEditMode ? (
                          <input
                            type="text"
                            value={b.name}
                            onChange={(e) => handleUpdateBranch(bIdx, 'name', e.target.value)}
                            className="w-full px-2 py-1 bg-well border border-line rounded font-mono font-bold text-accent text-xs outline-none"
                          />
                        ) : (
                          <span className="font-mono font-bold text-accent whitespace-nowrap">{b.name}</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 align-middle">
                        {isEditMode ? (
                          <input
                            type="text"
                            value={b.purpose}
                            onChange={(e) => handleUpdateBranch(bIdx, 'purpose', e.target.value)}
                            className="w-full px-2 py-1 bg-well border border-line rounded text-ink-2 text-xs outline-none"
                          />
                        ) : (
                          <span className="text-ink-2">{b.purpose}</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 align-middle">
                        {isEditMode ? (
                          <input
                            type="text"
                            value={b.namingConvention}
                            onChange={(e) => handleUpdateBranch(bIdx, 'namingConvention', e.target.value)}
                            className="w-full px-2 py-1 bg-well border border-line rounded font-mono text-muted text-xs outline-none"
                          />
                        ) : (
                          <span className="font-mono text-muted">{b.namingConvention}</span>
                        )}
                      </td>
                      {isEditMode && (
                        <td className="px-4 py-2.5 text-center align-middle">
                          <button
                            type="button"
                            onClick={() => handleDeleteBranch(b.name)}
                            className="p-1 text-muted hover:text-danger rounded transition-colors cursor-pointer"
                            title="삭제"
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
              {isEditMode ? (
                <input
                  type="text"
                  value={conventions.commitConvention.format}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (setConventions) {
                      setConventions((prev) => ({
                        ...prev,
                        commitConvention: { ...prev.commitConvention, format: val }
                      }));
                    }
                  }}
                  className="w-full p-2.5 rounded-lg bg-well font-mono text-xs text-accent border border-line outline-none focus:border-accent"
                />
              ) : (
                <div className="p-3 rounded-lg bg-well font-mono text-xs text-accent border border-line">
                  {conventions.commitConvention.format}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-line overflow-hidden bg-surface">
              <div className="p-3 bg-well/30 border-b border-line flex items-center justify-between">
                <span className="text-xs font-semibold text-ink">커밋 타입 접두사 목록</span>
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => setIsAddingCommitType(true)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent text-accent-ink text-xs font-semibold hover:bg-accent-hover transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>커밋 타입 추가</span>
                  </button>
                )}
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-well border-b border-line text-muted">
                  <tr>
                    <th className="px-4 py-2.5 font-medium w-28">타입 (Type)</th>
                    <th className="px-4 py-2.5 font-medium">설명</th>
                    <th className="px-4 py-2.5 font-medium">실제 커밋 예시</th>
                    <th className="px-4 py-2.5 text-center w-16">복사</th>
                    {isEditMode && <th className="px-4 py-2.5 text-center w-14">삭제</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {conventions.commitConvention.types.map((t, tIdx) => (
                    <tr key={t.type} className="hover:bg-well/40 transition-colors">
                      <td className="px-4 py-2.5 align-middle">
                        {isEditMode ? (
                          <input
                            type="text"
                            value={t.type}
                            onChange={(e) => handleUpdateCommitType(tIdx, 'type', e.target.value)}
                            className="w-full px-2 py-1 bg-well border border-line rounded font-mono font-bold text-teal-400 text-xs outline-none"
                          />
                        ) : (
                          <span className="font-mono font-bold text-teal-400 whitespace-nowrap">{t.type}</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 align-middle">
                        {isEditMode ? (
                          <input
                            type="text"
                            value={t.description}
                            onChange={(e) => handleUpdateCommitType(tIdx, 'description', e.target.value)}
                            className="w-full px-2 py-1 bg-well border border-line rounded text-ink-2 text-xs outline-none"
                          />
                        ) : (
                          <span className="text-ink-2">{t.description}</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 align-middle">
                        {isEditMode ? (
                          <input
                            type="text"
                            value={t.example}
                            onChange={(e) => handleUpdateCommitType(tIdx, 'example', e.target.value)}
                            className="w-full px-2 py-1 bg-well border border-line rounded font-mono text-muted text-xs outline-none"
                          />
                        ) : (
                          <span className="font-mono text-muted">{t.example}</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-center align-middle">
                        <button
                          type="button"
                          onClick={() => handleCopy(t.example, `"${t.example}"가`)}
                          className="p-1 text-muted hover:text-ink rounded transition-colors cursor-pointer"
                          title="예시 복사"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </td>
                      {isEditMode && (
                        <td className="px-4 py-2.5 text-center align-middle">
                          <button
                            type="button"
                            onClick={() => handleDeleteCommitType(t.type)}
                            className="p-1 text-muted hover:text-danger rounded transition-colors cursor-pointer"
                            title="삭제"
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
                  className="text-[11px] text-muted hover:text-ink cursor-pointer flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>복사</span>
                </button>
              </div>
              {isEditMode ? (
                <textarea
                  value={conventions.folderStructure.frontendTree}
                  onChange={(e) => {
                    if (setConventions) {
                      const val = e.target.value;
                      setConventions((prev) => ({
                        ...prev,
                        folderStructure: { ...prev.folderStructure, frontendTree: val }
                      }));
                    }
                  }}
                  rows={14}
                  className="w-full p-3 rounded-lg bg-well text-xs font-mono text-ink border border-line focus:outline-none focus:border-accent leading-relaxed"
                />
              ) : (
                <pre className="p-3 rounded-lg bg-well text-xs font-mono text-ink-2 overflow-x-auto leading-relaxed border border-line">
                  {conventions.folderStructure.frontendTree}
                </pre>
              )}
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
                  className="text-[11px] text-muted hover:text-ink cursor-pointer flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>복사</span>
                </button>
              </div>
              {isEditMode ? (
                <textarea
                  value={conventions.folderStructure.backendTree}
                  onChange={(e) => {
                    if (setConventions) {
                      const val = e.target.value;
                      setConventions((prev) => ({
                        ...prev,
                        folderStructure: { ...prev.folderStructure, backendTree: val }
                      }));
                    }
                  }}
                  rows={14}
                  className="w-full p-3 rounded-lg bg-well text-xs font-mono text-ink border border-line focus:outline-none focus:border-accent leading-relaxed"
                />
              ) : (
                <pre className="p-3 rounded-lg bg-well text-xs font-mono text-ink-2 overflow-x-auto leading-relaxed border border-line">
                  {conventions.folderStructure.backendTree}
                </pre>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: Rules & Linting */}
        {activeTab === 'rules' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface border border-line space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-ink flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-accent" />
                  공통 코딩 스타일 및 품질 검증 원칙
                </h3>
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => setIsAddingRule(true)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent text-accent-ink text-xs font-semibold hover:bg-accent-hover transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>코딩 규칙 추가</span>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {conventions.codeRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-well border border-line text-xs text-ink-2 flex items-start justify-between gap-2"
                  >
                    <div className="flex items-start gap-2 min-w-0 flex-1">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-1 shrink-0" />
                      {isEditMode ? (
                        <input
                          type="text"
                          value={rule}
                          onChange={(e) => handleUpdateRule(idx, e.target.value)}
                          className="w-full px-2 py-1 bg-surface border border-line rounded text-xs text-ink outline-none focus:border-accent"
                        />
                      ) : (
                        <span>{rule}</span>
                      )}
                    </div>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={() => handleDeleteRule(idx)}
                        className="p-1 text-muted hover:text-danger transition-colors cursor-pointer shrink-0 mt-0.5"
                        title="규칙 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add Branch Rule */}
      {isAddingBranch && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface border border-line-strong rounded-2xl w-full max-w-md shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-line flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                  <GitBranch className="w-4 h-4 text-teal-400" />
                </div>
                <h3 className="text-sm font-bold text-ink">새 Git 브랜치 규칙 등록</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingBranch(false)}
                className="p-1 rounded-lg text-muted hover:text-ink hover:bg-well transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBranch} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">브랜치명</label>
                <input
                  type="text"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  placeholder="예: hotfix/*"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink font-mono text-xs focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">역할 및 목적</label>
                <input
                  type="text"
                  value={newBranchPurpose}
                  onChange={(e) => setNewBranchPurpose(e.target.value)}
                  placeholder="예: 프로덕션 긴급 버그 핫픽스 브랜치"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">네이밍 규칙 & 예시</label>
                <input
                  type="text"
                  value={newBranchNaming}
                  onChange={(e) => setNewBranchNaming(e.target.value)}
                  placeholder="예: hotfix/#티켓-이슈키워드"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink font-mono text-xs focus:outline-none focus:border-accent"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsAddingBranch(false)}
                  className="px-3 py-1.5 rounded-lg bg-well text-muted hover:text-ink text-xs font-medium cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-accent text-accent-ink hover:bg-accent-hover text-xs font-semibold cursor-pointer"
                >
                  브랜치 규칙 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Commit Type */}
      {isAddingCommitType && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface border border-line-strong rounded-2xl w-full max-w-md shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-line flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                  <GitCommit className="w-4 h-4 text-teal-400" />
                </div>
                <h3 className="text-sm font-bold text-ink">새 커밋 타입 등록</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingCommitType(false)}
                className="p-1 rounded-lg text-muted hover:text-ink hover:bg-well transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCommitType} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">커밋 타입 접두사</label>
                <input
                  type="text"
                  value={newCommitType}
                  onChange={(e) => setNewCommitType(e.target.value)}
                  placeholder="예: perf"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink font-mono text-xs focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">설명</label>
                <input
                  type="text"
                  value={newCommitDesc}
                  onChange={(e) => setNewCommitDesc(e.target.value)}
                  placeholder="예: 쿼리 및 응답 성능 개선"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">실제 커밋 예시</label>
                <input
                  type="text"
                  value={newCommitExample}
                  onChange={(e) => setNewCommitExample(e.target.value)}
                  placeholder="예: perf: Redis 캐시 도입으로 마감 상품 조회 지연 85% 단축"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-well border border-line text-ink font-mono text-xs focus:outline-none focus:border-accent"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsAddingCommitType(false)}
                  className="px-3 py-1.5 rounded-lg bg-well text-muted hover:text-ink text-xs font-medium cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-accent text-accent-ink hover:bg-accent-hover text-xs font-semibold cursor-pointer"
                >
                  타입 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Code Rule */}
      {isAddingRule && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface border border-line-strong rounded-2xl w-full max-w-md shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-line flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-teal-400" />
                </div>
                <h3 className="text-sm font-bold text-ink">새 코딩 및 린팅 규칙 추가</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingRule(false)}
                className="p-1 rounded-lg text-muted hover:text-ink hover:bg-well transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRule} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">규칙 내용</label>
                <textarea
                  value={newRuleText}
                  onChange={(e) => setNewRuleText(e.target.value)}
                  rows={3}
                  placeholder="예: 모든 비동기 예외는 전역 Error Boundary 및 GlobalExceptionHandler에서 표준 RFC 7807 포맷으로 캡슐화한다."
                  className="w-full p-2.5 rounded-lg bg-well border border-line text-ink text-xs focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsAddingRule(false)}
                  className="px-3 py-1.5 rounded-lg bg-well text-muted hover:text-ink text-xs font-medium cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-accent text-accent-ink hover:bg-accent-hover text-xs font-semibold cursor-pointer"
                >
                  규칙 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
