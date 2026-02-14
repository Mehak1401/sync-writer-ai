import { Sparkles, BookMarked, LayoutList, Eye, ArrowRight } from "lucide-react";
import { mockSuggestions, type AISuggestion } from "@/lib/mock-data";

const typeIcons: Record<AISuggestion["type"], typeof Sparkles> = {
  citation: BookMarked,
  structure: LayoutList,
  clarity: Eye,
  "next-step": ArrowRight,
};

const typeLabels: Record<AISuggestion["type"], string> = {
  citation: "Citation",
  structure: "Structure",
  clarity: "Clarity",
  "next-step": "Next Step",
};

const AICopilotPane = () => {
  return (
    <div className="flex h-full flex-col border-l bg-card">
      <div className="flex items-center gap-2 border-b px-5 py-3">
        <Sparkles className="h-4 w-4 text-ai" />
        <h2 className="font-display text-sm font-semibold">AI Co-Pilot</h2>
        <span className="ml-auto rounded-full bg-ai-muted px-2 py-0.5 text-xs font-medium text-ai">
          {mockSuggestions.length} suggestions
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {mockSuggestions.map((suggestion) => {
          const Icon = typeIcons[suggestion.type];
          return (
            <div
              key={suggestion.id}
              className="group rounded-lg border p-4 transition-all hover:border-ai/40 hover:shadow-sm cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-ai-muted">
                  <Icon className="h-3.5 w-3.5 text-ai" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-ai">{typeLabels[suggestion.type]}</span>
                    <span className="text-xs text-muted-foreground">{suggestion.confidence}% confident</span>
                  </div>
                  <h4 className="mt-1 text-sm font-semibold">{suggestion.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {suggestion.description}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="rounded-md bg-ai px-3 py-1 text-xs font-medium text-ai-foreground transition-colors hover:bg-ai/90">
                  Apply
                </button>
                <button className="rounded-md px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary">
                  Dismiss
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AICopilotPane;
