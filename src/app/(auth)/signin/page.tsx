'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Bookmark, PlayCircle, FileText, Bell, CheckSquare } from 'lucide-react';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';

// ─── Schemas ──────────────────────────────────────────

const emailSchema = z.object({
  email: z.email('Please enter a valid email address'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'Must be 6 digits').regex(/^\d+$/, 'Digits only'),
});

type Step = 'email' | 'otp';

// ─── Feature list ─────────────────────────────────────

const FEATURES = [
  { icon: Bookmark,     label: 'Bookmarks',  desc: 'Save and revisit any link instantly' },
  { icon: PlayCircle,   label: 'Videos',     desc: 'Track your YouTube learning progress' },
  { icon: FileText,     label: 'Notes',      desc: 'Write rich notes with a full editor' },
  { icon: CheckSquare,  label: 'Todos',      desc: 'Manage tasks with priority levels' },
  { icon: Bell,         label: 'Reminders',  desc: 'Get email alerts for saved resources' },
];

// ─── Page ─────────────────────────────────────────────

export default function SignInPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const onSendOtp = async (values: z.infer<typeof emailSchema>) => {
    try {
      await authApi.sendOtp(values.email);
      setEmail(values.email);
      setStep('otp');
      toast.success('Verification code sent');
    } catch {
      toast.error('Failed to send code. Try again.');
    }
  };

  const onVerifyOtp = async (values: z.infer<typeof otpSchema>) => {
    try {
      const res = await authApi.verifyOtp(email, values.otp);
      setUser(res.data.data.user);
      toast.success('Signed in successfully');
      router.push('/dashboard');
    } catch {
      toast.error('Invalid or expired code.');
      otpForm.setError('otp', { message: 'Invalid or expired code' });
    }
  };

  const handleResend = async () => {
    try {
      await authApi.sendOtp(email);
      toast.success('New code sent');
    } catch {
      toast.error('Failed to resend.');
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-white">

      {/* ── Left panel ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 bg-slate-50 border-r border-slate-200 relative overflow-hidden">

        {/* Dot grid background */}
        <div className="absolute inset-0 dot-grid opacity-60" />

        {/* Fade out bottom of grid */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-slate-50 to-transparent" />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold text-base shadow-sm">
            B
          </div>
          <span className="font-semibold text-slate-900 text-base tracking-tight">BMS</span>
        </div>

        {/* Headline + features */}
        <div className="relative space-y-8">
          <div className="space-y-3">
            <h1 className="text-[2.25rem] font-bold text-slate-900 leading-tight tracking-tight">
              Everything you save,
              <br />
              <span className="text-indigo-600">organized.</span>
            </h1>
            <p className="text-slate-500 text-base leading-relaxed max-w-xs">
              One place for your bookmarks, videos, notes, todos, and reminders.
            </p>
          </div>

          <div className="space-y-3.5">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="mt-0.5 flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 shrink-0">
                  <Icon className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <div className="leading-snug">
                  <span className="text-slate-800 text-sm font-medium">{label}</span>
                  <span className="text-slate-400 text-sm"> — {desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative text-slate-400 text-xs">
          &copy; {new Date().getFullYear()} BMS
        </p>
      </div>

      {/* ── Right panel — form ─────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-[360px] space-y-7">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm">
              B
            </div>
            <span className="font-semibold text-slate-900 tracking-tight">BMS</span>
          </div>

          {/* ── Email step ── */}
          {step === 'email' && (
            <>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sign in</h2>
                <p className="text-sm text-slate-500">
                  Enter your email to receive a verification code
                </p>
              </div>

              <form onSubmit={emailForm.handleSubmit(onSendOtp)} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    autoFocus
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    {...emailForm.register('email')}
                  />
                  {emailForm.formState.errors.email && (
                    <p className="text-xs text-red-500">{emailForm.formState.errors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={emailForm.formState.isSubmitting}
                  className="w-full h-10 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {emailForm.formState.isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Send verification code
                </button>
              </form>

              <p className="text-center text-xs text-slate-400">
                No account? One is created automatically on first sign in.
              </p>
            </>
          )}

          {/* ── OTP step ── */}
          {step === 'otp' && (
            <>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Check your inbox
                </h2>
                <p className="text-sm text-slate-500">
                  Code sent to{' '}
                  <span className="font-medium text-slate-700">{email}</span>
                </p>
              </div>

              <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="otp" className="text-sm font-medium text-slate-700">
                    Verification code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    placeholder="000000"
                    maxLength={6}
                    autoComplete="one-time-code"
                    autoFocus
                    className="w-full h-14 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-300 text-3xl font-bold font-mono tracking-[0.4em] text-center outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    {...otpForm.register('otp')}
                  />
                  {otpForm.formState.errors.otp && (
                    <p className="text-xs text-red-500 text-center">
                      {otpForm.formState.errors.otp.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={otpForm.formState.isSubmitting}
                  className="w-full h-10 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {otpForm.formState.isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Verify &amp; sign in
                </button>
              </form>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => { setStep('email'); otpForm.reset(); }}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Change email
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-slate-400 hover:text-slate-700 transition-colors"
                >
                  Resend code
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
