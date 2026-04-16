import { LayoutDashboard, TrendingUp, FileText, MessageCircle, Volume2, ThumbsUp, ThumbsDown, Zap, RotateCcw } from 'lucide-react';

export const NAV_TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'transcript', label: 'Transcript', icon: FileText },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
];

export const MESSAGE_ACTIONS = [
    { icon: Volume2, title: 'Read aloud' },
    { icon: ThumbsUp, title: 'Helpful' },
    { icon: ThumbsDown, title: 'Not helpful' },
    { icon: Zap, title: 'Quick action' },
    { icon: RotateCcw, title: 'Regenerate' },
];
