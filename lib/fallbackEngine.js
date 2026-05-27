export function generateFallbackAnswer({ project, message, attachments = [] }) {
    const assetNote = attachments.length
        ? `\n\n**Input assets queued**\n${attachments.join(', ')} can be incorporated once file parsing and solver ingestion are enabled.`
        : '';

    return `**Preliminary ${project.discipline.toLowerCase()} assessment**\n\nI can frame a fast screening study for **${project.name}**, but live model generation is not configured in this environment. Your request was: "${message}".\n\n**Proposed model setup**\n- Define geometry, material properties, loads, and boundary conditions.\n- Establish a baseline around the current run marker: ${project.metric}.\n- Run a sensitivity sweep on the two or three parameters most likely to move the response.\n\n**Validation gate**\nTreat this as study planning until Phoenix Engine is connected to Gemini and the result is compared against solver or experimental evidence.${assetNote}`;
}
