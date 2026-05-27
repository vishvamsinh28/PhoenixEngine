'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { projects as initialProjects, messagesByProject as initialMessages } from '@/data/engineData';
import { STREAM_STEP_MS, formatPreview } from '@/lib/chatUtils';

function updateMessage(messages, projectId, messageId, update) {
    return {
        ...messages,
        [projectId]: (messages[projectId] || []).map((message) => message.id === messageId
            ? { ...message, ...update }
            : message),
    };
}

export function usePhoenixChat() {
    const [activeProjectId, setActiveProjectId] = useState(initialProjects[0]?.id ?? '');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [projects, setProjects] = useState(initialProjects);
    const [messages, setMessages] = useState(initialMessages);
    const [isStreaming, setIsStreaming] = useState(false);
    const [runtime, setRuntime] = useState('Connecting');
    const streamIntervalRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        fetch('/api/conversations')
            .then((response) => response.json())
            .then((payload) => {
                if (!isMounted)
                    return;
                setProjects(payload.projects || initialProjects);
                setMessages(payload.messagesByProject || initialMessages);
                setRuntime(payload.persistence === 'mongodb' ? 'MongoDB connected' : 'Demo dataset');
            })
            .catch(() => {
                if (isMounted)
                    setRuntime('Demo dataset');
            });

        return () => {
            isMounted = false;
            if (streamIntervalRef.current)
                window.clearInterval(streamIntervalRef.current);
        };
    }, []);

    const projectList = useMemo(() => projects.map((project) => {
        const projectMessages = messages[project.id] || [];
        const lastMessage = projectMessages[projectMessages.length - 1];
        return {
            ...project,
            lastMessagePreview: lastMessage ? formatPreview(lastMessage.message.replace(/\*\*/g, '')) : 'Start an engineering analysis',
        };
    }), [messages, projects]);

    const activeProject = projectList.find((project) => project.id === activeProjectId) ?? projectList[0];
    const currentMessages = messages[activeProjectId] || [];

    const streamAssistantMessage = (projectId, assistantMessageId, answer) => new Promise((resolve) => {
        const chunks = answer.split(/(\s+)/);
        let index = 0;
        streamIntervalRef.current = window.setInterval(() => {
            index = Math.min(index + 3, chunks.length);
            setMessages((previous) => updateMessage(previous, projectId, assistantMessageId, {
                message: chunks.slice(0, index).join(''),
            }));
            if (index >= chunks.length) {
                window.clearInterval(streamIntervalRef.current);
                streamIntervalRef.current = null;
                resolve();
            }
        }, STREAM_STEP_MS);
    });

    const sendMessage = async (text, attachments = []) => {
        if (isStreaming || !activeProject)
            return;

        const projectId = activeProject.id;
        const userMessage = { id: `user-${Date.now()}`, sender: 'user', message: text, attachments };
        const assistantMessageId = `assistant-pending-${Date.now()}`;
        const history = messages[projectId] || [];

        setIsStreaming(true);
        setMessages((previous) => ({
            ...previous,
            [projectId]: [...(previous[projectId] || []), userMessage, { id: assistantMessageId, sender: 'assistant', message: '' }],
        }));

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, message: text, attachments, history }),
            });
            const payload = await response.json();

            if (!response.ok)
                throw new Error(payload.error || 'Analysis request failed.');

            setRuntime(payload.persisted ? `Gemini ${payload.source === 'gemini' ? '+ MongoDB' : '+ MongoDB fallback'}` : payload.source === 'gemini' ? 'Gemini live' : 'Demo dataset');
            await streamAssistantMessage(projectId, assistantMessageId, payload.message.message);
        }
        catch {
            const failure = '**Run unavailable**\n\nThe analysis request could not be completed. Verify the server configuration and try this run again.';
            await streamAssistantMessage(projectId, assistantMessageId, failure);
        }
        finally {
            setIsStreaming(false);
        }
    };

    return {
        activeProject,
        activeProjectId,
        currentMessages,
        isStreaming,
        projectList,
        runtime,
        sendMessage,
        setActiveProjectId,
        setSidebarOpen,
        sidebarOpen,
    };
}
