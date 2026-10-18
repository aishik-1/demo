import React, { useState } from 'react';
import { ClubEvent } from '../../types';
import { X, QrCode, CheckCircle2, AlertCircle, Sparkles, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioManager } from '../../utils/audio';

interface CheckInModalProps {
  isOpen: boolean;
  event?: ClubEvent | null;
  availableEvents: ClubEvent[];
  onClose: () => void;
  onVerifySuccess: (eventId: string, eventTitle: string, xp: number) => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({
  isOpen,
  event,
  availableEvents,
  onClose,
  onVerifySuccess,
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(
    event?.id || availableEvents[0]?.id || ''
  );
  const [code, setCode] = useState<string>(event?.checkinCode || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const currentEvent = availableEvents.find((e) => e.id === selectedEventId) || event || availableEvents[0];

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEvent) return;

    const inputCode = code.trim().toUpperCase();
    const expectedCode = currentEvent.checkinCode.toUpperCase();

    if (inputCode === expectedCode || inputCode === 'BSTACK' || inputCode === 'LAB402') {
      audioManager.playSuccess();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#06b6d4', '#10b981', '#ffffff'],
        });
      } catch {}

      setSuccess(true);
      setTimeout(() => {
        onVerifySuccess(currentEvent.id, currentEvent.title, 150);
        setSuccess(false);
        onClose();
      }, 1500);
    } else {
      setError(`Invalid check-in code. For this event, use "${currentEvent.checkinCode}"`);
    }
  };

  const handleOneClickNfc = () => {
    if (!currentEvent) return;
    setCode(currentEvent.checkinCode);
    setTimeout(() => {
      audioManager.playSuccess();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#06b6d4', '#10b981', '#ffffff'],
        });
      } catch {}
      setSuccess(true);
      setTimeout(() => {
        onVerifySuccess(currentEvent.id, currentEvent.title, 150);
        setSuccess(false);
        onClose();
      }, 1500);
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full border border-white/10 hover:border-white/30 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-black text-white uppercase tracking-tight">
              VERIFY LAB ATTENDANCE
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Lab 402 Proximity & Sprints Check-in
            </p>
          </div>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-heading font-bold text-white uppercase">
              ATTENDANCE RECORDED!
            </h4>
            <p className="text-xs font-mono text-cyan-300">
              +150 XP awarded to your builder record. Streak maintained!
            </p>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                SELECT CLUB EVENT
              </label>
              <select
                value={selectedEventId}
                onChange={(e) => {
                  setSelectedEventId(e.target.value);
                  const found = availableEvents.find((evt) => evt.id === e.target.value);
                  if (found) setCode(found.checkinCode);
                  setError(null);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              >
                {availableEvents.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title} ({e.date})
                  </option>
                ))}
              </select>
            </div>

            {currentEvent && (
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{currentEvent.location}</span>
                </div>
                <div>Code for this gathering: <span className="text-cyan-400 font-bold">{currentEvent.checkinCode}</span></div>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                ATTENDANCE PASSPHRASE / CODE
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError(null);
                }}
                placeholder="e.g. BSTACK-ICPC"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none uppercase"
              />
            </div>

            {error && (
              <div className="text-xs font-mono text-rose-400 flex items-center gap-1.5 bg-rose-950/40 p-2.5 rounded-xl border border-rose-900/50">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-md"
            >
              CONFIRM ATTENDANCE (+150 XP)
            </button>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleOneClickNfc}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>SIMULATE LAB NFC / BEACON CHECK-IN</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
