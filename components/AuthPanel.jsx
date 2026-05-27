'use client';

import { useState } from 'react';
import { Cpu, Hexagon } from 'lucide-react';

export default function AuthPanel({ onAuthenticated }) {
    const [mode, setMode] = useState('login');
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    const updateField = (event) => {
        setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
    };

    const submit = async (event) => {
        event.preventDefault();
        setBusy(true);
        setError('');

        try {
            const response = await fetch(`/api/auth/${mode}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const payload = await response.json();
            if (!response.ok)
                throw new Error(payload.error || 'Authentication failed.');
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
        setMode((previous) => previous === 'login' ? 'register' : 'login');
        setError('');
    };

    return (<main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_78%_16%,rgba(95,166,255,0.18),transparent_34%),radial-gradient(circle_at_12%_85%,rgba(151,125,255,0.12),transparent_32%),linear-gradient(132deg,#fdfbff,#f4f6ff_52%,#eaf7ff)] p-5">
      <section className="w-full max-w-md rounded-[28px] border border-white/90 bg-white/72 p-7 shadow-[0_26px_76px_rgba(43,61,103,0.12)] backdrop-blur-xl md:p-9">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#376df2,#65c6ff)] text-white shadow-[0_10px_24px_rgba(55,109,242,0.24)]">
            <Hexagon className="h-8 w-8"/>
            <Cpu className="absolute h-4 w-4"/>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#172743]">Phoenix Engine</h1>
            <p className="text-xs text-[#7787a4]">Created by Vishvamsinh Vaghela</p>
          </div>
        </div>
        <h2 className="mt-9 text-2xl font-semibold tracking-[-0.03em] text-[#182743]">{mode === 'login' ? 'Sign in' : 'Create account'}</h2>
        <p className="mt-2 text-sm text-[#7383a0]">Your engineering conversations are stored securely in your account.</p>
        <form className="mt-7 space-y-4" onSubmit={submit}>
          {mode === 'register' && (<label className="block text-sm text-[#4f6080]">
              Name
              <input required minLength={2} name="name" value={form.name} onChange={updateField} className="mt-2 block w-full rounded-xl border border-[#dfe6f5] bg-white px-4 py-3 text-[#1f304e] outline-none focus:border-[#86adff] focus:shadow-[0_0_0_3px_rgba(71,117,241,0.10)]"/>
            </label>)}
          <label className="block text-sm text-[#4f6080]">
            Email
            <input required type="email" name="email" value={form.email} onChange={updateField} className="mt-2 block w-full rounded-xl border border-[#dfe6f5] bg-white px-4 py-3 text-[#1f304e] outline-none focus:border-[#86adff] focus:shadow-[0_0_0_3px_rgba(71,117,241,0.10)]"/>
          </label>
          <label className="block text-sm text-[#4f6080]">
            Password
            <input required minLength={8} type="password" name="password" value={form.password} onChange={updateField} className="mt-2 block w-full rounded-xl border border-[#dfe6f5] bg-white px-4 py-3 text-[#1f304e] outline-none focus:border-[#86adff] focus:shadow-[0_0_0_3px_rgba(71,117,241,0.10)]"/>
          </label>
          {error && <p className="rounded-xl border border-[#ffd6dc] bg-[#fff3f5] p-3 text-sm text-[#bd4c60]">{error}</p>}
          <button disabled={busy} className="w-full rounded-xl bg-[linear-gradient(135deg,#3f6df2,#56baff)] px-4 py-3 font-medium text-white shadow-[0_12px_25px_rgba(63,109,242,0.22)] transition hover:brightness-105 disabled:cursor-wait disabled:opacity-70">
            {busy ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
        <button type="button" onClick={switchMode} className="mt-5 w-full text-sm text-[#386df0] hover:text-[#254fc2]">
          {mode === 'login' ? 'Create a new account' : 'Already have an account? Sign in'}
        </button>
      </section>
    </main>);
}
