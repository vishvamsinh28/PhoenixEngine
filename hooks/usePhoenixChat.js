'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { projects as initialProjects, emptyMessagesByProject } from '@/data/engineData';
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
    const [messages, setMessages] = useState(emptyMessagesByProject);
    const [isStreaming, setIsStreaming] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const streamIntervalRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        fetch('/api/conversations')
            .then(async (response) => {
                const payload = await response.json();
                if (!response.ok)
                    throw new Error(payload.error || 'Unable to load saved conversations.');
                return payload;
            })
            .then((payload) => {
                if (!isMounted)
                    return;
                setProjects(payload.projects || initialProjects);
                setMessages(payload.messagesByProject || emptyMessagesByProject);
                setIsLoading(false);
            })
            .catch((failure) => {
                if (isMounted) {
                    setError(failure.message);
                    setIsLoading(false);
                }
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

    const sendMessage = async (text) => {
        if (isStreaming || !activeProject)
            return;

        const projectId = activeProject.id;
        const userMessage = { id: `user-${Date.now()}`, sender: 'user', message: text };
        const assistantMessageId = `assistant-pending-${Date.now()}`;

        setIsStreaming(true);
        setError('');
        setMessages((previous) => ({
            ...previous,
            [projectId]: [...(previous[projectId] || []), userMessage, { id: assistantMessageId, sender: 'assistant', message: '' }],
        }));

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, message: text }),
            });
            const payload = await response.json();

            if (!response.ok)
                throw new Error(payload.error || 'Analysis request failed.');

            await streamAssistantMessage(projectId, assistantMessageId, payload.message.message);
        }
        catch (failure) {
            setMessages((previous) => ({
                ...previous,
                [projectId]: (previous[projectId] || []).filter((message) => message.id !== userMessage.id && message.id !== assistantMessageId),
            }));
            setError(failure.message || 'Analysis request failed.');
        }
        finally {
            setIsStreaming(false);
        }
    };

    return {
        activeProject,
        activeProjectId,
        currentMessages,
        error,
        isLoading,
        isStreaming,
        projectList,
        sendMessage,
        setActiveProjectId,
        setSidebarOpen,
        sidebarOpen,
    };
}
