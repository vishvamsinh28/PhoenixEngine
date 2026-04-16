export const STREAM_START_DELAY_MS = 350;
export const STREAM_STEP_MS = 40;

export const formatPreview = (text) => text.length > 42 ? `${text.slice(0, 39)}...` : text;

export const applyAvatarFallback = (event, name) => {
    const target = event.target;
    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e0e7ff&color=3730a3&size=80`;
};
