import { GitBranch, ChevronRight } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { formatDistanceToNow } from "date-fns";

type Version = Tables<"paper_versions">;

const VersionSidebar = ({ versions }: { versions: Version[] }) => {
  return (
    <div className="flex h-full w-64 flex-col border-r bg-sidebar">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <GitBranch className="h-4 w-4 text-muted-foreground" />
        <h2 className="font-display text-sm font-semibold">Versions</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {versions.length === 0 ? (
          <p className="px-3 py-2 text-xs text-muted-foreground">No versions saved yet.</p>
        ) : (
          versions.map((version, i) => (
            <button
              key={version.id}
              className={`w-full rounded-md px-3 py-2.5 text-left transition-colors hover:bg-sidebar-accent ${
                i === 0 ? "bg-sidebar-accent" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${i === 0 ? "text-accent" : ""}`}>
                  {version.label || `v${version.version_number}`}
                </span>
                {i === 0 && <ChevronRight className="h-3.5 w-3.5 text-accent" />}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{version.changes_summary}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {version.word_count.toLocaleString()} words
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default VersionSidebar;
