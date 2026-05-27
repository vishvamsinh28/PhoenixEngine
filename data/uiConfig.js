import { LayoutDashboard, Layers3, Database, MessageCircle, Download, ThumbsUp, ThumbsDown, Zap, RotateCcw } from 'lucide-react';

export const NAV_TABS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'models', label: 'Models', icon: Layers3 },
    { id: 'datasets', label: 'Datasets', icon: Database },
    { id: 'copilot', label: 'Copilot', icon: MessageCircle },
];

export const MESSAGE_ACTIONS = [
    { icon: Download, title: 'Export result' },
    { icon: ThumbsUp, title: 'Accept estimate' },
    { icon: ThumbsDown, title: 'Flag result' },
    { icon: Zap, title: 'Launch sweep' },
    { icon: RotateCcw, title: 'Re-run' },
];
