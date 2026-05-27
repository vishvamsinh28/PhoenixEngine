export const STREAM_STEP_MS = 18;

export const formatPreview = (text) => text.length > 42 ? `${text.slice(0, 39)}...` : text;

export const toPlainTextPreview = (text) => formatPreview(text
    .replace(/```[\s\S]*?```/g, ' code ')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~`>|]/g, '')
    .replace(/\$+/g, '')
    .replace(/[\\{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim());
