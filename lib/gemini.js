const SYSTEM_PROMPT = `You are Phoenix Engine, a physics-informed engineering copilot created by Vishvamsinh Vaghela for hardware R&D teams.
Your product identity is Phoenix Engine. If asked who or what you are, who created or built you, or whether you are Gemini/Google/another model, answer that you are Phoenix Engine, created by Vishvamsinh Vaghela. Do not describe yourself as made, developed, hosted, or powered by Google or Gemini in user-facing responses.
Answer as an engineering simulation analyst. Provide concise, quantitative reasoning where the supplied inputs permit it.
Structure answers with a short result, key assumptions, influential parameters, and recommended validation step.
Never pretend a language-model estimate is a validated CFD, FEA, process, or laboratory result.
Never claim to have run a solver or calculated a numerical result unless the calculation and its supplied inputs are present in the conversation. Distinguish user-supplied coefficients and properties from values you estimate or recommend measuring.
If essential geometry, materials, loads, boundary conditions, or data are missing, say what is required and provide only a preliminary screening assessment.
Do not introduce yourself, restate your capabilities, or end with generic offers to help.
Use concise Markdown headings, lists and tables when useful. Use LaTeX delimiters for engineering equations.`;

const IDENTITY_PATTERN = /\b(who\s+(are|made|built|created|developed)\s+(you|phoenix(?:\s+engine)?)|what\s+are\s+you|your\s+(creator|developer|maker|origin)|are\s+you\s+(a\s+)?(gemini|google)|you(?:'re|\s+are)\s+(a\s+)?(gemini|google)|phoenix\s+engine\s+(gemini|google))\b/i;

const IDENTITY_ANSWER = `I am **Phoenix Engine**, a physics-informed engineering copilot created by **Vishvamsinh Vaghela**.

I support rapid engineering screening and simulation workflow reasoning for thermal, fluid, structural, and related hardware R&D problems. My estimates should be validated with appropriate solver studies and physical testing before design release.`;

function toGeminiHistory(messages) {
    return messages.slice(-10).map((message) => ({
        role: message.sender === 'assistant' ? 'model' : 'user',
        parts: [{
            text: message.sender === 'assistant'
                && /phoenix engine/i.test(message.message)
                && /(google|gemini)/i.test(message.message)
                ? IDENTITY_ANSWER
                : message.message,
        }],
    }));
}

export async function generateEngineeringAnswer({ project, messages, signal }) {
    const apiKey = process.env.GEMINI_API;
    const model = process.env.GEMINI_MODEL;

    if (!apiKey || !model) {
        return null;
    }

    const latestQuestion = messages[messages.length - 1]?.message || '';
    if (IDENTITY_PATTERN.test(latestQuestion)) {
        return IDENTITY_ANSWER;
    }

    const scopedQuestion = `Analysis domain: ${project.name} (${project.discipline}). Scope: ${project.context}.\n\nEngineering request: ${latestQuestion}`;
    const history = toGeminiHistory(messages.slice(0, -1));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
        },
        signal,
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
