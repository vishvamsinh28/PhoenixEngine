export const chats = [
    {
        id: '1',
        name: 'Dr. Emily Chen',
        role: 'Medical Oncologist',
        avatar: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1',
        lastMessagePreview: 'Can you summarize the monitoring plan for...',
    },
    {
        id: '2',
        name: 'Sarah Patel',
        role: 'Clinical Research Associate',
        avatar: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1',
        lastMessagePreview: 'We are seeing slower enrollment at two sit...',
    },
    {
        id: '3',
        name: 'Rajiv Kumar',
        role: 'Pharmacovigilance Specialist',
        avatar: 'https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1',
        lastMessagePreview: 'How should we triage a potential hepatic s...',
    },
    {
        id: '4',
        name: 'Linda Garcia',
        role: 'Medical Science Liaison',
        avatar: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1',
        lastMessagePreview: 'The KOL asked for a concise mechanism-of-a...',
    },
    {
        id: '5',
        name: 'Dr. Sarah Khan',
        role: 'Hematologist',
        avatar: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1',
        lastMessagePreview: 'What are practical counseling points for b...',
    },
    {
        id: '6',
        name: 'Emily Thompson',
        role: 'Regulatory Affairs Manager',
        avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1',
        lastMessagePreview: 'Can you outline the likely review-pathway...',
    },
    {
        id: '7',
        name: 'David Li',
        role: 'Clinical Trials Coordinator',
        avatar: 'https://images.pexels.com/photos/6256/doctor-patient-hospital-health.jpg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1',
        lastMessagePreview: 'What should we standardize before site ini...',
    },
    {
        id: '8',
        name: 'Emma Chen',
        role: 'Oncology Nurse',
        avatar: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1',
        lastMessagePreview: 'What is the best way to explain infusion-d...',
    },
];

export const messagesByChat = {
    '1': [
        {
            id: 'm1',
            sender: 'user',
            message: 'A patient starting second-line therapy is worried about what monitoring happens in the first month. How would you explain it simply?',
        },
        {
            id: 'm2',
            sender: 'assistant',
            message: 'I would frame it as a routine safety check-in period rather than something alarming. In the first month, the team usually focuses on baseline labs, symptom review, tolerance after the first doses, and any early signs that supportive care should be adjusted.',
        },
        {
            id: 'm3',
            sender: 'user',
            message: 'Can you summarize the monitoring plan for the first cycle in patient-friendly language?',
        },
        {
            id: 'm4',
            sender: 'assistant',
            message: 'You can tell the patient that the first cycle is mainly about making sure treatment is both safe and manageable. The care team will usually review blood counts, chemistry labs, hydration status, and how they are feeling between visits.\n\nIf fatigue, nausea, appetite changes, fever, or new pain show up early, those updates help the team decide whether supportive medications, extra labs, or scheduling adjustments are needed.',
        },
    ],
    '2': [
        {
            id: 'm1',
            sender: 'user',
            message: 'We are seeing slower enrollment at two sites. What are the first things you would check?',
        },
        {
            id: 'm2',
            sender: 'assistant',
            message: 'I would start with screen-failure patterns, referral flow, and whether the inclusion criteria are being interpreted too narrowly. It also helps to compare activation timing, staffing, and investigator engagement between high- and low-enrolling sites.',
        },
        {
            id: 'm3',
            sender: 'user',
            message: 'What quick interventions usually make the biggest difference?',
        },
        {
            id: 'm4',
            sender: 'assistant',
            message: 'The fastest wins are usually operational: refresh the prescreening list, tighten follow-up on referrals, and confirm that coordinators have a simple eligibility checklist. A short retraining session can also uncover avoidable drop-off points in screening.',
        },
    ],
    '3': [
        {
            id: 'm1',
            sender: 'user',
            message: 'How should we triage a potential hepatic safety signal that appears in post-market case reports?',
        },
        {
            id: 'm2',
            sender: 'assistant',
            message: 'First, confirm whether the cases are clinically coherent by looking at time to onset, dechallenge or rechallenge information, competing etiologies, and seriousness. That helps determine whether the pattern is suggestive of a true signal or still too nonspecific.',
        },
        {
            id: 'm3',
            sender: 'user',
            message: 'What should happen next if the pattern still looks concerning?',
        },
        {
            id: 'm4',
            sender: 'assistant',
            message: 'If the pattern remains concerning, the next step is usually a structured signal assessment with medical review, case-level reconciliation, and comparison against background risk. From there, teams can decide whether labeling discussion, targeted surveillance, or escalation to governance is appropriate.',
        },
    ],
    '4': [
        {
            id: 'm1',
            sender: 'user',
            message: 'A KOL asked for a concise mechanism-of-action explanation that is scientifically accurate but easy to present. Any suggestion?',
        },
        {
            id: 'm2',
            sender: 'assistant',
            message: 'A good approach is to anchor the explanation around the disease pathway first, then describe where the therapy intervenes. That keeps it focused on clinical relevance instead of sounding like a dense molecular lecture.',
        },
        {
            id: 'm3',
            sender: 'user',
            message: 'Can you make that even shorter for one slide?',
        },
        {
            id: 'm4',
            sender: 'assistant',
            message: 'You could say: the therapy is designed to interrupt a key signaling pathway that cancer cells rely on for survival, with the goal of reducing tumor activity while preserving a manageable safety profile.',
        },
    ],
    '5': [
        {
            id: 'm1',
            sender: 'user',
            message: 'What are practical counseling points for bispecific therapy before the first infusion?',
        },
        {
            id: 'm2',
            sender: 'assistant',
            message: 'Patients usually benefit from a simple explanation of step-up dosing, why observation may be longer at the beginning, and what symptoms should be reported right away. Setting expectations early tends to reduce anxiety and improve adherence to the monitoring plan.',
        },
        {
            id: 'm3',
            sender: 'user',
            message: 'What symptoms do you emphasize the most?',
        },
        {
            id: 'm4',
            sender: 'assistant',
            message: 'I would highlight fever, chills, shortness of breath, confusion, severe fatigue, and any rapid change from baseline. Patients should know that even if symptoms seem mild at first, early reporting makes management easier and safer.',
        },
    ],
    '6': [
        {
            id: 'm1',
            sender: 'user',
            message: 'Can you outline the likely review-pathway differences between a standard filing and an expedited pathway?',
        },
        {
            id: 'm2',
            sender: 'assistant',
            message: 'The major differences are usually timeline compression, review intensity, and the amount of early alignment with the agency. Expedited pathways can create earlier and more frequent regulatory interactions, but they also increase the need for a very disciplined evidence package.',
        },
        {
            id: 'm3',
            sender: 'user',
            message: 'What tends to create the biggest execution risk in accelerated programs?',
        },
        {
            id: 'm4',
            sender: 'assistant',
            message: 'Execution risk usually comes from chemistry-manufacturing readiness, unresolved dataset questions, and cross-functional timing gaps. The program may move faster, but the evidence still has to tell a clean, defensible story.',
        },
    ],
    '7': [
        {
            id: 'm1',
            sender: 'user',
            message: 'We have site initiation visits coming up next week. What should we standardize ahead of time so coordinators are aligned?',
        },
        {
            id: 'm2',
            sender: 'assistant',
            message: 'The biggest win is usually consistency around screening workflow, source documentation expectations, and escalation points for protocol questions. If every site hears the same operational priorities, startup tends to feel much smoother.',
        },
        {
            id: 'm3',
            sender: 'user',
            message: 'What should we standardize before site initiation so we avoid avoidable deviations?',
        },
        {
            id: 'm4',
            sender: 'assistant',
            message: 'I would standardize eligibility review steps, investigational product handling basics, visit-window rules, and how queries get routed back to the study team. A short checklist for coordinators can prevent a lot of early variability across sites.',
        },
    ],
    '8': [
        {
            id: 'm1',
            sender: 'user',
            message: 'What is the best way to explain infusion-day expectations to nervous patients?',
        },
        {
            id: 'm2',
            sender: 'assistant',
            message: 'It helps to walk them through the day in sequence: check-in, labs if needed, premedications, infusion time, and observation. When patients know the order of events, the visit usually feels more predictable and less intimidating.',
        },
        {
            id: 'm3',
            sender: 'user',
            message: 'Can you make that a little warmer and more reassuring?',
        },
        {
            id: 'm4',
            sender: 'assistant',
            message: 'You might say that infusion day is structured and closely supervised, so they will not be going through it alone. The team will explain each step, check on how they are feeling, and respond quickly if anything feels uncomfortable or unexpected.',
        },
    ],
};

export const mockAssistantReplies = [
    ...new Set(Object.values(messagesByChat)
        .flatMap((messages) => messages
        .filter((message) => message.sender === 'assistant')
        .map((message) => message.message))),
];
