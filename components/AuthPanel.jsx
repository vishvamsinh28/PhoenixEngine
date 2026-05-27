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

    return (<main className="flex min-h-screen items-center justify-center bg-[#061117] p-5">
      <section className="w-full max-w-md rounded-[24px] border border-[#172f3b] bg-[#091820] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:p-9">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-[#142d38] text-[#25c0ee]">
            <Hexagon className="h-8 w-8"/>
            <Cpu className="absolute h-4 w-4"/>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Phoenix Engine</h1>
            <p className="text-xs text-[#78929e]">Physics-informed analysis workspace</p>
          </div>
        </div>
        <h2 className="mt-9 text-2xl font-semibold tracking-[-0.03em] text-white">{mode === 'login' ? 'Sign in' : 'Create account'}</h2>
        <p className="mt-2 text-sm text-[#8199a5]">Your engineering conversations are stored securely in your account.</p>
        <form className="mt-7 space-y-4" onSubmit={submit}>
          {mode === 'register' && (<label className="block text-sm text-[#aabdc5]">
              Name
              <input required minLength={2} name="name" value={form.name} onChange={updateField} className="mt-2 block w-full rounded-xl border border-[#1b3542] bg-[#0c1d26] px-4 py-3 text-white outline-none focus:border-[#25bbe9]"/>
            </label>)}
          <label className="block text-sm text-[#aabdc5]">
            Email
            <input required type="email" name="email" value={form.email} onChange={updateField} className="mt-2 block w-full rounded-xl border border-[#1b3542] bg-[#0c1d26] px-4 py-3 text-white outline-none focus:border-[#25bbe9]"/>
          </label>
          <label className="block text-sm text-[#aabdc5]">
            Password
            <input required minLength={8} type="password" name="password" value={form.password} onChange={updateField} className="mt-2 block w-full rounded-xl border border-[#1b3542] bg-[#0c1d26] px-4 py-3 text-white outline-none focus:border-[#25bbe9]"/>
          </label>
          {error && <p className="rounded-xl border border-[#63343a] bg-[#27171b] p-3 text-sm text-[#f1a4a8]">{error}</p>}
          <button disabled={busy} className="w-full rounded-xl bg-[#19b5e8] px-4 py-3 font-medium text-[#03141d] transition-colors hover:bg-[#43c5ef] disabled:cursor-wait disabled:opacity-70">
            {busy ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
        <button type="button" onClick={switchMode} className="mt-5 w-full text-sm text-[#52caf1] hover:text-[#81dcf8]">
          {mode === 'login' ? 'Create a new account' : 'Already have an account? Sign in'}
        </button>
      </section>
    </main>);
}
