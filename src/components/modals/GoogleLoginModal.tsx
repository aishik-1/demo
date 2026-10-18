import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowRight, ShieldCheck, AlertCircle, KeyRound, ExternalLink, CheckCircle2 } from 'lucide-react';
import { GoogleLogo } from '../common/GoogleLogo';
import { audioManager } from '../../utils/audio';
import {
  AUTHORIZED_EMAILS,
  isAuthorizedEditor,
  getStoredGoogleClientId,
  buildGoogleAuthUrl,
  verifyEmailAuthorization,
} from '../../utils/authStorage';

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleSuccess: (email: string, name?: string) => void;
  onUnauthorized: (email: string) => void;
}

export const GoogleLoginModal: React.FC<GoogleLoginModalProps> = ({
  isOpen,
  onClose,
  onGoogleSuccess,
  onUnauthorized,
}) => {
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  if (!isOpen) return null;

  const handleOfficialGoogleRedirect = () => {
    audioManager.playClick();
    const clientId = getStoredGoogleClientId();

    if (clientId && !clientId.includes('YOUR_GOOGLE_CLIENT_ID')) {
      setIsRedirecting(true);
      const redirectUri = window.location.origin;
      const googleAuthUrl = buildGoogleAuthUrl(clientId, redirectUri);
      sessionStorage.setItem('bstack_google_oauth_in_progress', 'true');
      window.location.href = googleAuthUrl;
    } else {
      // If client ID is not configured, user can select or test email directly
    }
  };

  const handleSimulateGoogleLogin = async (email: string, name?: string) => {
    audioManager.playClick();
    const cleanEmail = email.trim().toLowerCase();

    const authorized = await verifyEmailAuthorization(cleanEmail);
    if (authorized) {
      onGoogleSuccess(cleanEmail, name || cleanEmail.split('@')[0]);
      onClose();
    } else {
      onUnauthorized(cleanEmail);
      onClose();
    }
  };

  const hasClientId = Boolean(
    getStoredGoogleClientId() && !getStoredGoogleClientId().includes('YOUR_GOOGLE_CLIENT_ID')
  );

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0d1019] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden flex flex-col font-sans text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white mb-3 shadow-md">
            <GoogleLogo className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-heading font-bold text-white tracking-tight">
            Sign in with Google
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Authenticate using your Google account. Access is restricted to approved editors on the <code className="text-cyan-300 font-mono">AUTHORIZED_EMAILS</code> list.
          </p>
        </div>

        {/* Option 1: Official Google OAuth Redirect */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleOfficialGoogleRedirect}
            disabled={isRedirecting}
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-neutral-100 active:scale-[0.98] text-neutral-900 font-medium text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-md cursor-pointer border border-neutral-300"
          >
            <GoogleLogo className="w-4 h-4 shrink-0" />
            <span>
              {isRedirecting ? 'Redirecting to Google...' : 'Continue with Google (Live OAuth)'}
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-500 ml-auto" />
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-[1px] bg-white/10" />
          <span className="text-[10px] font-mono uppercase text-neutral-500">
            or select / verify google account
          </span>
          <div className="flex-1 h-[1px] bg-white/10" />
        </div>

        {/* Initial Seed Approved Editors Quick Select */}
        <div className="space-y-2 text-left">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
            Seed Approved Editors:
          </div>

          {[
            { email: 'ziyadparkar.official@gmail.com', name: 'Ziyad Parkar', role: 'Lead' },
            { email: 'aishik.roy1234@gmail.com', name: 'Aishik Roy', role: 'Tech Club Head' },
            { email: 'propriyansh71@gmail.com', name: 'Priyansh Singh', role: 'Lead' },
          ].map((acc) => (
            <button
              key={acc.email}
              type="button"
              onClick={() => handleSimulateGoogleLogin(acc.email, acc.name)}
              className="w-full p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-cyan-500/40 hover:border-cyan-400 text-left transition-all flex items-center justify-between cursor-pointer group shadow-sm"
            >
              <div className="min-w-0 pr-2">
                <div className="text-xs font-bold text-white group-hover:text-cyan-300 flex items-center gap-1.5">
                  <span>{acc.name}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950/90 border border-cyan-800 text-cyan-300 font-mono">
                    {acc.role}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-cyan-300/90 truncate mt-0.5">
                  {acc.email}
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-all shrink-0" />
            </button>
          ))}
        </div>

        {/* Custom Google Email Verification Input (To test unauthorized rejection) */}
        <div className="mt-4 pt-3 border-t border-white/10 text-left space-y-2">
          <div className="text-[11px] font-mono text-slate-400">
            Test any Google Email (Authorized or Unauthorized):
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (customEmail) {
                handleSimulateGoogleLogin(customEmail, customName || customEmail.split('@')[0]);
              }
            }}
            className="flex gap-2"
          >
            <input
              type="email"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              placeholder="e.g. unknown@gmail.com"
              required
              className="flex-1 px-3 py-2 rounded-xl bg-[#06080e] border border-white/15 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Verify
            </button>
          </form>
        </div>

      </div>
    </div>,
    document.body
  );
};
