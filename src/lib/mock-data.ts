export interface Paper {
  id: string;
  title: string;
  status: "draft" | "in-review" | "published";
  wordCount: number;
  deadline: string;
  lastEdited: string;
  versions: number;
  author: string;
  tags: string[];
}

export interface Version {
  id: string;
  label: string;
  timestamp: string;
  wordCount: number;
  changesSummary: string;
}

export interface AISuggestion {
  id: string;
  type: "citation" | "structure" | "clarity" | "next-step";
  title: string;
  description: string;
  confidence: number;
}

export const mockPapers: Paper[] = [
  {
    id: "1",
    title: "Quantum Entanglement in Multi-Qubit Systems: A Survey",
    status: "draft",
    wordCount: 4280,
    deadline: "2026-03-15",
    lastEdited: "2 hours ago",
    versions: 7,
    author: "You",
    tags: ["Physics", "Quantum Computing"],
  },
  {
    id: "2",
    title: "Neural Architecture Search for Low-Resource NLP",
    status: "in-review",
    wordCount: 8120,
    deadline: "2026-02-28",
    lastEdited: "Yesterday",
    versions: 14,
    author: "You",
    tags: ["Machine Learning", "NLP"],
  },
  {
    id: "3",
    title: "CRISPR-Cas9 Off-Target Effects in Mammalian Cells",
    status: "draft",
    wordCount: 2950,
    deadline: "2026-04-01",
    lastEdited: "3 days ago",
    versions: 4,
    author: "You",
    tags: ["Biology", "Genetics"],
  },
  {
    id: "4",
    title: "Climate Feedback Loops in Arctic Permafrost Thaw",
    status: "published",
    wordCount: 11200,
    deadline: "2026-01-30",
    lastEdited: "2 weeks ago",
    versions: 22,
    author: "You",
    tags: ["Environmental Science"],
  },
];

export const mockVersions: Version[] = [
  { id: "v7", label: "v7 — Current", timestamp: "Today, 2:15 PM", wordCount: 4280, changesSummary: "+320 words in Methods section" },
  { id: "v6", label: "v6", timestamp: "Today, 11:02 AM", wordCount: 3960, changesSummary: "Rewrote abstract" },
  { id: "v5", label: "v5", timestamp: "Yesterday, 4:30 PM", wordCount: 3800, changesSummary: "Added Figure 3 and references" },
  { id: "v4", label: "v4", timestamp: "Feb 12, 9:15 AM", wordCount: 3400, changesSummary: "Expanded literature review" },
  { id: "v3", label: "v3", timestamp: "Feb 11, 3:00 PM", wordCount: 2900, changesSummary: "Restructured introduction" },
  { id: "v2", label: "v2", timestamp: "Feb 10, 10:45 AM", wordCount: 2100, changesSummary: "Initial methodology draft" },
  { id: "v1", label: "v1", timestamp: "Feb 9, 8:00 AM", wordCount: 1200, changesSummary: "Outline and abstract" },
];

export const mockSuggestions: AISuggestion[] = [
  {
    id: "s1",
    type: "citation",
    title: "Missing Citation",
    description: "Your claim about decoherence rates in paragraph 3 should cite Zurek (2003) or Schlosshauer (2007) for stronger support.",
    confidence: 92,
  },
  {
    id: "s2",
    type: "structure",
    title: "Section Ordering",
    description: "Consider moving your experimental setup before the theoretical framework — readers typically expect methodology earlier in physics papers.",
    confidence: 78,
  },
  {
    id: "s3",
    type: "clarity",
    title: "Ambiguous Pronoun",
    description: "In sentence 4 of the Results section, \"it\" could refer to either the system or the measurement. Clarify the subject.",
    confidence: 85,
  },
  {
    id: "s4",
    type: "next-step",
    title: "Next: Write Discussion",
    description: "Your Results section is solid. The natural next step is the Discussion — consider contrasting your findings with Nielsen & Chuang's predictions.",
    confidence: 88,
  },
];

export const mockEditorContent = `## Abstract

Quantum entanglement remains one of the most profound phenomena in modern physics, serving as the cornerstone of quantum information processing and quantum computing. This survey examines recent advances in multi-qubit entanglement, focusing on scalable architectures and error mitigation strategies.

## 1. Introduction

The study of quantum entanglement has evolved dramatically since Einstein, Podolsky, and Rosen first questioned its implications in 1935. Today, entanglement is not merely a theoretical curiosity but a practical resource for quantum computation, cryptography, and sensing.

In recent years, the development of multi-qubit systems has pushed the boundaries of what is experimentally achievable. Systems with 50+ qubits are now routinely demonstrated, though maintaining coherence across these systems remains a central challenge.

## 2. Theoretical Framework

We consider a system of *n* qubits described by the Hilbert space H = (C²)^⊗n. The entanglement structure of a pure state |ψ⟩ can be characterized by various measures, including the von Neumann entropy of reduced density matrices.

For mixed states, the situation is more nuanced. The entanglement of formation, concurrence, and negativity each capture different aspects of quantum correlations. It has been shown that these measures are not equivalent in general.

## 3. Experimental Methods

Our experimental setup utilizes a trapped-ion platform with individual addressing capabilities. The system achieves single-qubit gate fidelities exceeding 99.9% and two-qubit gate fidelities of 99.5%.

`;
