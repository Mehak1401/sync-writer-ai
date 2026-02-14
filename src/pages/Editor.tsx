import { ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EditorPane from "@/components/EditorPane";
import AICopilotPane from "@/components/AICopilotPane";
import VersionSidebar from "@/components/VersionSidebar";
import { mockPapers } from "@/lib/mock-data";

const Editor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const paper = mockPapers.find((p) => p.id === id) ?? mockPapers[0];

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-display text-sm font-semibold leading-tight">{paper.title}</h1>
            <p className="text-xs text-muted-foreground">
              v{paper.versions} · {paper.wordCount.toLocaleString()} words · Last edited {paper.lastEdited}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Save className="h-3.5 w-3.5" />
            Save Version
          </Button>
        </div>
      </header>

      {/* Main workspace */}
      <div className="flex flex-1 overflow-hidden">
        <VersionSidebar />
        <div className="flex flex-1">
          <div className="flex-1">
            <EditorPane />
          </div>
          <div className="w-[380px]">
            <AICopilotPane />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
