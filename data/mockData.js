export const chats = [
    {
        id: '1',
        name: 'Dr. Emily Chen',
        role: 'Medical Oncologist',
        avatar: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1',
        lastMessagePreview: 'What roles do regulatory affairs speciali...',
    },
    {
        id: '2',
        name: 'Sarah Patel',
        role: 'Clinical Research Associate',
        avatar: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1',
        lastMessagePreview: 'How do clinical research associates con...',
    },
    {
        id: '3',
        name: 'Rajiv Kumar',
        role: 'Pharmacovigilance Specialist',
        avatar: 'https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1',
        lastMessagePreview: 'What is the importance of pharmacovigil...',
    },
    {
        id: '4',
        name: 'Linda Garcia',
        role: 'Medical Science Liaison',
        avatar: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1',
        lastMessagePreview: 'How do medical science liaisons bridge...',
    },
    {
        id: '5',
        name: 'Dr. Sarah Khan',
        role: 'Hematologist',
        avatar: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1',
        lastMessagePreview: 'What are the latest advancements in dr...',
    },
    {
        id: '6',
        name: 'Emily Thompson',
        role: 'Regulatory Affairs Manager',
        avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1',
        lastMessagePreview: 'How do regulatory agencies impact phar...',
    },
    {
        id: '7',
        name: 'Emma Chen',
        role: 'Oncology Nurse',
        avatar: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1',
        lastMessagePreview: 'How are patients selected for clinical tri...',
    },
];
export const messagesByChat = {
    '1': [
        {
            id: 'm1',
            sender: 'assistant',
            message: "For patients who are NPO (nothing by mouth) prior to a procedure or may have GI prep that could impact absorption, there isn't a specific adjustment required for Zepzelca, since it's administered as an intravenous infusion. Standard dosing can typically proceed as scheduled, but if the procedure timing overlaps with an infusion day, it's generally recommended to coordinate with the GI and infusion teams to avoid conflicts.\n\nIf the patient is experiencing any significant changes in renal or hepatic function related to the procedure or prep, additional monitoring or dose adjustments may be warranted, in line with the prescribing information.",
            timestamp: '10:14 AM',
        },
        {
            id: 'm2',
            sender: 'user',
            message: 'What roles do regulatory affairs specialists play in drug approval?',
            timestamp: '10:16 AM',
        },
        {
            id: 'm3',
            sender: 'assistant',
            message: "For patients who are NPO (nothing by mouth) prior to a procedure or may have GI prep that could impact absorption, there isn't a specific adjustment required for Zepzelca, since it's administered as an intravenous infusion. Standard dosing can typically proceed as scheduled, but if the procedure timing overlaps with an infusion day, it's generally recommended to coordinate with the GI and infusion teams to avoid conflicts.\n\nIf the patient is experiencing any significant changes in renal or hepatic function related to the procedure or prep, additional monitoring or dose adjustments may be warranted, in line with the prescribing information.",
            timestamp: '10:17 AM',
        },
    ],
    '2': [
        {
            id: 'm1',
            sender: 'assistant',
            message: 'Clinical research associates (CRAs) play a critical role in ensuring that clinical trials are conducted according to the protocol, GCP guidelines, and applicable regulations. They monitor study sites, verify data integrity, and serve as the primary liaison between sponsors and investigative sites.',
            timestamp: '9:30 AM',
        },
        {
            id: 'm2',
            sender: 'user',
            message: 'How do clinical research associates contribute to data quality in trials?',
            timestamp: '9:32 AM',
        },
        {
            id: 'm3',
            sender: 'assistant',
            message: 'CRAs ensure data quality through source data verification (SDV), reviewing case report forms, identifying and resolving queries, and ensuring proper documentation. They also verify that adverse events are reported correctly and in a timely manner.',
            timestamp: '9:33 AM',
        },
    ],
    '3': [
        {
            id: 'm1',
            sender: 'user',
            message: 'What is the importance of pharmacovigilance in post-market drug safety?',
            timestamp: '11:00 AM',
        },
        {
            id: 'm2',
            sender: 'assistant',
            message: 'Pharmacovigilance is essential for detecting, assessing, understanding, and preventing adverse effects of medicines after they have been approved. It helps identify safety signals that may not have been apparent during clinical trials due to limited sample sizes or duration.',
            timestamp: '11:02 AM',
        },
    ],
    '4': [
        {
            id: 'm1',
            sender: 'user',
            message: 'How do medical science liaisons bridge the gap between science and clinical practice?',
            timestamp: '2:15 PM',
        },
        {
            id: 'm2',
            sender: 'assistant',
            message: 'Medical science liaisons (MSLs) serve as scientific experts who communicate complex clinical and scientific information to healthcare providers. They build relationships with key opinion leaders, support medical education, and gather real-world insights to inform drug development and commercialization strategies.',
            timestamp: '2:17 PM',
        },
    ],
    '5': [
        {
            id: 'm1',
            sender: 'user',
            message: 'What are the latest advancements in drug treatment for hematologic malignancies?',
            timestamp: '3:45 PM',
        },
        {
            id: 'm2',
            sender: 'assistant',
            message: 'Recent advancements include CAR-T cell therapies, bispecific antibodies, and targeted small molecule inhibitors. BTK inhibitors like ibrutinib have revolutionized CLL treatment, while venetoclax has shown strong efficacy in combination regimens for AML and CLL.',
            timestamp: '3:47 PM',
        },
    ],
    '6': [
        {
            id: 'm1',
            sender: 'user',
            message: 'How do regulatory agencies impact pharmaceutical development timelines?',
            timestamp: '8:30 AM',
        },
        {
            id: 'm2',
            sender: 'assistant',
            message: 'Regulatory agencies like the FDA and EMA establish the requirements for drug approval, which significantly influence development timelines. Expedited pathways such as Breakthrough Therapy Designation, Fast Track, and Priority Review can compress timelines for therapies addressing unmet medical needs.',
            timestamp: '8:32 AM',
        },
    ],
    '7': [
        {
            id: 'm1',
            sender: 'user',
            message: 'How are patients selected for clinical trials in oncology?',
            timestamp: '4:00 PM',
        },
        {
            id: 'm2',
            sender: 'assistant',
            message: 'Patient selection for oncology trials is based on eligibility criteria including diagnosis, disease stage, prior treatments, performance status, and biomarker profiles. Increasingly, molecular profiling and genomic testing are used to match patients to targeted therapies in basket or umbrella trial designs.',
            timestamp: '4:02 PM',
        },
    ],
};
