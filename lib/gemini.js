const SYSTEM_PROMPT = `You are Phoenix Engine, a physics-informed engineering copilot for hardware R&D teams.
Answer as an engineering simulation analyst. Provide concise, quantitative reasoning where the supplied inputs permit it.
Structure answers with a short result, key assumptions, influential parameters, and recommended validation step.
Never pretend a language-model estimate is a validated CFD, FEA, process, or laboratory result.
If essential geometry, materials, loads, boundary conditions, or data are missing, say what is required and provide only a preliminary screening assessment.
Do not introduce yourself, restate your capabilities, or end with generic offers to help.
Use concise Markdown headings, lists and tables when useful. Use LaTeX delimiters for engineering equations.`;

function toGeminiHistory(messages) {
    return messages.slice(-10).map((message) => ({
        role: message.sender === 'assistant' ? 'model' : 'user',
        parts: [{ text: message.message }],
    }));
}

export async function generateEngineeringAnswer({ project, messages }) {
    const apiKey = process.env.GEMINI_API;
    const model = process.env.GEMINI_MODEL;

    if (!apiKey || !model) {
        return null;
    }

    const latestQuestion = messages[messages.length - 1]?.message || '';
    const scopedQuestion = `Analysis domain: ${project.name} (${project.discipline}). Scope: ${project.context}.\n\nEngineering request: ${latestQuestion}`;
    const history = toGeminiHistory(messages.slice(0, -1));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [...history, { role: 'user', parts: [{ text: scopedQuestion }] }],
            generationConfig: {
                temperature: 0.35,
                maxOutputTokens: 900,
            },
        }),
    });

    if (!response.ok) {
        const failure = await response.json().catch(() => ({}));
        throw new Error(failure.error?.message || 'Gemini could not complete this simulation request.');
    }

    const payload = await response.json();
    const answer = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim();

    if (!answer) {
        throw new Error('Gemini returned an empty engineering response.');
    }

    return answer;
}
