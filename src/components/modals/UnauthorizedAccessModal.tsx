import React from 'react';
import { createPortal } from 'react-dom';
import { ShieldAlert, X, ArrowRight, Lock, KeyRound, ExternalLink, Users } from 'lucide-react';
import { GoogleLogo } from '../common/GoogleLogo';
import { audioManager } from '../../utils/audio';
import { AUTHORIZED_EMAILS } from '../../utils/authStorage';

interface UnauthorizedAccessModalProps {
  isOpen: boolean;
  attemptedEmail?: string;
  onClose: () => void;
  onSwitchAccount: () => void;
  onReturnHome: () => void;
}

export const UnauthorizedAccessModal: React.FC<UnauthorizedAccessModalProps> = ({
  isOpen,
  attemptedEmail,
  onClose,
  onSwitchAccount,
  onReturnHome,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0c1017] border border-rose-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 text-left overflow-hidden">
        {/* Top Dismiss Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Security Badge */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-500/50 flex items-center justify-center text-rose-400 shrink-0 shadow-lg shadow-rose-950/50">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-rose-950/80 border border-rose-700/60 text-rose-300 font-semibold">
              Restricted Area · 403 Forbidden
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white mt-1">
              Dashboard Access Restricted
            </h2>
          </div>
        </div>

        {/* Attempted Account Notice */}
        <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-1 mb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-rose-300">
            <Lock className="w-3.5 h-3.5" />
            <span>Attempted Login:</span>
          </div>
          <p className="text-sm font-bold text-white font-mono break-all">
            {attemptedEmail || 'Unverified / Unknown Account'}
          </p>
          <p className="text-[11px] text-rose-200/80 leading-relaxed pt-1">
            This email address is not in the authorized administrator whitelist for B/Stack Tech Club dashboard access.
          </p>
        </div>

        {/* Explanation */}
        <p className="text-xs text-neutral-300 leading-relaxed mb-4 font-light">
          The B/Stack Dashboard and Events Editor are restricted strictly to designated administrator emails. To manage upcoming events and club operations, please sign in with an authorized Google account (such as <code className="text-cyan-300 font-mono font-semibold">ziyadparkar.official@gmail.com</code>, <code className="text-cyan-300 font-mono font-semibold">aishik.roy1234@gmail.com</code>, or <code className="text-cyan-300 font-mono font-semibold">propriyansh71@gmail.com</code>).
        </p>

        {/* Authorized Emails Sample */}
        <div className="p-3.5 rounded-2xl bg-[#070a11] border border-white/10 mb-6 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Pre-Approved Administrator Whitelist:</span>
            <span className="text-emerald-400">{AUTHORIZED_EMAILS.length} Authorized</span>
          </div>
          <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
            {AUTHORIZED_EMAILS.map((email) => (
              <div
                key={email}
                className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/5 text-[11px] font-mono text-slate-300 flex items-center justify-between"
              >
                <span className="truncate">{email}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold shrink-0 ml-2">
                  Authorized Lead
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              onSwitchAccount();
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <GoogleLogo className="w-4 h-4 shrink-0" />
            <span>Sign In with Authorized Google</span>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-950" />
          </button>

          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              onReturnHome();
            }}
            className="py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-mono transition-colors cursor-pointer text-center"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
