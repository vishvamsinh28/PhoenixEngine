'use client';

import { useEffect, useState } from 'react';
import AuthPanel from '@/components/AuthPanel';
import LandingPage from '@/components/LandingPage';
import PhoenixWorkspace from '@/components/workspace/PhoenixWorkspace';

export default function Home() {
    const [user, setUser] = useState(undefined);
    const [showAuth, setShowAuth] = useState(false);

    useEffect(() => {
        fetch('/api/auth/session')
            .then((response) => response.json())
            .then((payload) => setUser(payload.user || null))
            .catch(() => setUser(null));
    }, []);

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
    };

    if (user === undefined) {
        return <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(130deg,#0b1421,#0c2230)] text-sm text-[#95a4bf]">Loading Phoenix Engine...</div>;
    }

    if (!user) {
        if (showAuth) {
            return <AuthPanel onAuthenticated={setUser} onBack={() => setShowAuth(false)}/>;
        }

        return <LandingPage onGetStarted={() => setShowAuth(true)}/>;
    }

    return <PhoenixWorkspace user={user} onLogout={logout}/>;
}
