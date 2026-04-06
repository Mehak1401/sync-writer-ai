import { useState, useEffect, useCallback } from "react";
import { Sparkles, BookMarked, LayoutList, Eye, ArrowRight, RefreshCw } from "lucide-react";
import type { AISuggestion } from "@/lib/mock-data";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

interface AICopilotPaneProps {
  content: string;
  title: string;
}

const AICopilotPane = ({ content, title }: AICopilotPaneProps) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchSuggestions = useCallback(async () => {
    if (!content || content.trim().length < 50) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-suggestions", {
        body: { content, title },
      });

      if (error) throw error;

      const items: AISuggestion[] = (data.suggestions || []).map(
        (s: any, i: number) => ({ ...s, id: `ai-${i}-${Date.now()}` })
      );
      setSuggestions(items);
      setDismissed(new Set());
    } catch (e: any) {
      console.error("AI suggestions error:", e);
      toast({
        title: "AI suggestions unavailable",
        description: e.message || "Could not fetch suggestions. Try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [content, title, toast]);

  // Auto-fetch on first load and when content changes significantly
  useEffect(() => {
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    if (wordCount < 20) return;

    const timer = setTimeout(fetchSuggestions, 2000);
    return () => clearTimeout(timer);
  }, [content, fetchSuggestions]);

  const visibleSuggestions = suggestions.filter((s) => !dismissed.has(s.id));

  return (
    <div className="flex h-full flex-col border-l bg-card">
      <div className="flex items-center gap-2 border-b px-5 py-3">
        <Sparkles className="h-4 w-4 text-ai" />
        <h2 className="font-display text-sm font-semibold">AI Co-Pilot</h2>
        <span className="ml-auto flex items-center gap-2">
          <button
            onClick={fetchSuggestions}
            disabled={loading}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
            title="Refresh suggestions"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <span className="rounded-full bg-ai-muted px-2 py-0.5 text-xs font-medium text-ai">
            {loading ? "Analyzing…" : `${visibleSuggestions.length} suggestions`}
          </span>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading && suggestions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <RefreshCw className="h-6 w-6 animate-spin mb-3 text-ai" />
            <p className="text-sm">Analyzing your paper…</p>
          </div>
        )}

        {!loading && visibleSuggestions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Sparkles className="h-6 w-6 mb-3" />
            <p className="text-sm text-center">
              {content.trim().length < 50
                ? "Start writing to get AI suggestions"
                : "No suggestions right now. Click refresh to re-analyze."}
            </p>
          </div>
        )}

        {visibleSuggestions.map((suggestion) => {
          const Icon = typeIcons[suggestion.type];
          return (
            <div
              key={suggestion.id}
              className="group rounded-lg border p-4 transition-all hover:border-ai/40 hover:shadow-sm"
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
                <button
                  onClick={() => setDismissed((prev) => new Set(prev).add(suggestion.id))}
                  className="rounded-md px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary"
                >
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
