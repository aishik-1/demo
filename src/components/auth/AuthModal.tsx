import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ArrowRight,
  LogIn,
  AlertCircle,
  Phone,
  CheckCircle2,
  ExternalLink,
  Key,
  Settings2,
  ChevronDown,
  ChevronUp,
  Radio,
} from 'lucide-react';
import { User, VerticalType } from '../../types';
import { audioManager } from '../../utils/audio';
import {
  authenticateWithPhoneNumber,
  isAuthorizedEditor,
  saveSessionUser,
  processGoogleUserProfile,
  getStoredGoogleClientId,
  setStoredGoogleClientId,
  buildGoogleAuthUrl,
  verifyEmailAuthorization,
} from '../../utils/authStorage';
import { ZIYAD_PARKAR, AISHIK_ROY, PRIYANSH_SINGH } from '../../data/clubMembers';
import { launchRealGoogleOAuthPopup } from '../../utils/googleAuth';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'signup';
  initialMethod?: 'google' | 'phone';
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

/**
 * Pixel-perfect Google 4-color SVG Icon
 */
const GoogleLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
    />
  </svg>
);

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'signin',
  initialMethod = 'google',
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [authMethod, setAuthMethod] = useState<'google' | 'phone'>('google');
  const [mounted, setMounted] = useState(false);

  // Google OAuth state
  const [googleClientId, setGoogleClientId] = useState(getStoredGoogleClientId());
  const [isVerifyingGoogle, setIsVerifyingGoogle] = useState(false);

  // Phone & OTP states
  const [countryCode, setCountryCode] = useState('91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [selectedVertical, setSelectedVertical] = useState<VerticalType>('balgo');
  const [otpStep, setOtpStep] = useState<'input-phone' | 'input-otp'>('input-phone');
  const [otpCode, setOtpCode] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // General state
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch server config on open
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setAuthMethod(initialMethod === 'phone' ? 'phone' : 'google');
      setAuthError('');
      setAuthSuccess('');
      setOtpStep('input-phone');
      setOtpCode('');

      fetch('/api/auth/google-config')
        .then((res) => res.json())
        .then((data) => {
          if (data?.clientId && data.configured) {
            setGoogleClientId(data.clientId);
            setStoredGoogleClientId(data.clientId);
          } else {
            setGoogleClientId('');
            setStoredGoogleClientId('');
          }
        })
        .catch(() => {});
    }
  }, [initialMode, initialMethod, isOpen]);

  // Resend countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  /**
   * Verify and process user by email address
   */
  const handleVerifyEmail = async (emailInput: string, optionalName?: string) => {
    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setIsVerifyingGoogle(false);
      setAuthError('Please enter a valid email address.');
      return;
    }

    // Strict Authorization Whitelist Check (checks local + live server database)
    const isAuth = await verifyEmailAuthorization(cleanEmail);
    if (!isAuth) {
      setIsVerifyingGoogle(false);
      setAuthError(
        `Access Denied: "${cleanEmail}" is not authorized to access the B/Stack Dashboard. Access is restricted to designated administrator email addresses only.`
      );
      audioManager.playAlert();
      return;
    }

    setIsVerifyingGoogle(true);
    setAuthError('');

    try {
      await fetch('/api/auth/google-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      }).catch(() => {});

      let memberUser: User;
      if (cleanEmail === 'ziyadparkar.official@gmail.com') {
        memberUser = {
          ...ZIYAD_PARKAR,
          email: cleanEmail,
          authProvider: 'google',
          isAdmin: true,
          role: 'Lead',
        };
      } else if (cleanEmail === 'aishik.roy1234@gmail.com') {
        memberUser = {
          ...AISHIK_ROY,
          email: cleanEmail,
          authProvider: 'google',
          isAdmin: true,
          role: 'Lead',
        };
      } else if (cleanEmail === 'propriyansh71@gmail.com') {
        memberUser = {
          ...PRIYANSH_SINGH,
          email: cleanEmail,
          authProvider: 'google',
          isAdmin: true,
          role: 'Lead',
        };
      } else {
        memberUser = {
          id: `usr-google-${Date.now()}`,
          name: optionalName || cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          handle: `@${cleanEmail.split('@')[0].replace(/[^a-z0-9_]/g, '')}`,
          email: cleanEmail,
          role: 'Lead',
          isAdmin: true,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}&backgroundColor=0f172a`,
          vertical: 'balgo',
          year: 'Guild Administrator',
          github: `https://github.com/${cleanEmail.split('@')[0]}`,
          bio: 'Authorized Tech Club Administrator at Bosscoder School of Technology.',
          xp: 7200,
          streakWeeks: 24,
          attendanceRate: 100,
          projectsCount: 8,
          badges: ['Tech Club Lead', 'Google Verified', 'Dashboard Authorized'],
          joinedDate: 'October 2026',
          authProvider: 'google',
        };
      }

      saveSessionUser(memberUser);
      setIsVerifyingGoogle(false);
      setAuthSuccess(`Welcome, ${memberUser.name}! Logging in to B/Stack Dashboard...`);
      audioManager.playSuccess();
      setTimeout(() => {
        onLoginSuccess(memberUser);
      }, 350);
    } catch {
      setIsVerifyingGoogle(false);
      setAuthError('Failed to initialize session. Please retry.');
    }
  };


  /**
   * Handle Google OAuth: Redirect to Google Account Chooser with prompt=select_account
   */
  const handleLaunchGoogleSignIn = async () => {
    audioManager.playClick();
    setAuthError('');
    setAuthSuccess('');

    const activeClientId = googleClientId || getStoredGoogleClientId();

    if (activeClientId && activeClientId.includes('.apps.googleusercontent.com')) {
      setIsVerifyingGoogle(true);
      try {
        const result = await launchRealGoogleOAuthPopup(activeClientId);
        if (result.success && result.profile) {
          await verifyEmailAuthorization(result.profile.email);
          const processed = processGoogleUserProfile(result.profile);
          if (processed.success && processed.user) {
            saveSessionUser(processed.user);
            setIsVerifyingGoogle(false);
            setAuthSuccess(`Welcome, ${processed.user.name}! Redirecting to Tech Club portal...`);
            audioManager.playSuccess();
            setTimeout(() => {
              onLoginSuccess(processed.user!);
            }, 350);
            return;
          } else {
            setIsVerifyingGoogle(false);
            setAuthError(
              processed.error ||
              `Access Denied: "${result.profile.email}" is not authorized to access the B/Stack Dashboard.`
            );
            audioManager.playAlert();
            return;
          }
        }

        if (result.isClosedByUser) {
          setIsVerifyingGoogle(false);
          return;
        }

        if (result.error) {
          // Fallback to full page OAuth redirect
          sessionStorage.setItem('bstack_google_oauth_in_progress', 'true');
          const googleAuthUrl = buildGoogleAuthUrl(activeClientId, window.location.origin);
          window.location.href = googleAuthUrl;
          return;
        }
      } catch {
        sessionStorage.setItem('bstack_google_oauth_in_progress', 'true');
        const googleAuthUrl = buildGoogleAuthUrl(activeClientId, window.location.origin);
        window.location.href = googleAuthUrl;
        return;
      }
    }

    // 3. Fallback when live OAuth client ID is not configured
    setAuthError('To access the dashboard, please sign in with your authorized Google Account.');
  };


  // Send Phone OTP via server Message Central Verify Now API with strict whitelist enforcement
  const handleSendPhoneOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    // Normalize phone number: extract last 10 digits cleanly
    let cleanNumber = phoneNumber.replace(/\D/g, '');
    if (cleanNumber.length >= 10) {
      cleanNumber = cleanNumber.slice(-10);
    }

    if (cleanNumber.length < 10) {
      setAuthError('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Strict authorized phone numbers whitelist for OTP
    const AUTHORIZED_OTP_NUMBERS = ['7219244426', '6260083535', '9257203509'];
    if (!AUTHORIZED_OTP_NUMBERS.includes(cleanNumber)) {
      setAuthError('Access Denied: This mobile number is not authorized for Tech Club login.');
      audioManager.playAlert();
      return;
    }

    setIsLoading(true);
    audioManager.playClick();

    const fullNumber = `+${countryCode}${cleanNumber}`;
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: fullNumber,
          countryCode,
          mobileNumber: cleanNumber,
        }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {}

      if (res.ok && data?.success) {
        setOtpStep('input-otp');
        setResendTimer(60);
        setOtpCode(''); // Never auto-fill: wait for the code received via SMS on user's mobile
        setAuthSuccess(data.message || `SMS verification code dispatched to ${fullNumber}! Check your phone.`);
        audioManager.playSuccess();
      } else {
        setAuthError(data?.error || 'Failed to dispatch SMS code. Please wait a moment and retry.');
        audioManager.playAlert();
      }
    } catch (err: any) {
      console.error('OTP send network error:', err);
      setAuthError('Network error: Could not reach verification server. Please check your connection and retry.');
      audioManager.playAlert();
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP and Authenticate User
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    let cleanNumber = phoneNumber.replace(/\D/g, '');
    if (cleanNumber.length >= 10) {
      cleanNumber = cleanNumber.slice(-10);
    }
    const fullNumber = `+${countryCode}${cleanNumber}`;
    const cleanOtp = otpCode.trim();

    if (cleanOtp.length < 4) {
      setAuthError('Please enter the 6-digit verification code received on your mobile.');
      return;
    }

    setIsLoading(true);
    audioManager.playClick();

    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: fullNumber,
          code: cleanOtp,
        }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {}

      if (res.ok && (data?.verified || data?.success)) {
        const result = authenticateWithPhoneNumber({
          phoneNumber: fullNumber,
          name: name.trim() || undefined,
          vertical: selectedVertical,
        });

        if (result.success && result.user) {
          setIsLoading(false);
          audioManager.playSuccess();
          onLoginSuccess(result.user);
          return;
        } else {
          setAuthError(result.error || 'Could not initialize session.');
        }
      } else {
        setAuthError(data?.error || 'Incorrect verification code. Please check the SMS on your mobile phone.');
        audioManager.playAlert();
      }
    } catch {
      setAuthError('Verification network error. Please retry.');
      audioManager.playAlert();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Modal Card */}
      <div className="relative w-full max-w-md bg-[#0c1017] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 text-left overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Top Bar: Sign In/Sign Up Pills & Close Button */}
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex p-1 rounded-full bg-[#121622] border border-white/5 text-xs">
            <button
              type="button"
              onClick={() => {
                audioManager.playClick();
                setMode('signin');
                setAuthError('');
                setAuthSuccess('');
                setOtpStep('input-phone');
              }}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Heading */}
        <div className="mt-4 mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Sign In to B/Stack
          </h2>
          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
            Role-based authentication: Access is strictly limited to authorized accounts.
          </p>
        </div>

        {/* TWO METHOD TABS ONLY: Google OAuth & Phone OTP */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              setAuthMethod('google');
              setAuthError('');
              setAuthSuccess('');
            }}
            className={`py-2.5 px-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-medium transition-all cursor-pointer ${
              authMethod === 'google'
                ? 'bg-[#181f2c] border border-cyan-500/50 text-white shadow-sm ring-1 ring-cyan-500/30'
                : 'bg-[#10141d] border border-white/5 text-neutral-400 hover:text-neutral-200 hover:border-white/10'
            }`}
          >
            <GoogleLogo className="w-4 h-4 shrink-0" />
            <span className="font-semibold">Sign in with Google</span>
          </button>

          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              setAuthMethod('phone');
              setAuthError('');
              setAuthSuccess('');
            }}
            className={`py-2.5 px-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-medium transition-all cursor-pointer ${
              authMethod === 'phone'
                ? 'bg-[#181f2c] border border-cyan-500/50 text-white shadow-sm ring-1 ring-cyan-500/30'
                : 'bg-[#10141d] border border-white/5 text-neutral-400 hover:text-neutral-200 hover:border-white/10'
            }`}
          >
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span className="font-semibold">Phone OTP</span>
          </button>
        </div>

        {/* Error Notice */}
        {authError && (
          <div className="mb-4 text-xs text-rose-300 bg-rose-950/60 p-3.5 rounded-2xl border border-rose-600/70 flex items-start gap-2.5 animate-in fade-in shadow-lg">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed font-semibold">{authError}</div>
          </div>
        )}

        {/* Success Notice */}
        {authSuccess && (
          <div className="mb-4 text-xs text-emerald-300 bg-emerald-950/60 p-3 rounded-2xl border border-emerald-600/60 flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed font-medium">{authSuccess}</div>
          </div>
        )}

        {/* ======================================================== */}
        {/* METHOD 1: GOOGLE OAUTH & CLIENT KEY INPUT */}
        {/* ======================================================== */}
        {authMethod === 'google' && (
          <div className="py-1 animate-in fade-in space-y-4">
            {/* Live Google Button */}
            <div>
              <button
                type="button"
                onClick={handleLaunchGoogleSignIn}
                disabled={isVerifyingGoogle}
                className="w-full py-3.5 rounded-2xl bg-white hover:bg-neutral-100 active:scale-[0.99] text-neutral-950 font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl transition-all cursor-pointer"
              >
                <GoogleLogo className="w-5 h-5 shrink-0" />
                <span>{isVerifyingGoogle ? 'Connecting to Google...' : 'Sign in with Google OAuth'}</span>
                <ExternalLink className="w-4 h-4 text-neutral-950 shrink-0 ml-1" />
              </button>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* METHOD 2: PHONE & OTP AUTHENTICATION */}
        {/* ======================================================== */}
        {authMethod === 'phone' && (
          <div className="space-y-4 animate-in fade-in">
            {otpStep === 'input-phone' ? (
              <form onSubmit={handleSendPhoneOtp} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-medium text-neutral-300">
                      Mobile number
                    </label>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="relative">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="appearance-none bg-[#070a11] text-white border border-white/10 rounded-xl pl-3 pr-7 py-3 text-xs font-mono focus:border-cyan-400 focus:outline-none cursor-pointer"
                      >
                        <option value="91">IN +91</option>
                        <option value="1">US +1</option>
                        <option value="44">UK +44</option>
                        <option value="65">SG +65</option>
                        <option value="971">AE +971</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-neutral-400 text-[10px]">
                        ▼
                      </div>
                    </div>

                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        if (authError) setAuthError('');
                      }}
                      placeholder="98765 43210"
                      required
                      autoFocus
                      className="flex-1 px-4 py-3 rounded-xl bg-[#070a11] border border-white/10 text-white text-sm font-mono placeholder:text-neutral-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">
                    A 6-digit verification code will be sent to your mobile phone via SMS.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-full bg-white hover:bg-neutral-100 active:scale-[0.99] text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer mt-2"
                >
                  <span>{isLoading ? 'DISPATCHING SMS...' : 'SEND VERIFICATION OTP'}</span>
                  <ArrowRight className="w-4 h-4 text-neutral-950" />
                </button>

              </form>
            ) : (
              /* OTP Step 2: Enter Verification Code */
              <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in">
                <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-neutral-300">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-cyan-300">Enter Verification Code</span>
                    <button
                      type="button"
                      onClick={() => setOtpStep('input-phone')}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      Change number
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    SMS code dispatched to <span className="text-white font-mono">+{countryCode} {phoneNumber}</span>. Check your mobile messages and enter the 6-digit code below.
                  </p>
                </div>

                <div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    required
                    autoFocus
                    className="w-full py-3 text-center rounded-xl bg-[#070a11] border border-white/15 text-white text-xl tracking-[0.5em] font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-full bg-white hover:bg-neutral-100 active:scale-[0.99] text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <span>{isLoading ? 'VERIFYING...' : 'VERIFY & ACCESS GUILD'}</span>
                  <ArrowRight className="w-4 h-4 text-neutral-950" />
                </button>

                <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                  <button
                    type="button"
                    disabled={resendTimer > 0}
                    onClick={() => handleSendPhoneOtp()}
                    className="hover:text-white disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend OTP SMS'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOtpStep('input-phone')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Edit Phone Number
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>,
    document.body
  );
};
