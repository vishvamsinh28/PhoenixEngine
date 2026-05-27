'use client';

import { useState } from 'react';
import { ArrowLeft, Cpu, Eye, EyeOff, Hexagon } from 'lucide-react';

export default function AuthPanel({ onAuthenticated, onBack }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const updateField = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    setBusy(true);
    setError('');

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Authentication failed.');
      }

      onAuthenticated(payload.user);
    }
    catch (failure) {
      setError(failure.message);
    }
    finally {
      setBusy(false);
    }
  };

  const switchMode = () => {
    setMode((previous) =>
      previous === 'login' ? 'register' : 'login'
    );

    setError('');
  };

  const inputStyles =
    'mt-2 block w-full rounded-xl border border-[#2b3b55] bg-[#1a2436] px-4 py-3 text-[#e0e8f5] placeholder:text-[#6f819d] shadow-[inset_0_1px_3px_rgba(0,0,0,0.18)] outline-none transition duration-200 focus:border-[#4e7eeb] focus:bg-[#223249] focus:ring-4 focus:ring-[#4e7eeb]/20';
  const passwordInputStyles =
    `${inputStyles} pr-12`;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_78%_16%,rgba(48,98,185,0.24),transparent_34%),radial-gradient(circle_at_12%_85%,rgba(70,54,133,0.20),transparent_32%),linear-gradient(132deg,#0b1421,#101a2b_52%,#0b2230)] p-5">
      <section className="w-full max-w-md rounded-[28px] border border-white/5 bg-[#151f32]/72 p-7 shadow-[0_28px_78px_rgba(0,0,0,0.36)] backdrop-blur-xl md:p-9">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#91a8c8] transition hover:text-[#c9dcf8]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to overview
          </button>
        )}

        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#376df2,#65c6ff)] text-white shadow-[0_10px_24px_rgba(55,109,242,0.24)]">
            <Hexagon className="h-8 w-8" />
            <Cpu className="absolute h-4 w-4" />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-[#edf3fb]">
              Phoenix Engine
            </h1>
            <a
              href="https://www.linkedin.com/in/vishvamsinh-vaghela-591695217/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#8698b4] transition hover:text-[#9dc5ff]"
            >
              Created by Vishvamsinh Vaghela
            </a>
          </div>
        </div>

        <h2 className="mt-9 text-2xl font-semibold tracking-[-0.03em] text-[#eef3fb]">
          {mode === 'login' ? 'Sign in' : 'Create account'}
        </h2>

        <p className="mt-2 text-sm text-[#97a7bf]">
          Your engineering conversations are stored securely in your account.
        </p>

        <form className="mt-7 space-y-4" onSubmit={submit}>

          {mode === 'register' && (
            <label className="block text-sm text-[#b1bfd3]">
              Name

              <input
                required
                minLength={2}
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="Enter your name"
                className={inputStyles}
              />
            </label>
          )}

          <label className="block text-sm text-[#b1bfd3]">
            Email

            <input
              required
              type="email"
              name="email"
              value={form.email}
              onChange={updateField}
              placeholder="Enter your email"
              className={inputStyles}
            />
          </label>

          <label className="block text-sm text-[#b1bfd3]">
            Password

            <div className="relative">
              <input
                required
                minLength={8}
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={updateField}
                placeholder="Enter your password"
                className={passwordInputStyles}
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#8fa1bb] transition hover:bg-[#263850] hover:text-[#dce8f8] focus:outline-none focus:ring-2 focus:ring-[#4e7eeb]/60"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </label>

          {error && (
            <p className="rounded-xl border border-[#5c2c3d] bg-[#38202d]/90 p-3 text-sm text-[#f2a5b7] shadow-sm">
              {error}
            </p>
          )}

          <button
            disabled={busy}
            className="w-full rounded-xl bg-[linear-gradient(135deg,#3f6df2,#56baff)] px-4 py-3 font-medium text-white shadow-[0_12px_25px_rgba(63,109,242,0.22)] transition duration-200 hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
          >
            {busy
              ? 'Please wait...'
              : mode === 'login'
                ? 'Sign in'
                : 'Create account'}
          </button>
        </form>

        <button
          type="button"
          onClick={switchMode}
          className="mt-5 w-full text-sm text-[#78aaff] transition hover:text-[#9dc5ff]"
        >
          {mode === 'login'
            ? 'Create a new account'
            : 'Already have an account? Sign in'}
        </button>
      </section>
    </main>
  );
}
