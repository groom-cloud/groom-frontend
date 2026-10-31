import React, { useState } from 'react';
import {
  Copy,
  Check,
  X,
  UserPlus
} from 'lucide-react';
import type { ProjectMember } from '../mockData';

interface WorkspaceModalsProps {
  isClaimModalOpen: boolean;
  setIsClaimModalOpen: (open: boolean) => void;
  isAccountClaimed: boolean;
  onClaimSuccess: (email: string) => void;
  isInviteModalOpen: boolean;
  setIsInviteModalOpen: (open: boolean) => void;
  members: ProjectMember[];
  setMembers: React.Dispatch<React.SetStateAction<ProjectMember[]>>;
}

export const WorkspaceModals: React.FC<WorkspaceModalsProps> = ({
  isClaimModalOpen,
  setIsClaimModalOpen,
  isAccountClaimed,
  onClaimSuccess,
  isInviteModalOpen,
  setIsInviteModalOpen,
  members,
  setMembers
}) => {
  // Claim Modal States
  const [claimEmail, setClaimEmail] = useState('jungho.han@groom.dev');
  const [claimPassword, setClaimPassword] = useState('••••••••••••');

  // Invite Modal States
  const [copiedCode, setCopiedCode] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'EDITOR' | 'VIEWER'>('EDITOR');

  const handleCopyInviteCode = () => {
    navigator.clipboard?.writeText('grm_invite_9a8b7c').catch(() => {});
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1800);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    const namePart = inviteEmail.split('@')[0] || '신규멤버';
    const newMember: ProjectMember = {
      id: `mem_${Date.now()}`,
      name: namePart,
      email: inviteEmail.trim(),
      initials: namePart.slice(0, 2).toUpperCase(),
      role: inviteRole,
      joinedAt: '방금 합류'
    };
    setMembers((prev) => [...prev, newMember]);
    setInviteEmail('');
  };

  const handleRoleChange = (memberId: string, nextRole: 'ADMIN' | 'EDITOR' | 'VIEWER') => {
    setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role: nextRole } : m)));
  };

  return (
    <>
      {/* ============================================================== */}
      {/* 1. ACCOUNT CLAIM MODAL (계정 연동 / 영구 귀속) */}
      {/* ============================================================== */}
      {isClaimModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="claim-modal-title"
          className="fixed inset-0 z-50 bg-overlay flex items-center justify-center p-4 select-none"
        >
          <div className="bg-surface border border-line rounded-2xl w-full max-w-md max-h-[90dvh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-line flex items-center justify-between shrink-0">
              <div>
                <h2 id="claim-modal-title" className="text-sm font-semibold text-ink">
                  프로젝트 영구 보관 연동
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  임시 게스트 세션의 산출물을 개인 계정으로 귀속합니다.
                </p>
              </div>
              <button
                type="button"
                aria-label="영구 저장 모달 닫기"
                onClick={() => setIsClaimModalOpen(false)}
                className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-well transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 overflow-y-auto text-xs">
              <p className="text-ink-2 leading-relaxed">
                현재 작성된 8단계 기획서, 화면 흐름, ERD 스키마, 아키텍처 토폴로지, 칸반 티켓 및 운영 이력이 손실 없이 그대로 유지되며 24시간 만료 타이머가 해제됩니다.
              </p>

              {/* Form */}
              <div className="space-y-3 pt-2 border-t border-line">
                <div>
                  <label htmlFor="claim-email-input" className="text-ink-2 font-medium block mb-1.5">
                    이메일 주소
                  </label>
                  <input
                    id="claim-email-input"
                    aria-label="연동할 이메일 주소 입력"
                    type="email"
                    value={claimEmail}
                    onChange={(e) => setClaimEmail(e.target.value)}
                    className="w-full bg-well border border-line rounded-lg px-3 py-2 text-xs text-ink"
                  />
                </div>

                <div>
                  <label htmlFor="claim-password-input" className="text-ink-2 font-medium block mb-1.5">
                    비밀번호 설정
                  </label>
                  <input
                    id="claim-password-input"
                    aria-label="워크스페이스 비밀번호 입력"
                    type="password"
                    value={claimPassword}
                    onChange={(e) => setClaimPassword(e.target.value)}
                    className="w-full bg-well border border-line rounded-lg px-3 py-2 text-xs text-ink"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 bg-well border-t border-line flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsClaimModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-surface hover:bg-control text-ink text-xs font-medium cursor-pointer whitespace-nowrap"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  onClaimSuccess(claimEmail);
                  setIsClaimModalOpen(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-ink hover:opacity-90 text-paper text-xs font-medium transition-opacity cursor-pointer whitespace-nowrap"
              >
                {isAccountClaimed ? '연동 완료됨' : '계정 연동하기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. MEMBER INVITE & RBAC MODAL (팀원 초대 및 권한 제어) */}
      {/* ============================================================== */}
      {isInviteModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="invite-modal-title"
          className="fixed inset-0 z-50 bg-overlay flex items-center justify-center p-4 select-none"
        >
          <div className="bg-surface border border-line rounded-2xl w-full max-w-lg max-h-[90dvh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-line flex items-center justify-between shrink-0">
              <div>
                <h2 id="invite-modal-title" className="text-sm font-semibold text-ink">
                  팀원 초대 및 권한 관리
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  프로젝트 단위 역할 권한 설정 (무료 플랜 최대 3명)
                </p>
              </div>
              <button
                type="button"
                aria-label="팀원 초대 모달 닫기"
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-well transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-5 overflow-y-auto text-xs">
              {/* Invite Code Copy Box */}
              <div className="space-y-1.5">
                <span className="text-ink-2 font-medium block">초대 코드 공유</span>
                <div className="bg-well border border-line rounded-lg px-3 py-2 flex items-center justify-between gap-2">
                  <code className="font-mono font-semibold text-ink truncate">
                    grm_invite_9a8b7c
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyInviteCode}
                    className="px-2.5 py-1 rounded-md bg-surface hover:bg-control text-ink text-xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-ok" />
                        <span className="text-ok">복사됨</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-muted" />
                        <span>코드 복사</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Email Invite + Role Dropdown */}
              <form onSubmit={handleInviteSubmit} className="space-y-1.5">
                <label htmlFor="invite-email-input" className="text-ink-2 font-medium block">
                  이메일로 초대
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="invite-email-input"
                    aria-label="초대할 팀원 이메일 입력"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="teammate@company.com"
                    className="flex-1 bg-well border border-line rounded-lg px-3 py-2 text-xs text-ink placeholder:text-muted"
                  />
                  <div className="flex gap-2">
                    <select
                      aria-label="팀원 역할 권한 선택"
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as 'ADMIN' | 'EDITOR' | 'VIEWER')}
                      className="bg-well border border-line rounded-lg px-2.5 py-2 text-xs font-medium text-ink"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="EDITOR">EDITOR</option>
                      <option value="VIEWER">VIEWER</option>
                    </select>
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-lg bg-ink hover:opacity-90 text-paper text-xs font-medium flex items-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>초대</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Current Participating Members List */}
              <div className="space-y-2 pt-3 border-t border-line">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span className="font-semibold text-ink">참여 멤버 ({members.length}/3)</span>
                  <span>역할별 편집 권한 차등 적용</span>
                </div>

                <div className="divide-y divide-line">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="py-2.5 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-ink truncate">{member.name}</span>
                          {member.isCurrentUser && (
                            <span className="text-xs text-muted">(나)</span>
                          )}
                        </div>
                        <div className="text-xs text-muted truncate">{member.email}</div>
                      </div>

                      <div className="shrink-0">
                        {member.role === 'OWNER' ? (
                          <span className="text-xs font-semibold text-ink-2 px-2 py-1">
                            OWNER
                          </span>
                        ) : (
                          <select
                            aria-label={`${member.name} 권한 변경`}
                            value={member.role}
                            onChange={(e) =>
                              handleRoleChange(member.id, e.target.value as 'ADMIN' | 'EDITOR' | 'VIEWER')
                            }
                            className="bg-well border border-line rounded-lg px-2 py-1 text-xs font-medium text-ink"
                          >
                            <option value="ADMIN">ADMIN</option>
                            <option value="EDITOR">EDITOR</option>
                            <option value="VIEWER">VIEWER</option>
                          </select>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 bg-well border-t border-line flex items-center justify-between text-xs text-muted shrink-0">
              <span>소유권 이전은 V2.0에서 지원됩니다.</span>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-surface hover:bg-control text-ink font-medium cursor-pointer whitespace-nowrap"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
