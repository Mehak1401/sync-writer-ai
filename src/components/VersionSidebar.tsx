import { GitBranch, ChevronRight } from "lucide-react";
import { mockVersions } from "@/lib/mock-data";

const VersionSidebar = () => {
  return (
    <div className="flex h-full w-64 flex-col border-r bg-sidebar">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <GitBranch className="h-4 w-4 text-muted-foreground" />
        <h2 className="font-display text-sm font-semibold">Versions</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {mockVersions.map((version, i) => (
          <button
            key={version.id}
            className={`w-full rounded-md px-3 py-2.5 text-left transition-colors hover:bg-sidebar-accent ${
              i === 0 ? "bg-sidebar-accent" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${i === 0 ? "text-accent" : ""}`}>
                {version.label}
              </span>
              {i === 0 && <ChevronRight className="h-3.5 w-3.5 text-accent" />}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{version.timestamp}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{version.changesSummary}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {version.wordCount.toLocaleString()} words
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VersionSidebar;
